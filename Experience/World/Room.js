import * as THREE from "three"
import Experience from "../Experience"
import GSAP from "gsap"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"

export default class Room {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.room = this.resources.items.room
        this.actualRoom = this.room?.scene
        this.roomChildren = {}

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        }

        this.setModel()
        this.setAnimation()
        this.onMouseMove()

    }

    setModel(){
        this.actualRoom.children.forEach(child => {
            child.castShadow = true
            child.receiveShadow = true

            if (child instanceof THREE.Group) {
                child.children.forEach((groupChild) => {
                    groupChild.castShadow = true
                    groupChild.receiveShadow = true
                })
            }

            if (child.name === "Tank") {
                child.material = new THREE.MeshPhysicalMaterial()
                child.material.roughness = 0
                child.material.color.set(0x549dd2)
                child.material.ior = 3
                child.material.transmission = 1
                child.material.opacity = 1
            }
            
            if (child.name == "Computer") {
                child.children[0].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen
                })
            }

            // if (
            //     child.name === "Mailbox" ||
            //     child.name === "Lamp" ||
            //     child.name === "FloorFirst" || 
            //     child.name === "FloorSecond" || 
            //     child.name === "FloorThird" || 
            //     child.name === "Dirt" || 
            //     child.name === "Flower1" || 
            //     child.name === "Flower2"
            // ) {
            //     child.scale.set(0, 0, 0)
            // }

            child.scale.set(0, 0, 0)

            if (child.name === "Mini_floor") {
                child.position.x = 10
                child.position.z = -10
            }

            if (child.name === "Cube370") {
                // child.scale.set(1, 1, 1)
                child.position.set(0, -1.5, 0)
                child.rotation.y = Math.PI / 4
            }

            this.roomChildren[child.name] = child
        })

        const width = .9
        const height = .4
        const intensity = 2
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        )
        rectLight.position.set(5.5, 6, 0)
        rectLight.rotation.x = -Math.PI / 2
        rectLight.rotation.z = -Math.PI / 4

        this.actualRoom.add(rectLight)

        this.roomChildren["rectLight"] = rectLight


        // const rectLightHelper = new RectAreaLightHelper(rectLight)
        // rectLight.add(rectLightHelper)

        this.scene.add(this.actualRoom)
        this.actualRoom.scale.set(0.11,0.11,0.11)
    }

    setAnimation() {
        this.mixer = new THREE.AnimationMixer(this.actualRoom)
        this.swim = this.mixer.clipAction(this.room.animations[14])
        this.swim.play()
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation = (e.clientX - window.innerWidth / 2) * 2 / window.innerWidth
            this.lerp.target = this.rotation * 0.1
        })
    }

    resize(){
    
    };

    update(){

        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        )

        this.actualRoom.rotation.y = this.lerp.current

        this.mixer.update(this.time.delta * .0009)
    };
}