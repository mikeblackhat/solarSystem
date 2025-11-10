/**
 * Spaceships Module for Interactive 3D Galaxy Animation
 * Creates and manages spaceships with realistic movement patterns
 */

class SpaceshipManager {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.spaceships = [];
        this.spaceshipGroup = new THREE.Group();
        this.scene.add(this.spaceshipGroup);
        
        // Spaceship configuration
        this.config = {
            count: 8,
            minOrbitRadius: 15,
            maxOrbitRadius: 45,
            speed: 0.002,
            colors: [0x4a90e2, 0x7ed321, 0xf5a623, 0xd0021b, 0x9013fe, 0x50e3c2]
        };
        
        this.init();
    }
    
    init() {
        this.createSpaceships();
        this.startAnimation();
    }
    
    createSpaceshipGeometry() {
        const geometry = new THREE.BufferGeometry();
        
        // Create a simple spaceship shape using vertices
        const vertices = new Float32Array([
            // Main body (triangular prism-like)
            0, 0, 2,    // nose tip
            -0.5, 0, -1,  // left wing back
            0.5, 0, -1,   // right wing back
            0, 0, 2,    // nose tip
            0, 0.3, 0,  // top center
            -0.3, 0, -0.5, // left wing middle
            0, 0, 2,    // nose tip
            0, 0.3, 0,  // top center
            0.3, 0, -0.5,  // right wing middle
            // Wings
            -0.5, 0, -1,  // left wing tip
            -0.3, 0, -0.5, // left wing middle
            -0.2, 0.1, -0.3, // left wing top
            0.5, 0, -1,   // right wing tip
            0.3, 0, -0.5,  // right wing middle
            0.2, 0.1, -0.3  // right wing top
        ]);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        
        return geometry;
    }
    
    createSpaceship() {
        const geometry = this.createSpaceshipGeometry();
        const material = new THREE.MeshLambertMaterial({
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            transparent: true,
            opacity: 0.95,
            emissive: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            emissiveIntensity: 0.2
        });
        
        const spaceship = new THREE.Mesh(geometry, material);
        
        // Add engine glow effect
        const engineGlow = new THREE.PointLight(0x00ffff, 0.5, 10);
        engineGlow.position.set(0, 0, -1.2);
        spaceship.add(engineGlow);
        
        // Add navigation lights
        const navLight1 = new THREE.PointLight(0xff0000, 0.3, 5);
        navLight1.position.set(-0.4, 0.1, -0.8);
        spaceship.add(navLight1);
        
        const navLight2 = new THREE.PointLight(0x00ff00, 0.3, 5);
        navLight2.position.set(0.4, 0.1, -0.8);
        spaceship.add(navLight2);
        
        // Random starting position and orbit
        const angle = Math.random() * Math.PI * 2;
        const radius = this.config.minOrbitRadius + Math.random() * (this.config.maxOrbitRadius - this.config.minOrbitRadius);
        const height = (Math.random() - 0.5) * 10;
        
        spaceship.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        // Store spaceship data
        spaceship.userData = {
            angle: angle,
            radius: radius,
            height: height,
            speed: this.config.speed + (Math.random() - 0.5) * this.config.speed * 0.5,
            verticalSpeed: (Math.random() - 0.5) * 0.001,
            originalColor: material.color.getHex()
        };
        
        return spaceship;
    }
    
    createSpaceships() {
        for (let i = 0; i < this.config.count; i++) {
            const spaceship = this.createSpaceship();
            this.spaceshipGroup.add(spaceship);
            this.spaceships.push(spaceship);
        }
        
        console.log(`🚀 Created ${this.config.count} spaceships`);
    }
    
    updateSpaceship(spaceship) {
        const data = spaceship.userData;
        
        // Update orbital position
        data.angle += data.speed;
        data.height += data.verticalSpeed;
        
        // Keep height within bounds
        if (Math.abs(data.height) > 15) {
            data.verticalSpeed *= -1;
        }
        
        // Update position
        spaceship.position.x = Math.cos(data.angle) * data.radius;
        spaceship.position.y = data.height;
        spaceship.position.z = Math.sin(data.angle) * data.radius;
        
        // Make spaceship face direction of movement
        const nextX = Math.cos(data.angle + 0.1) * data.radius;
        const nextZ = Math.sin(data.angle + 0.1) * data.radius;
        spaceship.lookAt(nextX, data.height, nextZ);
        
        // Add subtle bobbing motion
        spaceship.position.y += Math.sin(Date.now() * 0.003 + data.angle) * 0.2;
        
        // Engine pulse effect
        const engineGlow = spaceship.children.find(child => child.type === 'PointLight');
        if (engineGlow) {
            engineGlow.intensity = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.spaceships.forEach(spaceship => {
                this.updateSpaceship(spaceship);
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // Public methods for external control
    setVisibility(visible) {
        this.spaceshipGroup.visible = visible;
    }
    
    setSpeed(multiplier) {
        this.spaceships.forEach(spaceship => {
            spaceship.userData.speed = this.config.speed * multiplier + (Math.random() - 0.5) * this.config.speed * 0.5;
        });
    }
    
    addSpaceship() {
        const spaceship = this.createSpaceship();
        this.spaceshipGroup.add(spaceship);
        this.spaceships.push(spaceship);
        this.config.count++;
    }
    
    removeSpaceship() {
        if (this.spaceships.length > 0) {
            const spaceship = this.spaceships.pop();
            this.spaceshipGroup.remove(spaceship);
            this.config.count--;
        }
    }
    
    destroy() {
        this.scene.remove(this.spaceshipGroup);
        this.spaceships.forEach(spaceship => {
            spaceship.geometry.dispose();
            spaceship.material.dispose();
        });
        this.spaceships = [];
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceshipManager;
}