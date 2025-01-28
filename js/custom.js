/*! device.js 0.1.58 */
(function(){var a,b,c,d,e,f,g,h,i,j;a=window.device,window.device={},c=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),device.ios=function(){return device.iphone()||device.ipod()||device.ipad()},device.iphone=function(){return d("iphone")},device.ipod=function(){return d("ipod")},device.ipad=function(){return d("ipad")},device.android=function(){return d("android")},device.androidPhone=function(){return device.android()&&d("mobile")},device.androidTablet=function(){return device.android()&&!d("mobile")},device.blackberry=function(){return d("blackberry")||d("bb10")||d("rim")},device.blackberryPhone=function(){return device.blackberry()&&!d("tablet")},device.blackberryTablet=function(){return device.blackberry()&&d("tablet")},device.windows=function(){return d("windows")},device.windowsPhone=function(){return device.windows()&&d("phone")},device.windowsTablet=function(){return device.windows()&&d("touch")},device.fxos=function(){return(d("(mobile;")||d("(tablet;"))&&d("; rv:")},device.fxosPhone=function(){return device.fxos()&&d("mobile")},device.fxosTablet=function(){return device.fxos()&&d("tablet")},device.meego=function(){return d("meego")},device.mobile=function(){return device.androidPhone()||device.iphone()||device.ipod()||device.windowsPhone()||device.blackberryPhone()||device.fxosPhone()||device.meego()},device.tablet=function(){return device.ipad()||device.androidTablet()||device.blackberryTablet()||device.windowsTablet()||device.fxosTablet()},device.portrait=function(){return 90!==Math.abs(window.orientation)},device.landscape=function(){return 90===Math.abs(window.orientation)},device.noConflict=function(){return window.device=a,this},d=function(a){return-1!==j.indexOf(a)},f=function(a){var b;return b=new RegExp(a,"i"),c.className.match(b)},b=function(a){return f(a)?void 0:c.className+=" "+a},h=function(a){return f(a)?c.className=c.className.replace(a,""):void 0},device.ios()?device.ipad()?b("ios ipad tablet"):device.iphone()?b("ios iphone mobile"):device.ipod()&&b("ios ipod mobile"):device.android()?device.androidTablet()?b("android tablet"):b("android mobile"):device.blackberry()?device.blackberryTablet()?b("blackberry tablet"):b("blackberry mobile"):device.windows()?device.windowsTablet()?b("windows tablet"):device.windowsPhone()?b("windows mobile"):b("desktop"):device.fxos()?device.fxosTablet()?b("fxos tablet"):b("fxos mobile"):device.meego()?b("meego mobile"):b("desktop"),e=function(){return device.landscape()?(h("portrait"),b("landscape")):(h("landscape"),b("portrait"))},i="onorientationchange"in window,g=i?"orientationchange":"resize",window.addEventListener?window.addEventListener(g,e,!1):window.attachEvent?window.attachEvent(g,e):window[g]=e,e()}).call(this);
/*device end*/

/*lazyload images*/

document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll(".lazy"));
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;



      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
           
          if ( (lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && 

            (  (getComputedStyle(lazyImage).display !== "none")       )       )   {
            
            if (lazyImage.dataset.src){
                lazyImage.src = lazyImage.dataset.src;
            } 
            if (lazyImage.dataset.img){
                lazyImage.src = lazyImage.dataset.img;
            } 
            if (lazyImage.dataset.srcset){
                lazyImage.srcset = lazyImage.dataset.srcset; 
            } 
            lazyImage.classList.remove("lazy");

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
            }
          }
        });
        lazyBackgrounds.forEach(function(lazyBackground) {
          if ((lazyBackground.getBoundingClientRect().top <= window.innerHeight && lazyBackground.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyBackground).display !== "none") {
            lazyBackground.classList.remove("lazy-background");
            lazyBackgrounds = lazyBackgrounds.filter(function(image) {
              return image !== lazyBackground;
            });
            
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
});

  /*lazyload images END*/


function viewport() {
    var e = window, i = "inner";
    return "innerWidth" in window || (i = "client", e = document.documentElement || document.body), {
        width: e[i + "Width"],
        height: e[i + "Height"]
    }
}

var winW = viewport().width;
$(document).ready(function () {
    if ( $('#popup-15 .det__item').length<1 ){
        $('#head_mob_item_pageservicemodel').hide();
    }

    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) && $("body").addClass("ios");
    var e = !1, i = window.navigator.userAgent, t = i.indexOf("MSIE "), s = i.indexOf("Trident/");
    if ((t > -1 || s > -1) && (e = !0), e && $("body").addClass("ie"), $("input, textarea").each(function () {
            var e = $(this).attr("placeholder");
            $(this).focus(function () {
                $(this).attr("placeholder", "")
            }), $(this).focusout(function () {
                $(this).attr("placeholder", e)
            })
        }), $(".js-slider-next").click(function () {
            $(".slider-4__arrow_next").click()
        }), $(".js-scroll").click(function (e) {
            e.preventDefault(), $("#mask").click()
        }), function (e, i) {
            i = parseInt(i, 10) === i ? i : 300, $(e).on("click", function (e) {
                e.preventDefault();
                var t = $(this).attr("href");


                if($(t).length>0) {
                    $("html, body").animate({scrollTop: parseInt($(t).offset().top)}, i);
                }



            })
        }(".js-scroll", 500), $(".js-more-button").click(function () {
            $(this).hasClass("active") ? ($(this).removeClass("active").text("Подробнее"), $(this).closest(".js-more-wrap").find(".js-more-hide").stop().slideUp(300), $(this).hasClass("brands__more") && $(this).text("Показать все")) : ($(this).addClass("active").text("Свернуть"), $(this).closest(".js-more-wrap").find(".js-more-hide").stop().slideDown(300))
        }), $(".js-slider-1").length > 0) {
        var a = $(".slider-1__item:first-child").index(), d = $(".slider-1__item:last-child").index();
        $(".slider-1__item:last").addClass("active").addClass("active-1"), $(".slider-1__item:nth-child(2)").addClass("active").addClass("active-2"), $(".slider-1__item").each(function () {
            var e = $(this).index();
            $(this).attr("data-item", e)
        }), $(".js-slider-1").slick({
            dots: !0,
            infinite: !0,
            lazyLoad: 'ondemand',
            autoplay: !1,
            slidesToShow: 5,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 500,
            centerMode: !0,
            variableWidth: !0,
            prevArrow: $(".slider-1__arrow_prev"),
            nextArrow: $(".slider-1__arrow_next"),
            responsive: [{breakpoint: 767, settings: {slidesToShow: 1, centerMode: !1, variableWidth: !1}}]
        }), $(".js-slider-1").on("beforeChange", function (e, i, t, s) {
            $(this).find(".js-slide-item").removeClass("active").removeClass("active-1").removeClass("active-2");
            var l = s - 1, o = s + 1;
            $(this).find(".js-slide-item[data-item=" + l + "]").addClass("active").addClass("active-1"), $(this).find(".js-slide-item[data-item=" + o + "]").addClass("active").addClass("active-2"), s == a && $(this).find(".js-slide-item[data-item=" + d + "]").addClass("active").addClass("active-1"), s == d && $(this).find(".js-slide-item[data-item=" + a + "]").addClass("active").addClass("active-2")
        }), $(".js-slider-1").on('afterChange', function (slick, currentSlide) {
            $('.slider-1').find('select').toggleSelected(currentSlide.currentSlide + 1).trigger('refresh');
        })
    }
    if ($(".slider-1__item").live("click", function () {
            var e = $(this).data("item") + 1;
            $(".js-slider-1 .slick-dots li:nth-child(" + e + ")").click()
        }), $(".js-slider-2").length > 0 && ($(".slider-2__item, .tabs__item").each(function () {
            var e = $(this).index() + 1;
            $(this).attr("data-item", e)
        }), $(".js-slider-2").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 500,
            adaptiveHeight: !0,
            prevArrow: $(".slider-2__arrow_prev"),
            nextArrow: $(".slider-2__arrow_next")
        }), $(".js-slider-2").on("beforeChange", function (e, i, t, s) {
            var a = s + 1;
            $(".tabs__item").removeClass("active"), $(".tabs__item[data-item=" + a + "]").addClass("active");
            var d = $(".tabs__item.active").position().top;
            $(".tabs__fix").css("top", d + "px")
        }), $(".js-slider-2").on("afterChange", function (e, i, t, s) {
            $(".tabs__mask").fadeOut(0)
        })), $(".js-tabs-button").live("click", function () {
            var e = $(this).closest(".js-tabs-item").data("item");
            $(".tabs__mask").fadeIn(0), $(".tabs__item").removeClass("active"), $(this).closest(".tabs__item").addClass("active"), $(".js-slider-2 .slick-dots li:nth-child(" + e + ")").click()
        }), $(".slider-2__item").live("click", function () {
            var e = $(this).data("item");
            $(".js-slider-2 .slick-dots li:nth-child(" + e + ")").click()
        }), $(".js-slider-3").length > 0) {
        var l = $(".slider-3__item:first-child").index(), o = $(".slider-3__item:last-child").index();
        $(".slider-3__item:last").addClass("active").addClass("active-1"), $(".slider-3__item:nth-child(2)").addClass("active").addClass("active-2"), $(".slider-3__item").each(function () {
            var e = $(this).index();
            $(this).attr("data-item", e)
        }), $(".js-slider-3").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            slidesToShow: 3,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 500,
            centerMode: !0,
            variableWidth: !0,
            prevArrow: $(".slider-3__arrow_prev"),
            nextArrow: $(".slider-3__arrow_next"),
            responsive: [{
                breakpoint: 767,
                settings: {slidesToShow: 1, centerMode: !1, variableWidth: !1, adaptiveHeight: !0}
            }]
        }), $(".js-slider-3").on("beforeChange", function (e, i, t, s) {
            $(this).find(".js-slide-item").removeClass("active").removeClass("active-1").removeClass("active-2");
            var a = s - 1, d = s + 1;
            $(this).find(".js-slide-item[data-item=" + a + "]").addClass("active").addClass("active-1"), $(this).find(".js-slide-item[data-item=" + d + "]").addClass("active").addClass("active-2"), s == l && $(this).find(".js-slide-item[data-item=" + o + "]").addClass("active").addClass("active-1"), s == o && $(this).find(".js-slide-item[data-item=" + l + "]").addClass("active").addClass("active-2")
        })
    }
    if ($(".slider-3__item").live("click", function () {
            var e = $(this).data("item");
            $(".js-slider-3").slick("slickGoTo", e)
        }), $(".js-slider-4").length > 0 && $(".js-slider-4").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 1e3,
            fade: !0,
            appendDots: $(".slider-4__dots"),
            prevArrow: $(".slider-4__arrow_prev"),
            nextArrow: $(".slider-4__arrow_next")
        }), $(".js-slider-5").length > 0 && $(".js-slider-5").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 800,
            appendDots: $(".slider-5__dots"),
            prevArrow: $(".slider-5__arrow_prev"),
            nextArrow: $(".slider-5__arrow_next"),
            adaptiveHeight: !0
        }), $(".js-slider-7").length > 0) {
			$(".js-slider-4").on('beforeChange', (event, slick, currentSlide, nextSlide) => {
				if (nextSlide <= 5 ) {
					slick.$dots.css('top', 0);
				} else if (nextSlide > 5 && nextSlide < slick.slideCount - 5) {
					slick.$dots.css('top', -(nextSlide - 5) *  20);
				} else {
					slick.$dots.css('top', -(slick.slideCount - 11) *  20);
				}
			})
			
        $(".num-slider__item").each(function () {
            var e = $(this).index();
            $(this).attr("data-item", e)
        });
        var r = $(".num-slider__item:last-child").index();
        $(".js-slider-7").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            slidesToShow: 4,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 500,
            prevArrow: $(".num-slider__arrow_prev"),
            nextArrow: $(".num-slider__arrow_next"),
            responsive: [{breakpoint: 601, settings: {slidesToShow: 2}}]
        }), $(".js-slider-7").on("beforeChange", function (e, i, t, s) {
            $(".num-slider__item").removeClass("fixed"), s == r && ($(".num-slider__item[data-item=" + r + "]").addClass("fixed"), $(".num-slider__item[data-item=0], .num-slider__item[data-item=1], .num-slider__item[data-item=2]").addClass("fixed")), 0 == s && $(".num-slider__item[data-item=0], .num-slider__item[data-item=1], .num-slider__item[data-item=2], .num-slider__item[data-item=3]").addClass("fixed")
        }), $(".num-slider__item").live("click", function () {
            var e = $(this).data("item") + 1;
            $(".js-slider-7 .slick-dots li:nth-child(" + e + ")").click()
        })
    }
    $("select").length > 0 && ($(".slider-1__select option").each(function () {
        var e = $(this).index();
        $(this).attr("data-item", e)
    }), $("select").styler({}), $(".jq-selectbox__dropdown").each(function () {
        $(this).find("li").length > 7 && $(this).find(".jq-scroll").mCustomScrollbar({
            horizontalScroll: !1,
            scrollButtons: {enable: !1},
            advanced: {updateOnContentResize: !0},
            advanced: {updateOnBrowserResize: !0},
            scrollInertia: 0,
            mouseWheelPixels: 30
        })
    }), $(".slider-1__select select").live("change", function () {
        var e = $(this).find("option:selected").index();
        $(".js-slider-1 .slick-dots li:nth-child(" + e + ") button").click()
    })), $("input[type=file]").length > 0 && $("input[type=file]").styler({}), $(".fancybox").length > 0 && $(".fancybox").fancybox({
        helpers: {
            overlay: {locked: !1},
            title: {type: "over"}
        }
    }),


        $(".js-popup-11").length > 0 && $(".js-popup-11").fancybox({
        autoSize: !1,
        fitToView: !1,
        width: "100%",
        height: "auto",
        margin: 0,
        padding: 0,
        closeSpeed: 0,
        helpers: {overlay: {locked: !1}}
    }),


        $(".js-popup-1").click(function (e) {
            e.preventDefault();
            var el = $(this);
            var id = el.attr("href");
            var params = el.attr("data-params");
            id = id.replace("#", "");
            id = id.replace("-", "");
            
            $.ajax({
                type	: "POST",
                cache	: false,
                url		: "/popups.php?id="+ id,
                data    : params,
                success: function(data) {
                    $('.windows').append(data);
                    $.fancybox.open({href : el.attr("href")},{
                        autoSize: !1,
                        fitToView: !1,
                        width: "100%",
                        height: "auto",
                        margin: 0,
                        padding: 0,
                        closeSpeed: 0,
                        closeBtn:false,
                        helpers: {overlay: {locked: !1}}
                    });
                    $('.js-close-popup').click(function () {
                        $.fancybox.close();
                    });

                }
            });


        }),

        $(".js-popup-2").click(function (e) {
            e.preventDefault();
            var el = $(this);
            var id = el.attr("href");
            id = id.replace("#", "");
            id = id.replace("-", "");


            $.ajax({
                type	: "POST",
                cache	: false,
                url		: "/popups.php?id="+ id,
                success: function(data) {
                    $('.windows').append(data);
                    $.fancybox.open({href : el.attr("href")},{
                        autoSize: !1,
                        fitToView: !1,
                        width: "100%",
                        height: "auto",
                        margin: 0,
                        padding: 0,
                        closeSpeed: 0,
                        closeBtn:false,
                        helpers: {overlay: {locked: !1}}
                    });
                    $('.js-close-popup').click(function () {
                        $.fancybox.close();
                    });

                }
            });


        }),

    /*

    $(".js-popup-1").length > 0 && $(".js-popup-1").fancybox({
        autoSize: !1,
        fitToView: !1,
        width: "100%",
        height: "auto",
        margin: 0,
        padding: 0,
        closeSpeed: 0,
        helpers: {overlay: {locked: !1}}
    }),
    */




        $(".js-filter-wrap.active").removeClass("active").addClass("fixed").find(".js-filter-hide").slideDown(0), $(".js-filter-button").click(function () {
        if ($(this).closest(".js-filter-wrap").hasClass("fixed")) {
            $(".js-filter-wrap").each(function () {
                if (!$(this).find('input').is(':checked')) {
                    $(this).removeClass("fixed"), $(this).find(".js-filter-hide").stop().slideUp(300);
                    $(this).find('.filter__button.js-filter-button').css("color", "#b2b2b2");
                } else {
                    $(this).find('.filter__button.js-filter-button').css("color", "#00FFFF");
                }
            });
            $(this).closest(".js-filter-wrap").removeClass("fixed"), $(this).closest(".js-filter-wrap").find(".js-filter-hide").stop().slideUp(300);
        } else {
            $(".js-filter-wrap").each(function () {
                if (!$(this).find('input').is(':checked')) {
                    $(this).removeClass("fixed"), $(this).find(".js-filter-hide").stop().slideUp(300);
                    $(this).find('.filter__button.js-filter-button').css("color", "#b2b2b2");
                } else {
                    $(this).find('.filter__button.js-filter-button').css("color", "#00FFFF");
                }
            });
            $(this).closest(".js-filter-wrap").addClass("fixed"), $(this).closest(".js-filter-wrap").find(".js-filter-hide").stop().slideDown(300);
        }
    });
    $(".js-mask").length > 0 && $(".js-mask").mask("+7 (999) 999-99-99", {
        completed: function () {
            $(".js-mask").val(this.val());
            setCookie('phone', this.val());
        }
    }), $(".dist__all").each(function () {
        var e = $(this).index();
        $(this).attr("data-item", e)
    }), $(".dist__all").live("click", function () {
        var e = $(this).data("item") + 1;
        $(".js-slider-6 .slick-dots li:nth-child(" + e + ")").click()
    }), $(".js-mob-button").click(function () {
        $(this).hasClass("active") ? ($("#mask, .js-mob-hide").stop().fadeOut(300), $(this).removeClass("active")) : ($("#mask, .js-mob-hide").stop().fadeIn(300), $(this).addClass("active"))
    }), $(".js-datetimepicker").length > 0 && ($(".js-datetimepicker").datetimepicker({}), $.datetimepicker.setLocale("ru"), $(".ios .js-datetimepicker").attr("readonly", "true"))
}), $(window).load(function () {
});
var handler1 = function () {
    var e = $(".repairs").height();
    $(".head-loc").css("top", e + "px");
    var i = $(".complex__title-1").height() + 20, t = $(".complex__title-3").height() + 49;
    if ($(".complex__title-3").css("top", i + "px"), $(".complex__ui").css("margin-top", t + "px"), ".js-cols".length > 0) {
        $(".dist__col").css("height", "0");
        for (var s = 1; s < 99; s++) {
            var a = 0;
            $(".js-col:nth-child(" + s + ") .dist__col").each(function () {
                a = a > $(this).height() ? a : $(this).height()
            }), $(".js-col:nth-child(" + s + ") .dist__col").each(function () {
                $(this).css("height", a + "px")
            })
        }
        setTimeout(function () {
            $(" .dist__col").css("height", "0");
            for (var e = 1; e < 99; e++) {
                var i = 0;
                $(".js-col:nth-child(" + e + ") .dist__col").each(function () {
                    i = i > $(this).height() ? i : $(this).height()
                }), $(".js-col:nth-child(" + e + ") .dist__col").each(function () {
                    $(this).css("height", i + "px")
                })
            }
        }, 500)
    }
    var d = viewport().width;
    if (d > 767 && (l = $(".js-slider-6 .slick-track").length) && ($(".js-slider-6").slick("unslick"), $(".js-slider-6 *").removeAttr("tabindex").removeAttr("role").removeAttr("aria-describedby")), d <= 767) {
        var l = $(".js-slider-6").length, o = $(".js-slider-6 .slick-track").length;
        l > 0 && o < 1 && $(".js-slider-6").slick({
            dots: !0,
            infinite: !0,
            autoplay: !1,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 200,
            adaptiveHeight: !0
        })
    }
    $(".xdsoft_datetimepicker:visible").length > 0 && $(".xdsoft_datetimepicker").hide(), (d = viewport().width) > 767 && $(".js-more-fix").removeClass("js-more-title"), d <= 767 && $(".js-more-fix").addClass("js-more-title")
};
$(window).bind("orientationchange", handler1), $(window).bind("resize", handler1), $(window).bind("load", handler1);
var handler2 = function () {
    var e = $("input[type=radio]").length, i = $("input[type=checkbox]").length;
    (e > 0 || i > 0) && ($("input[type=checkbox]").styler({}), $(".radio input[type=radio]").styler({wrapper: ".radio"}))
};
$(window).bind("load", handler2);
var handler3 = function () {
    $(".radio__item").each(function () {
        $(this).find(".jq-radio.checked").length >= 1 ? $(this).addClass("active") : $(this).removeClass("active")
    }), $(".radio__item").each(function () {
        $(this).find(".jq-radio.disabled").length >= 1 ? $(this).addClass("disabled") : $(this).removeClass("disabled")
    }), $(".checkbox__item").each(function () {
        $(this).find(".jq-checkbox.checked").length >= 1 ? $(this).addClass("active") : $(this).removeClass("active")
    }), $(".checkbox__item").each(function () {
        $(this).find(".jq-checkbox.disabled").length >= 1 ? $(this).addClass("disabled") : $(this).removeClass("disabled")
    })
};
$(window).bind("click", handler3), $(window).bind("load", handler3), $(document).on("touchstart", function () {
    documentClick = !0
}), $(document).on("touchmove", function () {
    documentClick = !1
}), $(document).on("click touchend", function (e) {
    if ("click" == e.type && (documentClick = !0), documentClick) {
        var i = $(e.target);
        i.is(".js-close-popup") && $(".fancybox-close").click(), i.is(".js-more-title") && ($(i).closest(".js-more-wrap").find(".js-more-button").hasClass("active") ? ($(i).closest(".js-more-wrap").find(".js-more-button").removeClass("active").text("Подробнее"), $(i).closest(".js-more-wrap").find(".js-more-hide").stop().slideUp(300)) : ($(i).closest(".js-more-wrap").find(".js-more-button").addClass("active").text("Свернуть"), $(i).closest(".js-more-wrap").find(".js-more-hide").stop().slideDown(300))), i.is("#mask") && ($("#mask, .js-mob-hide").stop().fadeOut(300), $(".js-mob-button").removeClass("active"))
    }
});
