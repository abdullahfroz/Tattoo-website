const logo = document.getElementById("rotating-logo");

let targetRotation = 0;
let currentRotation = 0;

window.addEventListener("scroll", () => {
    targetRotation = window.scrollY * 0.08;
});

function animateLogo() {
    currentRotation += (targetRotation - currentRotation) * 0.05;

    logo.style.transform = `rotate(${currentRotation}deg)`;

    requestAnimationFrame(animateLogo);
}

animateLogo();