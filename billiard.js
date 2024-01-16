const billiard_canvas = document.getElementById('billiardCanvas');
const billiard_ctx = billiard_canvas.getContext('2d');

billiard_canvas.width = 800;
billiard_canvas.height = 20;

class BilliardBall {
    constructor(color) {
        this.radius = 5;
        this.mass = 1; // Assuming equal mass for simplicity
        this.x = Math.random() * (billiard_canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (billiard_canvas.height - this.radius * 2) + this.radius;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.color = color;
    }

    draw() {
        billiard_ctx.beginPath();
        billiard_ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        billiard_ctx.fillStyle = this.color;
        billiard_ctx.fill();
        billiard_ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wall collision
        if (this.x - this.radius <= 0 || this.x + this.radius >= billiard_canvas.width) {
            this.speedX = -this.speedX;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= billiard_canvas.height) {
            this.speedY = -this.speedY;
        }
    }
}

let billiardballs = [
    new BilliardBall('white'),
    new BilliardBall('gray'),
    new BilliardBall('silver'),
    new BilliardBall('darkgray'),
    new BilliardBall('gray'),
    new BilliardBall('silver'),
    new BilliardBall('darkgray')
];

function increaseSpeed(color, increment) {
    billiardballs.forEach(ball => {
        if (ball.color === color) {
            ball.speedX += ball.speedX > 0 ? increment : -increment;
            ball.speedY += ball.speedY > 0 ? increment : -increment;
        }
    });
}

function detectCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ball1.radius + ball2.radius) {
        // Collision detected!
        handleCollision(ball1, ball2);
    }
}

function handleCollision(ball1, ball2) {
    // Simple elastic collision physics
    let vCollision = {x: ball2.x - ball1.x, y: ball2.y - ball1.y};
    let distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};

    let vRelativeVelocity = {x: ball1.speedX - ball2.speedX, y: ball1.speedY - ball2.speedY};
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    if (speed < 0) {
        return;
    }

    let impulse = 2 * speed / (ball1.mass + ball2.mass);
    ball1.speedX -= impulse * ball2.mass * vCollisionNorm.x;
    ball1.speedY -= impulse * ball2.mass * vCollisionNorm.y;
    ball2.speedX += impulse * ball1.mass * vCollisionNorm.x;
    ball2.speedY += impulse * ball1.mass * vCollisionNorm.y;
}

function updateGame() {
    billiard_ctx.clearRect(0, 0, billiard_canvas.width, billiard_canvas.height);
    for (let i = 0; i < billiardballs.length; i++) {
        billiardballs[i].move();
        for (let j = i + 1; j < billiardballs.length; j++) {
            detectCollision(billiardballs[i], billiardballs[j]);
        }
    }
    billiardballs.forEach(ball => ball.draw());
    requestAnimationFrame(updateGame);
}

setInterval(() => increaseSpeed('white', 0.1), 5000);
setInterval(() => increaseSpeed('gray', 0.1), 10000);

updateGame();
