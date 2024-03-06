import Particle from "../Wolfie2D/Nodes/Graphics/Particle";
import ParticleSystem from "../Wolfie2D/Rendering/Animations/ParticleSystem";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
import RandUtils from "../Wolfie2D/Utils/RandUtils";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";

// HOMEWORK 5 - TODO - done
/**
 * This particle system extends the base ParticleSystem class, and I reccommend you look at some of the implementation, 
 * at least for the default setParticleAnimation()
 * 
 * You'll just be handling the tweens for each particle for their animation, overriding the base implementation.
 * 
 * The new particle animation add these behaviors, along with the existing setParticleAnimation behaviors:
 * 
 *  - Each particle should look like they're affected by gravity, accelerating down over the course of their lifetime. This
 *  change should also be affected by the particle's mass, meaning particles with a higher mass should fall faster.
 * 
 *  - Each particle should disappear over it's lifetime, moving from an alpha of 1 to 0.
 */
export default class HW5_ParticleSystem extends ParticleSystem {

    setParticleAnimation(particle: Particle) {
        super.setParticleAnimation(particle);

        const gravity = 9.81;
        let timeToGround = Math.sqrt((2 * particle.position.y) / gravity);
        let acceleration = gravity * particle.mass;
        let finalVelocity = particle.vel.add(new Vec2(0, acceleration * timeToGround));

        particle.tweens.add("gravity", {
            startDelay: 0,
            duration: timeToGround,
            effects: [
                {
                    property: "vel",
                    start: particle.vel,
                    end: finalVelocity,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        particle.tweens.add("alpha", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    update(deltaT: number) {
        super.update(deltaT);

        this.particlePool.forEach(particle => {
            if (particle.inUse) {
                particle.vel.y += 500 * deltaT;
                particle.move(particle.vel.scaled(deltaT));

                particle.alpha -= .0001;
            }
        });
    }

}
