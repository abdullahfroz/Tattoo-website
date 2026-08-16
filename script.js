import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");

    if (!canvas || !container) return;


    /* ================================
       SCENE
    ================================= */

    const scene = new THREE.Scene();


    /* ================================
       CAMERA
    ================================= */

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 6;


    /* ================================
       RENDERER
    ================================= */

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


    /* ================================
       LOGO TEXTURE
    ================================= */

    const loader = new THREE.TextureLoader();

    loader.load(
        "images/cali-3d-logo.png",
        (texture) => {

            texture.colorSpace = THREE.SRGBColorSpace;

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false
            });


            /*
             * The logo is square,
             * so we use a square plane.
             */

            const geometry =
                new THREE.PlaneGeometry(4, 4);


            const logo =
                new THREE.Mesh(
                    geometry,
                    material
                );


            scene.add(logo);


            /* ================================
               SCROLL VARIABLES
            ================================= */

            let targetScroll = 0;
            let smoothScroll = 0;


            window.addEventListener("scroll", () => {

                targetScroll = window.scrollY;

            });


            /* ================================
               ANIMATION
            ================================= */

            function animate() {

                requestAnimationFrame(animate);


                /*
                 * Smooth scrolling value
                 */

                smoothScroll +=
                    (targetScroll - smoothScroll) * 0.06;


                /*
                 * 3D rotation
                 */

                logo.rotation.x =
                    smoothScroll * 0.0015;

                logo.rotation.y =
                    smoothScroll * 0.0025;

                logo.rotation.z =
                    smoothScroll * 0.0005;


                /*
                 * Floating movement
                 */

                logo.position.x =
                    Math.sin(smoothScroll * 0.006) * 0.18;

                logo.position.y =
                    -smoothScroll * 0.003;


                /*
                 * Subtle depth movement
                 */

                logo.position.z =
                    Math.sin(smoothScroll * 0.004) * 0.35;


                renderer.render(
                    scene,
                    camera
                );

            }


            animate();

        }
    );


    /* ================================
       RESIZE
    ================================= */

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