class ElegantBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.canvas.id = 'background-canvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);
    }

    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.15 + 0.05
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
        });
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.fillStyle = `rgba(0, 104, 71, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawGradientBg() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#fef7f0');
        gradient.addColorStop(0.3, '#fdf3eb');
        gradient.addColorStop(0.7, '#fef8f3');
        gradient.addColorStop(1, '#fffaf6');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMeshGradient() {
        const meshOpacity = 0.02;

        const grad1 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.canvas.width * 0.4);
        grad1.addColorStop(0, `rgba(0, 104, 71, ${meshOpacity})`);
        grad1.addColorStop(1, 'rgba(0, 104, 71, 0)');
        this.ctx.fillStyle = grad1;
        this.ctx.fillRect(0, 0, this.canvas.width * 0.4, this.canvas.height * 0.4);

        const grad2 = this.ctx.createRadialGradient(
            this.canvas.width, this.canvas.height, 0,
            this.canvas.width, this.canvas.height, this.canvas.width * 0.4
        );
        grad2.addColorStop(0, `rgba(206, 17, 38, ${meshOpacity})`);
        grad2.addColorStop(1, 'rgba(206, 17, 38, 0)');
        this.ctx.fillStyle = grad2;
        this.ctx.fillRect(
            this.canvas.width * 0.6, this.canvas.height * 0.6,
            this.canvas.width * 0.4, this.canvas.height * 0.4
        );

        const grad3 = this.ctx.createRadialGradient(
            this.canvas.width, 0, 0,
            this.canvas.width, 0, this.canvas.width * 0.3
        );
        grad3.addColorStop(0, `rgba(255, 215, 0, ${meshOpacity * 0.5})`);
        grad3.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = grad3;
        this.ctx.fillRect(this.canvas.width * 0.7, 0, this.canvas.width * 0.3, this.canvas.height * 0.3);
    }

    animate() {
        this.drawGradientBg();
        this.drawMeshGradient();
        this.updateParticles();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ElegantBackground();
    });
} else {
    new ElegantBackground();
}