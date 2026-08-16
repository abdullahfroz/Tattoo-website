import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("three-logo");
    const container = document.getElementById("three-logo-container");

    if (!canvas || !container) {
        console.error("Three.js canvas or container not found.");
        return;
    }

    /* ==========================================
       SCENE
    ========================================== */

    const scene = new THREE.Scene();


    /* ==========================================
       CAMERA
    ========================================== */

    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 7);


    /* ==========================================
       RENDERER
    ========================================== */

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

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.1;


    /* ==========================================
       LIGHTING
    ========================================== */

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambientLight);


    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        4
    );

    keyLight.position.set(4, 5, 6);

    scene.add(keyLight);


    const fillLight = new THREE.DirectionalLight(
        0x9aa7b5,
        2
    );

    fillLight.position.set(-5, 1, 3);

    scene.add(fillLight);


    const rimLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    rimLight.position.set(0, -4, -5);

    scene.add(rimLight);


    /* ==========================================
       LOGO GROUP
    ========================================== */

    const logoGroup = new THREE.Group();

    scene.add(logoGroup);


    /* ==========================================
       CREATE 3D CAGE
    ========================================== */

    const outerGeometry =
        new THREE.IcosahedronGeometry(2.15, 1);

    const positionAttribute =
        outerGeometry.getAttribute("position");


    const vertices = [];

    for (
        let i = 0;
        i < positionAttribute.count;
        i++
    ) {

        const vertex = new THREE.Vector3();

        vertex.fromBufferAttribute(
            positionAttribute,
            i
        );

        vertices.push(vertex);

    }


    /* Remove duplicate vertices */

    const uniqueVertices = [];

    vertices.forEach((vertex) => {

        const exists = uniqueVertices.some(
            (existing) =>
                existing.distanceTo(vertex) < 0.001
        );

        if (!exists) {
            uniqueVertices.push(vertex);
        }

    });


    /* ==========================================
       CYLINDER BETWEEN TWO POINTS
    ========================================== */

    function createBeam(
        start,
        end,
        radius = 0.055
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(end, start);

        const length = direction.length();

        const midpoint =
            new THREE.Vector3()
                .addVectors(start, end)
                .multiplyScalar(0.5);

        const geometry =
            new THREE.CylinderGeometry(
                radius,
                radius,
                length,
                8,
                1,
                false
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xd8dde2,

                metalness: 0.95,

                roughness: 0.2

            });


        const beam =
            new THREE.Mesh(
                geometry,
                material
            );


        beam.position.copy(midpoint);


        /*
         * Cylinder normally points vertically.
         * Rotate it so it points from start → end.
         */

        beam.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );


        logoGroup.add(beam);

    }


    /* ==========================================
       CREATE UNIQUE EDGES
    ========================================== */

    const edges = [];

    for (
        let i = 0;
        i < uniqueVertices.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < uniqueVertices.length;
            j++
        ) {

            const distance =
                uniqueVertices[i]
                    .distanceTo(uniqueVertices[j]);


            /*
             * Icosahedron edge length is
             * approximately this range.
             */

            if (
                distance > 1.9 &&
                distance < 2.7
            ) {

                edges.push([
                    uniqueVertices[i],
                    uniqueVertices[j]
                ]);

            }

        }

    }


    edges.forEach(([start, end]) => {

        createBeam(
            start,
            end,
            0.065
        );

    });


    /* ==========================================
       INNER STRUCTURE
    ========================================== */

    const innerGeometry =
        new THREE.IcosahedronGeometry(1.25, 0);

    const innerEdges =
        new THREE.EdgesGeometry(
            innerGeometry
        );

    const innerMaterial =
        new THREE.LineBasicMaterial({
            color: 0xaeb5bc,
            transparent: true,
            opacity: 0.9
        });

    const innerWire =
        new THREE.LineSegments(
            innerEdges,
            innerMaterial
        );

    innerWire.rotation.y =
        Math.PI / 5;

    innerWire.rotation.x =
        Math.PI / 6;

    logoGroup.add(innerWire);


    /* ==========================================
       CENTRAL CORE
    ========================================== */

    const coreGeometry =
        new THREE.IcosahedronGeometry(
            0.35,
            1
        );

    const coreMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xf0f2f4,

            metalness: 1,

            roughness: 0.12

        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    logoGroup.add(core);


    /* ==========================================
       INITIAL ORIENTATION
    ========================================== */

    logoGroup.rotation.x =
        THREE.MathUtils.degToRad(-8);

    logoGroup.rotation.y =
        THREE.MathUtils.degToRad(18);

    logoGroup.rotation.z =
        THREE.MathUtils.degToRad(4);


    /* ==========================================
       SMOOTH ROTATION
    ========================================== */

    let targetRotationX =
        logoGroup.rotation.x;

    let targetRotationY =
        logoGroup.rotation.y;

    let currentRotationX =
        logoGroup.rotation.x;

    let currentRotationY =
        logoGroup.rotation.y;


    /*
     * Mouse movement gives the object
     * a subtle 3D response.
     */

    window.addEventListener(
        "pointermove",
        (event) => {

            const x =
                (event.clientX /
                    window.innerWidth) * 2 - 1;

            const y =
                (event.clientY /
                    window.innerHeight) * 2 - 1;


            targetRotationY =
                x * 0.25 + 0.25;

            targetRotationX =
                -y * 0.18 - 0.14;

        }
    );


    /* ==========================================
       ANIMATION
    ========================================== */

    function animate() {

        requestAnimationFrame(animate);


        currentRotationX +=
            (
                targetRotationX -
                currentRotationX
            ) * 0.035;


        currentRotationY +=
            (
                targetRotationY -
                currentRotationY
            ) * 0.035;


        logoGroup.rotation.x =
            currentRotationX;

        logoGroup.rotation.y =
            currentRotationY;


        /*
         * Very slow autonomous movement.
         * This can later be tied to scrolling.
         */

        logoGroup.rotation.z +=
            0.0008;


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    /* ==========================================
       RESPONSIVE
    ========================================== */

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