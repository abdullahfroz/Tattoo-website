document.addEventListener("DOMContentLoaded", () => {

    const logo = document.getElementById("rotating-logo");
    const portfolio = document.getElementById("work");

    if (!logo || !portfolio) return;

    let currentY = 0;
    let targetY = 0;

    function animate() {

        currentY += (targetY - currentY) * 0.08;

        logo.style.transform = `
             translate(-50%, calc(-50% + ${currentY}px))
        `;

        requestAnimationFrame(animate);
    }


    function updateLogoPosition() {

        const scroll = window.scrollY;

        /*
         * How far the logo moves down.
         */

        targetY = Math.min(
            scroll * 0.45,
            portfolio.offsetTop - window.innerHeight * 0.45
        );

    }


    window.addEventListener("scroll", updateLogoPosition);

    updateLogoPosition();

    animate();

});