document.addEventListener("DOMContentLoaded", () => {

    const logo = document.getElementById("rotating-logo");

    if (!logo) {
        console.log("Logo not found");
        return;
    }

    let currentRotation = 0;
    let targetRotation = 0;

    window.addEventListener("scroll", () => {

        targetRotation = window.scrollY * 0.08;

    });

    function animateLogo() {

        currentRotation +=
            (targetRotation - currentRotation) * 0.05;

        logo.style.transform =
            `rotate(${currentRotation}deg)`;

        requestAnimationFrame(animateLogo);
    }

    animateLogo();

});