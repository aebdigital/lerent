// GSAP Animations Utility
// Presná kópia štruktúry pracovnej verzie

export const initGSAPAnimations = () => {
  // Check if GSAP and Lenis are loaded
  if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
    console.warn('GSAP or Lenis not loaded yet');
    return;
  }

  // Registrácia pluginu ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Inicializácia plynulého rolovania Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Pripojenie Lenis k GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Return lenis instance for cleanup
  return lenis;
};

export const initScrollAnimations = () => {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded yet');
    return;
  }

  // 1. ANIMÁCIE SEKCIÍ HERO
  // Animácia názvu hrdinu
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.fromTo(
      heroTitle,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.2
      }
    );
  }

  // Animácia titulkov hrdinu
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    gsap.fromTo(
      heroSubtitle,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.6
      }
    );
  }

  // Animácia štatistík hrdinu
  const statItems = document.querySelectorAll('.stat-item');
  if (statItems.length > 0) {
    gsap.fromTo(
      statItems,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.8
      }
    );
  }

  // 2. ANIMÁCIE POSÚVANIA (animujú sa iba existujúce prvky)
  // Generické animácie sekcií
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Animácie počítadla pre štatistické čísla
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(counter => {
    const textNode = counter.childNodes[0];
    if (textNode && textNode.textContent) {
      const target = parseInt(textNode.textContent) || 100;
      const obj = { value: 0 };

      // Nastaviť počiatočnú hodnotu na 0
      textNode.textContent = 0;

      // Animovať okamžite po načítaní stránky s malým oneskorením
      gsap.to(obj, {
        value: target,
        duration: 2,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          textNode.textContent = Math.round(obj.value);
        }
      });
    }
  });

  // Animácie tlačidla s výzvou na akciu pri podržaní kurzora myši
  const ctaButtons = document.querySelectorAll('.cta-btn');
  ctaButtons.forEach(button => {
    const tl = gsap.timeline({ paused: true });
    tl.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });

    button.addEventListener('mouseenter', () => tl.play());
    button.addEventListener('mouseleave', () => tl.reverse());
  });

  // INDIKÁTOR POKROKU POSÚVANIA (iba ak element existuje)
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  if (scrollProgressBar) {
    gsap.to(scrollProgressBar, {
      height: '100%',
      ease: "none",
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }

  // OPTIMALIZÁCIA VÝKONU
  // Obnoviť ScrollTrigger pri zmene veľkosti okna
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  console.log('🎬 Animácie GSAP boli úspešne načítané!');
};
