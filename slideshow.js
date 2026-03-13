window.addEventListener("load", () => {
    const images = document.querySelectorAll(".slideshow img");
    let index = 0;

    setInterval(() => {
        images[index].classList.remove("active");
        index = (index + 1) % images.length;
        images[index].classList.add("active");
    }, 2000);
});
