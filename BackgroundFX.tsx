
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const BackgroundFX = ({ theme }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const particles = [];
    const count = window.innerWidth < 600 ? 15 : 40; 

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.opacity = '0';
      p.style.pointerEvents = 'none';
      p.style.willChange = 'transform, opacity';
      container.appendChild(p);
      particles.push(p);
    }

    const ctx = gsap.context(() => {
      if (theme.id === 'savanna') {
        // Heat Haze / Dust
        particles.forEach((p) => {
          gsap.set(p, {
            width: gsap.utils.random(10, 30),
            height: gsap.utils.random(10, 30),
            backgroundColor: '#FFF',
            borderRadius: '50%',
            filter: 'blur(5px)',
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            opacity: gsap.utils.random(0.05, 0.2)
          });
          gsap.to(p, {
            y: '-=150',
            x: `+=${gsap.utils.random(-50, 50)}`,
            opacity: 0,
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            ease: 'none',
            delay: gsap.utils.random(0, 5)
          });
        });
      } else if (theme.id === 'river') {
        // Bubbles / Water particles
        particles.forEach((p) => {
           gsap.set(p, {
            width: gsap.utils.random(5, 15),
            height: gsap.utils.random(5, 15),
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '50%',
            x: gsap.utils.random(0, window.innerWidth),
            y: window.innerHeight + 50,
          });
          gsap.to(p, {
            y: -100,
            x: `+=${gsap.utils.random(-100, 100)}`,
            opacity: [0, 0.6, 0], // Fade in then out
            duration: gsap.utils.random(6, 12),
            repeat: -1,
            ease: 'sine.inOut',
            delay: gsap.utils.random(0, 8)
          });
        });
      } else if (theme.id === 'jungle') {
        // Fireflies
        particles.forEach((p) => {
           gsap.set(p, {
            width: gsap.utils.random(4, 6),
            height: gsap.utils.random(4, 6),
            backgroundColor: '#CCFF00',
            borderRadius: '50%',
            boxShadow: '0 0 15px #CCFF00',
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            opacity: 0
          });
          // Blink
          gsap.to(p, {
            opacity: gsap.utils.random(0.4, 1),
            duration: gsap.utils.random(1, 3),
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: gsap.utils.random(0, 2)
          });
          // Wander
          gsap.to(p, {
            x: `+=${gsap.utils.random(-200, 200)}`,
            y: `+=${gsap.utils.random(-100, 100)}`,
            duration: gsap.utils.random(10, 20),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      } else if (theme.id === 'village') {
        // Building blocks / Geometric
        particles.forEach((p) => {
          const size = gsap.utils.random(20, 40);
          gsap.set(p, {
            width: size,
            height: size,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            x: gsap.utils.random(0, window.innerWidth),
            y: window.innerHeight + 50,
            rotation: gsap.utils.random(0, 360),
          });
          gsap.to(p, {
            y: -100,
            rotation: '+=180',
            duration: gsap.utils.random(10, 15),
            repeat: -1,
            ease: 'linear',
            delay: gsap.utils.random(0, 10)
          });
        });
      } else if (theme.id === 'celebration') {
        // Confetti
        particles.forEach((p) => {
           const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FFF', '#76FF03'];
           gsap.set(p, {
            width: gsap.utils.random(8, 12),
            height: gsap.utils.random(8, 12),
            backgroundColor: gsap.utils.random(colors),
            x: gsap.utils.random(0, window.innerWidth),
            y: -50,
            rotation: gsap.utils.random(0, 360),
          });
          gsap.to(p, {
            y: window.innerHeight + 50,
            rotationX: '+=720',
            rotationY: '+=360',
            x: `+=${gsap.utils.random(-100, 100)}`,
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            ease: 'linear',
            delay: gsap.utils.random(0, 3)
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [theme]);

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />;
};

export default BackgroundFX;
