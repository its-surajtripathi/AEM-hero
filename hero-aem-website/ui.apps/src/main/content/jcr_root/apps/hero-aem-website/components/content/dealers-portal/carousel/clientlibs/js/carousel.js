function initCarousel(container) {
    let currentIndex = 0;
    let items = container.querySelectorAll('img.dealer-slider-image');
    let itemAmount = items.length;
    let leftArrow = container.querySelector('#dealer-carousel .left-arrow');
    let rightArrow = container.querySelector('#dealer-carousel .right-arrow');
    let autoPlay;
    items[currentIndex].style.display = "block";
    autoPlay = setInterval(function () {
        items[currentIndex].style.display = "none";
        currentIndex++;
        if (currentIndex >= itemAmount) {
            currentIndex = 0;
        }
        items[currentIndex].style.display = "block";
    }, 2500);
    leftArrow.addEventListener('click', function () {
        items[currentIndex].style.display = "none";
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = itemAmount - 1;
        }
        items[currentIndex].style.display = "block";
        clearInterval(autoPlay);
    });

    rightArrow.addEventListener('click', function () {
        items[currentIndex].style.display = "none";
        currentIndex++;
        if (currentIndex >= itemAmount) {
            currentIndex = 0;
        }
        items[currentIndex].style.display = "block";
        clearInterval(autoPlay);
    });
}
const carouselContainers = document.querySelectorAll('#dealer-carousel');
carouselContainers.forEach((container) => {
    initCarousel(container);
});
