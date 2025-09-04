$(document).ready(function () {
    $('.explore-360-tab .nav-link').on('click', function () {
        $('.explore-360-tab .nav-link').removeClass('active');
        $(this).addClass('active');
    });
    if ($('.explore-360-main')[0]) {
        
        var category = $(".explore-360-main .explore-360-tab").attr('data-category');
        var product = $(".explore-360-main .explore-360-tab").attr('data-product');
        var color = $(".explore-360-main .nav-link.active").attr('data-color');
        
        // pageload set first tab value
        load360(category, product, color,true);
        
        // click change value for variant
        $(".explore-360-main .nav-link").on("click", function () {
            load360(category, product, $(this).attr("data-color"),false);
        });
        function bootSpriteSpin(selector, options) {
            if ("IntersectionObserver" in window) {
                // Browser supports IntersectionObserver so use that to defer the boot
                let observer = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            observer.unobserve(entry.target);
                            $(entry.target).spritespin(options);
                            console.log("booted", selector, options);
                        }
                    });
                });
                observer.observe($(selector)[0]);
            } else {
                // Browser does not support IntersectionObserver so boot instantly
                $(selector).spritespin(options);
                console.log("booted", selector, options);
            }
        }
        // common function to load variant
        function load360(category, product, color,injectEventListener) {
            var folderpath=$('#360ImageFolderPath').attr("data-folder-path");
            var path = color + '/{frame}.png';

            bootSpriteSpin(".varient1", {
                source: SpriteSpin.sourceArray(path, {
                    frame: [1, 12],
                    digits: 1,
                    preloadCount:1
                }),
                animate: false,
                loop: false,
                onInit: function (e, data) {
                          $('.loader-div').removeClass('d-none');
                          $('.varient1').addClass('d-none');
                    if(injectEventListener){
                        $('.left-rotate-arrow').on("click", function (e) {
                            SpriteSpin.updateFrame(data, data.frame + 1);
                        });
                        $('.right-rotate-arrow').on("click", function (e) {
                            SpriteSpin.updateFrame(data, data.frame - 1);
                        });
                    }
                },
                 onComplete:function(){
                   $('.loader-div').addClass('d-none');
                   $('.varient1').removeClass('d-none');
                },
                sense: -1
            });

        }
    }
});