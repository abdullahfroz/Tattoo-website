import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");

    if (!canvas || !container) {
        console.log("Three.js container not found");
        return;
    }

    // SCENE
    const scene = new THREE.Scene();


    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 6;


    // RENDERER
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


    // LOAD CALI LOGO
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


            // Create the logo plane
            const geometry = new THREE.PlaneGeometry(4, 4);

            const logo = new THREE.Mesh(
                geometry,
                material
            );

            scene.add(logo);


            // ANIMATION LOOP
            function animate() {

                requestAnimationFrame(animate);

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


    // RESPONSIVE RESIZING
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