document.addEventListener("DOMContentLoaded", () => {

    const logo = document.getElementById("rotating-logo");

    if (!logo) return;

    let currentScroll = 0;
    let targetScroll = 0;

    function animate() {

        currentScroll +=
            (targetScroll - currentScroll) * 0.08;

        /*
         * 3D movement
         */

        const rotateX = currentScroll * 0.12;
        const rotateY = currentScroll * 0.18;
        const rotateZ = currentScroll * 0.035;

        /*
         * Subtle floating movement
         */

        const moveX = Math.sin(currentScroll * 0.015) * 25;
        const moveY = Math.cos(currentScroll * 0.012) * 18;

        /*
         * Scale creates the feeling of moving
         * toward and away from the viewer.
         */

        const scale =
            1 + Math.sin(currentScroll * 0.01) * 0.08;

        logo.style.transform = `
            translate(${moveX}px, ${moveY}px)
            perspective(800px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
        `;

        requestAnimationFrame(animate);
    }

    window.addEventListener("scroll", () => {

        targetScroll = window.scrollY;

    });

    animate();

});