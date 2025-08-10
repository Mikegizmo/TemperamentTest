document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("navbar-placeholder");
  const res = await fetch("/components/navbar.html");
  const html = await res.text();
  placeholder.innerHTML = html;

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  // Toggle menu open/close
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Highlight active link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active-link");
    }

    // Auto-close menu on mobile when clicking a link
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
});
