import { Component, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

declare var window: any;

/**
 * Displays a threeJS canvas
 */
@Component({
    selector: 'app-canvas-window',
    templateUrl: './canvas-window.component.html',
    styleUrls: ['./canvas-window.component.less']
})
export class CanvasWindowComponent implements OnInit {

    // DO NOT MODIFY
    private canvas: HTMLElement | null = null;
    private scene = new THREE.Scene()
    private clock = new THREE.Clock();
    private camera = new THREE.PerspectiveCamera();
    private renderer = new THREE.WebGLRenderer();
    private loader = new GLTFLoader();
    private mixer: THREE.AnimationMixer | null = null;

    // Settings
    private fps = 60

    // Objects
    private model: any;
    private targetDict: any;

    // Input Bindings
    @Input()
    public set viseme(value: string) {
        if (!value) { return; }
        if (!this.model) { return; }

        let animationClip = this.createAnimation(value, this.targetDict, "Wolf3D_Avatar");
        if (!animationClip) { return; }
        if (!this.mixer) { return; }

        let clipAction = this.mixer.clipAction(animationClip).setEffectiveWeight(1);
        clipAction.setLoop(THREE.LoopOnce, 1).reset().play();
        console.log(this.mixer);
    }

    ngOnInit(): void {
        this.canvas = document.getElementById('canvas-box');

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.75);
        pointLight.position.x = 2;
        pointLight.position.y = 2;
        pointLight.position.z = 2;
        this.scene.add(pointLight);

        // Load the glTF model
        this.loader.load('assets/man.glb', ((gltf: any) => {
            gltf.scene.traverse((node: any) => {
                if (node.type == 'Mesh' || node.type == 'SkinnedMesh') {
                    console.log(node);
                    this.targetDict = node.morphTargetDictionary;
                }
            });

            this.mixer = new THREE.AnimationMixer(gltf.scene);
            this.mixer.timeScale = 1;
            this.model = gltf.scene;
            this.scene.add(this.model);
            animateScene();
        }).bind(this), undefined, function (error: any) {
            console.error(error);
        });

        const canvasSizes = {
            width: window.innerWidth / 2,
            height: window.innerHeight / 3,
        };

        this.camera = new THREE.PerspectiveCamera(
            75,
            canvasSizes.width / canvasSizes.height,
            0.001,
            1000
        );
        this.camera.position.y = 1.75;
        this.camera.position.z = 0.55;
        this.scene.add(this.camera);

        if (!this.canvas) {
            return;
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setClearColor(0xD52B1E, 1);
        this.renderer.setSize(canvasSizes.width, canvasSizes.height);

        window.addEventListener('resize', () => {
            canvasSizes.width = window.innerWidth / 2;
            canvasSizes.height = window.innerHeight / 3;

            this.camera.aspect = canvasSizes.width / canvasSizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(canvasSizes.width, canvasSizes.height);
            this.renderer.render(this.scene, this.camera);
        });

        const animateScene = () => {

            // Call animateGeometry again on the next frame
            window.requestAnimationFrame(animateScene);

            // Render
            this.renderer.render(this.scene, this.camera);

            if (this.mixer) {
                this.mixer.update(this.clock.getDelta());
            }
        }
    }

    private modifyKey(key: string) {
        if (["eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight"].includes(key)) {
            return key
        }

        if (key.endsWith("Right")) {
            return key.replace("Right", "_R");
        }
        if (key.endsWith("Left")) {
            return key.replace("Left", "_L");
        }
        return key;
    }

    private createAnimation(recordedData: any, morphTargetDictionary: any, bodyPart: any) {
        if (recordedData.length != 0) {
            let animation: any[] = []
            for (let i = 0; i < Object.keys(morphTargetDictionary).length; i++) {
                animation.push([])
            }

            let time: any[] = []
            let finishedFrames = 0
            recordedData.forEach((d: any, i: any) => {
                Object.entries(d.BlendShapes).forEach(([key, value]) => {
                    if (!(this.modifyKey(key) in morphTargetDictionary)) { return };

                    if (key == 'mouthShrugUpper') {
                        //@ts-ignore
                        value += 0.4;
                    }

                    animation[morphTargetDictionary[this.modifyKey(key)]].push(value)
                });
                time.push(finishedFrames / this.fps)
                finishedFrames++
            });

            let tracks: THREE.KeyframeTrack[] = []
            //create morph animation
            Object.entries(recordedData[0].BlendShapes).forEach(([key, value]) => {
                if (!(this.modifyKey(key) in morphTargetDictionary)) { return };
                let i = morphTargetDictionary[this.modifyKey(key)]
                let track = new THREE.NumberKeyframeTrack(`${bodyPart}.morphTargetInfluences[${i}]`, time, animation[i])
                tracks.push(track)
            });

            const clip = new THREE.AnimationClip('animation', -1, tracks);
            return clip
        }
        return null
    }

}

