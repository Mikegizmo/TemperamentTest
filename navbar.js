// Load navbar from HTML file
document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("navbar-placeholder");
  const res = await fetch("/components/navbar.html");
  const html = await res.text();
  placeholder.innerHTML = html;

  // After injecting, bind hamburger behavior
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
});
