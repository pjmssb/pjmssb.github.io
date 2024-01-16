const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');

const sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 15 };
const planets = [
    { name: "Mercury", radius: 2, distance: 30, angle: 0, speed: 3.74 },
    { name: "Mercury2", radius: 4, distance: 50, angle: 3.141592654/2, speed: 3.74 },
    { name: "Mercury3", radius: 3, distance: 75, angle: 3.141592654, speed: 2.74 },
    { name: "Mercury4", radius: 5, distance: 105, angle: 3.141592654*3/2, speed: 4.74 },
    { name: "Venus", radius: 8, distance: 120, angle: 0, speed: 1.50 },
    { name: "Mercury2", radius: 5, distance: 200, angle: 2, speed: .5 },
    // Add other planets similarly
];

function drawSun() {
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function drawPlanet(planet) {
    let x = sun.x + planet.distance * Math.cos(planet.angle);
    let y = sun.y + planet.distance * Math.sin(planet.angle);
    ctx.beginPath();
    ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'grey';
    ctx.fill();
}

function updateSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSun();
    planets.forEach(planet => {
        drawPlanet(planet);
        planet.angle += planet.speed / 100;
    });
    requestAnimationFrame(updateSystem);
}

updateSystem();
