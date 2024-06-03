const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the Particle class
class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
    }

    applyForce(fx, fy) {
        this.vx += fx;
        this.vy += fy;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
    }
}

// Define the Joint class
class Joint {
    constructor(partA, partB, length) {
        this.partA = partA;
        this.partB = partB;
        this.length = length;
    }

    update() {
        const dx = this.partB.x - this.partA.x;
        const dy = this.partB.y - this.partA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const difference = this.length - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        this.partA.x -= offsetX;
        this.partA.y -= offsetY;
        this.partB.x += offsetX;
        this.partB.y += offsetY;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.partA.x, this.partA.y);
        ctx.lineTo(this.partB.x, this.partB.y);
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
}

// Create particles for body parts
const torso = new Particle(400, 300, 5);
const head = new Particle(400, 270, 5);
const leftArm = new Particle(390, 300, 5);
const rightArm = new Particle(410, 300, 5);
const leftLeg = new Particle(395, 330, 5);
const rightLeg = new Particle(405, 330, 5);

// Create joints to connect body parts
const joints = [
    new Joint(torso, head, 30),
    new Joint(torso, leftArm, 20),
    new Joint(torso, rightArm, 20),
    new Joint(torso, leftLeg, 20),
    new Joint(torso, rightLeg, 20)
];

const particles = [torso, head, leftArm, rightArm, leftLeg, rightLeg];

// Function to draw stars for the background
function drawStars() {
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
}

// Update loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();

    // Update and draw joints first to maintain visual layering
    joints.forEach(joint => {
        joint.update();
        joint.draw();
    });

    // Update and draw particles
    particles.forEach(particle => {
        particle.applyForce(0, 0.01); // Apply a small force to simulate gravity
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(update);
}

update();

// Event listener for movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') torso.applyForce(0, -0.1);
    if (e.key === 'ArrowDown') torso.applyForce(0, 0.1);
    if (e.key === 'ArrowLeft') torso.applyForce(-0.1, 0);
    if (e.key === 'ArrowRight') torso.applyForce(0.1, 0);
});
