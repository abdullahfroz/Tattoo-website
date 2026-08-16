import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");

    if (!canvas || !container) {
        console.error("Three.js container not found.");
        return;
    }


    /* =========================================
       SCENE
    ========================================= */

    const scene = new THREE.Scene();


    /* =========================================
       CAMERA
    ========================================= */

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 7);


    /* =========================================
       RENDERER
    ========================================= */

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.1;


    /* =========================================
       LIGHTING
    ========================================= */

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.5
    );

    scene.add(ambientLight);


    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    keyLight.position.set(4, 5, 6);

    scene.add(keyLight);


    const fillLight = new THREE.DirectionalLight(
        0xc9d4df,
        1.5
    );

    fillLight.position.set(-4, 2, 4);

    scene.add(fillLight);


    const rimLight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    rimLight.position.set(0, -3, -5);

    scene.add(rimLight);


    /* =========================================
       MODEL GROUP
    ========================================= */

    const logoGroup = new THREE.Group();

    scene.add(logoGroup);


    /* =========================================
       LOAD REAL 3D MODEL
    ========================================= */

    const loader = new GLTFLoader();

    loader.load(

        "models/cali-logo-3d.glb",

        (gltf) => {

            const model = gltf.scene;

            console.log("Cali 3D model loaded successfully.");


            /* -------------------------------------
               Center the model
            ------------------------------------- */

            const box = new THREE.Box3().setFromObject(model);

            const center = box.getCenter(
                new THREE.Vector3()
            );

            model.position.sub(center);


            /* -------------------------------------
               Find model size
            ------------------------------------- */

            const size = box.getSize(
                new THREE.Vector3()
            );

            const maxDimension = Math.max(
                size.x,
                size.y,
                size.z
            );


            /* -------------------------------------
               Normalize size
            ------------------------------------- */

            const desiredSize = 4;

            const scale =
                desiredSize / maxDimension;

            model.scale.setScalar(scale);


            /* -------------------------------------
               Improve model rendering
            ------------------------------------- */

            model.traverse((child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {

                        child.material.needsUpdate = true;

                    }

                }

            });


            logoGroup.add(model);


            /* =====================================
               INITIAL ORIENTATION
            ===================================== */

            logoGroup.rotation.x =
                THREE.MathUtils.degToRad(-5);

            logoGroup.rotation.y =
                THREE.MathUtils.degToRad(12);

            logoGroup.rotation.z = 0;


            /* =====================================
               ROTATION
            ===================================== */

            let targetX = logoGroup.rotation.x;
            let targetY = logoGroup.rotation.y;

            let currentX = logoGroup.rotation.x;
            let currentY = logoGroup.rotation.y;


            /* -------------------------------------
               Mouse interaction
            ------------------------------------- */

            window.addEventListener(
                "pointermove",
                (event) => {

                    const mouseX =
                        (event.clientX /
                            window.innerWidth) * 2 - 1;

                    const mouseY =
                        (event.clientY /
                            window.innerHeight) * 2 - 1;


                    targetY =
                        THREE.MathUtils.degToRad(12)
                        + mouseX * 0.20;


                    targetX =
                        THREE.MathUtils.degToRad(-5)
                        - mouseY * 0.15;

                }
            );


            /* =====================================
               ANIMATION LOOP
            ===================================== */

            function animate() {

                requestAnimationFrame(animate);


                /* Smooth tilt */

                currentX +=
                    (targetX - currentX) * 0.04;

                currentY +=
                    (targetY - currentY) * 0.04;


                logoGroup.rotation.x =
                    currentX;

                logoGroup.rotation.y =
                    currentY;


                /* Very slow continuous rotation */

                logoGroup.rotation.z += 0.0005;


                renderer.render(
                    scene,
                    camera
                );

            }


            animate();

        },


        undefined,


        (error) => {

            console.error(
                "Could not load Cali 3D model:",
                error
            );

        }

    );


    /* =========================================
       RESPONSIVE
    ========================================= */

    function resize() {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;


        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

    }


    window.addEventListener(
        "resize",
        resize
    );

});