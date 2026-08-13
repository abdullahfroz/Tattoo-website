document.addEventListener("DOMContentLoaded", () => {

    const logo = document.getElementById("rotating-logo");
    const artistSection = document.getElementById("artist");

    if (!logo || !artistSection) return;

    let currentY = 0;
    let targetY = 0;

    function animate() {

        currentY += (targetY - currentY) * 0.08;

        logo.style.marginTop = `${currentY}px`;

        requestAnimationFrame(animate);
    }


    function updateLogoPosition() {

        const scroll = window.scrollY;

        const artistPosition =
            artistSection.offsetTop - window.innerHeight * 0.35;

        targetY = Math.min(
            scroll * 0.55,
            artistPosition
        );

    }


    window.addEventListener("scroll", updateLogoPosition);

    updateLogoPosition();

    animate();

});