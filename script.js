const logo = document.getElementById("rotating-logo");

window.addEventListener("scroll", () => {

    const scrollPosition = window.scrollY;

    const rotation = scrollPosition * 0.4;

    logo.style.transform = `rotate(${rotation}deg)`;

});