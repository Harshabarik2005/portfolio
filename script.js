/* ============================================
   HARSHA B — PORTFOLIO
   Interactive Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Scroll Reveal ───────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  const timelineItems = document.querySelectorAll('.reveal-timeline');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Timeline Stagger ──────────────────────────
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each timeline item
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
  });

  timelineItems.forEach(el => timelineObserver.observe(el));

  // ─── Navbar Scroll Effect ─────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ─── Active Nav Link ──────────────────────────
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPos >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    // Failsafe for the very bottom of the page
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
      if (sections.length > 0) current = sections[sections.length - 1].getAttribute('id');
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ─── Mobile Nav Toggle ────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ─── Project Tabs ─────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${target}`) {
          content.classList.add('active');
          // Re-trigger reveal animations for newly visible cards
          content.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => revealObserver.observe(el), 50);
          });
        }
      });
    });
  });

  // ─── Smooth Scroll for CTA buttons ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Cursor Trail Effect (subtle) ─────────────
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transition: transform 0.15s ease;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // ─── Typing effect for hero greeting ──────────
  const greeting = document.querySelector('.hero-greeting');
  if (greeting) {
    const text = greeting.textContent;
    greeting.textContent = '';
    greeting.style.opacity = '1';
    greeting.style.transform = 'translateY(0)';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        greeting.textContent += text.charAt(i);
        i++;
        setTimeout(type, 80);
      }
    };
  // Start after page load
    setTimeout(type, 600);
  }

  // ─── Cryptographic Scramble Effect ────────────
  class Scrambler {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\\\/[]{}—=+*^?#_';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText || '';
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="scramble-char">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const heroName = document.querySelector('.hero-name');
  const heroTitle = document.querySelector('.hero-title');
  
  if (heroName && heroTitle) {
    // Preserve the original HTML structure for title because it contains HTML entities (&bull;)
    // textContent reads &bull; correctly as a bullet character.
    const nameText = heroName.textContent;
    const titleText = heroTitle.textContent;
    
    // Clear them initially to hide them before scramble starts
    heroName.style.opacity = '1';
    heroTitle.style.opacity = '1';
    heroName.textContent = '';
    heroTitle.textContent = '';
    
    const scramblerName = new Scrambler(heroName);
    const scramblerTitle = new Scrambler(heroTitle);
    
    // Wait for the typing greeting to finish before scrambling the name and title
    // "Hello, I'm" has 10 chars. 10 * 80ms = 800ms + 600ms initial wait = 1400ms.
    setTimeout(() => {
      scramblerName.setText(nameText).then(() => {
        setTimeout(() => scramblerTitle.setText(titleText), 200);
      });
    }, 1500);
  }

  // ─── Parallax on Hero ─────────────────────────
  const heroSection = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (heroSection) {
      const scroll = window.pageYOffset;
      const heroContent = heroSection.querySelector('.hero-content');
      if (heroContent && scroll < window.innerHeight) {
        heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
        heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
      }
    }
  });

});
