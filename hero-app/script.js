document.addEventListener("DOMContentLoaded", () => {
  // Initial States
  gsap.set("nav", { y: -150 });
  gsap.set(".progress-bar", { scaleX: 0, transformOrigin: "right center" });
  gsap.set(".char-span", { y: 400 });

  const masterTl = gsap.timeline();

  // Animate Digits Function
  const animateDigit = (selector, duration, delay = 1) => {
    const digitEl = document.querySelector(selector);
    if (!digitEl) return;
    const numEl = digitEl.querySelector(".num");
    if (!numEl) return;

    const numHeight = numEl.clientHeight || 150;
    const totalDistance = (digitEl.querySelectorAll(".num").length - 1) * numHeight;

    gsap.to(digitEl, {
      y: -totalDistance,
      duration: duration,
      delay: delay,
      ease: "power2.inOut",
    });
  };

  animateDigit(".digit-3", 5);
  animateDigit(".digit-2", 6);
  animateDigit(".digit-1", 2, 5);

  // Timeline Sequence
  masterTl
    .to(".progress-bar", {
      scaleX: 0.35,
      duration: 2,
      ease: "power4.inOut",
    }, 7)
    .to(".progress-bar", {
      scaleX: 1,
      duration: 1.5,
      ease: "power3.out",
    }, 8.5)
    // Preloader Slide Out to Left
    .to(".preloader-content", {
      x: -window.innerWidth * 1.2,
      opacity: 0,
      scale: 0.9,
      duration: 0.9,
      ease: "power3.inOut",
    }, 9.0)
    .to(".pre-loader", {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        document.querySelector(".pre-loader").style.display = "none";
      },
    }, 9.7)
    // Synchronized Hero Image Reveal
    .to(".hero-img", {
      clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
      duration: 1.2,
      ease: "power4.inOut",
      stagger: 0.25,
    }, 9.2)
    .to(".hero-imgs", {
      scale: 1.15,
      duration: 3,
      ease: "power3.inOut",
    }, 9.2)
    // Navbar and Title Reveal
    .to("nav", {
      y: 0,
      duration: 1.1,
      ease: "power3.out",
    }, 11.0)
    .to(".char-span", {
      y: 0,
      stagger: 0.08,
      duration: 1.1,
      ease: "power3.out",
    }, 11.0);
});