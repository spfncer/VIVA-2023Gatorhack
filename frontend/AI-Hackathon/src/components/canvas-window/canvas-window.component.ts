import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { randFloat } from 'three/src/math/MathUtils';

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

    private canvas: HTMLElement | null = null;
    private scene = new THREE.Scene()
    private clock = new THREE.Clock();
    private camera = new THREE.PerspectiveCamera();
    private renderer = new THREE.WebGLRenderer();
    private loader = new GLTFLoader();

    // Objects
    private model: any;

    ngOnInit(): void {
        this.canvas = document.getElementById('canvas-box');

        const material = new THREE.MeshToonMaterial();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.x = 2;
        pointLight.position.y = 2;
        pointLight.position.z = 2;
        this.scene.add(pointLight);

        // Load the glTF model
        this.loader.load('assets/man.glb', (gltf: any) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
            console.log(this.model);
            this.model.children[0].children[1].morphTargets = true;
        }, undefined, function (error: any) {
            console.error(error);
        });

        const canvasSizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.camera = new THREE.PerspectiveCamera(
            75,
            canvasSizes.width / canvasSizes.height,
            0.001,
            1000
        );
        this.camera.position.y = 1.65;
        this.camera.position.z = 1.3;
        this.scene.add(this.camera);

        if (!this.canvas) {
            return;
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setClearColor(0xe232222, 1);
        this.renderer.setSize(canvasSizes.width, canvasSizes.height);

        window.addEventListener('resize', () => {
            canvasSizes.width = window.innerWidth;
            canvasSizes.height = window.innerHeight;

            this.camera.aspect = canvasSizes.width / canvasSizes.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(canvasSizes.width, canvasSizes.height);
            this.renderer.render(this.scene, this.camera);
        });



        const animateScene = () => {
            const elapsedTime = this.clock.getElapsedTime();

            // Update animation objects
            if (this.model) {
                // console.log(this.model);

                this.model.children[0].children[1].morphTargetInfluences[0] = randFloat(0, 1);
                this.model.children[0].children[1].updateMorphTargets();
            }

            // Render
            this.renderer.render(this.scene, this.camera);

            // Call animateGeometry again on the next frame
            window.requestAnimationFrame(animateScene);
        }

        animateScene();
    }

}

