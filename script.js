// Skills filter pills
(function () {
  const pills = document.querySelectorAll('.pill');
  const cards = document.querySelectorAll('.skill-card');
  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

// Active nav link on scroll
(function () {
  const sections = document.querySelectorAll('main section[id], main#top');
  const navLinks = document.querySelectorAll('.navlinks a');
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((s) => io.observe(s));
})();

// Reveal-on-scroll for cards, staggered within each group
(function () {
  const groups = document.querySelectorAll(
    '.about-cards, .skills-grid, .exp-grid, .project-grid, .certs-row'
  );
  if (!('IntersectionObserver' in window) || groups.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = [];
  groups.forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      if (!prefersReduced) {
        child.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
      }
      targets.push(child);
    });
  });

  if (prefersReduced) {
    targets.forEach((t) => t.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((t) => io.observe(t));
})();
