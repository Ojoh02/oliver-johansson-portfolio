import * as THREE from "three"
import Experience from "./Experience"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { Texture } from "three"

export default class Camera{
    constructor(){
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.createPerspectiveCamera()
        this.createOrthographicCamera()
        this.setOrbitControls()
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35, 
            this.sizes.aspect, 
            0.1, 
            100
        )
        this.scene.add(this.perspectiveCamera)
        this.perspectiveCamera.position.x = 29
        this.perspectiveCamera.position.y = 14
        this.perspectiveCamera.position.z = 12
    }

    createOrthographicCamera(){
        this.orthoGraphicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum) / 3,
            (this.sizes.aspect * this.sizes.frustrum) / 3,
            this.sizes.frustrum / 3,
            -this.sizes.frustrum / 3,
            -50,
            50
        )

        // 3.5 and 5 originally
        this.orthoGraphicCamera.position.y = 5.65
        this.orthoGraphicCamera.position.z = 10
        this.orthoGraphicCamera.rotation.x = -Math.PI / 6

        this.scene.add(this.orthoGraphicCamera)

        // this.helper = new THREE.CameraHelper(this.orthoGraphicCamera)
        // this.scene.add(this.helper)

        const size = 20
        const divisions = 20

        // const gridHelper = new THREE.GridHelper(size, divisions)
        // this.scene.add(gridHelper)

        // const axesHelper = new THREE.AxesHelper(10)
        // this.scene.add(axesHelper)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
        this.controls.enableDamping = true
        this.controls.enableZoom = false
    }

    resize(){
        // Updating Perspective Camera on Resize
        this.perspectiveCamera.aspect = this.sizes.aspect
        this.perspectiveCamera.updateProjectionMatrix()

        // Updating Perspective Camera on Resize
        this.orthoGraphicCamera.left = (-this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthoGraphicCamera.right = (this.sizes.aspect * this.sizes.frustrum) / 2
        this.orthoGraphicCamera.top = this.sizes.frustrum / 2
        this.orthoGraphicCamera.bottom = -this.sizes.frustrum / 2
        this.orthoGraphicCamera.updateProjectionMatrix()

    }

    update(){
        this.controls.update()

        // this.helper.matrixWorldNeedsUpdate = true
        // this.helper.update()

        // this.helper.position.copy(this.orthoGraphicCamera.position)
        // this.helper.rotation.copy(this.orthoGraphicCamera.rotation)
    }

}