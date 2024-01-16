const balls_canvas = document.getElementById('ballscanvas');
const balls_ctx = balls_canvas.getContext('2d');
balls_canvas.width = balls_canvas.offsetWidth;
balls_canvas.height = balls_canvas.offsetHeight;

const balls = []; // Array to hold our ball objects
const ballColors = ['black', 'black', 'black', 'black',
                    'black', 'black', 'black', 'black',
                    'white', 'white', 'white', 'white', 'white','white', 
                    'white', 'white', 'white', 'white', 'white','white', 
                    'grey', 'grey', 'grey', 'grey', 'grey','grey',  
                    'grey', 'grey', 'grey', 'grey', 'grey','grey',    
                    'silver', 'silver', 'silver', 'silver', 'silver','silver',  
                    'silver', 'silver', 'silver', 'silver', 'silver','silver']; // Ball colors

class Ball {
    constructor(color) {
        this.color = color;
        this.reset();
    }

    reset() {
        this.x = Math.random() * balls_canvas.width;
        this.y = Math.random() * balls_canvas.height;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
    }

    draw() {
        balls_ctx.fillStyle = this.color;
        balls_ctx.beginPath();
        balls_ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        balls_ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Teleportation logic
        if (this.x < 0 || this.x > balls_canvas.width || this.y < 0 || this.y > balls_canvas.height) {
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
    balls_ctx.clearRect(0, 0, balls_canvas.width, balls_canvas.height);
    balls.forEach(ball => {
        ball.update();       
        ball.draw();
    });
    requestAnimationFrame(animate);
}
    
animate();
    
    balls_canvas.addEventListener('click', () => {
    balls.forEach(ball => ball.reset());
});