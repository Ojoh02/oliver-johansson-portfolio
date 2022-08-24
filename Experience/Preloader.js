import { EventEmitter } from "events"
import Experience from "./Experience"
import GSAP from "gsap"
import convert from "./Utils/convertDivsToSpans"
import convertDivsToSpans from "./Utils/convertDivsToSpans"
import getCommits from "./api/getCommits"

export default class Preloader extends EventEmitter{
    constructor(){
        super()
        this.experience = new Experience();
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.world = this.experience.world
        this.device = this.sizes.device

        this.sizes.on("switchdevice", (device) => {
            this.device = device
        })

        this.world.on("worldready", () => {
            this.setAssets()
            this.playIntro()
        })
    }

    setAssets(){
        convertDivsToSpans(document.querySelector(".intro-text"))
        convertDivsToSpans(document.querySelector(".hero-main-title"))
        convertDivsToSpans(document.querySelector(".hero-main-description"))
        convertDivsToSpans(document.querySelector(".hero-second-subheading"))
        convertDivsToSpans(document.querySelector(".second-sub"))

        this.room = this.experience.world.room.actualRoom
        this.roomChildren = this.experience.world.room.roomChildren
    }

    firstIntro() {
        return new Promise((resolve) => {
            this.timeline = new GSAP.timeline()
            this.timeline.set(".animatethis", { y: 0, yPercent: 100 })

            this.timeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: () => {
                    document.querySelector(".preloader").classList.add("hidden")
                }
            })

            if (this.device === "desktop") {
                this.timeline.to(this.roomChildren.Cube370.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position, {
                    x: -1,
                    ease: "power1.out",
                    duration: 0.7,
                })
            } else {
                this.timeline.to(this.roomChildren.Cube370.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position, {
                    z: -1,
                    ease: "power1.out",
                    duration: 0.7,
                })
            }
            this.timeline.to(".intro-text .animatethis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.out(1.7)",
                onComplete: resolve
            }).to(".arrow-svg-wrapper", {
                opacity: 1,
            }, "same").to(".toggle-bar", {
                opacity: 1,
                onComplete: resolve
            }, "same")
        })
    }

    async secondIntro() {
        return new Promise(async (resolve) => {
            const latestCommit = await getCommits()
            const current = Date.now()
            let elapsed = (current - latestCommit?.milliseconds) / 1000 / 60
            let message

            document.querySelector(".repo-text").textContent = latestCommit?.repoName
            document.querySelector(".ending-text").textContent = ` from Ojoh02: "${latestCommit?.comments}"`
            
            if (elapsed < 60) {
                message = "mins"
            } else {
                elapsed = elapsed / 60
                if (elapsed < 24) {
                    message = "hrs"
                } else {
                    elapsed = elapsed / 24
                    message = "days"
                }
            }
            document.querySelector(".elapsed").textContent = `${parseInt(elapsed)} ${message} ago`

            this.secondTimeline = new GSAP.timeline()
            
            this.secondTimeline.to(".intro-text .animatethis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            }, "fadeout").to(".arrow-svg-wrapper", {
                opacity: 0,
            }, "fadeout").to(this.room.position, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power1.out",
            }, "same").to(this.roomChildren.Cube370.rotation, {
                y: 2 * Math.PI + Math.PI / 4
            }, "same").to(this.roomChildren.Cube370.scale, {
                x: 10,
                y: 10,
                z: 10,
            }, "same").to(this.camera.orthoGraphicCamera.position, {
                y: 6.5,
            }, "same").to(this.roomChildren.Cube370.position, {
                x: 0.638711,
                y: 8.5618,
                z: 1.3243,
            }, "same").set(this.roomChildren.Body.scale, {
                x: 1,
                y: 1,
                z: 1,
            }).to(this.roomChildren.Cube370.scale, {
                x: 0,
                y: 0,
                z: 0,
            }, "introtext").to(".hero-main-title .animatethis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "introtext").to(".hero-main-description .animatethis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "introtext").to(".first-sub .animatethis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "introtext").to(".second-sub .animatethis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "introtext").to(this.roomChildren.Aquarium.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.5").to(this.roomChildren.Tank.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.4").to(this.roomChildren.fish.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.4").to(this.roomChildren.Shelves.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.3").to(this.roomChildren.Floor_Items.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.3").to(this.roomChildren.Desks.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.3").to(this.roomChildren.Table_Stuff.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.2").to(this.roomChildren.Computer.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.1").to(this.roomChildren.Clock.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.1").set(this.roomChildren.Mini_floor.scale, {
                x: 1,
                y: 1,
                z: 1,
            }, ">-0.1").to(this.roomChildren.Chair.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, "chair").to(this.roomChildren.Chair.rotation, {
                y: 5 * Math.PI + 3 * Math.PI / 4 + Math.PI / 8,
                ease: "power2.out",
                duration: 1,
            }, "chair").to(".arrow-svg-wrapper", {
                opacity: 1,
                onComplete: resolve
            })
        })
    }

    onScroll(e) {
        if (e.deltaY > 0) {
            this.removeEventListeners()
            this.playSecondIntro()
        }
    }

    onTouch(e) {
        console.log(e)
        this.initialY = e.touches[0].clientY
    }

    onTouchMove (e) {
        let currentY = e.touches[0].clientY
        let difference = this.initialY - currentY
        if (difference > 0) {
            this.removeEventListeners()
            this.playSecondIntro()
        }
        this.initialY = null
    }

    removeEventListeners() {
        window.removeEventListener("wheel", this.scrollOnceEvent)
        window.removeEventListener("touchstart", this.touchStart)
        window.removeEventListener("touchmove", this.touchMove)
    }

    async playIntro(){
        await this.firstIntro()
        this.moveFlag = true
        this.scrollOnceEvent = this.onScroll.bind(this)
        this.touchStart = this.onTouch.bind(this)
        this.touchMove = this.onTouchMove.bind(this)
        window.addEventListener("wheel", this.scrollOnceEvent)
        window.addEventListener("touchstart", this.touchStart)
        window.addEventListener("touchmove", this.touchMove)
    }

    async playSecondIntro() { 
        this.moveFlag = false
        this.scaleFlag = true;
        await this.secondIntro()
        this.scaleFlag = false;
        this.emit("enablecontrols")
    }
    
    move() {
        if (this.device === "desktop") {
            this.room.position.set(-1, 0, 0)
        } else {
            this.room.position.set(0, 0, -1)
        }
    }

    scale() {
        this.roomChildren.rectLight.width = 0
        this.roomChildren.rectLight.height = 0
        
        if (this.device === "desktop") {
            this.room.scale.set(0.11, 0.11, 0.11)
        } else {
            this.room.scale.set(0.07, 0.07, 0.07)
        }
    }

    update() {
        if (this.moveFlag) {
            this.move()
        }

        if (this.scaleFlag) {
            this.scale()
        }
    }
}    