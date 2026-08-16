import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");

    if (!canvas || !container) return;

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

    renderer.outputColorSpace = THREE.SRGBColorSpace;

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

            let targetX = 0;
            let targetY = 0;

            let currentX = 0;
            let currentY = 0;

            window.addEventListener("pointermove", (event) => {

                targetY =
                    ((event.clientX / window.innerWidth) - 0.5) * 0.35;

                targetX =
                    ((event.clientY / window.innerHeight) - 0.5) * -0.25;

            });

            function animate() {

                requestAnimationFrame(animate);

                currentX +=
                    (targetX - currentX) * 0.05;

                currentY +=
                    (targetY - currentY) * 0.05;

                logo.rotation.x = currentX;
                logo.rotation.y = currentY;

                renderer.render(scene, camera);
            }

            animate();
        }
    );

    window.addEventListener("resize", () => {

        camera.aspect =
            container.clientWidth /
            container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    });

});