// ============================================
// API CONFIGURATION working
// ============================================
const API_URL = 'https://shape-portfolio-api.onrender.com';

// ============================================
// 3D PARALLAX EFFECT FOR PROJECT CARDS
// ============================================
function initProjects3D() {
    const projectsShowcase = document.querySelector('.projects-showcase');
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectsShowcase || projectCards.length === 0) return;

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

// ============================================
// MOBILE MENU TOGGLE
// ============================================
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
    const nav = document.querySelector('.projects-nav');
    if (nav) {
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ============================================
// PROJECT DATA (Fallback - will be replaced by API)
// ============================================
let projectsData = {
    1: {
        missionBrief: "The Autonomous Drone System represents a breakthrough in unmanned aerial vehicle technology, combining advanced navigation algorithms with real-time obstacle avoidance. This project integrates multiple sensor arrays including LiDAR, ultrasonic, and computer vision systems to create a fully autonomous flight platform capable of navigating complex environments. The system utilizes machine learning for path optimization and adaptive flight control, ensuring maximum efficiency and safety in various operational scenarios.",
        architecture: `┌─────────────────────────────────────┐
│         FLIGHT CONTROLLER          │
│         (Arduino Mega)             │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│ LiDAR │ │  IMU  │ │  GPS  │
│ Sensor│ │Sensor │ │Module │
└───────┘ └───────┘ └───────┘
    │          │          │
    └──────────┼──────────┘
               │
    ┌──────────▼──────────┐
    │   ESP32 AI Module   │
    │  (Computer Vision)  │
    └─────────────────────┘`,
        stack: ["Arduino", "ESP32", "LiDAR", "IMU", "GPS", "Computer Vision", "AI/ML", "RF Communication"],
        status: {
            stability: 92,
            range: 85,
            reliability: 88
        }
    },
    2: {
        missionBrief: "The Smart Home Automation System revolutionizes residential living through intelligent IoT integration. This comprehensive solution connects multiple devices and sensors throughout the home, enabling seamless automation and remote control. The system employs MQTT protocol for efficient message queuing and real-time communication, ensuring reliable data transmission between devices. Advanced sensor fusion allows for predictive automation, learning user patterns and optimizing energy consumption while maintaining comfort and security.",
        architecture: `┌─────────────────────────────────────┐
│      MQTT BROKER (Cloud)          │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│ ESP32 │ │ ESP32 │ │ NodeJS │
│Gateway│ │Sensor │ │ Server │
└───┬───┘ └───────┘ └───┬───┘
    │                    │
┌───▼────────────────────▼───┐
│    React Dashboard (Web)    │
└─────────────────────────────┘`,
        stack: ["ESP32", "MQTT", "Node.js", "React", "Sensors", "IoT", "Cloud", "REST API"],
        status: {
            stability: 95,
            range: 90,
            reliability: 93
        }
    },
    3: {
        missionBrief: "The 6-DOF Robotic Arm project demonstrates precision engineering in mechatronics, featuring six degrees of freedom for complex manipulation tasks. Each joint is controlled by high-torque servo motors with position feedback, enabling sub-millimeter accuracy. The control system utilizes inverse kinematics algorithms to calculate optimal joint angles for desired end-effector positions. Custom 3D-printed components ensure lightweight construction while maintaining structural integrity, making this system ideal for research, education, and industrial applications.",
        architecture: `┌─────────────────────────────────────┐
│    Arduino Control Unit            │
│    (Inverse Kinematics)            │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Servo 1│ │Servo 2│ │Servo 3│
│(Base) │ │(Shoulder)│(Elbow)│
└───────┘ └───────┘ └───────┘
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Servo 4│ │Servo 5│ │Servo 6│
│(Wrist)│ │(Wrist)│ │(Gripper)│
└───────┘ └───────┘ └───────┘`,
        stack: ["Arduino", "C++", "Servo Motors", "3D Printing", "Inverse Kinematics", "Control Systems"],
        status: {
            stability: 88,
            range: 75,
            reliability: 90
        }
    },
    4: {
        missionBrief: "The Satellite Communication System establishes a ground station capable of receiving and transmitting data to low-earth orbit satellites. This project implements high-frequency RF modules with directional antenna arrays for optimal signal strength and data integrity. The system includes telemetry decoding, data logging, and real-time visualization of satellite passes. Advanced tracking algorithms predict satellite positions, enabling automated antenna pointing for maximum communication efficiency during brief contact windows.",
        architecture: `┌─────────────────────────────────────┐
│    Ground Station Controller        │
│         (Arduino + PC)              │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│  RF   │ │Antenna│ │Tracking│
│Module │ │Array  │ │System  │
└───┬───┘ └───────┘ └───┬───┘
    │                    │
┌───▼────────────────────▼───┐
│   Telemetry Decoder &       │
│   Data Visualization        │
└─────────────────────────────┘`,
        stack: ["RF Modules", "Arduino", "Antenna Design", "Telemetry", "Satellite Tracking", "Python"],
        status: {
            stability: 85,
            range: 95,
            reliability: 87
        }
    },
    5: {
        missionBrief: "The Embedded Control System represents a real-time industrial automation solution designed for high-precision manufacturing and monitoring applications. This system utilizes RTOS (Real-Time Operating System) architecture to ensure deterministic response times for critical control loops. Multiple sensor inputs are processed through advanced filtering algorithms, providing accurate feedback for closed-loop control. The system features redundant safety mechanisms and fault-tolerant design, making it suitable for mission-critical industrial environments.",
        architecture: `┌─────────────────────────────────────┐
│    RTOS Control Core                │
│    (Real-Time Scheduler)             │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Sensor │ │Actuator│ │Safety │
│Input  │ │Output  │ │System │
└───┬───┘ └───────┘ └───┬───┘
    │                    │
┌───▼────────────────────▼───┐
│   HMI & Data Logging        │
└─────────────────────────────┘`,
        stack: ["RTOS", "Embedded C", "Sensors", "Control Systems", "Industrial Automation", "Safety Systems"],
        status: {
            stability: 98,
            range: 80,
            reliability: 96
        }
    },
    6: {
        missionBrief: "The Circuit Design & PCB project showcases expertise in high-frequency electronics and power management systems. This comprehensive design process includes schematic capture, PCB layout optimization, and signal integrity analysis. The project focuses on creating custom solutions for specific applications, incorporating advanced power distribution networks, EMI/EMC considerations, and thermal management. Prototype validation through rigorous testing ensures reliability and performance in real-world operating conditions.",
        architecture: `┌─────────────────────────────────────┐
│    PCB Design Software              │
│    (Schematic & Layout)             │
└──────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Power  │ │Signal │ │Thermal │
│Design │ │Integrity│ │Analysis│
└───┬───┘ └───────┘ └───┬───┘
    │                    │
┌───▼────────────────────▼───┐
│   Prototype & Testing       │
└─────────────────────────────┘`,
        stack: ["PCB Design", "Circuit Analysis", "Power Management", "RF Design", "EMI/EMC", "Thermal Design"],
        status: {
            stability: 90,
            range: 85,
            reliability: 92
        }
    }
};

// ============================================
// LOAD PROJECTS FROM API
// ============================================
function loadProjectsFromAPI() {
    console.log('Loading projects from API...');
    console.log('API URL:', `${API_URL}/api/projects?status=live`);
    
    fetch(`${API_URL}/api/projects?status=live`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })
        .then(response => {
            console.log('API Response status:', response.status);
            console.log('API Response headers:', response.headers);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response data:', data);
            console.log('Projects array:', data.projects);
            
            if (data && data.success && data.projects && Array.isArray(data.projects)) {
                console.log(`Found ${data.projects.length} live project(s)`);
                
                if (data.projects.length === 0) {
                    console.warn('No live projects found. Make sure projects have status="live"');
                }
                
                // Update project count in hero section
                updateProjectCount(data.projects.length);
                
                // Convert API projects to projectsData format
                const apiProjects = {};
                data.projects.forEach((project, index) => {
                    console.log(`Processing project ${index + 1}:`, project.name, 'Status:', project.status);
                    apiProjects[project.id] = {
                        missionBrief: project.missionBrief || '',
                        architecture: project.architecture || '',
                        stack: project.stack || [],
                        status: project.statusValues || {
                            stability: project.statusValues?.stability || 0,
                            range: project.statusValues?.range || 0,
                            reliability: project.statusValues?.reliability || 0
                        }
                    };
                });
                
                // Merge with existing projectsData (fallback)
                projectsData = { ...projectsData, ...apiProjects };
                
                // Update project cards with API data - this will replace static HTML
                updateProjectCards(data.projects);
            } else {
                console.warn('No projects found or invalid response:', data);
                console.warn('Response structure:', {
                    hasData: !!data,
                    hasSuccess: data?.success,
                    hasProjects: !!data?.projects,
                    projectsType: typeof data?.projects,
                    projectsIsArray: Array.isArray(data?.projects)
                });
                // If no projects, set count to 0
                updateProjectCount(0);
                // Clear the grid
                const projectsGrid = document.getElementById('projectsGrid');
                if (projectsGrid) {
                    projectsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No projects available. Make sure projects are set to "Live" status in admin dashboard.</div>';
                }
            }
        })
        .catch(error => {
            console.error('Error loading projects from API:', error);
            console.error('Error details:', error.message);
            console.log('API URL was:', `${API_URL}/api/projects?status=live`);
            console.log('Make sure the Flask server is running on port 5000');
            
            // Try to load all projects (without status filter) as fallback
            console.log('Trying fallback: loading all projects...');
            fetch(`${API_URL}/api/projects`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.success && data.projects && Array.isArray(data.projects)) {
                        // Filter for live projects on client side
                        const liveProjects = data.projects.filter(p => (p.status === 'live'));
                        console.log(`Fallback: Found ${liveProjects.length} live project(s) from all projects`);
                        console.log('All projects statuses:', data.projects.map(p => ({ id: p.id, name: p.name, status: p.status })));
                        
                        if (liveProjects.length > 0) {
                            updateProjectCount(liveProjects.length);
                            updateProjectCards(liveProjects);
                        } else {
                            updateProjectCount(0);
                            const projectsGrid = document.getElementById('projectsGrid');
                            if (projectsGrid) {
                                projectsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No live projects found. Make sure projects are set to "Live" status in admin dashboard.</div>';
                            }
                        }
                    } else {
                        // Show error message
                        updateProjectCount(0);
                        const projectsGrid = document.getElementById('projectsGrid');
                        if (projectsGrid) {
                            projectsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #ff6b6b;">
                                <p>Error loading projects from server.</p>
                                <p style="font-size: 0.9em; color: #888; margin-top: 1rem;">Make sure the Flask server is running on http://localhost:5000</p>
                                <p style="font-size: 0.9em; color: #888;">Error: ${error.message}</p>
                            </div>`;
                        }
                    }
                })
                .catch(fallbackError => {
                    console.error('Fallback also failed:', fallbackError);
                    updateProjectCount(0);
                    const projectsGrid = document.getElementById('projectsGrid');
                    if (projectsGrid) {
                        projectsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #ff6b6b;">
                            <p>Cannot connect to server.</p>
                            <p style="font-size: 0.9em; color: #888; margin-top: 1rem;">Make sure the Flask server is running on http://localhost:5000</p>
                            <p style="font-size: 0.9em; color: #888;">Error: ${error.message}</p>
                        </div>`;
                    }
                });
        });
}

// Update project count in hero section
function updateProjectCount(count) {
    const projectCountElement = document.getElementById('projectCount');
    if (projectCountElement) {
        projectCountElement.textContent = count > 0 ? `${count}+` : '0';
    }
}

// Update project cards with API data
function updateProjectCards(apiProjects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
    console.log(`Updating project cards with ${apiProjects.length} project(s)`);
    
    // Update project count
    updateProjectCount(apiProjects.length);
    
    // Clear existing cards (including static HTML)
    projectsGrid.innerHTML = '';
    console.log('Cleared existing project cards');
    
    // Create cards from API data
    if (apiProjects.length === 0) {
        projectsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No projects available</div>';
        return;
    }
    
    apiProjects.forEach((project, index) => {
        console.log(`Creating card for project ${index + 1}:`, project.name);
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
    
    console.log('Project cards updated successfully');
    
    // Re-initialize click handlers for new cards
    initializeProjectCards();
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project', project.id);
    
    const stackIcons = project.stack ? project.stack.slice(0, 6).map(tag => {
        const shortTag = tag.substring(0, 3).toUpperCase();
        return `<span class="tech-icon" title="${tag}">${shortTag}</span>`;
    }).join('') : '';
    
    // Convert absolute paths to relative paths
    const getImagePath = (imagePath) => {
        if (!imagePath) return null;
        
        // Normalize path separators
        const normalized = imagePath.replace(/\\/g, '/');
        
        // If it's an absolute Windows path, extract relative part
        if (normalized.includes(':') || normalized.startsWith('/')) {
            // Find the 'image' folder in the path
            if (normalized.toLowerCase().includes('image')) {
                const parts = normalized.split('/');
                const imageIndex = parts.findIndex(part => part.toLowerCase() === 'image');
                if (imageIndex >= 0) {
                    // Get everything after 'image' folder
                    const relativePath = parts.slice(imageIndex + 1).join('/');
                    return `image/${relativePath}`;
                }
            }
            // Fallback: just use filename
            const parts = normalized.split('/');
            return `image/${parts[parts.length - 1]}`;
        }
        
        // If it already starts with image/, use as is
        if (normalized.startsWith('image/')) {
            return normalized;
        }
        
        // If it's just a filename, assume it's in image folder
        if (!normalized.includes('/')) {
            return `image/${normalized}`;
        }
        
        return normalized;
    };
    
    const firstImagePath = project.images && project.images.length > 0 
        ? getImagePath(project.images[0])
        : null;
    
    const firstImage = firstImagePath
        ? `<img src="${firstImagePath}" alt="${project.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'><span>IMAGE NOT FOUND</span></div>';">`
        : '<div class="image-placeholder"><span>PROJECT IMAGE</span></div>';
    
    card.innerHTML = `
        <div class="card-image">
            ${firstImage}
            <div class="card-overlay"></div>
        </div>
        <div class="card-content">
            <h3 class="project-name">${escapeHtml(project.name)}</h3>
            <p class="project-mission">${escapeHtml(project.mission || '')}</p>
            <div class="tech-stack">
                ${stackIcons}
            </div>
            <button class="view-mission-btn">View Mission</button>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', function() {
        showProjectDetail(project.id);
    });
    
    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing projects page...');
    
    // Clear static HTML cards first
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        console.log('Clearing static project cards...');
        projectsGrid.innerHTML = '';
    }
    
    // Load projects from API first
    loadProjectsFromAPI();
    
    // Initialize 3D effect for project cards
    setTimeout(() => {
        initProjects3D();
    }, 500);
    
    // Re-initialize 3D effect after projects are loaded (in case cards are added dynamically)
    setTimeout(() => {
        initProjects3D();
    }, 2000);
    
    // Initialize event handlers
    initializeCloseButton();
    initializeSmoothScrolling();
    
    // Note: initializeProjectCards() will be called after API projects load
});

// ============================================
// PROJECT CARD INTERACTIONS
// ============================================
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            showProjectDetail(projectId);
        });
    });
}

// ============================================
// SHOW PROJECT DETAIL
// ============================================
function showProjectDetail(projectId) {
    // Try to get from API first
    fetch(`${API_URL}/api/projects/${projectId}`)
        .then(response => response.json())
        .then(async (data) => {
            if (data && data.success && data.project) {
                await displayProjectDetail(data.project);
            } else {
                // Fallback to local data
                const project = projectsData[projectId];
                if (project) {
                    await displayProjectDetailFromLocal(projectId, project);
                }
            }
        })
        .catch(async (error) => {
            console.error('Error loading project detail:', error);
            // Fallback to local data
            const project = projectsData[projectId];
            if (project) {
                await displayProjectDetailFromLocal(projectId, project);
            }
        });
}

// Display project detail from API
async function displayProjectDetail(project) {
    const detailSection = document.getElementById('projectDetail');
    
    // Populate mission brief
    document.getElementById('missionBrief').textContent = project.missionBrief || '';
    
    // Populate architecture diagram
    document.getElementById('architectureDiagram').textContent = project.architecture || '';
    
    // Populate stack tags
    const stackTagsContainer = document.getElementById('stackTags');
    stackTagsContainer.innerHTML = '';
    if (project.stack && project.stack.length > 0) {
        project.stack.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'stack-tag';
            tagElement.textContent = tag;
            stackTagsContainer.appendChild(tagElement);
        });
    }
    
    // Display project images gallery
    console.log('Project images:', project.images);
    await displayProjectGallery(project.images || []);
    
    // Display LinkedIn link if available
    const linkedInSection = document.getElementById('linkedInLinkSection');
    const linkedInLink = document.getElementById('linkedInLink');
    if (project.linkedInLink && project.linkedInLink.trim()) {
        linkedInLink.href = project.linkedInLink;
        linkedInSection.style.display = 'block';
    } else {
        linkedInSection.style.display = 'none';
    }

    // Display project report PDF inline if available
    const reportSection = document.getElementById('projectReportSection');
    const reportLink = document.getElementById('projectReportLink');
    const reportContainer = document.getElementById('projectReportEmbedContainer');
    if (project.reportFile && project.reportFile.trim()) {
        const src = project.reportFile.trim();

        // Clear previous embed
        if (reportContainer) {
            reportContainer.innerHTML = '';

            const embed = document.createElement('embed');
            embed.src = src;
            embed.type = 'application/pdf';
            embed.setAttribute('aria-label', 'Project report PDF');

            reportContainer.appendChild(embed);
        }

        if (reportLink) {
            reportLink.href = src;
        }

        if (reportSection) {
            reportSection.style.display = 'block';
        }
    } else {
        if (reportSection) reportSection.style.display = 'none';
        if (reportContainer) reportContainer.innerHTML = '';
        if (reportLink) reportLink.removeAttribute('href');
    }
    
    // Animate HUD bars
    const status = project.statusValues || {
        stability: 0,
        range: 0,
        reliability: 0
    };
    animateHUDBars(status);
    
    // Show detail section
    detailSection.style.display = 'block';
    document.body.style.overflow = 'hidden';
    detailSection.scrollTop = 0;
}

// Display project gallery
let currentImageIndex = 0;
let projectImages = [];

async function displayProjectGallery(images) {
    const gallerySection = document.getElementById('projectGallery');
    const galleryMainImage = document.getElementById('galleryMainImage');
    const galleryThumbnails = document.getElementById('galleryThumbnails');
    
    // Normalize image paths
    const normalizeImagePath = (imagePath) => {
        if (!imagePath) return null;
        
        // Normalize path separators
        const normalized = imagePath.replace(/\\/g, '/');
        
        // If it's an absolute Windows path, extract relative part
        if (normalized.includes(':') || normalized.startsWith('/')) {
            // Find the 'image' folder in the path
            if (normalized.toLowerCase().includes('image')) {
                const parts = normalized.split('/');
                const imageIndex = parts.findIndex(part => part.toLowerCase() === 'image');
                if (imageIndex >= 0) {
                    // Get everything after 'image' folder
                    const relativePath = parts.slice(imageIndex + 1).join('/');
                    return `image/${relativePath}`;
                }
            }
            // Fallback: just use filename
            const parts = normalized.split('/');
            return `image/${parts[parts.length - 1]}`;
        }
        
        // If it already starts with image/, use as is
        if (normalized.startsWith('image/')) {
            return normalized;
        }
        
        // If it's just a filename, assume it's in image folder
        if (!normalized.includes('/')) {
            return `image/${normalized}`;
        }
        
        return normalized;
    };
    
    projectImages = images.map(normalizeImagePath).filter(img => img !== null);
    
    console.log('Normalized project images:', projectImages);
    console.log('Original images array:', images);
    
    if (projectImages.length === 0) {
        console.warn('No valid images found after normalization');
        gallerySection.style.display = 'none';
        return;
    }
    
    // Limit to 20 images for display
    if (projectImages.length > 20) {
        console.warn(`Too many images (${projectImages.length}), limiting to 20`);
        projectImages = projectImages.slice(0, 20);
    }
    
    gallerySection.style.display = 'block';
    currentImageIndex = 0;
    
    // Pre-validate images - filter out ones that don't exist
    await validateAndFilterImages();
    
    if (projectImages.length === 0) {
        console.warn('No valid images found after validation');
        gallerySection.style.display = 'none';
        return;
    }
    
    // Update image count display
    const imageCountEl = document.getElementById('imageCount');
    if (imageCountEl) {
        imageCountEl.textContent = `(${projectImages.length} image${projectImages.length !== 1 ? 's' : ''})`;
    }
    
    // Function to validate images exist
    async function validateAndFilterImages() {
        const validationPromises = projectImages.map(async (imagePath) => {
            return new Promise((resolve) => {
                const img = new Image();
                let resolved = false;
                
                // Set a timeout to avoid hanging
                const timeout = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve({ path: imagePath, valid: false });
                    }
                }, 5000);
                
                img.onload = () => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        resolve({ path: imagePath, valid: true });
                    }
                };
                
                img.onerror = () => {
                    // Silently handle missing images - no console warnings
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        resolve({ path: imagePath, valid: false });
                    }
                };
                
                img.src = imagePath;
            });
        });
        
        const results = await Promise.all(validationPromises);
        const validCount = results.filter(r => r.valid).length;
        const invalidCount = results.filter(r => !r.valid).length;
        
        projectImages = results.filter(r => r.valid).map(r => r.path);
        
        // Only show summary if there were invalid images (quiet mode)
        if (invalidCount > 0) {
            // Only log if more than 1 invalid image to reduce noise
            if (invalidCount > 1) {
                console.log(`Gallery: ${validCount} image(s) loaded, ${invalidCount} image(s) skipped (not found).`);
            }
        }
    }
    
    // Set main image with error handling
    let loadAttempts = 0;
    const maxLoadAttempts = projectImages.length;
    
    galleryMainImage.onerror = function() {
        console.error('Failed to load image:', projectImages[currentImageIndex]);
        loadAttempts++;
        
        // Try to show next image if available
        if (loadAttempts < maxLoadAttempts && projectImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % projectImages.length;
            this.src = projectImages[currentImageIndex];
            this.style.display = 'block';
        } else {
            this.style.display = 'none';
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'padding: 2rem; text-align: center; color: #ff6b6b;';
            errorMsg.textContent = 'Failed to load images. Please check image paths.';
            this.parentElement.appendChild(errorMsg);
        }
    };
    
    galleryMainImage.onload = function() {
        this.style.display = 'block';
        loadAttempts = 0; // Reset on successful load
        // Remove any error messages
        const errorMsg = this.parentElement.querySelector('div[style*="color: #ff6b6b"]');
        if (errorMsg) errorMsg.remove();
    };
    
    // Preload first image to check if it exists
    const testImg = new Image();
    testImg.onload = function() {
        galleryMainImage.src = projectImages[0];
        galleryMainImage.alt = 'Project Image 1';
    };
    testImg.onerror = function() {
        console.error('First image failed to preload:', projectImages[0]);
        // Try next image
        if (projectImages.length > 1) {
            currentImageIndex = 1;
            galleryMainImage.src = projectImages[1];
            galleryMainImage.alt = 'Project Image 2';
        } else {
            galleryMainImage.src = projectImages[0]; // Try anyway
            galleryMainImage.alt = 'Project Image 1';
        }
    };
    testImg.src = projectImages[0];
    
    // Create thumbnails
    galleryThumbnails.innerHTML = '';
    projectImages.forEach((imagePath, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (index === 0) {
            thumbnail.classList.add('active');
        }
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Thumbnail ${index + 1}`;
        img.onerror = function() {
            console.error('Failed to load thumbnail:', imagePath);
            this.style.opacity = '0.3';
            this.title = 'Image failed to load: ' + imagePath;
        };
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateGalleryDisplay();
        });
        galleryThumbnails.appendChild(thumbnail);
    });
    
    // Navigation buttons
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    // Use onclick so we don't stack multiple listeners every time
    if (prevBtn) {
        prevBtn.onclick = () => {
            currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
            updateGalleryDisplay();
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            currentImageIndex = (currentImageIndex + 1) % projectImages.length;
            updateGalleryDisplay();
        };
    }
    
    // Keyboard navigation (will be cleaned up when detail closes)
    if (!window.galleryKeyboardHandler) {
        window.galleryKeyboardHandler = handleGalleryKeyboard;
    }
    document.addEventListener('keydown', window.galleryKeyboardHandler);
}

function updateGalleryDisplay() {
    const galleryMainImage = document.getElementById('galleryMainImage');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    if (!projectImages || projectImages.length === 0) {
        console.error('No images available to display');
        return;
    }
    
    if (currentImageIndex < 0 || currentImageIndex >= projectImages.length) {
        currentImageIndex = 0;
    }
    
    const imagePath = projectImages[currentImageIndex];
    console.log('Loading image:', imagePath, 'at index:', currentImageIndex);
    
    // Add error handler
    galleryMainImage.onerror = function() {
        console.error('Failed to load image:', imagePath);
        // Try next image
        const nextIndex = (currentImageIndex + 1) % projectImages.length;
        if (nextIndex !== currentImageIndex && projectImages.length > 1) {
            currentImageIndex = nextIndex;
            updateGalleryDisplay();
        } else {
            this.style.display = 'none';
            this.alt = 'Image failed to load';
        }
    };
    
    galleryMainImage.onload = function() {
        this.style.display = 'block';
    };
    
    galleryMainImage.src = imagePath;
    galleryMainImage.alt = `Project Image ${currentImageIndex + 1}`;
    
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // Scroll thumbnail into view
    if (thumbnails[currentImageIndex]) {
        thumbnails[currentImageIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function handleGalleryKeyboard(e) {
    const gallerySection = document.getElementById('projectDetail');
    if (gallerySection.style.display !== 'block') return;
    
    if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        updateGalleryDisplay();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        updateGalleryDisplay();
    }
}

// Display project detail from local data (fallback)
async function displayProjectDetailFromLocal(projectId, project) {
    const detailSection = document.getElementById('projectDetail');
    
    // Populate mission brief
    document.getElementById('missionBrief').textContent = project.missionBrief || '';
    
    // Populate architecture diagram
    document.getElementById('architectureDiagram').textContent = project.architecture || '';
    
    // Populate stack tags
    const stackTagsContainer = document.getElementById('stackTags');
    stackTagsContainer.innerHTML = '';
    if (project.stack && project.stack.length > 0) {
        project.stack.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'stack-tag';
            tagElement.textContent = tag;
            stackTagsContainer.appendChild(tagElement);
        });
    }
    
    // Display project images gallery (empty for local data)
    await displayProjectGallery(project.images || []);
    
    // Animate HUD bars
    const status = project.status || project;
    animateHUDBars(status);
    
    // Show detail section
    detailSection.style.display = 'block';
    document.body.style.overflow = 'hidden';
    detailSection.scrollTop = 0;
}

// ============================================
// ANIMATE HUD BARS
// ============================================
function animateHUDBars(status) {
    const bars = {
        stability: {
            element: document.getElementById('stabilityBar'),
            value: document.getElementById('stabilityValue'),
            target: status.stability
        },
        range: {
            element: document.getElementById('rangeBar'),
            value: document.getElementById('rangeValue'),
            target: status.range
        },
        reliability: {
            element: document.getElementById('reliabilityBar'),
            value: document.getElementById('reliabilityValue'),
            target: status.reliability
        }
    };
    
    // Reset bars
    Object.values(bars).forEach(bar => {
        bar.element.style.width = '0%';
        bar.value.textContent = '0%';
    });
    
    // Animate to target values
    setTimeout(() => {
        Object.values(bars).forEach(bar => {
            bar.element.style.width = `${bar.target}%`;
            bar.value.textContent = `${bar.target}%`;
        });
    }, 100);
}

// ============================================
// CLOSE DETAIL SECTION
// ============================================
function initializeCloseButton() {
    const closeBtn = document.getElementById('closeDetail');
    const detailSection = document.getElementById('projectDetail');
    
    function closeDetail() {
        detailSection.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Remove keyboard event listener for gallery
        if (window.galleryKeyboardHandler) {
            document.removeEventListener('keydown', window.galleryKeyboardHandler);
        }
    }
    
    closeBtn.addEventListener('click', closeDetail);
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && detailSection.style.display === 'block') {
            closeDetail();
            detailSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close on background click
    detailSection.addEventListener('click', function(e) {
        if (e.target === detailSection) {
            detailSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initializeSmoothScrolling() {
    // Only select links that have href starting with "#" and have an actual anchor (not just "#")
    // Exclude the LinkedIn link and other external links
    document.querySelectorAll('a[href^="#"]:not(#linkedInLink)').forEach(anchor => {
        const href = anchor.getAttribute('href');
        // Double check it's actually an anchor link (not an external URL that was updated)
        if (href && href.startsWith('#') && href.length > 1) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
let lastScroll = 0;
const nav = document.querySelector('.projects-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
        nav.style.borderBottomColor = 'rgba(100, 200, 255, 0.3)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.7)';
        nav.style.borderBottomColor = 'rgba(100, 200, 255, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// CURSOR GLOW EFFECT (Optional Enhancement)
// ============================================
document.addEventListener('mousemove', function(e) {
    const interactiveElements = document.querySelectorAll('.project-card, .view-mission-btn, .stack-tag');
    
    interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
        }
    });
});
