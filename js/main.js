// Twomonk Technologies Main JS

document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle Logic
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    const toggleMenu = () => {
        menuOverlay.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    };

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Parallax Effect for Hero
    const heroSection = document.getElementById('home');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroSection) {
            heroSection.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        }
    });

    // Improved Reveal on Scroll Logic
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-right');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Immediate position for dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorDot.style.opacity = '1';

            // Smooth lag for outline
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
            cursorOutline.style.opacity = '1';
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .menu-link, .hover-lift');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-teal');
        } else {
            link.classList.remove('text-teal');
        }
    });

    // Dots Animation Placeholder
    initDotsAnimation();
});

function initDotsAnimation() {
    const canvas = document.getElementById('dots-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles;

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        createParticles();
    };

    class Particle {
        constructor(isCore = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = isCore ? 3 + Math.random() * 2 : 1 + Math.random() * 2;
            this.isCore = isCore;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isCore ? '#002D5B' : '#00A99D';
            ctx.fill();

            if (this.isCore) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00A99D';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    const createParticles = () => {
        particles = [];
        // Core nodes (larger, navy)
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(true));
        }
        // Auxiliary nodes (teal)
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(false));
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - dist / 120;
                    ctx.strokeStyle = p.isCore || p2.isCore ?
                        `rgba(0, 45, 91, ${opacity * 0.4})` :
                        `rgba(0, 169, 157, ${opacity * 0.3})`;
                    ctx.lineWidth = p.isCore && p2.isCore ? 1 : 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
}
