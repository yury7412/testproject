var sevvise_detail = {
    13: {},
    12: {},
    8: {},
    9: {},
    10: {},
    11: {}
};
var service = {
    mat_krasc: false,
    not_work: false,
    geometry: false,
};

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {
    var options = {
        path: '/',
        domain: window.location.hostname,
        expires: 3600 * 24 * 60
    };
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }
    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}

$.fn.toggleChecked = function(flag) {
    return this.each(function() {
        this.checked = flag;
    });
};
$.fn.toggleSelected = function(flag) {
    return this.each(function() {
        this.value = flag;
    });
};
$.fn.toggleDisabled = function(flag) {
    return this.each(function() {
        this.disabled = flag;
    });
};
var summ = 0;
var countServ8s = 1;
var countServ13s = 1;
var countServ = 1;
var materials = 0;
var loadDataDetail = false;

function slider2Init() {
    var sliderLen2 = $('.js-slider-2').length;
    if (sliderLen2 > 0) {
        $(".slider-2__item, .tabs__item").each(function() {
            var curInd = $(this).index() + 1;
            $(this).attr("data-item", curInd);
        });
        $('.js-slider-2').slick({
            dots: true,
            infinite: true,
            autoplay: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            touchThreshold: 200,
            speed: 500,
            adaptiveHeight: true,
            prevArrow: $('.slider-2__arrow_prev'),
            nextArrow: $('.slider-2__arrow_next'),
            responsive: [{
                breakpoint: 767,
                settings: {
                    variableWidth: true
                }
            }]
        });
        if (!one_page_load) {
            $('.js-slider-2').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                var curInd = nextSlide + 1;
                $(".tabs__item").removeClass("active");
                $(".tabs__item[data-item=" + curInd + "]").addClass("active");
                var position1 = $(".tabs__item.active").position();
                var position2 = position1.top;
                $(".tabs__fix").css("top", position2 + "px");
            });
            $('.js-slider-2').on('afterChange', function(event, slick, currentSlide, nextSlide) {
                $(".tabs__mask").fadeOut(0);
            });
            $('.js-slider-2').slick('slickGoTo', 0);
        }
    }
}

function getPriceServ(servicer) {

    if ((servicer == 8 && countServ8s == 1) || (servicer == 13 && countServ13s == 1)) {
        countServ = 0;
        if (servicer == 8) countServ8s = 0;
        if (servicer == 13) countServ13s = 0;
        var carmodel = $('select.model').val();

        var append = '';
        $.ajax({
            type: "POST",
            url: "/",
            dataType: "json",
            data: "module=carpricelist&action=load_price&service=" + servicer + "&carmodel=" + carmodel,
            success: function(response, textStatus) {

                var price = parseInt(response.price);
                if (servicer == 8) {
                    price -= materials;
                }
                append += '<li class="det__item-in">' + '<p class="det__left-2">' + response.servicename + ' ' + response.name + '</p>' + '<p class="det__right-2">' + price + ' руб.</p>' + '</li>';
                $('ul.summ-list').append(append);
                setCookie('detail_calculate', getCookie('detail_calculate') + append);
                summ += parseInt(response.price);
                $('.sum-all').text(summ);
                var sum_clear = summ;
                if (service.geometry) {
                    sum_clear = summ - 4000;
                }
                $('.sum-all-rem').text(sum_clear - materials);
                var time_work = Math.ceil((summ - materials) / 1000 / 12);
                if (((time_work % 10 == 2) || (time_work % 10 == 3) || (time_work % 10 == 3) || (time_work % 10 == 4)) && !((time_work % 100 == 11) || (time_work % 100 == 12) || (time_work % 100 == 13) || (time_work % 100 == 14))) {
                    time_work = time_work + ' дня'
                } else {
                    if (time_work % 10 == 1) time_work = time_work + ' день';
                    else time_work = time_work + ' дней';
                }
                $('.time-work').text(time_work);
                $('.itog-sum').find('.sum-all').text(summ);
                setCookie('summ', summ);
                countServ = 1;
            }
        });

    }
}

function recalcAll() {


    setCookie('calculate', JSON.stringify(sevvise_detail));
    setCookie('detail_calculate', '');
    if (countServ == 1) {
        countServ8s = 1;
        countServ13s = 1;
    }
    summ = 0;
    materials = 0;
    var count = 0;
    var serv8 = 15;
    var serv13 = 15;
    var serv12 = 15;
    $('ul.summ-list').html("");
    var countDetail = {};

    for (var key in sevvise_detail) {
        var countService = 0;
        var append = '';
        var tSumm = 0;
        for (var keyd in sevvise_detail[key]) {
            countService++;
            countDetail[keyd] = true;
            var price = parseInt(sevvise_detail[key][keyd].price);

            if ($(".mat_krasc_input").is(':checked') && key == 8) {
                price += 1000;
            }
            tSumm += price;


            var detail_name = sevvise_detail[key][keyd].name;
            if (sevvise_detail[key][keyd].select) {
                detail_name = detail_name.replace("правого", "(прав.)");
                detail_name = detail_name.replace("левого", "(лев.)");
                detail_name = detail_name.replace("правой", "(прав.)");
                detail_name = detail_name.replace("левой", "(лев.)");
            }
            price -= parseInt(sevvise_detail[key][keyd].material);
            append += '<li class="det__item-in">' + '<p class="det__left-2">' + sevvise_detail[key][keyd].servicename + ' ' + detail_name + '</p>' + '<p class="det__right-2">' + price + ' руб.</p>' + '</li>';
            materials += parseInt(sevvise_detail[key][keyd].material);
        }
        if (key == 8 && countService >= serv8) {
            getPriceServ(8);

        } else if (key == 12 && countService >= serv12) {
            getPriceServ(12);

        } else if (key == 13 && countService >= serv13) {
            getPriceServ(13);
        } else {
            $('ul.summ-list').append(append);
            setCookie('detail_calculate', getCookie('detail_calculate') + append);
            summ += tSumm;

        }

    }
    count = Object.keys(countDetail).length;
    $('.count-detail').text(count);
    setCookie('count', count);
    if ($(".geometry_input").is(':checked')) {
        summ += 4000;
        $('.geometry').show();
        $('.geometry').find('.det__cols').addClass('view-col');
        var i = 1;
        $('#popup-4').find('.det__item .det__cols.view-col').each(function() {
            if (i % 2 == 0) $(this).css('background', '#fff');
            else $(this).css('background', '#f2f2f2');
            i++;
        });
        service.geometry = true;
        setCookie('detail_calculate', getCookie('detail_calculate') + '<li>Исправление геометрии кузова 4000 руб.</li>');
    } else {
        $('.geometry').hide();
        service.geometry = false;
        $('.geometry').find('.det__cols').removeClass('view-col');
        var i = 1;
        $('#popup-4').find('.det__item .det__cols.view-col').each(function() {
            if (i % 2 == 0) $(this).css('background', '#fff');
            else $(this).css('background', '#f2f2f2');
            i++;
        });
    }
    if ($(".not_work_input").is(':checked')) {
        $('.not_work').show();
        service.not_work = true;
        $('.not_work').find('.det__cols').addClass('view-col');
        var i = 1;
        $('#popup-4').find('.det__item .det__cols.view-col').each(function() {
            $(this).addClass('view-col');
            if (i % 2 == 0) $(this).css('background', '#fff');
            else $(this).css('background', '#f2f2f2');
            i++;
        });
        setCookie('detail_calculate', getCookie('detail_calculate') + '<li>Эвакуация до техцентра/str</li>');
    } else {
        $('.not_work').hide();
        $('.not_work').find('.det__cols').removeClass('view-col');
        var i = 1;
        $('#popup-4').find('.det__item .det__cols.view-col').each(function() {
            if (i % 2 == 0) $(this).css('background', '#fff');
            else $(this).css('background', '#f2f2f2');
            i++;
        });
        service.not_work = false;
    }
    if ($(".mat_krasc_input").is(':checked')) {
        setCookie('detail_calculate', getCookie('detail_calculate') + '<li>Матовая краска/str</li>');
        service.mat_krasc = true;
    } else {
        service.mat_krasc = false;
    }
    $('.sum-all').text(summ);

    var sum_clear = summ;
    if (service.geometry) {
        sum_clear = summ - 4000;
    }
    $('.sum-all-rem').text(sum_clear - materials);
    var time_work = Math.ceil((summ - materials) / 1000 / 12);
    if (((time_work % 10 == 2) || (time_work % 10 == 3) || (time_work % 10 == 3) || (time_work % 10 == 4)) && !((time_work % 100 == 11) || (time_work % 100 == 12) || (time_work % 100 == 13) || (time_work % 100 == 14))) {
        time_work = time_work + ' дня'
    } else {
        if (time_work % 10 == 1) time_work = time_work + ' день';
        else time_work = time_work + ' дней';
    }
    $('.time-work').text(time_work);
    $('.itog-sum').find('.sum-all').text(summ);
    setCookie('summ', summ);
    setCookie('materials', materials);
    setCookie('service', JSON.stringify(service));
    if (count == 0) {
        $(".js-action-all-sell").data("active", false);
        $(".js-action-all-sell").text("Выделить весь кузов");
    } else {
        $(".js-action-all-sell").data("active", 1);
        $(".js-action-all-sell").text("Снять выделение");
    }
    $('.material-all').text(materials);
}
$(document).ready(function() {
    if (window.innerWidth > 767) {
		setTimeout(function() {
			showLine($("#det6")[0]);
			$('.car__line').fadeIn(300);
		}, 1000);
	}

    if ($('a[href="#popup-2"].js-popup-1').length) {

        recalcAll();
        $.ajax({
            type: "POST",
            cache: false,
            url: "/popups.php?id=popup4",
            success: function(data) {
                $('.windows').append(data);
            }
        });
    }
})


function getDetailPrice(detail, service, all, option, set_option) {

    var not_kr = false;
    if (service == 22) {
        not_kr = true;
        service = 12;
    }
    var id_detail = detail;
    var carmodel = $('select.model').val();
    if (typeof model_select !== 'undefined' && model_select > 0) {
        carmodel = model_select;
    }

    $.ajax({
        type: "POST",
        url: "/",
        dataType: "json",
        data: "module=carpricelistdetail&action=load_detail_price&detail=" + id_detail + "&service=" + service + "&carmodel=" + carmodel,
        success: function(response, textStatus) {
            var cnt = 0;
            for (var any in response) cnt++
            if (cnt > 0) {
                sevvise_detail[service][id_detail] = response;
                if (set_option) {
                    if (!all) $('.option__title').text(response.name_1);
                    if ((id_detail == 8 || id_detail == 9) && !option) {
                        $('.service-option').find('input[value="13"]').parent().parent().hide();
                        $('.service-option').find('input[value="9"]').parent().parent().hide();
                        $('.service-option').find('input[value="10"]').parent().parent().hide();
                        $('.service-option').find('input[value="11"]').parent().parent().hide();
                        $('.service-option').find('label[for="check_12"]').html("Замена и покраска " + '<span class="option_price"></span>').trigger('refresh');
                        $('.service-option').find('label[for="check_22"]').html("Замена " + '<span class="option_price"></span>').trigger('refresh');
                        $('.service-option').find('input[value="22"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').parent().parent().addClass('active');
                        $('.service-option').find('input[value="8"]').toggleChecked(true).trigger('refresh');
                    } else if (response.replace == '1') {
                        $('.service-option').find('input[value="22"]').parent().parent().hide();
                        $('.service-option').find('input[value="13"]').parent().parent().hide();
                        $('.service-option').find('input[value="13"]').parent().parent().hide();
                        $('.service-option').find('input[value="8"]').parent().parent().hide();
                        $('.service-option').find('input[value="9"]').parent().parent().hide();
                        $('.service-option').find('input[value="10"]').parent().parent().hide();
                        $('.service-option').find('input[value="11"]').parent().parent().hide();
                        $('.service-option').find('label[for="check_12"]').html("Замена " + '<span class="option_price"></span>').trigger('refresh');
                        $('.service-option').find('input[value="12"]').parent().parent().addClass('active');
                        $('.service-option').find('input[value="12"]').toggleChecked(true).trigger('refresh');
                    } else if (all) {
                        $('.service-option').find('input[value="22"]').parent().parent().hide();
                        $('.service-option').find('input[value="12"]').parent().parent().hide();
                        $('.service-option').find('input[value="13"]').parent().parent().show();
                        $('.service-option').find('input[value="9"]').parent().parent().show();
                        $('.service-option').find('input[value="10"]').parent().parent().show();
                        $('.service-option').find('input[value="11"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').parent().parent().addClass('active');
                    } else if (!option) {
                        $('.service-option').find('input[value="22"]').parent().parent().hide();
                        $('.service-option').find('label[for="check_12"]').html("Замена и покраска " + '<span class="option_price"></span>').trigger('refresh');
                        $('.service-option').find('input[value="12"]').parent().parent().show();
                        $('.service-option').find('input[value="13"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').parent().parent().show();
                        $('.service-option').find('input[value="9"]').parent().parent().show();
                        $('.service-option').find('input[value="10"]').parent().parent().show();
                        $('.service-option').find('input[value="11"]').parent().parent().show();
                        $('.service-option').find('input[value="8"]').toggleChecked(true).trigger('refresh');
                        $('.service-option').find('input[value="8"]').toggleDisabled(true).trigger('refresh');
                        $('.service-option').find('input[value="8"]').parent().parent().addClass('active');
                    }
                }
                recalcAll();
                if (!not_kr)
                    if (service == 9 || service == 10 || service == 11 || (service == 12 && response.replace != '1')) getDetailPrice(id_detail, 8, false, true, set_option);
            }
            
            if (response.services_price) {
				for (k in response.services_price) {
					let el = $("#check_" + response.services_price[k].service_id);
					if (el) {
						el.parent().parent().find('.option_price').html('(' + response.services_price[k].price + 'р.)');
					}
				}
			}
        }
    });
}


function showLine(detail) {
    var obOption = $('.options > div:visible');
    var removeToSec = $('.calc.line.js-cars-wrap').offset().top;
    var active = $('.car.js-cars-item.active').data('item');
    var carmodel = $('select.model').val();
    var constant = 114;
    if (typeof $(detail).attr('transform') !== 'undefined') {
        constant = 0;
    }


    if (carmodel == '68' || carmodel == '71') {
        constant = 0;
    }
    var carPos = document.getElementsByClassName('g-conteiner')[active];
    var carPosD = carPos.getBoundingClientRect();
    var yOption = obOption.offset().top - removeToSec;
    var b = detail.getBBox();
    var centerDetailX = b.x + b.width / 2;
    var centerDetailY = b.y + constant + b.height / 2;
    var numDetail = $(detail).data("detail");
    if (numDetail == 15) centerDetailY = b.y + constant;
    if (numDetail == 13 || numDetail == 14) centerDetailY -= 25;



    $(".svg-view").find('line').fadeIn(300);
    $(".svg-view").find('line').each(function() {
        $(this).attr('x1', centerDetailX);
        $(this).attr('y1', centerDetailY);
        $(this).attr('x2', 960 + carPosD.width / 2 + 60);
        $(this).attr('y2', yOption + 150);
        $(".car__line").css('left', centerDetailX);
        $(".car__line").css('top', centerDetailY);
    });
}

function selectDetail() {
    $(".st0").click(function(evt) {
        var active = $(this).data("active");
        var detail = $(this).data("detail");
        if (active) {
            $(".option").hide();
            $("#calc-before-select-option").show();
            for (var key in sevvise_detail) delete sevvise_detail[key][detail];
            $('.st0[data-detail=' + detail + ']').removeClass("active");
            $('.st0[data-detail=' + detail + ']').data("active", false);
//            $('.car__line').fadeOut(300);
//            $(".svg-view").find('line').fadeOut(300);
            recalcAll();
        } else {
            $("#calc-before-select-option").hide();
            $(".option").show();            
            $(".option").data("detail", detail);
            $('.service-option').find('input').toggleDisabled(false).trigger('refresh');
            $('.service-option').find('input').toggleChecked(false).trigger('refresh');
            getDetailPrice(detail, 8, false, false, true);
            showLine(this);
            $('.st0[data-detail=' + detail + ']').addClass("active");
            $('.st0[data-detail=' + detail + ']').data("active", "1");
            $('.car__line').fadeIn(300);
            $(".js-action-all-sell").data("active", "1");
            $(".js-action-all-sell").text("Снять выделение");
        }
    });
}


window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    var height = $('#scroll-1').height();
    if (document.body.scrollTop > height || document.documentElement.scrollTop > height) {
        $('.scroller').css("display", "block");
    } else {
        $('.scroller').css("display", "none");
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
$(document).ready(function() {
    var i = 1;
    $('#popup-4').find('.det__item .det__cols.view-col').each(function() {
        if (i % 2 == 0) $(this).css('background', '#fff');
        else $(this).css('background', '#f2f2f2');
        i++;
    });
    $(".not-work-time").fancybox({
        autoSize: !1,
        fitToView: !1,
        width: "100%",
        height: "auto",
        margin: 0,
        padding: 0,
        closeSpeed: 0,
        helpers: {
            overlay: {
                locked: !1
            }
        }
    });
    var n = $(".js-cars-item:last-child").index();
    $(".js-cars-button").click(function() {
        var e = $(".js-cars-item.active").index();
        $(".js-cars-item").removeClass("active")
        if (e == 0) $(".js-cars-item[data-item=" + 3 + "]").addClass("active");
        if (e == 3) $(".js-cars-item[data-item=" + 2 + "]").addClass("active");
        if (e == 2) $(".js-cars-item[data-item=" + 1 + "]").addClass("active");
        if (e == 1) $(".js-cars-item[data-item=" + 0 + "]").addClass("active");
        $(".option").hide();
        $("#calc-before-select-option").show();
        $('.car__line').fadeOut(300);
        $(".svg-view").find('line').fadeOut(300);
    });
    $('.calc__check').find('.checkbox__item').click(function() {
        var name = $(this).find('input').attr('class');
        if ($(this).find('input').is(':checked')) {
            $('.' + name).toggleChecked(true).trigger('refresh');
        } else $('.' + name).toggleChecked(false).trigger('refresh');
        recalcAll();
    });
    $('.service-option').find('.checkbox__item').click(function(e) {
        var service = $(this).find('input').val();
        var detail = $(".option").data("detail");
        $('.service-option').find('input').each(function() {
            var s = $(this).val();
            if (s == 22) s = 12;
            if ($(this).is(':checked')) {
                var service_ = service;
                if (service == 22) service_ = 12;
                if (service_ != s) {
                    if (detail == 'all') {
                        $('.st0').each(function() {
                            var detail_1 = $(this).data("detail");
                            if (detail_1 in sevvise_detail[s]) {
                                delete sevvise_detail[s][detail_1];
                                recalcAll();
                            }
                        });
                    } else {
                        if (detail in sevvise_detail[s]) {
                            if (service_ == 13 || service == 22) {
                                if (detail in sevvise_detail[8]) {
                                    delete sevvise_detail[8][detail];
                                }
                            }
                            delete sevvise_detail[s][detail];
                            recalcAll();
                        }
                    }
                    $(this).toggleChecked(false).trigger('refresh');
                    $(this).toggleDisabled(false).trigger('refresh');
                }
                if (($(this).val() == 12 && service == 22)) {
                    if (detail in sevvise_detail[8]) {
                        delete sevvise_detail[8][detail];
                    }
                }
                if (($(this).val() == 22 && $(this).val() != service) || (service == 12 && $(this).val() == 22) || ($(this).val() == 12 && service == 22)) {
                    $(this).toggleChecked(false).trigger('refresh');
                    $(this).toggleDisabled(false).trigger('refresh');
                }
            }
        });
        if ($(this).find('input').is(':checked')) {
            $(this).find('input').toggleDisabled(true).trigger('refresh');
            if (detail == 'all') {
                $(".option").hide();
                $("#calc-before-select-option").show();
                console.log("all");
                $('.service-option').find('input').toggleDisabled(false).trigger('refresh');
                $('.service-option').find('input').toggleChecked(false).trigger('refresh');
                $('.service-option').find('input').parent().parent().removeClass('active');
                $('.service-option').find('input[value="' + service + '"]').toggleDisabled(false).trigger('refresh');
                $('.service-option').find('input[value="' + service + '"]').toggleChecked(true).trigger('refresh');
                $('.service-option').find('input[value="' + service + '"]').parent().parent().addClass('active');
                $('.service-option').find('input[value="22"]').parent().parent().hide();
                $('.service-option').find('input[value="12"]').parent().parent().hide();
                $('.st0').each(function() {
                    var detail_1 = $(this).data("detail");
                    if (detail_1 != 22 && detail_1 != 24 && detail_1 != 9 && detail_1 != 16 && detail_1 != 26 && detail_1 != 25 && detail_1 != 19 && detail_1 != 23 && detail_1 != 8 && detail_1 != 21 && detail_1 != 27 && detail_1 != 28 && detail_1 != 20) {
                        if (!(detail_1 in sevvise_detail[service])) {
                            getDetailPrice(detail_1, service, false, false, false);
                        }
                    }
                });
                $('.option__title').text("Весь кузов");
                console.log("Весь кузов");
                $(".option").data("detail", 'all');
                $("#calc-before-select-option").hide();
                $(".option").show();                
            } else getDetailPrice(detail, service, false, true, true);
        } else {}
    });
    $('.js-filter-wrap').find('.checkbox__item').click(function() {
        var service = $(this).data("service");
        var detail = $(this).data("detail");
        if ($(this).find('input').is(':checked')) {
            $(this).parent().find('input').each(function() {
                var s = $(this).val();
                if (s == 22) s = 12;
                if ($(this).is(':checked')) {
                    var service_ = service;
                    if (service == 22) service_ = 12;
                    if (service_ != s) {
                        if (detail in sevvise_detail[s]) {
                            if (service_ == 13 || service == 22) {
                                if (detail in sevvise_detail[8]) {
                                    delete sevvise_detail[8][detail];
                                }
                            }
                            delete sevvise_detail[s][detail];
                            recalcAll();
                        }
                        $(this).toggleChecked(false).trigger('refresh');
                    }
                    if (($(this).val() == 12 && service == 22)) {
                        if (detail in sevvise_detail[8]) {
                            delete sevvise_detail[8][detail];
                        }
                    }
                    if (($(this).val() == 22 && $(this).val() != service) || (service == 12 && $(this).val() == 22) || ($(this).val() == 12 && service == 22)) {
                        $(this).toggleChecked(false).trigger('refresh');
                        $(this).toggleDisabled(false).trigger('refresh');
                    }
                }
            });
            $('.st0[data-detail=' + detail + ']').addClass("active");
            $('.st0[data-detail=' + detail + ']').data("active", "1");
            getDetailPrice(detail, service, false, true, true);
        } else {
            if (service == 22) {
                if (detail in sevvise_detail[12]) {
                    delete sevvise_detail[12][detail];
                    $('.st0[data-detail=' + detail + ']').removeClass("active");
                    $('.st0[data-detail=' + detail + ']').data("active", "0");
                    recalcAll();
                }
            } else if (detail in sevvise_detail[service]) {
                delete sevvise_detail[service][detail];
                $('.st0[data-detail=' + detail + ']').removeClass("active");
                $('.st0[data-detail=' + detail + ']').data("active", "0");
                recalcAll();
            }
        }
    });
    $(".js-action-all-sell").click(function() {
        var active = $(this).data("active");
        if (active) {
            $(".option").hide();
            $("#calc-before-select-option").show();
            $('.st0').each(function() {
                var detail = $(this).data("detail");
                for (var key in sevvise_detail) {
                    if (detail in sevvise_detail[key]) {
                        delete sevvise_detail[key][detail];
                    }
                }
                $(this).removeClass("active");
                $(this).data("active", false);
            });
            $('.car__line').fadeOut(300);
            $(".svg-view").find('line').fadeOut(300);
            $(this).data("active", false);
            $(this).text("Выделить весь кузов");
            recalcAll();
        } else {
            $("#calc-before-select-option").hide();
            $(".option").show();            
            $('.service-option').find('input').toggleDisabled(false).trigger('refresh');
            $('.service-option').find('input').toggleChecked(false).trigger('refresh');
            $('.service-option').find('input[value="8"]').toggleChecked(true).trigger('refresh');
            $('.st0').each(function() {
                var detail = $(this).data("detail");
                if (detail != 22 && detail != 24 && detail != 9 && detail != 16 && detail != 26 && detail != 25 && detail != 19 && detail != 23 && detail != 8 && detail != 21 && detail != 27 && detail != 28 && detail != 20) {
                    for (var key in sevvise_detail) {
                        if (!(detail in sevvise_detail[key])) {
                            getDetailPrice(detail, 8, true, false, true);
                        }
                    }
                    $(this).addClass("active");
                    $(this).data("active", "1");
                }
            });
            $(this).data("active", "1");
            $('.option__title').text("Весь кузов");
            $(".option").data("detail", 'all');
            $("#calc-before-select-option").hide();
            $(".option").show();            
            $(this).text("Снять выделение");
        }
    });
    selectDetail();
    $('form').submit(function(e) {

        e.preventDefault();
        var form = $(this);
        var phone = false;
        if (form.find('input[name="phone"]').length > 0) {
            if (form.find('input[name="phone"]').val() == '') {
                var old_border = form.find('input[name="phone"]').css("border");
                form.find('input[name="phone"]').css("border", "1px solid red");
                form.find('input[name="phone"]').focus();
                setTimeout(function() {
                    form.find('input[name="phone"]').css("border", old_border);
                }, 3000);
                return;
            }
            phone = true;
            setCookie('phone', form.find('input[name="phone"]').val());
        } else {
            form.append('<input type="hidden" name="phone" value="' + $('input[name="phone"]').val() + '">');
        }
        if (form.find('input[name="email"]').length > 0) {
            if (form.find('input[name="email"]').val() == '') {
                var old_border = form.find('input[name="email"]').css("border");
                form.find('input[name="email"]').css("border", "1px solid red");
                form.find('input[name="email"]').focus();
                setTimeout(function() {
                    form.find('input[name="email"]').css("border", old_border);
                }, 3000);
                return;
            }
            setCookie('email', form.find('input[name="email"]').val());
        } else if (getCookie('email')) {
            form.append('<input type="hidden" name="email" value="' + getCookie('email') + '">');
        }
        var num_form = form.find('input[name="form_name"]').val();
        eventGoal(num_form);
        form.append('<input type="hidden" name="calculate" value="' + encodeURIComponent(JSON.stringify(sevvise_detail)) + '">');
        form.append('<input type="hidden" name="service" value="' + encodeURIComponent(JSON.stringify(service)) + '">');
        form.append('<input type="hidden" name="count" value="' + getCookie('count') + '">');
        form.append('<input type="hidden" name="detail_calculate" value="' + encodeURIComponent(getCookie('detail_calculate')) + '">');
        form.append('<input type="hidden" name="summ" value="' + getCookie('summ') + '">');
        form.append('<input type="hidden" name="materials" value="' + getCookie('materials') + '">');
        if ($(this).hasClass('send-file')) {
            $.ajax({
                type: "POST",
                url: "/",
                processData: false,
                contentType: false,
                data: new FormData(this),
                success: function(response, textStatus) {

                    ga('send', 'event', 'form', 'submit');
                    var data = JSON.parse(response);

                    if (1 + 1 == 4) {
                        /* data.data==101 */
                        $('#popup-10').find('.spec__text-2 span').text(form.find('input[name="phone"]').val());
                        $(".not-work-time").trigger('click');
                    } else {
                        if (form.find('.messege-form').length > 0) {} else {}
                        /*
                        if(phone){
                        	form.append('<p class="rec__text messege-form">Менеджер свяжется с Вами в течение <span class="time-out">30 секунд</span>.</p>');
                        }else{
                        	form.append('<p class="rec__text messege-form">Спасибо, Ваша заявка принята.</p>');
                        }
                        */
                        $.fancybox.open({
                            href: "#popup-32"
                        }, {
                            autoSize: !1,
                            fitToView: !1,
                            width: "100%",
                            height: "auto",
                            margin: 0,
                            padding: 0,
                            closeSpeed: 0,
                            closeBtn: false,
                            helpers: {
                                overlay: {
                                    locked: !1
                                }
                            }
                        });
                        $('.js-close-popup').click(function() {
                            $.fancybox.close();
                        });

                        $('.messege-form').hide();
                        $('.messege-form').fadeIn(300);
                        var time_out = 1;
                        $("form").find("button").attr('disabled', 'disabled');
                        var intervalTimeOut = setInterval(function() {
                            if (time_out > 0) {
                                time_out -= 1;
                                var time = time_out + ' секунд';
                                if (((time_out % 10 == 2) || (time_out % 10 == 3) || (time_out % 10 == 4)) && !((time_out % 100 == 11) || (time_out % 100 == 12) || (time_out % 100 == 13) || (time_out % 100 == 14))) {
                                    time = time_out + ' секунд'
                                } else {
                                    if (time_out % 10 == 1) time = time_out + ' секунды';
                                    else time = time_out + ' секунд';
                                }
                                $('.time-out').text(time);
                            } else {
                                clearInterval(intervalTimeOut);
                                $("form").find("button").removeAttr('disabled');
                                $('.messege-form').fadeOut(300);
                            }
                        }, 1000);
                    }
                }
            });
        } else {
            console.log('submit form1');
            $.ajax({
                type: "POST",
                url: "/",
                data: {
                    action: 'add',
                    data: form.serializeArray(),
                    module: 'formcalback',
                },
                complete: function(response, textStatus) {
                    console.log(response);

                },
                success: function(response, textStatus) {
                    console.log('success');


                    var data = JSON.parse(response);
                    console.log(data['data']);
                    $(form).find('.phone_error').hide();
                    if ((data['data'] - 0) < 1) {
                        if ($(form).find('.phone_error').length < 1) {
                            $(form).prepend('<p class="phone_error" style="color:red; font-size:17px;"><b>Ошибка!</b><br> Вы указали некорректный номер телефона.<br>	Пожалуйста, введите Ваш номер еще раз.</p>');
                        } else {
                            $(form).find('.phone_error').show();
                        }
                    } else {

                        ga('send', 'event', 'form', 'submit');
                        if (1 + 1 == 4) {
                            /* data.data==101 */
                            $('#popup-10').find('.spec__text-2 span').text(form.find('input[name="phone"]').val());
                            $(".not-work-time").trigger('click');
                        } else {
                            if (form.find('.messege-form').length > 0) {} else {}

                            /*
                            	if(phone){
                            		form.append('<p class="rec__text messege-form">Менеджер свяжется с Вами в течение <span class="time-out">30 секунд</span>.</p>');
                            	}else{
                            		form.append('<p class="rec__text messege-form">Спасибо, Ваша заявка принята.</p>');
                            	}
                            	*/
                            $.fancybox.open({
                                href: "#popup-32"
                            }, {
                                autoSize: !1,
                                fitToView: !1,
                                width: "100%",
                                height: "auto",
                                margin: 0,
                                padding: 0,
                                closeSpeed: 0,
                                closeBtn: false,
                                helpers: {
                                    overlay: {
                                        locked: !1
                                    }
                                }
                            });
                            $('.js-close-popup').click(function() {
                                $.fancybox.close();
                            });

                            $('.messege-form').hide();
                            $('.messege-form').fadeIn(300);
                            $("form").find("button").attr('disabled', 'disabled');
                            var time_out = 1;
                            var intervalTimeOut = setInterval(function() {
                                if (time_out > 0) {
                                    time_out -= 1;
                                    var time = time_out + ' секунд';
                                    var time = time_out + ' секунд';
                                    if (((time_out % 10 == 2) || (time_out % 10 == 3) || (time_out % 10 == 4)) && !((time_out % 100 == 11) || (time_out % 100 == 12) || (time_out % 100 == 13) || (time_out % 100 == 14))) {
                                        time = time_out + ' секунд'
                                    } else {
                                        if (time_out % 10 == 1 && time_out != 11) time = time_out + ' секунды';
                                        else time = time_out + ' секунд';
                                    }
                                    $('.time-out').text(time);
                                } else {
                                    clearInterval(intervalTimeOut);
                                    $("form").find("button").removeAttr('disabled');
                                    $('.messege-form').fadeOut(300);
                                }
                            }, 1000);
                        }
                    }
                }
            });
        }
    });
    $('.js-form-1').click(function(e) {
        $('#popup-1').find('input[name="form_name"]').val(1);
    });
    $('.js-form-3').click(function(e) {
        $('#popup-1').find('input[name="form_name"]').val(3);
    });
    $('.js-form-4').click(function(e) {
        $('#popup-1').find('input[name="form_name"]').val(4);
    });
    $('.js-form-6').click(function(e) {
        $('#popup-1').find('input[name="form_name"]').val(6);
    });
    $('.js-form-7').click(function(e) {
        $('#popup-2').find('input[name="form_name"]').val(7);
    });
    $('.js-form-8').click(function(e) {
        $('#popup-1').find('input[name="form_name"]').val(8);
    });
    $('.js-form-9').click(function(e) {
        $('#popup-3').find('input[name="form_name"]').val(9);
    });
    var count_st0 = $('.st0').length - 1;
    var t_count = 0;
    $('.st0').each(function() {
        var detail = $(this).attr("id");
        detail = detail.substr(3);
        $(this).attr("data-detail", detail);
        t_count++;
        if (t_count >= count_st0) loadDataDetail = true;
    });
    setTimeout(function() {
        $('.vac-1').show();
        $(".vacantions").toggleSelected(1).trigger('refresh');
        $('.js-slider-2').slick('slickGoTo', 0);
    }, 3000);
    $('.js-popup-vac').click(function() {
        $('.vac-1').hide();
        $(".vacantions").toggleSelected(0).trigger('refresh');
    });
    $(".js-popup-2").fancybox({
        autoSize: !1,
        autoCenter: !1,
        fitToView: !1,
        width: "100%",
        height: "auto",
        margin: 0,
        padding: 0,
        closeSpeed: 0,
        helpers: {
            overlay: {
                locked: false
            }
        }
    });
    $(".js-popup-3").fancybox({
        autoSize: !1,
        fitToView: !1,
        width: "100%",
        height: "auto",
        margin: 10,
        padding: 0,
        closeSpeed: 0,
        helpers: {
            overlay: {
                locked: !1
            }
        }
    });
    $('input[name="email"]').focusout(function(e) {
        if ($(this).val().length > 0 && $(this).val() != '') {
            $('input[name="email"]').val($(this).val());
            setCookie('email', $(this).val());
        }
    })
    loadFormInCookie();
});

function scrollRefresh() {
    $(".jq-selectbox__dropdown").each(function() {
        $(this).find("li").length > 7 && $(this).find(".jq-scroll").mCustomScrollbar({
            horizontalScroll: !1,
            scrollButtons: {
                enable: !1
            },
            advanced: {
                updateOnContentResize: !0
            },
            advanced: {
                updateOnBrowserResize: !0
            },
            scrollInertia: 0,
            mouseWheelPixels: 30
        });
    });
}

var first_time = true;

function selectBrands(select) {

    var selected = select.value;
    setCookie('carbrends', selected);
    setCookie('carbrends_sel', selected);
    $.ajax({
        type: "POST",
        url: "/",
        data: "module=carmodel&action=load_in_option&carbrand=" + selected,
        success: function(response, textStatus) {
            $("select.brands").toggleSelected(selected).trigger('refresh');
            scrollRefresh();
            $(".js-slider-1").slick("slickGoTo", selected - 1);
            if (apend_akc_) {
                var name_brand = select.options[select.selectedIndex].innerHTML;
                $('.js-slider-3').slick('slickAdd', apend_akc_);
                var slide = $('.slide-apend-akc').data("slick-index");
                $(".js-slider-3").slick("slickGoTo", slide);
                $('.slide-apend-akc').find('.akc-brends').text(name_brand);
                $('.slide-apend-akc').data("hide", 2);
                $('.js-form-6').click(function(e) {
                    $('#popup-1').find('input[name="form_name"]').val(6);
                });
                apend_akc_ = '';
            }

            $('select.model').each(function() {
                $(this).find('option').remove().end().append(response);
            }).trigger('refresh');
            $("select.model").val('not');

            selectModels(document.getElementsByClassName('model')[1]);
        }
    });
}

function selectBrandsCookie(select) {

    var selected = select.value;
    setCookie('carbrends', selected);
    setCookie('carbrends_sel', selected);
    $.ajax({
        type: "POST",
        url: "/",
        data: "module=carmodel&action=load_in_option&carbrand=" + selected,
        success: function(response, textStatus) {

            $("select.brands").toggleSelected(selected).trigger('refresh');

            $('select.model').each(function() {
                $(this).find('option').remove().end().append(response);
            }).trigger('refresh');
            scrollRefresh();
            $(".js-slider-1").slick("slickGoTo", selected - 1);
            if (getCookie('carmodel')) {
                if ($(".model option:selected").length < 1) {
                    $(".model").val(getCookie('carmodel')).trigger('refresh');
                }

                $(".model").val(getCookie('carmodel')).trigger('refresh'); // its meybe delete
                selectModels(document.getElementsByClassName('model')[1]);
            }
        }
    });
}

function selectBrandsUrl(select, model) {

    var selected = select;
    setCookie('carbrends', selected);
    setCookie('carbrends_sel', selected);
    $.ajax({
        type: "POST",
        url: "/",
        data: "module=carmodel&action=load_in_option&carbrand=" + selected,
        success: function(response, textStatus) {
            $("select.brands").toggleSelected(selected).trigger('refresh');
            $('select.model').each(function() {
                $(this).find('option').remove().end().append(response);
            }).trigger('refresh');
            scrollRefresh();
            if (model) {
                $("select.model").val(model);
                selectModels(document.getElementsByClassName('model')[1]);
            } else {
                if (getCookie('carmodel')) {

                    $("select.model").val(model);
                    selectModels(document.getElementsByClassName('model')[1]);
                }
            }
        }
    });
}

function loadCarModelInCanvas(model) {
    console.log(model);

    loadDataDetail = false;
    $.ajax({
        type: "POST",
        url: "/",
        data: "module=carmodel&action=load_in_canvas&carmodel=" + model,
        success: function(response, textStatus) {
            if (response) $(".cars").html(response);
            var count_st0 = $('.st0').length - 1;
            var t_count = 0;
            $('.st0').each(function() {
                var detail = $(this).attr("id");
                detail = detail.substr(3);
                $(this).attr("data-detail", detail);
                t_count++;
                if (t_count >= count_st0) loadDataDetail = true;
            });
            selectDetail();
            $(".option").hide();
            $("#calc-before-select-option").show();
            var interval = setInterval(function() {
                if (loadDataDetail) {
                    for (var key in sevvise_detail) {
                        for (var keyb in sevvise_detail[key]) {
                            getDetailPrice(keyb, key, false, false, true);
                            $('.st0[data-detail=' + keyb + ']').addClass("active");
                            $('.st0[data-detail=' + keyb + ']').data("active", "1");
                        }
                    }
                    clearInterval(interval);
                }
            }, 200);
        }
    });
}

function scrolToCalc(select) {
    var par = $(select).parent().parent();
    if (viewport().width < 767 && par.hasClass("calc__select")) {
        $('body,html').animate({
            scrollTop: $("#scroll-4").offset().top
        }, 1500);
    }
}



function selectModels(select) {
    if (typeof pageservicemodel_noform !== 'undefined' && pageservicemodel_noform == 1) {

    } else {}
    /*
    	 if ( $(".model option:selected").length > 0 ){
    		var selected=$("select.model").val();
    		
    	} else {
    		var selected=select.value;
    	}
    */
    var selected = select.value;


    setCookie('carmodel', selected); 
    setCookie('carmodel_sel', selected);
    $.ajax({
        type: "POST",
        url: "",
        data: "module=carpricelistdetail&action=load_in_option&carmodel=" + selected + "&one_page_load=" + one_page_load,
        success: function(response, textStatus) {
            $('select.model').toggleSelected(selected).trigger('refresh');
            $('#showlistdetail').html(response);
            slider2Init();
            loadCarModelInCanvas(selected);
            scrollRefresh();
        }
    });

}

function loadCalculateInCookie() {
    console.log('load');
    if (getCookie('calculate')) {
        sevvise_detail = JSON.parse(getCookie('calculate'));
        var count = 0;
        var interval = setInterval(function() {
            if (loadDataDetail) {
                for (var key in sevvise_detail) {
                    for (var keyb in sevvise_detail[key]) {
                        if (key == 12 && (keyb == 8 || keyb == 9)) {
                            if (keyb in sevvise_detail[8]) getDetailPrice(keyb, key, false, false, true);
                            else getDetailPrice(keyb, 22, false, true, true);
                        } else getDetailPrice(keyb, key, false, false, true);
                        $('.st0[data-detail=' + keyb + ']').addClass("active");
                        $('.st0[data-detail=' + keyb + ']').data("active", "1");
                        if (key == 8 && (keyb in sevvise_detail[9] || keyb in sevvise_detail[10] || keyb in sevvise_detail[11] || keyb in sevvise_detail[12])) {} else if (key == 12 && !(keyb in sevvise_detail[8]) && (keyb == 8 || keyb == 9)) {
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('.filter__button.js-filter-button').trigger('click');
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('.filter__button.js-filter-button').css("color", "#00FFFF");
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('input[value=22]').toggleChecked(true).trigger('refresh');
                        } else {
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('.filter__button.js-filter-button').trigger('click');
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('.filter__button.js-filter-button').css("color", "#00FFFF");
                            $('.js-filter-wrap[data-detail=' + keyb + ']').find('input[value=' + key + ']').toggleChecked(true).trigger('refresh');
                        }
                        count++;
                    }
                }
                clearInterval(interval);
            }
        }, 200);
        if (count > 0) {
            $('.js-action-all-sell').data('active', '1');
            $('.js-action-all-sell').text('Снять выделение');
        }
    }
    if (getCookie('service')) {
        service = JSON.parse(getCookie('service'));
        if (service.mat_krasc == true) {
            $('.mat_krasc_input').parent().parent().parent().addClass('active');
            $(".mat_krasc_input").toggleChecked(true).trigger('refresh');
        }
        if (service.geometry == true) {
            $('.geometry_input').parent().parent().parent().addClass('active');
            $(".geometry_input").toggleChecked(true).trigger('refresh');
        }
        if (service.not_work == true) {
            $('.not_work_input').parent().parent().parent().addClass('active');
            $(".not_work_input").toggleChecked(true).trigger('refresh');
        }
    }
    recalcAll();
}

function loadCalculateInUrl(sevvise_detail_url) {
    console.log('load in url');
    if (!(8 in sevvise_detail_url)) sevvise_detail_url[8] = {};
    if (!(9 in sevvise_detail_url)) sevvise_detail_url[9] = {};
    if (!(10 in sevvise_detail_url)) sevvise_detail_url[10] = {};
    if (!(11 in sevvise_detail_url)) sevvise_detail_url[11] = {};
    if (!(12 in sevvise_detail_url)) sevvise_detail_url[12] = {};
    if (!(13 in sevvise_detail_url)) sevvise_detail_url[13] = {};
    var count = 0;
    var interval = setInterval(function() {
        if (loadDataDetail) {
            for (var key in sevvise_detail_url) {
                for (var keyb in sevvise_detail_url[key]) {
                    if (key == 12 && (keyb == 8 || keyb == 9)) {
                        if (keyb in sevvise_detail_url[8]) getDetailPrice(keyb, key, false, false, true);
                        else getDetailPrice(keyb, 22, false, true, true);
                    } else getDetailPrice(keyb, key, false, false, true);
                    $('.st0[data-detail=' + keyb + ']').addClass("active");
                    $('.st0[data-detail=' + keyb + ']').data("active", "1");
                    if (key == 8 && (keyb in sevvise_detail_url[9] || keyb in sevvise_detail_url[10] || keyb in sevvise_detail_url[11] || keyb in sevvise_detail_url[12])) {} else {
                        $('.js-filter-wrap[data-detail=' + keyb + ']').find('input[value=' + key + ']').toggleChecked(true).trigger('refresh');
                        $('.js-filter-wrap[data-detail=' + keyb + ']').find('.filter__button.js-filter-button').trigger('click');
                    }
                    count++;
                }
            }
            clearInterval(interval);
        }
    }, 200);
    if (count > 0) {
        $('.js-action-all-sell').data('active', '1');
        $('.js-action-all-sell').text('Снять выделение');
    }
    recalcAll();
}

function loadBrendsAndModelsInCookie() {
    if (getCookie('carbrends')) {
        $(".brands").val(getCookie('carbrends'));
        selectBrandsCookie(document.getElementsByClassName('brands')[0]);
    }
}

function loadFormInCookie() {
    if (getCookie('phone')) {
        $('input[name="phone"]').val(getCookie('phone'));
    }
    if (getCookie('email')) {
        if (getCookie('email') != '') $('input[name="email"]').val(getCookie('email'));
    }
}

function selectVacantions(select) {
    var selected = select.value;
    if (selected == 0) {
        $('.vacantion').fadeOut(300);
        $('.fancybox-opened').removeClass('fancybox-top0');

    } else {
        $('.fancybox-opened').addClass('fancybox-top0');
        $("html, body").animate({
            scrollTop: "0px"
        }, 0);
        $('.vacantion').hide();
        $('.vac-' + selected).fadeIn(300);
    }

}
