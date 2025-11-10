/**
 * Asteroids Module for Interactive 3D Galaxy Animation
 * Creates and manages asteroids with realistic physics and movement
 */

class AsteroidManager {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.asteroids = [];
        this.asteroidGroup = new THREE.Group();
        this.scene.add(this.asteroidGroup);
        
        // Asteroid configuration
        this.config = {
            count: 25,
            minSize: 0.3,
            maxSize: 2.5,
            minOrbitRadius: 25,
            maxOrbitRadius: 55,
            speed: 0.0008,
            rotationSpeed: 0.01,
            colors: [0x8b7355, 0xa0956b, 0x6b5b47, 0x9c8a6b, 0x7a6b4f, 0xb8a082]
        };
        
        this.init();
    }
    
    init() {
        this.createAsteroids();
        this.startAnimation();
    }
    
    createAsteroidGeometry(size) {
        // Create irregular asteroid shape using noise
        const geometry = new THREE.SphereGeometry(size, 8, 6);
        
        // Apply random deformation for irregular shape
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            const noise = (Math.random() - 0.5) * size * 0.4;
            vertex.normalize().multiplyScalar(size + noise);
            vertices[i] = vertex.x;
            vertices[i + 1] = vertex.y;
            vertices[i + 2] = vertex.z;
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        return geometry;
    }
    
    createAsteroid() {
        const size = this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize);
        const geometry = this.createAsteroidGeometry(size);
        
        const material = new THREE.MeshLambertMaterial({
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            transparent: true,
            opacity: 0.9,
            emissive: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            emissiveIntensity: 0.15
        });
        
        const asteroid = new THREE.Mesh(geometry, material);
        
        // Add subtle glow for visibility
        const glowGeometry = new THREE.SphereGeometry(size * 1.15, 8, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            transparent: true,
            opacity: 0.15
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        asteroid.add(glow);
        
        // Random starting position and orbit parameters
        const angle = Math.random() * Math.PI * 2;
        const radius = this.config.minOrbitRadius + Math.random() * (this.config.maxOrbitRadius - this.config.minOrbitRadius);
        const height = (Math.random() - 0.5) * 8;
        const inclination = (Math.random() - 0.5) * 0.3; // Orbital inclination
        
        asteroid.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        // Store asteroid data
        asteroid.userData = {
            angle: angle,
            radius: radius,
            height: height,
            inclination: inclination,
            speed: this.config.speed + (Math.random() - 0.5) * this.config.speed * 0.5,
            rotationSpeed: {
                x: (Math.random() - 0.5) * this.config.rotationSpeed,
                y: (Math.random() - 0.5) * this.config.rotationSpeed,
                z: (Math.random() - 0.5) * this.config.rotationSpeed
            },
            size: size,
            originalColor: material.color.getHex()
        };
        
        return asteroid;
    }
    
    createAsteroids() {
        for (let i = 0; i < this.config.count; i++) {
            const asteroid = this.createAsteroid();
            this.asteroidGroup.add(asteroid);
            this.asteroids.push(asteroid);
        }
        
        console.log(`🪨 Created ${this.config.count} asteroids`);
    }
    
    updateAsteroid(asteroid) {
        const data = asteroid.userData;
        
        // Update orbital position with inclination
        data.angle += data.speed;
        
        // Calculate position with orbital inclination
        const x = Math.cos(data.angle) * data.radius;
        const z = Math.sin(data.angle) * data.radius;
        const y = data.height + Math.sin(data.angle + data.inclination) * 2;
        
        asteroid.position.set(x, y, z);
        
        // Rotate asteroid on all axes
        asteroid.rotation.x += data.rotationSpeed.x;
        asteroid.rotation.y += data.rotationSpeed.y;
        asteroid.rotation.z += data.rotationSpeed.z;
        
        // Add subtle size pulsing for visual interest
        const scale = 1 + Math.sin(Date.now() * 0.001 + data.angle) * 0.05;
        asteroid.scale.setScalar(scale);
    }
    
    // Create asteroid belt effect
    createAsteroidBelt(innerRadius, outerRadius, count = 15) {
        const beltAsteroids = [];
        
        for (let i = 0; i < count; i++) {
            const size = this.config.minSize + Math.random() * (this.config.maxSize * 0.7);
            const geometry = this.createAsteroidGeometry(size);
            
            const material = new THREE.MeshLambertMaterial({
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                transparent: true,
                opacity: 0.8,
                emissive: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                emissiveIntensity: 0.1
            });
            
            const asteroid = new THREE.Mesh(geometry, material);
            
            // Position in belt formation
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const height = (Math.random() - 0.5) * 3;
            
            asteroid.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            asteroid.userData = {
                angle: angle,
                radius: radius,
                height: height,
                speed: this.config.speed * (0.5 + Math.random() * 0.5),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * this.config.rotationSpeed,
                    y: (Math.random() - 0.5) * this.config.rotationSpeed,
                    z: (Math.random() - 0.5) * this.config.rotationSpeed
                },
                size: size
            };
            
            this.asteroidGroup.add(asteroid);
            this.asteroids.push(asteroid);
            beltAsteroids.push(asteroid);
        }
        
        console.log(`🪨 Created asteroid belt with ${count} asteroids`);
        return beltAsteroids;
    }
    
    startAnimation() {
        const animate = () => {
            this.asteroids.forEach(asteroid => {
                this.updateAsteroid(asteroid);
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // Public methods for external control
    setVisibility(visible) {
        this.asteroidGroup.visible = visible;
    }
    
    setSpeed(multiplier) {
        this.asteroids.forEach(asteroid => {
            asteroid.userData.speed = this.config.speed * multiplier;
        });
    }
    
    addAsteroid() {
        const asteroid = this.createAsteroid();
        this.asteroidGroup.add(asteroid);
        this.asteroids.push(asteroid);
        this.config.count++;
    }
    
    removeAsteroid() {
        if (this.asteroids.length > 0) {
            const asteroid = this.asteroids.pop();
            this.asteroidGroup.remove(asteroid);
            asteroid.geometry.dispose();
            asteroid.material.dispose();
            this.config.count--;
        }
    }
    
    // Collision detection for spaceships (optional feature)
    checkCollisions(spaceshipPositions, collisionRadius = 2) {
        const collisions = [];
        
        this.asteroids.forEach(asteroid => {
            spaceshipPositions.forEach(spaceshipPos => {
                const distance = asteroid.position.distanceTo(spaceshipPos);
                if (distance < collisionRadius) {
                    collisions.push({
                        asteroid: asteroid,
                        spaceshipPosition: spaceshipPos,
                        distance: distance
                    });
                }
            });
        });
        
        return collisions;
    }
    
    destroy() {
        this.scene.remove(this.asteroidGroup);
        this.asteroids.forEach(asteroid => {
            asteroid.geometry.dispose();
            asteroid.material.dispose();
        });
        this.asteroids = [];
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsteroidManager;
}