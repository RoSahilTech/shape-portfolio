// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
        nav.style.borderBottomColor = 'rgba(100, 200, 255, 0.2)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.3)';
        nav.style.borderBottomColor = 'rgba(100, 200, 255, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate skill bars when they come into view
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillProgress = entry.target;
            const width = skillProgress.style.width;
            skillProgress.style.width = '0%';
            setTimeout(() => {
                skillProgress.style.width = width;
            }, 100);
            skillObserver.unobserve(skillProgress);
        }
    });
}, observerOptions);

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// 3D Parallax Effect for Hero Section
function init3DParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroImageImg = document.querySelector('.hero-image-wrapper img');
    const heroName = document.querySelectorAll('.hero-name h1');
    const heroBackground = document.querySelector('.hero-background img');

    if (!hero || !heroContent || !heroImage) return;

    // Check if device is mobile (disable on mobile for performance)
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let glowX = 0;
    let glowY = 0;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        glowX = e.clientX - rect.left;
        glowY = e.clientY - rect.top;
        
        // Update glow position
        hero.style.setProperty('--glow-x', `${glowX}px`);
        hero.style.setProperty('--glow-y', `${glowY}px`);
    });

    // Smooth animation loop
    function animate() {
        // Smoother interpolation for less jittery movement
        currentX += (mouseX - currentX) * 0.08; // Slower interpolation
        currentY += (mouseY - currentY) * 0.08; // Slower interpolation

        // Apply 3D transforms - reduced intensity for smoother effect
        const rotateX = currentY * 3; // Max 3 degrees (reduced from 5)
        const rotateY = currentX * 3; // Max 3 degrees (reduced from 5)
        const translateX = currentX * 15; // Max 15px (reduced from 20)
        const translateY = currentY * 15; // Max 15px (reduced from 20)

        // Text content - subtle tilt
        if (heroContent) {
            heroContent.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX * 0.3}deg) 
                rotateY(${rotateY * 0.3}deg)
                translateX(${translateX * 0.3}px)
                translateY(${translateY * 0.3}px)
            `;
        }

        // Image container - subtle movement (reduced intensity)
        if (heroImage) {
            heroImage.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX * 0.2}deg) 
                rotateY(${rotateY * 0.2}deg)
                translateX(${translateX * 0.2}px)
                translateY(${translateY * 0.2}px)
            `;
        }

        // Image wrapper - gentle 3D effect (much more subtle)
        if (heroImageWrapper) {
            // Constrain translateZ to prevent too much depth
            const translateZ = Math.max(Math.min((currentX + currentY) * 2, 15), -15);
            heroImageWrapper.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX * 0.25}deg) 
                rotateY(${rotateY * 0.25}deg)
                translateX(${translateX * 0.25}px)
                translateY(${translateY * 0.25}px)
                translateZ(${translateZ}px)
            `;
        }

        // Image itself - very subtle effect to prevent distortion
        if (heroImageImg) {
            // Keep scale minimal and constrained to prevent distortion
            const scale = Math.min(1 + Math.abs(currentX) * 0.003, 1.01); // Max 1% scale increase
            // Limit rotation to prevent weird angles
            const imgRotateX = Math.max(Math.min(-rotateX * 0.08, 2), -2); // Max ±2 degrees
            const imgRotateY = Math.max(Math.min(rotateY * 0.08, 2), -2); // Max ±2 degrees
            
            heroImageImg.style.transform = `
                perspective(1000px) 
                rotateX(${imgRotateX}deg) 
                rotateY(${imgRotateY}deg)
                scale(${scale})
            `;
            // Subtle glow effect without heavy filters
            const glowIntensity = Math.min(Math.abs(currentX) * 0.03, 0.2);
            heroImageImg.style.filter = `
                contrast(1.05) 
                brightness(0.95)
                drop-shadow(0 0 ${8 + glowIntensity * 15}px rgba(100, 200, 255, ${0.1 + glowIntensity}))
            `;
        }

        // Background parallax - subtle movement
        if (heroBackground) {
            const bgX = currentX * 30;
            const bgY = currentY * 30;
            heroBackground.style.transform = `translate(${bgX}px, ${bgY}px) scale(1.05)`;
        }

        // Name text - subtle parallax
        heroName.forEach((h1, index) => {
            const depth = (index + 1) * 0.1;
            h1.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX * 0.2 * depth}deg) 
                rotateY(${rotateY * 0.2 * depth}deg)
                translateZ(${currentX * 5 * depth}px)
            `;
            h1.style.textShadow = `
                0 0 30px rgba(100, 200, 255, ${0.2 + Math.abs(currentX) * 0.1}),
                ${translateX * 0.5}px ${translateY * 0.5}px 20px rgba(100, 200, 255, 0.1)
            `;
        });

        requestAnimationFrame(animate);
    }

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });

    animate();
}

// 3D Parallax Effect for Projects Section
function initProjects3D() {
    const projectsSection = document.querySelector('.projects');
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectsSection || projectCards.length === 0) return;

    // Check if device is mobile (disable on mobile for performance)
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    projectCards.forEach(card => {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        });

        card.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });

        // Smooth animation loop for each card
        function animateCard() {
            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;

            // Apply 3D transforms - subtle effect
            const rotateX = currentY * 8; // Max 8 degrees
            const rotateY = currentX * 8; // Max 8 degrees
            const translateX = currentX * 10; // Max 10px
            const translateY = currentY * 10; // Max 10px

            // Apply transform with hover lift
            const hoverLift = card.matches(':hover') ? -10 : 0;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
                translateX(${translateX}px)
                translateY(${translateY + hoverLift}px)
                translateZ(${currentX * 5 + currentY * 5}px)
            `;

            // Add dynamic glow to border
            const glowIntensity = Math.abs(currentX) + Math.abs(currentY);
            card.style.setProperty('--glow-opacity', Math.min(glowIntensity * 0.3, 0.6));

            requestAnimationFrame(animateCard);
        }

        animateCard();
    });
}

// Load skills from API
function loadSkills() {
    const API_URL = 'https://shape-portfolio-api.onrender.com';
    const skillsGrid = document.getElementById('skillsGrid');
    
    if (!skillsGrid) return;
    
    fetch(`${API_URL}/api/skills`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.skills) {
                displaySkills(data.skills);
            } else {
                skillsGrid.innerHTML = '<p style="color: #888;">No skills available</p>';
            }
        })
        .catch(error => {
            console.error('Error loading skills:', error);
            skillsGrid.innerHTML = '<p style="color: #888;">Error loading skills</p>';
        });
}

function displaySkills(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;
    
    if (skills.length === 0) {
        skillsGrid.innerHTML = '<p style="color: #888;">No skills available</p>';
        return;
    }
    
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-item">
            <span class="skill-name">${skill.name}</span>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.percentage}%"></div>
            </div>
        </div>
    `).join('');
    
    // Observe skill bars for animation
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Observe all skill progress bars
document.addEventListener('DOMContentLoaded', () => {
    // Load skills from API
    loadSkills();
    
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Initialize 3D parallax effect
    init3DParallax();
    
    // Initialize 3D effect for projects section
    initProjects3D();

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Send to Flask backend API
            const API_URL = 'https://shape-portfolio-api.onrender.com';
            
            console.log('Submitting contact form to:', `${API_URL}/api/contact`);
            console.log('Form data:', formData);
            
            fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                console.log('Contact form response status:', response.status);
                if (!response.ok) {
                    return response.json().then(data => {
                        console.error('Contact form error response:', data);
                        throw new Error(data.error || `Server error: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Contact form success response:', data);
                if (data.success) {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('There was an error sending your message: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                alert('Unable to send message. Please check your connection and try again.\n\nError: ' + error.message);
                // Don't use localStorage fallback as it won't sync with the backend
            });
        });
    }

});
