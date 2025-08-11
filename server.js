require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const Filter = require('bad-words');
const sanitizeHtml = require('sanitize-html');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '12kb' }));

// Initialize Firebase Admin SDK with service account from env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const COMMENT_MAX_LENGTH = parseInt(process.env.COMMENT_MAX_LENGTH || '1000', 10);

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 6, message: { error: 'Too many requests, slow down.' } });
app.use('/api/comments', limiter);

const filter = new Filter();

// Verify reCAPTCHA (v2 or v3 token accepted) -- returns boolean
async function verifyRecaptcha(token, ip) {
  if (!token) return false;
  const params = new URLSearchParams();
  params.append('secret', RECAPTCHA_SECRET);
  params.append('response', token);
  if (ip) params.append('remoteip', ip);

  const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
  const data = await resp.json();
  return data && data.success === true;
}

// PUBLIC: submit comment (pending approval)
app.post('/api/comments', async (req, res) => {
  try {
    const ip = req.ip;
    const { name = '', text = '', recaptchaToken } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 3) return res.status(400).json({ error: 'Comment must be at least 3 characters.' });
    if (text.length > COMMENT_MAX_LENGTH) return res.status(400).json({ error: `Comment too long (max ${COMMENT_MAX_LENGTH}).` });

    // verify captcha
    const ok = await verifyRecaptcha(recaptchaToken, ip);
    if (!ok) return res.status(400).json({ error: 'reCAPTCHA verification failed.' });

    // sanitize
    const safeText = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim();
    const safeName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} }).trim().slice(0, 100);

    // profanity check (reject or flag)
    if (filter.isProfane(safeText)) {
      // Option: store flagged but do not publish
      await db.collection('comments_flagged').add({ name: safeName || 'Anonymous', text: safeText, createdAt: admin.firestore.FieldValue.serverTimestamp(), ip: ip || null });
      return res.status(400).json({ error: 'Comment contains offensive language and was not accepted.' });
    }

    // store pending
    const docRef = await db.collection('comments').add({ name: safeName || 'Anonymous', text: safeText, createdAt: admin.firestore.FieldValue.serverTimestamp(), approved: false, deleted: false, ip: ip || null });
    return res.json({ success: true, id: docRef.id, message: 'Comment received and pending approval.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUBLIC: fetch approved comments
app.get('/api/comments', async (req, res) => {
  try {
    const snapshot = await db.collection('comments').where('approved', '==', true).where('deleted', '==', false).orderBy('createdAt', 'desc').limit(200).get();
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN middleware: verify ID token and admin custom claim
async function adminAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const match = auth.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ error: 'Unauthorized' });
    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded || !decoded.admin) return res.status(403).json({ error: 'Forbidden' });
    req.adminUser = decoded;
    next();
  } catch (err) {
    console.error('adminAuth error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ADMIN: fetch pending
app.get('/api/comments/pending', adminAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('comments').where('approved', '==', false).where('deleted', '==', false).orderBy('createdAt', 'desc').limit(500).get();
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: approve
app.patch('/api/comments/:id/approve', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('comments').doc(id).update({ approved: true });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN: soft-delete
app.delete('/api/comments/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('comments').doc(id).update({ deleted: true });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Serve static site (public folder)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));