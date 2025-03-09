// Animations JavaScript for the Fractional CTO Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize background animation
    initBackgroundAnimation();
    
    // Initialize section animations
    initSectionAnimations();
    
    // Initialize world map (placeholder)
    //initWorldMap();
});

// Array of animation functions
const backgroundAnimations = [];

// Register animation functions
function registerAnimations() {
    // Particles network animation
    backgroundAnimations.push(function particlesNetwork(canvas, ctx) {
        // Animation parameters
        const particles = [];
        const particleCount = 50;
        const maxSize = 5;
        const maxSpeed = 0.5;
        const connectionDistance = 150;
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * maxSize + 1,
                speedX: (Math.random() - 0.5) * maxSpeed,
                speedY: (Math.random() - 0.5) * maxSpeed
            });
        }
        
        // Animation frame function
        return function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get theme colors from CSS variables
            const animationElement = getComputedStyle(document.documentElement).getPropertyValue('--animation-element').trim();
            const animationElementLight = getComputedStyle(document.documentElement).getPropertyValue('--animation-element-light').trim();
            
            const particleColor = animationElement;
            const lineColor = animationElementLight;
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Move particles
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Boundary check and bounce
                if (p.x < 0 || p.x > canvas.width) {
                    p.speedX = -p.speedX;
                }
                
                if (p.y < 0 || p.y > canvas.height) {
                    p.speedY = -p.speedY;
                }
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
                
                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        // The closer they are, the more opaque the line
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = lineColor.replace('0.2', opacity * 0.2);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };
    });
    
    // Maze generator animation
    backgroundAnimations.push(function mazeGenerator(canvas, ctx) {
        // Maze parameters
        const cellSize = 20;
        const rows = Math.floor(canvas.height / cellSize);
        const cols = Math.floor(canvas.width / cellSize);
        const maze = [];
        const stack = [];
        let current;
        
        // Direction vectors
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 1, y: 0 },  // Right
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }  // Left
        ];
        
        // Create maze grid
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < cols; x++) {
                row.push({
                    x, y,
                    visited: false,
                    walls: [true, true, true, true] // Up, Right, Down, Left
                });
            }
            maze.push(row);
        }
        
        // Start from a random cell
        current = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
        current.visited = true;
        stack.push(current);
        
        // Maze balls
        const balls = [];
        let mazeBuilt = false;
        
        // Animation frame function
        return function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get animation colors from CSS variables
            const animationElement = getComputedStyle(document.documentElement).getPropertyValue('--animation-element').trim();
            const animationElementLight = getComputedStyle(document.documentElement).getPropertyValue('--animation-element-light').trim();
            
            const wallColor = animationElement;
            const visitedColor = animationElementLight;
            const currentColor = animationElement;
            const ballColor = animationElement;
            
            // Draw maze
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = maze[y][x];
                    const px = x * cellSize;
                    const py = y * cellSize;
                    
                    // Draw visited cells
                    if (cell.visited) {
                        ctx.fillStyle = visitedColor;
                        ctx.fillRect(px, py, cellSize, cellSize);
                    }
                    
                    // Draw walls
                    ctx.strokeStyle = wallColor;
                    ctx.lineWidth = 2;
                    
                    if (cell.walls[0]) { // Up
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px + cellSize, py);
                        ctx.stroke();
                    }
                    
                    if (cell.walls[1]) { // Right
                        ctx.beginPath();
                        ctx.moveTo(px + cellSize, py);
                        ctx.lineTo(px + cellSize, py + cellSize);
                        ctx.stroke();
                    }
                    
                    if (cell.walls[2]) { // Down
                        ctx.beginPath();
                        ctx.moveTo(px, py + cellSize);
                        ctx.lineTo(px + cellSize, py + cellSize);
                        ctx.stroke();
                    }
                    
                    if (cell.walls[3]) { // Left
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px, py + cellSize);
                        ctx.stroke();
                    }
                }
            }
            
            // Highlight current cell
            if (current) {
                const px = current.x * cellSize;
                const py = current.y * cellSize;
                ctx.fillStyle = currentColor;
                ctx.fillRect(px, py, cellSize, cellSize);
            }
            
            // Build maze
            if (stack.length > 0 && !mazeBuilt) {
                // Get current cell
                current = stack[stack.length - 1];
                
                // Get unvisited neighbors
                const neighbors = [];
                for (let i = 0; i < directions.length; i++) {
                    const nx = current.x + directions[i].x;
                    const ny = current.y + directions[i].y;
                    
                    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !maze[ny][nx].visited) {
                        neighbors.push({ cell: maze[ny][nx], direction: i });
                    }
                }
                
                if (neighbors.length > 0) {
                    // Choose random neighbor
                    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                    
                    // Remove walls between cells
                    current.walls[next.direction] = false;
                    next.cell.walls[(next.direction + 2) % 4] = false;
                    
                    // Mark as visited and add to stack
                    next.cell.visited = true;
                    stack.push(next.cell);
                } else {
                    // Backtrack
                    stack.pop();
                }
            } else if (!mazeBuilt) {
                // Maze is built
                mazeBuilt = true;
                
                // Add balls to the maze
                for (let i = 0; i < 8; i++) {
                    // Find a valid cell to place the ball
                    let randomCell;
                    do {
                        randomCell = maze[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)];
                    } while (!randomCell.visited);
                    
                    balls.push({
                        x: randomCell.x * cellSize + cellSize / 2,
                        y: randomCell.y * cellSize + cellSize / 2,
                        size: 5,
                        dx: Math.random() < 0.5 ? -1 : 1,
                        dy: Math.random() < 0.5 ? -1 : 1,
                        speed: 1 + Math.random()
                    });
                }
            }
            
            // Move and draw balls
            if (mazeBuilt) {
                for (const ball of balls) {
                    // Calculate next position
                    const nextX = ball.x + ball.dx * ball.speed;
                    const nextY = ball.y + ball.dy * ball.speed;
                    
                    // Get current cell coordinates
                    const currentCellX = Math.floor(ball.x / cellSize);
                    const currentCellY = Math.floor(ball.y / cellSize);
                    
                    // Get next cell coordinates
                    const nextCellX = Math.floor(nextX / cellSize);
                    const nextCellY = Math.floor(nextY / cellSize);
                    
                    // Check if ball is moving to a new cell
                    if (nextCellX !== currentCellX || nextCellY !== currentCellY) {
                        // Check for walls
                        const currentCell = maze[currentCellY][currentCellX];
                        
                        // Check horizontal walls
                        if (nextCellX > currentCellX && currentCell.walls[1]) {
                            ball.dx = -ball.dx; // Hit right wall
                        } else if (nextCellX < currentCellX && currentCell.walls[3]) {
                            ball.dx = -ball.dx; // Hit left wall
                        }
                        
                        // Check vertical walls
                        if (nextCellY > currentCellY && currentCell.walls[2]) {
                            ball.dy = -ball.dy; // Hit bottom wall
                        } else if (nextCellY < currentCellY && currentCell.walls[0]) {
                            ball.dy = -ball.dy; // Hit top wall
                        }
                    } else {
                        // No wall collision, update position
                        ball.x = nextX;
                        ball.y = nextY;
                    }
                    
                    // Draw ball
                    ctx.beginPath();
                    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
                    ctx.fillStyle = ballColor;
                    ctx.fill();
                }
            }
        };
    });
    
    // Bouncing blocks animation
    backgroundAnimations.push(function bouncingBlocks(canvas, ctx) {
        // Animation parameters
        const blocks = [];
        const blockCount = 25;
        const blockSize = 20;
        
        // Create blocks
        for (let i = 0; i < blockCount; i++) {
            blocks.push({
                x: Math.random() * (canvas.width - blockSize),
                y: Math.random() * (canvas.height - blockSize),
                size: blockSize + Math.random() * 10,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: Math.random() * 0.4 + 0.3 // Gray shade between 0.3 and 0.7
            });
        }
        
        // Animation frame function
        return function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get theme to determine color
            //const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            const isDarkMode = false;
            
            //Tomamos el color de main.css
            const animationElement = getComputedStyle(document.documentElement).getPropertyValue('--animation-element').trim();
            
            // Update and draw blocks
            for (const block of blocks) {
                // Move blocks
                block.x += block.speedX;
                block.y += block.speedY;
                
                // Boundary check and bounce
                if (block.x <= 0 || block.x + block.size >= canvas.width) {
                    block.speedX = -block.speedX;
                    
                    // If out of bounds, place back inside
                    if (block.x < 0) block.x = 0;
                    if (block.x + block.size > canvas.width) block.x = canvas.width - block.size;
                }
                
                if (block.y <= 0 || block.y + block.size >= canvas.height) {
                    block.speedY = -block.speedY;
                    
                    // If out of bounds, place back inside
                    if (block.y < 0) block.y = 0;
                    if (block.y + block.size > canvas.height) block.y = canvas.height - block.size;
                }
                
                // Draw block with blue shade
                //const blueColor = "rgb(100, 150, 255)";
                ctx.fillStyle = animationElement;
                ctx.fillRect(block.x, block.y, block.size, block.size);
            }
        };
    });

    // Planet & planetoids animation
    backgroundAnimations.push(function gravitationalParticles(canvas, ctx) {
        // Physics parameters
        const G = 0.5; // Gravitational constant
        const mainMass = 2000; // Mass of the main particle
        const smallMass = mainMass / 100; // Mass of small particles
        const particleCount = 200;
        
        // Main particle
        const mainParticle = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            mass: mainMass,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 
        };
        
        // Small particles array
        const particles = [];
        
        // Initialize small particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 2,
                mass: smallMass,
                vx: 0,
                vy: 0
            });
        }
        
        // Animation frame function
        return function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get animation colors from CSS variables
            const animationElement = getComputedStyle(document.documentElement).getPropertyValue('--animation-element').trim();
            const animationElementLight = getComputedStyle(document.documentElement).getPropertyValue('--animation-element-light').trim();
            
            // Update main particle position
            mainParticle.x += mainParticle.vx;
            mainParticle.y += mainParticle.vy;
            
            // Wrap around edges for main particle
            if (mainParticle.x < 0) mainParticle.x = canvas.width;
            if (mainParticle.x > canvas.width) mainParticle.x = 0;
            if (mainParticle.y < 0) mainParticle.y = canvas.height;
            if (mainParticle.y > canvas.height) mainParticle.y = 0;
            
            // Update small particles
            particles.forEach(particle => {
                // Calculate gravitational force
                const dx = mainParticle.x - particle.x;
                const dy = mainParticle.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    const force = G * (mainParticle.mass * particle.mass) / (distance * distance);
                    const ax = force * dx / (distance * particle.mass);
                    const ay = force * dy / (distance * particle.mass);
                    
                    // Update velocity
                    particle.vx += ax;
                    particle.vy += ay;
                }
                
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Add slight friction to prevent extreme velocities
                particle.vx *= 0.99;
                particle.vy *= 0.99;
            });
            
            // Draw main particle
            ctx.beginPath();
            ctx.arc(mainParticle.x, mainParticle.y, mainParticle.radius, 0, Math.PI * 2);
            ctx.fillStyle = animationElement;
            ctx.fill();
            
            // Draw small particles
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = animationElement;
                ctx.fill();
            });
        };
    });

    // Add new N-body gravitational simulation
    backgroundAnimations.push(function gravityBalls(canvas, ctx) {
        const G = 0.9; // Gravitational constant
        const balls = [];
        const numBalls = 8;
        const mass = 100;
        const radius = 8;
        const repulsionDistance = radius * 1.5; // Distance threshold for repulsion
        const repulsionStrength = 5; // Multiplier for repulsion force
        const maxSpeed = 2; // Maximum initial speed
        const minDistance = radius * 4; // Minimum distance between balls at start

        // Initialize balls with random positions and velocities
        for (let i = 0; i < numBalls; i++) {
            let x = radius + (Math.random() * (canvas.width - 2 * radius));
            let y = radius + (Math.random() * (canvas.height - 2 * radius));
            
            // Random angle for initial velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * maxSpeed;

            balls.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                mass: mass,
                radius: radius
            });
        }

        return function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const animationElement = getComputedStyle(document.documentElement)
                .getPropertyValue('--animation-element').trim();

            // Update velocities based on gravitational forces
            for (let i = 0; i < balls.length; i++) {
                const ball1 = balls[i];
                let fx = 0;
                let fy = 0;

                for (let j = 0; j < balls.length; j++) {
                    if (i !== j) {
                        const ball2 = balls[j];
                        const dx = ball2.x - ball1.x;
                        const dy = ball2.y - ball1.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance > 0) {
                            let force;
                            if (distance < repulsionDistance) {
                                // Repulsion force when balls are too close
                                force = -G * (ball1.mass * ball2.mass) / (distance * distance) * repulsionStrength;
                            } else {
                                // Normal gravitational attraction
                                force = G * (ball1.mass * ball2.mass) / (distance * distance);
                            }
                            
                            fx += force * dx / distance;
                            fy += force * dy / distance;
                        }
                    }
                }

                // Update velocity (F = ma → a = F/m)
                ball1.vx += fx / ball1.mass;
                ball1.vy += fy / ball1.mass;

                // Add friction to prevent excessive speeds
                ball1.vx *= 0.995;
                ball1.vy *= 0.995;
            }

            // Update positions and draw balls
            balls.forEach(ball => {
                ball.x += ball.vx;
                ball.y += ball.vy;

                // Bounce off walls with energy loss
                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                    ball.vx *= -0.8;
                    ball.x = ball.x - ball.radius < 0 ? ball.radius : canvas.width - ball.radius;
                }
                if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                    ball.vy *= -0.8;
                    ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
                }

                // Draw ball
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = animationElement;
                ctx.fill();
            });
        };
    });
}

// Create and manage background animation
function initBackgroundAnimation() {
    const backgroundElement = document.getElementById('backgroundAnimation');
    
    if (!backgroundElement) return;
    
    // Register all animations
    registerAnimations();
    
    // Create a canvas for the animation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Append canvas to the animation container
    backgroundElement.appendChild(canvas);
    
    // Choose a random animation
    const randomIndex = Math.floor(Math.random() * backgroundAnimations.length);
    const animationFrame = backgroundAnimations[randomIndex](canvas, ctx);
    
    // Animation loop
    function animate() {
        animationFrame();
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Animate sections when they enter the viewport
function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.card');
    
    // Observer options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.animated-title');
                if (title) {
                    title.style.animation = 'fadeInUp 0.5s ease forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observer for cards
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 0;
                entry.target.style.transform = 'translateY(20px)';
                
                // Add animation with delay based on card index
                const index = Array.from(cards).indexOf(entry.target);
                const delay = index % 3 * 0.1; // 0.1s delay between cards in a row
                
                entry.target.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
                
                // Trigger animation in the next frame
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, 10);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Start observing
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    cards.forEach(card => {
        cardObserver.observe(card);
    });
}

// Initialize world map (placeholder for a real map implementation)
function initWorldMap() {
    const worldMapElement = document.getElementById('worldMap');
    
    if (!worldMapElement) return;
    
    // In a real implementation, you would use a mapping library like Leaflet or Google Maps
    // For now, we'll just create a simple placeholder
    
    // Create a canvas for the world map
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = worldMapElement.clientWidth;
    canvas.height = worldMapElement.clientHeight;
    worldMapElement.appendChild(canvas);
    
    // Get theme to determine color
    //const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const isDarkMode = false;
    //const mapColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const animationElement = getComputedStyle(document.documentElement)
            .getPropertyValue('--animation-bg').trim();
    //const pointColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const pointColor = animationElement;


    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');
    
    // Draw simple map outline (placeholder)
    ctx.beginPath();
    ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.strokeStyle = mapColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Sample locations (would be replaced with real data)
    const locations = [
        { name: "Portugal", x: 0.2, y: 0.4 },
        { name: "Chile", x: 0.3, y: 0.7 },
        { name: "USA", x: 0.6, y: 0.35 },
        { name: "Colombia", x: 0.7, y: 0.6 }
    ];
    
    // Draw locations
    locations.forEach(location => {
        const x = location.x * canvas.width;
        const y = location.y * canvas.height;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
        
        // Pulsating animation
        setInterval(() => {
            // Clear previous circle
            ctx.clearRect(x - 20, y - 20, 40, 40);
            
            // Redraw point
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = accentColor;
            ctx.fill();
            
            // Draw pulsating circle
            const time = Date.now() / 1000;
            const size = 6 + Math.sin(time * 2) * 3;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        }, 50);
    });
}
