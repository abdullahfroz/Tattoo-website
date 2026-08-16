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
       THREE.JS
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


    /* ==============================
       LOAD LOGO
    ============================== */

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
               SCROLL VARIABLES
            ============================== */

            let currentScroll = window.scrollY;
            let targetScroll = window.scrollY;

            let currentTravel = 0;
            let targetTravel = 0;


            window.addEventListener(
                "scroll",
                () => {

                    targetScroll = window.scrollY;

                },
                { passive: true }
            );


            /* ==============================
               ANIMATION
            ============================== */

            function animate() {

                requestAnimationFrame(animate);


                /* Smooth scrolling */

                currentScroll +=
                    (targetScroll - currentScroll) * 0.06;


                /*
                 * Distance from the top of the page
                 * to the portfolio.
                 */

                const portfolioPosition =
                    portfolio.offsetTop;


                /*
                 * How far the logo can travel.
                 */

                const maxTravel =
                    Math.max(
                        0,
                        portfolioPosition -
                        window.innerHeight * 0.40
                    );


                /*
                 * Slow the movement down.
                 */

                targetTravel =
                    Math.min(
                        currentScroll * 0.30,
                        maxTravel
                    );


                currentTravel +=
                    (targetTravel - currentTravel) * 0.06;


                /* ==============================
                   MOVE THE ENTIRE CANVAS
                ============================== */

                container.style.marginTop =
                    `${currentTravel}px`;


                /* ==============================
                   3D MOTION
                ============================== */

                logo.rotation.x =
                    currentTravel * 0.0012;

                logo.rotation.y =
                    currentTravel * 0.0020;

                logo.rotation.z =
                    currentTravel * 0.0004;


                /*
                 * Very subtle floating movement
                 */

                logo.position.x =
                    Math.sin(currentTravel * 0.006) * 0.08;

                logo.position.y =
                    Math.cos(currentTravel * 0.004) * 0.05;


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
                "Could not load Cali logo:",
                error
            );

        }
    );


    /* ==============================
       RESIZE
    ============================== */

    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                container.clientWidth /
                container.clientHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );

            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    2
                )
            );

        }
    );

});