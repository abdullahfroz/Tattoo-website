import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   CALI WEBSITE
   - Three.js logo
   - Header scroll animation
   - Menu
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       HEADER SHRINK ON SCROLL
    ===================================================== */

    const siteHeader = document.querySelector(".site-header");
    const brand = document.querySelector(".brand");

    if (siteHeader && brand) {

        function updateHeader() {

            if (window.scrollY > 120) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }

        }

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        /* Set correct state when page loads */
        updateHeader();
    }


    /* =====================================================
       THREE.JS
    ===================================================== */

    const canvas =
        document.getElementById("three-logo");

    const container =
        document.getElementById("three-logo-container");


    /*
     * Your current HTML may not contain the Three.js
     * logo container anymore.
     *
     * In that case, simply skip Three.js instead of
     * stopping the rest of the website JavaScript.
     */

    if (!canvas || !container) {

        console.log(
            "Three.js logo container not found. Skipping 3D logo."
        );

        return;
    }


    /* =====================================================
       SCENE
    ===================================================== */

    const scene = new THREE.Scene();


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth /
        container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 6);


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
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

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
        1.15;


    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );

    scene.add(ambientLight);


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3.5
        );

    keyLight.position.set(4, 5, 6);

    scene.add(keyLight);


    const fillLight =
        new THREE.DirectionalLight(
            0xcbd6e2,
            1.5
        );

    fillLight.position.set(-4, 2, 4);

    scene.add(fillLight);


    const rimLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    rimLight.position.set(0, -4, -5);

    scene.add(rimLight);


    /* =====================================================
       MODEL GROUP
    ===================================================== */

    const logoGroup =
        new THREE.Group();

    scene.add(logoGroup);


    /* =====================================================
       LOAD CALI 3D MODEL
    ===================================================== */

    const loader =
        new GLTFLoader();

    loader.load(

        "models/cali-logo-3d-faithful.glb",

        (gltf) => {

            const model =
                gltf.scene;

            console.log(
                "Cali 3D logo loaded successfully."
            );


            /* ---------------------------------------------
               CENTER MODEL
            --------------------------------------------- */

            const box =
                new THREE.Box3().setFromObject(
                    model
                );

            const center =
                box.getCenter(
                    new THREE.Vector3()
                );

            model.position.sub(center);


            /* ---------------------------------------------
               NORMALIZE MODEL SIZE
            --------------------------------------------- */

            const size =
                box.getSize(
                    new THREE.Vector3()
                );

            const maxDimension =
                Math.max(
                    size.x,
                    size.y,
                    size.z
                );

            const desiredSize = 3.8;

            const scale =
                desiredSize /
                maxDimension;

            model.scale.setScalar(scale);


            /* ---------------------------------------------
               MATERIAL
            --------------------------------------------- */

            model.traverse((child) => {

                if (!child.isMesh) return;

                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {

                    child.material.metalness =
                        0.9;

                    child.material.roughness =
                        0.18;

                    child.material.needsUpdate =
                        true;
                }

            });


            logoGroup.add(model);


            /* =================================================
               INITIAL ANGLE
            ================================================= */

            logoGroup.rotation.x =
                THREE.MathUtils.degToRad(-4);

            logoGroup.rotation.y =
                THREE.MathUtils.degToRad(10);

            logoGroup.rotation.z = 0;


            /* =================================================
               MOUSE INTERACTION
            ================================================= */

            let targetX =
                THREE.MathUtils.degToRad(-4);

            let targetY =
                THREE.MathUtils.degToRad(10);

            let currentX =
                targetX;

            let currentY =
                targetY;


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
                        THREE.MathUtils.degToRad(10)
                        + mouseX * 0.18;

                    targetX =
                        THREE.MathUtils.degToRad(-4)
                        - mouseY * 0.12;

                }
            );


            /* =================================================
               ANIMATION LOOP
            ================================================= */

            function animate() {

                requestAnimationFrame(
                    animate
                );


                /* Smooth mouse movement */

                currentX +=
                    (targetX - currentX) *
                    0.045;

                currentY +=
                    (targetY - currentY) *
                    0.045;


                logoGroup.rotation.x =
                    currentX;

                logoGroup.rotation.y =
                    currentY;


                /* Very subtle rotation */

                logoGroup.rotation.z +=
                    0.00035;


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
                "Failed to load Cali 3D logo:",
                error
            );

        }

    );


    /* =====================================================
       RESPONSIVE RESIZE
    ===================================================== */

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
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

    }


    window.addEventListener(
        "resize",
        resize
    );

});

/* =========================================================
   MENU
========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");

if (menuButton && menuPanel) {

    menuButton.addEventListener("click", () => {

        const isOpen =
            menuButton.classList.toggle("menu-active");

        menuPanel.classList.toggle(
            "menu-visible",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
    });


    /* CLOSE AFTER CLICKING A MENU ITEM */

    menuPanel.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            menuButton.classList.remove("menu-active");
            menuPanel.classList.remove("menu-visible");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open menu"
            );
        });

    });

}