import * as THREE from "three"
import Experience from "../Experience"
import GSAP from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger.js"
import ASScroll from "@ashthornton/asscroll"

export default class Controls {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.room = this.experience.world.room.actualRoom
        this.room.children.forEach(child => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child
            }
        })
        this.circleFirst = this.experience.world.floor.circleFirst
        this.circleSecond = this.experience.world.floor.circleSecond
        this.circleThird = this.experience.world.floor.circleThird

        GSAP.registerPlugin(ScrollTrigger)

        document.querySelector(".page").style.overflow = "visible"

        this.setSmoothScroll()
        this.setScrollTrigger()
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.3,
            disableRaf: true
        });
      
      
        GSAP.ticker.add(asscroll.update);
      
        ScrollTrigger.defaults({
          scroller: asscroll.containerElement });
      
      
        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
          scrollTop(value) {
            if (arguments.length) {
              asscroll.currentPos = value;
              return;
            }
            return asscroll.currentPos;
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          fixedMarkers: true });
      
      
        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);
      
        requestAnimationFrame(() => {
          asscroll.enable({
            newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]") });
      
        });
        return asscroll;
    }

    setSmoothScroll(){
        this.asscroll = this.setupASScroll()
    }

    setScrollTrigger(){
        ScrollTrigger.matchMedia({
            //Desktop
            "(min-width: 969px)": () => {
                console.log("Desktop")

                // Resets
                this.room.scale.set(0.11, 0.11, 0.11)
                this.room.position.set(0, 0, 0)
                this.rectLight.width = 0.5
                this.rectLight.height = 0.7

                // First section --------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                })
                this.firstMoveTimeline.to(this.camera.orthoGraphicCamera.position, {
                    x: .5,
                    y: 9,
                }, 
                "component").to(this.room.scale, {
                    x: 0.3,
                    y: 0.3,
                    z: 0.3,
                }, 
                "component"), 

                // Second section --------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                })
                    .to(this.camera.orthoGraphicCamera.position, {
                    x:  -0.5,
                    y: 4,
                    z: () => {
                        return this.sizes.height * 0.0032
                    }
                }, 
                "same"
                )
                    .to(this.room.scale, {
                    x: 0.3,
                    y: 0.3,
                    z: 0.3,
                }, 
                "same"
                )
                    .to(this.rectLight, {
                    width: 0.4 * 4,
                    height: 0.7 * 4,
                }, 
                "same"
                )


                // Third section --------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.camera.orthoGraphicCamera.position, {
                    y: 1,
                    x: -3,
                },
                "equal").to(this.room.scale, {
                    x: 0.2,
                    y: 0.2,
                    z: 0.2,
                }, 
                "equal"
                )
            },

            //Mobile
            "(max-width: 968px)": () => {
                console.log("Mobile")

                // Resets
                this.room.scale.set(0.07, 0.07, 0.07)
                this.room.position.set(0, 0, 0)
                this.rectLight.width = 0.3
                this.rectLight.height = 0.3

                // First section --------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.scale, {
                    x: 0.2,
                    y: 0.2,
                    z: 0.2,
                }, "same").to(this.camera.orthoGraphicCamera.position, {
                    x: 1.25,
                    y: 7.5,
                }, "same"), 
                // Second section --------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.scale, {
                    x: 0.25,
                    y: 0.25,
                    z: 0.25,
                }, "same"
                ).to(this.rectLight, {
                    width: 0.3 * 3.4,
                    height: 0.4 * 3.4,
                }, "same"
                ).to(this.camera.orthoGraphicCamera.position, {
                    x:  -1.8,
                    y: 3,
                    z: () => {
                        return this.sizes.height * 0.0032
                    }
                }, "same")
                // Third section --------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.camera.orthoGraphicCamera.position, {
                    y: .5,
                    x: -1.5,
                })
            },

            all: () => {
                this.sections = document.querySelectorAll(".section")
                this.sections.forEach(section => {
                    this.progressWrapper = section.querySelector(".progress-wrapper")
                    this.progressBar = section.querySelector(".progress-bar")

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6
                            }
                        })
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6
                            }
                        })
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6
                            }
                        })
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6
                            }
                        })
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        }
                    })
                })

                // All Animations
                // First section --------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })

                // Second section --------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                }, "same").to(this.room.position, {
                    y: 0.7,
                }, "same")


                // Third section --------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })

                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    }
                })

                console.log(this.room.children)
                this.room.children.forEach(child => {
                    if (child.name === "Mini_floor") {
                        this.first = GSAP.to(child.position, {
                            x: 0,
                            z: 0,
                            duration: 0.3
                        })
                    }
                    if (child.name === "Lamp") {
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "Mailbox") {
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "FloorFirst") {
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "FloorSecond") {
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "FloorThird") {
                        this.sixth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "Dirt") {
                        this.seventh = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "Flower1") {
                        this.eigth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if (child.name === "Flower2") {
                        this.ninth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                })
                this.secondPartTimeline.add(this.first)
                this.secondPartTimeline.add(this.second)
                this.secondPartTimeline.add(this.third)
                this.secondPartTimeline.add(this.fourth, "-=0.2")
                this.secondPartTimeline.add(this.fifth, "-=0.2")
                this.secondPartTimeline.add(this.sixth, "-=0.2")
                this.secondPartTimeline.add(this.seventh, "-=0.2")
                this.secondPartTimeline.add(this.eigth)
                this.secondPartTimeline.add(this.ninth, "-=0.1")
            },
        })
    }

    resize(){
    
    };

    update(){
    }
}