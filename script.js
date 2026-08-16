import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");
    const portfolio = document.getElementById("work");

    if (!canvas || !container || !portfolio) {
        console.log("Required element not found");
        return;
    }

    /* ==============================
       THREE.JS SETUP
    ============================== */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
        canvas,
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

    const loader = new THREE.TextureLoader();

    loader.load(
        "images/cali3Dlogo.png",
        (texture) => {

            texture.colorSpace = THREE.SRGBColorSpace;

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false
            });

            const geometry =
                new THREE.PlaneGeometry(4, 4);

            const logo = new THREE.Mesh(
                geometry,
                material
            );

            scene.add(logo);

            /* ==============================
               SCROLL
            ============================== */

            let targetScroll = window.scrollY;
            let smoothScroll = window.scrollY;

            function updateScroll() {
                targetScroll = window.scrollY;
            }

            window.addEventListener(
                "scroll",
                updateScroll,
                { passive: true }
            );

            /* ==============================
               ANIMATION
            ============================== */

            function animate() {

                requestAnimationFrame(animate);

                smoothScroll +=
                    (targetScroll - smoothScroll) * 0.06;

                /*
                 * How far the logo travels.
                 *
                 * The logo starts moving immediately
                 * and stops when portfolio begins.
                 */

                const maxTravel =
                    Math.max(
                        0,
                        portfolio.offsetTop - window.innerHeight * 0.45
                    );

                const travel =
                    Math.min(
                        smoothScroll * 0.55,
                        maxTravel
                    );

                /*
                 * Move logo down through the page
                 */

                logo.position.y =
                    -travel * 0.01;

                /*
                 * Gentle 3D-style motion
                 */

                logo.rotation.x =
                    travel * 0.002;

                logo.rotation.y =
                    travel * 0.003;

                logo.rotation.z =
                    travel * 0.0008;

                /*
                 * Subtle floating movement
                 */

                logo.position.x =
                    Math.sin(travel * 0.01) * 0.12;

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
                "Could not load Cali 3D logo:",
                error
            );
        }
    );

    /* ==============================
       RESPONSIVE
    ============================== */

    window.addEventListener("resize", () => {

        camera.aspect =
            container.clientWidth /
            container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

    });

});