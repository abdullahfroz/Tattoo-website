document.addEventListener("DOMContentLoaded", () => {

    const logo = document.getElementById("rotating-logo");

    if (!logo) {
        console.log("Logo not found");
        return;
    }

    let targetRotation = 0;
    let currentRotation = 0;

    let targetX = 0;
    let currentX = 0;

    let targetY = 0;
    let currentY = 0;

    let targetMove = 0;
    let currentMove = 0;


    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        /* Main rotation */
        targetRotation = scroll * 0.08;

        /* 3D tilt */
        targetX = Math.sin(scroll * 0.006) * 8;

        targetY = Math.cos(scroll * 0.004) * 10;

        /* Subtle floating movement */
        targetMove = Math.sin(scroll * 0.008) * 18;

    });


    function animateLogo() {

        /* Smooth interpolation */

        currentRotation +=
            (targetRotation - currentRotation) * 0.05;

        currentX +=
            (targetX - currentX) * 0.05;

        currentY +=
            (targetY - currentY) * 0.05;

        currentMove +=
            (targetMove - currentMove) * 0.05;


        logo.style.transform = `
            translateX(${currentMove}px)
            rotateX(${currentX}deg)
            rotateY(${currentY}deg)
            rotateZ(${currentRotation}deg)
        `;


        requestAnimationFrame(animateLogo);

    }


    animateLogo();

});