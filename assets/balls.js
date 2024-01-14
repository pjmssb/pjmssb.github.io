const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const balls = []; // Array to hold our ball objects
const ballColors = ['black', 'black', 'black', 'black',  
                    'white', 'white', 'white', 'white', 'white','white', 
                    'white', 'white', 'white', 'white', 'white','white', 
                    'white', 'white', 'white', 'white', 'white','white', 
                    'blue', 'red', 'green', 'purple', 'white','yellow',  
                    'blue', 'red', 'green', 'purple', 'white','yellow',  
                    'blue', 'red', 'green', 'purple', 'blawhiteck','yellow']; // Ball colors

class Ball {
    constructor(color) {
        this.color = color;
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Teleportation logic
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }

        // Physics interactions
        balls.forEach(ball => {
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (ball.color === 'black') {
                    // Attraction to black ball
                    this.vx += dx / distance * 0.25;
                    this.vy += dy / distance * 0.25;
                } else if (this.color !== 'black') {
                    // Repulsion from other colored balls
                    this.vx -= dx / distance * 0.05;
                    this.vy -= dy / distance * 0.05;
                }
            }
        });
    }
}

// Initialize balls
ballColors.forEach(color => {
    balls.push(new Ball(color));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();       
        ball.draw();
    });
    requestAnimationFrame(animate);
}
    
animate();
    
    canvas.addEventListener('click', () => {
    balls.forEach(ball => ball.reset());
});