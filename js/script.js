"use strict";

// начало - полифил для edge
(function (ELEMENT) {
  ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

  ELEMENT.closest = ELEMENT.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;

    if (!this.parentElement) {
      return null;
    } else return this.parentElement.closest(selector);
  };
})(Element.prototype); // конец - полифил для edge


window.onload = function () {
  var supportsTouch = ('ontouchstart' in document.documentElement);

  if (document.querySelector("[data-canvas-rel]")) {
    var removeMouseMove = function removeMouseMove(e) {
      control_area.removeEventListener("mousemove", dragZone);
      document.body.removeEventListener("mouseup", removeMouseMove);
    };

    var removeTouchMove = function removeTouchMove(e) {
      control_area.removeEventListener("touchmove", dragZone);
      document.body.removeEventListener("touchend", removeTouchMove);
    };

    var dragZone = function dragZone(e) {
      var x_new = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
      var y_new = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      var canvas_y = canvas_pos.top + y;
      var canvas_x = canvas_pos.left + x;
      var circle_x;
      var circle_y;

      if (supportsTouch) {
        circle_x = +e.changedTouches[0].pageX - +canvas_x;
        circle_y = +e.changedTouches[0].pageY - +canvas_y;
      } else {
        circle_x = +e.pageX - +canvas_x;
        circle_y = +e.pageY - +canvas_y;
      }

      currentCoord.x = circle_x;
      currentCoord.y = circle_y;

      if (!supportsTouch) {
        if (e.pageX >= canvas_x && e.pageX <= canvas_x + canvas.width && e.pageY >= canvas_y && e.pageY <= canvas_y + canvas.height) {
          cursorInZone();
        } else {
          cursorOutZone();
        }
      } else {
        if (e.changedTouches[0].pageX >= canvas_x && e.changedTouches[0].pageX <= canvas_x + canvas.width && e.changedTouches[0].pageY >= canvas_y && e.changedTouches[0].pageY <= canvas_y + canvas.height) {
          cursorInZone();
        } else {
          cursorOutZone();
        }
      }

      function cursorInZone() {
        if (window.innerWidth <= 1230) {
          control.style.left = circle_x + "px";
          control.style.top = height_pic / 2 + "px";
        } else {
          control.style.left = currentCoord.x + "px";
          control.style.top = currentCoord.y + "px";
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        ctx.beginPath();

        if (window.innerWidth <= 1230) {
          ctx.rect(circle_x, 0, canvas_width, canvas_height);
          ctx.fill();
        } else {
          ctx.arc(currentCoord.x, currentCoord.y, radius, 0, 2 * Math.PI, true);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
        ctx.closePath();
      }

      function cursorOutZone() {
        arcCoord.x = width_pic / 2 + 44;
        arcCoord.y = height_pic / 2 - 42;
        currentCoord.x = width_pic / 2 + 44;
        currentCoord.y = height_pic / 2 - 42;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        ctx.beginPath();

        if (window.innerWidth <= 1230) {
          control.style.left = width_pic / 2 + "px";
          control.style.top = height_pic / 2 + "px";
          ctx.rect(canvas_width / 2, 0, canvas_width, canvas_height);
          ctx.fill();
        } else {
          control.style.left = arcCoord.x + "px";
          control.style.top = arcCoord.y + "px";
          ctx.arc(arcCoord.x, arcCoord.y, radius, 0, 2 * Math.PI, true);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
        ctx.closePath();
        control_area.removeEventListener("mousemove", dragZone);
        document.body.removeEventListener("mouseup", removeMouseMove);
      }
    };

    var width_pic = document.getElementById("under-canvas").offsetWidth;
    var height_pic = document.getElementById("under-canvas").offsetHeight;
    var control = document.querySelector("[data-canvas-control]");
    var control_area = document.querySelector("[data-canvas-area]");
    var radius = 150;
    var hover_radius = radius;
    var arcCoord = {
      x: width_pic / 2 + 44,
      y: height_pic / 2 - 42
    };
    var currentCoord = {
      x: width_pic / 2 + 44,
      y: height_pic / 2 - 42
    };

    if (window.innerWidth <= 1670) {
      radius = 125;
      hover_radius = radius;
    }

    var x = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    var y = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var canvas = document.getElementById("car-canvas");
    canvas.style.width = width_pic + "px";
    canvas.style.height = height_pic + "px";
    var canvas_width = width_pic;
    var canvas_height = height_pic;
    var canvas_pos = canvas.getBoundingClientRect();
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    control_area.style.width = width_pic + "px";
    var ctx = canvas.getContext("2d");
    var img = new Image();

    img.onload = function () {
      ctx.save();

      if (window.innerWidth <= 1230) {
        ctx.rect(canvas_width / 2, 0, canvas_width, canvas_height);
        ctx.fill();
      } else {
        ctx.arc(arcCoord.x, arcCoord.y, radius, 0, 2 * Math.PI, true);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
    };

    control.style.opacity = "1";

    if (window.innerWidth <= 1230) {
      control.style.left = width_pic / 2 + "px";
      control.style.top = height_pic / 2 + "px";
    } else {
      control.style.left = arcCoord.x + "px";
      control.style.top = arcCoord.y + "px";
    }

    img.src = canvas.closest("[data-canvas-rel]").querySelector("[data-img-src]").getAttribute("data-img-src");
    window.addEventListener("resize", function () {
      width_pic = document.getElementById("under-canvas").offsetWidth;
      height_pic = document.getElementById("under-canvas").offsetHeight;
      canvas.style.width = width_pic + "px";
      canvas.style.height = height_pic + "px";
      canvas_width = width_pic;
      canvas_height = height_pic;
      canvas_pos = canvas.getBoundingClientRect();
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      control_area.style.width = width_pic + "px";
      arcCoord.x = width_pic / 2 + 44;
      arcCoord.y = height_pic / 2 - 42;
      currentCoord.x = width_pic / 2 + 44;
      currentCoord.y = height_pic / 2 - 42;

      if (window.innerWidth <= 1670) {
        radius = 125;
        hover_radius = radius;
      } else {
        radius = 150;
        hover_radius = radius;
      }

      ctx.save();

      if (window.innerWidth <= 1230) {
        control.style.left = width_pic / 2 + "px";
        control.style.top = height_pic / 2 + "px";
        ctx.rect(canvas_width / 2, 0, canvas_width, canvas_height);
        ctx.fill();
      } else {
        control.style.left = arcCoord.x + "px";
        control.style.top = arcCoord.y + "px";
        ctx.arc(arcCoord.x, arcCoord.y, radius, 0, 2 * Math.PI, true);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
    });
    control.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    if (supportsTouch) {
      control.addEventListener("touchstart", function (e) {
        control_area.addEventListener("touchmove", dragZone);
        document.body.addEventListener("touchend", removeTouchMove);
        var pad_right = window.innerWidth - document.documentElement.clientWidth;
        document.body.classList.add("overflow-hidden");
        document.body.style.paddingRight = pad_right + "px";

        if (document.querySelector(".mainHeader.__sticky")) {
          document.querySelector(".mainHeader.__sticky").style.paddingRight = pad_right + "px";
        }
      });
      control.addEventListener("touchend", function () {
        control_area.removeEventListener("touchmove", dragZone);
        document.body.removeEventListener("touchend", removeTouchMove);
        document.body.classList.remove("overflow-hidden");
        document.body.style.paddingRight = "0";

        if (document.querySelector(".mainHeader.__sticky")) {
          document.querySelector(".mainHeader.__sticky").style.paddingRight = "0";
        }
      });
    } else {
      control.addEventListener("mousedown", function (e) {
        control_area.addEventListener("mousemove", dragZone);
        document.body.addEventListener("mouseup", removeMouseMove);
      });
      control_area.addEventListener("mouseleave", function () {
        control_area.removeEventListener("mousemove", dragZone);
        document.body.removeEventListener("mouseup", removeMouseMove);
      });
    }

    if (window.innerWidth > 1230 && !supportsTouch) {
      control.addEventListener("mouseenter", function () {
        if (window.innerWidth > 1230 && !supportsTouch) {
          var tmp = radius;
          hover_radius = radius + radius * 0.2;

          var _loop = function _loop(i) {
            setTimeout(function () {
              ctx.globalCompositeOperation = "source-over";
              ctx.clearRect(0, 0, canvas_width, canvas_height);
              ctx.beginPath();
              ctx.arc(currentCoord.x, currentCoord.y, i, 0, 2 * Math.PI, true);
              ctx.fill();
              ctx.globalCompositeOperation = "source-in";
              ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
              ctx.closePath();
            }, 100);
          };

          for (var i = radius; i <= hover_radius; i++) {
            _loop(i);
          }

          radius = hover_radius;
          hover_radius = tmp;
        }
      });
      control.addEventListener("mouseleave", function () {
        if (window.innerWidth > 1230 && !supportsTouch) {
          var tmp = radius;

          var _loop2 = function _loop2(i) {
            setTimeout(function () {
              ctx.globalCompositeOperation = "source-over";
              ctx.clearRect(0, 0, canvas_width, canvas_height);
              ctx.beginPath();
              ctx.arc(currentCoord.x, currentCoord.y, i, 0, 2 * Math.PI, true);
              ctx.fill();
              ctx.globalCompositeOperation = "source-in";
              ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
              ctx.closePath();
            }, 100);
          };

          for (var i = radius; i > hover_radius; i--) {
            _loop2(i);
          }

          radius = hover_radius;
          hover_radius = tmp;
        }
      });
    }
  }
};

$(document).ready(function () {
  if (window.innerWidth <= 1230) {
    $("#banner-btn").appendTo($("#adapt-btn"));
  }

  if (window.innerWidth <= 875) {
    $("#banner-product").appendTo($("#adapt-product"));
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 1230) {
      $("#banner-btn").appendTo($("#adapt-btn"));
    } else {
      $("#banner-btn").appendTo($("#banner-info"));
    }

    if (window.innerWidth <= 875) {
      $("#banner-product").appendTo($("#adapt-product"));
    } else {
      $("#banner-product").appendTo($("#banner-product-rel"));
    }
  });
});
$(document).ready(function () {
  var arrow_ico = '<svg viewBox="0 0 24 11.4"><path d="M18.3,11.4,16.9,10l3.3-3.3H0v-2H20.2L16.9,1.4,18.3,0,24,5.7Z"/></svg>';
  var arrow_prev = '<button class="sliderArrow sliderArrow-prev"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  var arrow_next = '<button class="sliderArrow sliderArrow-next"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  $(".videoBox-slider").each(function () {
    var _this = $(this);

    $(this).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      swipeToSlide: true,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      responsive: [{
        breakpoint: 1231,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-video-ctrl]").find("[data-video-arrow]")
        }
      }]
    });
  });
  $(".brandList-slider").each(function () {
    var _this = $(this);

    $(this).slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      dots: false,
      infinite: false,
      arrows: true,
      swipeToSlide: true,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-desktop-arrow]"),
      responsive: [{
        breakpoint: 1231,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 875,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]")
        }
      }]
    });
  });
  $(".bannerList-slider").each(function () {
    var _this = $(this);

    $(this).slick({
      dots: false,
      infinite: false,
      arrows: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      swipeToSlide: true,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-desktop-arrow]"),
      responsive: [{
        breakpoint: 876,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]")
        }
      }]
    });
  });
  $(".customScrollBox").mCustomScrollbar({});
  $("body").on("click", "[data-ct-btn]", function () {
    var start_offset_top = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var this_txt = $(this).find("[data-ct-txt]").text();
    var new_text = $(this).find("[data-ct-txt]").attr("data-ct-txt");
    $(this).find("[data-ct-txt]").text(new_text);
    $(this).find("[data-ct-txt]").attr("data-ct-txt", this_txt);

    if (!$(this).hasClass("__active")) {
      $(this).addClass("__active");
      $(this).parents("[data-ct-area]").find("[data-ct]").addClass("__active"); // window.scrollTo(0, start_offset_top);

      document.documentElement.scrollTop = start_offset_top;
    } else {
      $(this).removeClass("__active");
      $(this).parents("[data-ct-area]").find("[data-ct]").removeClass("__active");
    }
  });
  $("body").on("click", "[data-toggle-status]", function () {
    $(this).toggleClass("__active");
  });
  $("body").on("focus", "[data-focus-inp]", function () {
    $(this).parents("[data-focus-rel]").addClass("__active");
  });
  tippy('[data-tooltip]', {
    trigger: 'click'
  });
  $("body").on("click", "[data-tooltip]", function (e) {
    e.stopPropagation();
    $(".tippy-content").mCustomScrollbar({});
  });
  $("body").on("click", "[data-cls-element]", function (e) {
    $(this).parents("[data-element]").removeClass("__active");
    $("[data-overlay]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  $("body").on("mousedown touchend", "[data-overlay]", function () {
    $(this).removeClass("__active");
    $("[data-element]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  $("body").on("keydown", function (e) {
    if ($("[data-overlay]").hasClass("__active")) {
      if (e.code == "Escape") {
        $("[data-overlay]").removeClass("__active");
        $("[data-element]").removeClass("__active");
        $("body").removeClass("overflow-hidden");
        $("body").css("padding-right", "0");
        $(".mainHeader.__sticky").css("padding-right", "0");
      }
    }
  });
  $("[data-rait]").each(function () {
    var width_el = +$(this).find("[data-rait-point]").outerWidth();
    var this_value = +$(this).attr("data-rait");
    var fill_star = +Math.floor(this_value);
    var part_star = this_value - fill_star;
    var rect_val = (width_el * part_star).toFixed();
    var rect = "rect(auto, " + rect_val + "px, auto, 0)";
    $(this).find("[data-rait-point]").each(function (index) {
      if (index <= fill_star) {
        $(this).addClass("__fill-star");
      }

      if (index == fill_star) {
        $(this).find("[data-rait-fill]").css("clip", rect);
      }
    });
  });
});
window.addEventListener("load", function () {
  // добавление ошибки
  $("[data-error]").each(function (index, el, array) {
    var text = $(this).attr("data-error-text") ? $(this).attr("data-error-text") : "Сообщение об ошибке выводится здесь";
    var pos_top = +$(this).offset().top - 3;
    var pos_left = +$(this).offset().left - 3;
    var el_width = +$(this).outerWidth() + 6;
    var error = document.createElement('div');
    error.className = "errorBox";
    error.setAttribute("data-error-id", index);
    error.innerHTML = "<div class='errorBox__text'>" + text + "</div>";
    error.style.width = el_width + "px";
    error.style.top = pos_top + "px";
    error.style.left = pos_left + "px";
    $(this).attr("data-error", index);
    $(this).addClass("__error");
    document.body.append(error);
  }); // удаление ошибки

  $("body").on("input", "[data-error]", function () {
    if ($(this).val() == "") {
      var this_id = $(this).attr("data-error");
      $(this).removeAttr("data-error");
      $(this).removeClass("__error");
      $("[data-error-id=" + this_id + "]").remove();
    }
  });
  $(window).on("resize", function () {
    $("[data-error]").each(function () {
      var this_id = $(this).attr("data-error");
      $(this).removeAttr("data-error");
      $(this).removeClass("__error");
      $("[data-error-id=" + this_id + "]").remove();
    });
  });
  var Russian = {
    weekdays: {
      shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      longhand: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    },
    months: {
      shorthand: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      longhand: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    },
    firstDayOfWeek: 1,
    ordinal: function ordinal() {
      return "";
    },
    rangeSeparator: " — ",
    weekAbbreviation: "Нед.",
    scrollTitle: "Прокрутите для увеличения",
    toggleTitle: "Нажмите для переключения",
    amPM: ["ДП", "ПП"],
    yearAriaLabel: "Год",
    time_24hr: true
  };
  var btn_next = "<button type=\"button\" class=\"calendarBtn calendarBtn-next\">\n                        <span class=\"calendarBtn__inner\">\n\t\t\t\t\t\t\t<svg><use xlink:href=\"../icons/stack/icons.svg#dropdown\"></use></svg>\n                        </span>\n                    </button>";
  var btn_prev = "<button type=\"button\" class=\"calendarBtn calendarBtn-prev\">\n                        <span class=\"calendarBtn__inner\">\n\t\t\t\t\t\t\t<svg><use xlink:href=\"../icons/stack/icons.svg#dropdown\"></use></svg>\n                        </span>\n                    </button>";

  if (document.querySelector("[data-personal-calendar]")) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-personal-calendar]'), function (el) {
      var parEl = el.closest('[data-calendar-wrap]').querySelector('[data-calendar-rel]');
      var site_calendar = flatpickr(el, {
        "locale": Russian,
        mode: "range",
        position: "below",
        monthSelectorType: "static",
        nextArrow: btn_next,
        prevArrow: btn_prev,
        altFormat: "d.m.Y",
        dateFormat: "d.m.Y",
        conjunction: " - ",
        appendTo: parEl,
        onOpen: function onOpen(selectedDates, dateStr, instance) {
          this.input.closest("[data-calendar-wrap]").classList.add("__active");
        },
        onClose: function onClose(selectedDates, dateStr, instance) {
          this.input.closest("[data-calendar-wrap]").classList.remove("__active");
        }
      });
    });
  }

  $("body").on("click", "[data-input-collapsed-open]", function () {
    var this_rel = $(this).parents("[data-input-collapsed]");
    var this_dd = $(this).parents("[data-input-collapsed-content]");

    if ($(this).hasClass("__active")) {
      this_rel.removeClass("__active");
      this_rel.find("[data-input-collapsed-open]").removeClass("__active");
    } else {
      this_rel.addClass("__active");
      this_rel.find("[data-input-collapsed-open]").addClass("__active");
    }
  });
  $("body").on("change", "[data-input-collapsed-point]", function () {
    var this_rel = $(this).parents("[data-input-collapsed]");
    var this_inp = this_rel.find("[data-input-collapsed-main]");
    var this_cb_list = this_rel.find("[data-input-collapsed-point]");
    var list_length = this_cb_list.length;
    var last_checked_point;
    var check_counter = 0;
    var text = "Все";
    this_cb_list.each(function () {
      console.log($(this), $(this).prop("checked"));

      if ($(this).prop("checked")) {
        check_counter = check_counter + 1;
        last_checked_point = $(this);
      }
    });
    console.log(check_counter, list_length, text);

    if (check_counter == 0 || list_length == check_counter) {
      text = "Все";
    } else if (check_counter == 1) {
      console.log(last_checked_point.parents(".filterPoint").find(".filterPoint__text"));
      text = last_checked_point.parents(".filterPoint").find(".filterPoint__text")[0].innerText;
    } else if (check_counter < 5) {
      text = "\u0412\u044B\u0431\u0440\u0430\u043D\u043E ".concat(check_counter, " \u0441\u0442\u0430\u0442\u0443\u0441\u0430");
    } else {
      text = "\u0412\u044B\u0431\u0440\u0430\u043D\u043E ".concat(check_counter, " \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u0432");
    }

    this_inp.val(text);
  });
  $("[type='tel']").inputmask("+7 (999) 999 99 99", {
    "clearIncomplete": true,
    "onincomplete": function onincomplete() {
      if (this.value == "") {
        this.setAttribute("placeholder", "+7 (950) 375 22 98");
      }
    }
  });
  $("[type='tel']").attr("placeholder", "+7 (950) 375 22 98"); // пример для тестирования, можно удалить

  if (document.querySelector("[data-example-input]")) {
    document.querySelector("[data-example-input]").addEventListener("click", function () {
      this.closest("[data-example-city]").classList.add("__active");
      console.log('focus');
    });
    document.body.addEventListener("click", function (e) {
      if (!e.target.closest("[data-example-city]")) {
        console.log('blur');
        document.querySelector("[data-example-city]").classList.remove("__active");
      }
    });
  }
});
$(document).ready(function () {
  var supportsTouch = ('ontouchstart' in document.documentElement);

  function openCatalogMenu() {
    var this_id = +$(this).attr("data-catalog-point");
    var this_deep = +$(this).closest("[data-catalog-deep]").attr("data-catalog-deep");
    $(this).parents("[data-catalog-main]").find("[data-catalog-deep]").each(function () {
      if (+$(this).attr("data-catalog-deep") - 1 == this_deep && +$(this).attr("data-catalog-id") == this_id) {
        $(this).addClass("__active");
      } else if (+$(this).attr("data-catalog-deep") - 1 == this_deep && +$(this).attr("data-catalog-id") != this_id) {
        $(this).removeClass("__active");
        $(this).find("[data-catalog-point]").removeClass("__active");
      } else if (+$(this).attr("data-catalog-deep") == this_deep) {
        $(this).find("[data-catalog-point]").removeClass("__active");
      } else if (+$(this).attr("data-catalog-deep") - 1 > this_deep) {
        $(this).removeClass("__active");
        $(this).find("[data-catalog-point]").removeClass("__active");
      }
    });
    $(this).addClass("__active");
  }

  $("body").on("input", "[data-search-input]", function () {
    if ($(this).val() != "") {
      $(this).parents("[data-search-main]").addClass("__active");
    } else {
      $(this).parents("[data-search-main]").removeClass("__active");
    }
  });
  $("body").on("click", "[data-search-cls]", function () {
    $(this).parents("[data-search-main]").find("[data-search-input]").val("");
    $(this).parents("[data-search-main]").removeClass("__active");
  });

  if (!supportsTouch) {
    $("body").on("mouseenter", "[data-toggle-btn]", function () {
      $(this).parents("[data-toggle-rel]").addClass("__active");
    });
    $("body").on("mouseleave", "[data-toggle-rel]", function () {
      $(this).removeClass("__active");
    });

    if ($(window).outerWidth() > 1150) {
      $("body").on("mouseenter", "[data-catalog-point]", openCatalogMenu);
      $("body").on("mouseleave", "[data-catalog-deep]", function (e) {
        if (!e.relatedTarget.closest("[data-catalog-deep]")) {
          $(this).parents("[data-catalog-main]").find("[data-catalog-deep]").removeClass("__active");
          $(this).parents("[data-catalog-main]").find("[data-catalog-point]").removeClass("__active");
        }
      });
    }
  }

  if ($(window).outerWidth() <= 1150) {
    $("body").on("click touchend", "[data-catalog-point]", function (e) {
      if (+$(this).closest("[data-catalog-deep]").attr("data-catalog-deep") != 3) {
        e.preventDefault();
      }
    });
    $("body").on("click touchend", "[data-catalog-point]", openCatalogMenu);
  }

  $("body").on("click", "[data-catalog-back]", function () {
    var this_id = $(this).closest("[data-catalog-deep]").attr("data-catalog-id");
    $(this).closest("[data-catalog-deep]").removeClass("__active");
    $(this).closest("[data-catalog-main]").find("[data-catalog-point=" + this_id + "]").removeClass("__active");
  });
  $("body").on("click", "[data-toggle-btn]", function () {
    if ($(this).parents("[data-toggle-rel]").hasClass("__active")) {
      $(this).parents("[data-toggle-rel]").removeClass("__active");

      if (supportsTouch) {
        $("[data-catalog-overlay]").removeClass("__active");
        $("body").removeClass("overflow-hidden");
        $("body").css("padding-right", "0");
        $(".mainHeader.__sticky").css("padding-right", "0");
      }
    } else {
      $(this).parents("[data-toggle-rel]").addClass("__active");

      if (supportsTouch) {
        $("[data-catalog-overlay]").addClass("__active");
        var pad_right = window.innerWidth - document.documentElement.clientWidth;
        $("body").addClass("overflow-hidden");
        $("body").css("padding-right", pad_right + "px");
        $(".mainHeader.__sticky").css("padding-right", pad_right + "px");
      }
    }
  });
  $("body").on("click", "[data-catalog-btn]", function () {
    if ($(this).parents("[data-catalog-rel]").hasClass("__active")) {
      $(this).parents("[data-catalog-rel]").removeClass("__active");
      $(this).removeClass("__active");
      $("[data-catalog-overlay]").removeClass("__active");
      $("body").removeClass("overflow-hidden");
      $("body").css("padding-right", "0");
      $(".mainHeader.__sticky").css("padding-right", "0");
    } else {
      $(this).parents("[data-catalog-rel]").addClass("__active");
      $(this).addClass("__active");
      $("[data-catalog-overlay]").addClass("__active");
      var pad_right = window.innerWidth - document.documentElement.clientWidth;
      $("body").addClass("overflow-hidden");
      $("body").css("padding-right", pad_right + "px");
      $(".mainHeader.__sticky").css("padding-right", pad_right + "px");
    }
  });
  $("body").on("click", "[data-rel-cls]", function (e) {
    $(this).parents("[data-toggle-rel]").removeClass("__active");
    $("[data-catalog-overlay]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  $("body").on("click", "[data-catalog-cls]", function (e) {
    $("[data-catalog-overlay]").removeClass("__active");
    $("[data-catalog-rel]").removeClass("__active");
    $("[data-catalog-btn]").removeClass("__active");
    $("[data-catalog-rel]").find("[data-catalog-deep]").removeClass("__active");
    $("[data-catalog-rel]").find("[data-catalog-point]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  $("body").on("mousedown", "[data-catalog-overlay]", function (e) {
    $("[data-toggle-rel]").removeClass("__active");
    $(this).removeClass("__active");
    $("[data-catalog-rel]").removeClass("__active");
    $("[data-catalog-btn]").removeClass("__active");
    $("[data-catalog-rel]").find("[data-catalog-deep]").removeClass("__active");
    $("[data-catalog-rel]").find("[data-catalog-point]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  var is_move = false;

  function movEl() {
    if ($(window).outerWidth() < 876 && !is_move) {
      $("[data-header-mobile-top]").prepend($("[data-move-logo]"));
      $("[data-header-mobile-bot]").prepend($("[data-move-search]"));
      is_move = true;
    } else if ($(window).outerWidth() >= 876 && is_move) {
      $("[data-header-desktop-bot]").prepend($("[data-move-search]"));
      $("[data-header-desktop-bot]").prepend($("[data-move-logo]"));
      is_move = false;
    }
  }

  movEl();
  $(window).on("resize", function () {
    movEl();
  });
  $("body").on("click", "[data-open-menu]", function () {
    if ($(this).hasClass("__active")) {
      $("#menu-mobile").removeClass("__active");
      $(this).removeClass("__active");
    } else {
      $("#menu-mobile").addClass("__active");
      $(this).addClass("__active");
    }
  });
  $("body").on("click", "[data-menu-close]", function () {
    $("#menu-mobile").removeClass("__active");
    $("[data-open-menu]").removeClass("__active");
  }); // sticky header 

  var start_offset_top = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  var start_pos = document.getElementById("sticky-header").getBoundingClientRect().top + start_offset_top;
  var start_pos__main = document.getElementById("main-header").getBoundingClientRect().top + start_offset_top;

  if (window.innerWidth < 876) {
    window.addEventListener('scroll', function () {
      if (window.innerWidth < 876) {
        var offset_top = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var sticky_header = document.getElementById("sticky-header");
        var header_height = sticky_header.offsetHeight;

        if (start_pos <= offset_top) {
          document.querySelector('.siteContent').style.paddingTop = header_height + "px";
          sticky_header.classList.add('__sticky');
        } else {
          document.querySelector('.siteContent').style.paddingTop = "0";
          sticky_header.classList.remove('__sticky');
        }
      }
    });
  } else {
    window.addEventListener('scroll', function () {
      if (window.innerWidth >= 876) {
        var offset_top = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var sticky_header = document.getElementById("main-header");
        var header_height = sticky_header.offsetHeight;

        if (offset_top > 0) {
          document.querySelector('.siteContent').style.paddingTop = header_height + "px";
          sticky_header.classList.add('__sticky');
        } else {
          document.querySelector('.siteContent').style.paddingTop = "0";
          sticky_header.classList.remove('__sticky');
        }
      }
    });
  }

  var startScroll_main = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  window.addEventListener('scroll', function () {
    var curScroll = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var direction;

    if (curScroll < startScroll_main) {
      direction = "Up";
      document.body.classList.add("__window-up");
    } else {
      direction = "down";
      document.body.classList.remove("__window-up");
    }

    startScroll_main = curScroll;
  });
});
$(document).ready(function () {
  $("body").on("click", "[data-list-open]", function (e) {
    if ($(window).outerWidth() <= 576) {
      e.preventDefault();

      if ($(this).hasClass("__active")) {
        $(this).removeClass("__active");
        $(this).closest("[data-list-rel]").removeClass("__active");
      } else {
        $(this).addClass("__active");
        $(this).closest("[data-list-rel]").addClass("__active");
      }
    }
  });
  $("body").on("click", "[data-to-top]", function (e) {
    $('body,html').animate({
      scrollTop: 0
    }, 400);
  });
});
$(document).ready(function () {
  var arrow_ico = '<svg viewBox="0 0 24 11.4"><path d="M18.3,11.4,16.9,10l3.3-3.3H0v-2H20.2L16.9,1.4,18.3,0,24,5.7Z"/></svg>';
  var arrow_prev = '<button class="sliderArrow sliderArrow-prev"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  var arrow_next = '<button class="sliderArrow sliderArrow-next"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  $(".advantageList-slider").slick({
    dots: false,
    infinite: true,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    prevArrow: arrow_prev,
    nextArrow: arrow_next,
    responsive: [{
      breakpoint: 1301,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 999,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }]
  });
});
$(document).ready(function () {
  $("body").on("click", ".counterBox__btn", function () {
    $(this).parents(".counterBox").addClass("__focus");
    var min_val = $(this).parents(".counterBox").find(".counterBox__input-field").attr("data-min");
    var max_val = $(this).parents(".counterBox").find(".counterBox__input-field").attr("data-max");
    var step = +$(this).parents(".counterBox").find(".counterBox__input-field").attr("data-step");
    var cur_val = +$(this).parents(".counterBox").find(".counterBox__input-field").val();
    var inp = $(this).parents(".counterBox").find(".counterBox__input-field");

    if ($(this).hasClass("counterBox__btn-minus")) {
      if (min_val) {
        if (!(cur_val - step < +min_val)) {
          inp.val(cur_val - step);
        }
      } else if (!(cur_val - step < 0)) {
        inp.val(cur_val - step);
      }
    } else if ($(this).hasClass("counterBox__btn-plus")) {
      if (max_val) {
        if (!(cur_val + step > +max_val)) {
          inp.val(cur_val + step);
        }
      } else {
        inp.val(cur_val + step);
      }
    }
  });
  $("body").on("change", ".counterBox__input-field", function () {
    var min_val = +$(this).attr("data-min");
    var max_val = +$(this).attr("data-max");
    var cur_val = +$(this).val();

    if (min_val && max_val || min_val == 0 && max_val) {
      if (cur_val < min_val) {
        $(this).val(min_val);
      } else if (cur_val > max_val) {
        $(this).val(max_val);
      } else if (cur_val == min_val) {
        $(this).val(min_val);
      }
    } else if (min_val) {
      if (cur_val < min_val) {
        $(this).val(min_val);
      }
    } else if (max_val) {
      if (cur_val > max_val) {
        $(this).val(max_val);
      }
    }
  });
  $("body").on("focus", ".counterBox__input-field", function () {
    $(this).parents(".counterBox").addClass("__focus");
  });
  $("body").on("blur", ".counterBox__input-field", function () {
    $(this).parents(".counterBox").removeClass("__focus");
  });
  $("body").on("click", function (e) {
    if (!e.target.closest(".counterBox")) {
      $(".counterBox").removeClass("__focus");
    } else {
      $(e.target.closest(".counterBox")).addClass("__focus");
    }
  });
  var product__hover = true;
  var arrow_ico = '<svg viewBox="0 0 24 11.4"><path d="M18.3,11.4,16.9,10l3.3-3.3H0v-2H20.2L16.9,1.4,18.3,0,24,5.7Z"/></svg>';
  var arrow_prev = '<button class="sliderArrow sliderArrow-prev"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  var arrow_next = '<button class="sliderArrow sliderArrow-next"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';

  if ($(window).outerWidth() >= 1230) {
    $("body").on("mouseenter", "[data-product-hover]", function () {
      if (product__hover) {
        if ($(this).parents(".slick-track").css("transition") == "all 0s ease 0s" || $(this).parents(".slick-track").length == 0) {
          var _this = $(this);

          var this_id = $(this).attr("data-product-id");
          $(this).addClass("__hover");
          var el = $(this).find("[data-product-fixed]");
          var pos_top = $(this).offset().top + $(this).outerHeight();
          var pos_left = $(this).offset().left;
          var el_width = $(this).outerWidth();
          el.attr("data-id-chain", this_id);
          el.css({
            'top': pos_top + "px",
            'width': el_width + "px",
            'left': pos_left + "px"
          });
          el.addClass("__active");
          el.appendTo("body");
          product__hover = false;
        }
      }
    });
    $("body").on("mouseleave", "[data-product-hover]", function (e) {
      var this_id = $(this).attr("data-product-id");

      var _this = $(this);

      if (!e.relatedTarget.closest("[data-product-fixed]")) {
        $(this).removeClass("__hover");
        $("[data-product-fixed]").each(function () {
          if ($(this).attr("data-id-chain") == this_id) {
            $(this).removeClass("__active");
            $(this).appendTo(_this);
          }
        });
        product__hover = true;
      }
    });
    $("body").on("mouseleave", "[data-product-fixed]", function (e) {
      var this_id = $(this).attr("data-id-chain");

      var _this = $(this);

      var cond = e.relatedTarget.closest("[data-product-hover]") && this_id != $(e.relatedTarget.closest("[data-product-hover]")).attr("data-product-id");

      if (!e.relatedTarget.closest("[data-product-hover]") || cond) {
        $(this).removeClass("__active");
        $("[data-product-hover]").each(function () {
          if ($(this).attr("data-product-id") == this_id) {
            $(this).removeClass("__hover");
            $(_this).appendTo(this);
          }
        });
        product__hover = true;
      }
    });
  }

  $("body").on("click", "[data-add-basket]", function () {
    var this_id = $(this).parents("[data-id-chain]").attr("data-id-chain");
    $(this).parents("[data-product-fixed]").addClass("__in-cart");
    $("[data-product-id]").each(function () {
      if ($(this).attr("data-product-id") == this_id) {
        $(this).addClass("__in-cart");
      }
    });

    if ($(window).outerWidth() <= 768) {
      var _this_id = $(this).attr("data-add-basket");

      $("[data-modal]").each(function () {
        if ($(this).attr("data-modal") == _this_id) {
          $(this).addClass("__active");
          $(this).find("[data-modal-el]").addClass("__active");
          var pad_right = window.innerWidth - document.documentElement.clientWidth;
          $("body").addClass("overflow-hidden");
          $("body").css("padding-right", pad_right + "px");
          $(".mainHeader.__sticky").css("padding-right", pad_right + "px");
        }
      });
    }
  });
  $(".product-slider").each(function () {
    var _this = $(this);

    var min_slider = $(this).hasClass("product-slider--min");
    $(this).slick({
      dots: false,
      infinite: false,
      arrows: true,
      slidesToShow: min_slider ? 3 : 5,
      slidesToScroll: 1,
      swipe: false,
      swipeToSlide: false,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-desktop-arrow]"),
      responsive: [{
        breakpoint: 1501,
        settings: {
          slidesToShow: min_slider ? 2 : 4,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 1231,
        settings: {
          slidesToShow: min_slider ? 2 : 4,
          slidesToScroll: 1,
          swipe: true,
          swipeToSlide: true
        }
      }, {
        breakpoint: 961,
        settings: {
          slidesToShow: min_slider ? 3 : 3,
          slidesToScroll: 1,
          swipe: true,
          swipeToSlide: true
        }
      }, {
        breakpoint: 875,
        settings: {
          slidesToShow: min_slider ? 3 : 3,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]"),
          swipe: true,
          swipeToSlide: true
        }
      }, {
        breakpoint: 577,
        settings: {
          slidesToShow: min_slider ? 2 : 2,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]"),
          swipe: true,
          swipeToSlide: true
        }
      }]
    });
    $(this).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      product__hover = false;
    });
    $(this).on('afterChange', function (event, slick, currentSlide, nextSlide) {
      product__hover = true;
    });
  });
  var labels_adapt = false;

  if ($(window).outerWidth() <= 576 && !labels_adapt) {
    $(".productEl").each(function () {
      var labels = $(this).find(".productLabels__inner");
      $(this).find(".productCateg").appendTo(labels);
      $(this).find(".productLabels__inner").children().each(function () {
        if (labels.children().length > 1) {
          if (!$(this).hasClass("productLabels__item-btn") && !$(this).hasClass("productLabels__item-new")) {
            $(this).hide();
          }
        }
      });
      labels_adapt = true;
    });
  }

  $(window).on("resize", function () {
    if ($(window).outerWidth() <= 576 && !labels_adapt) {
      $(".productEl").each(function () {
        var labels = $(this).find(".productLabels__inner");
        $(this).find(".productCateg").appendTo(labels);
        $(this).find(".productLabels__inner").children().each(function () {
          if (labels.children().length > 1) {
            if (!$(this).hasClass("productLabels__item-btn") && !$(this).hasClass("productLabels__item-new")) {
              $(this).hide();
            }
          }
        });
      });
      labels_adapt = true;
    }
  });
  $("body").on("click", "[data-open-label]", function () {
    if (!$(this).hasClass("__active")) {
      $(this).parents(".productLabels__inner").children().each(function () {
        if (!$(this).hasClass("productLabels__item-btn") && !$(this).hasClass("productLabels__item-new")) {
          $(this).show();
        }
      });
      $(this).addClass("__active");
    } else {
      $(this).parents(".productLabels__inner").children().each(function () {
        if (!$(this).hasClass("productLabels__item-btn") && !$(this).hasClass("productLabels__item-new")) {
          $(this).hide();
        }
      });
      $(this).removeClass("__active");
    }
  });
  $(".compareSlider").each(function () {
    var _this = $(this);

    $(this).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      swipe: false,
      swipeToSlide: false,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      responsive: [{
        breakpoint: 1401,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 1231,
        settings: {
          swipe: true,
          swipeToSlide: true,
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }, {
        breakpoint: 999,
        settings: {
          swipe: true,
          swipeToSlide: true,
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }]
    });
    $(this).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      product__hover = false;
    });
    $(this).on('afterChange', function (event, slick, currentSlide, nextSlide) {
      product__hover = true;
    });
  });
});
$(document).ready(function () {
  var supportsTouch = ('ontouchstart' in document.documentElement);

  if (!supportsTouch) {
    $("body").on("mouseenter", "[data-next-point]", function () {
      $(this).parents("[data-next-rel]").addClass("__active");
    });
    $("body").on("mouseleave", "[data-next-rel]", function () {
      $(this).removeClass("__active");
    });
  } else {
    $("body").on("click touchend", "[data-next-point]", function (e) {
      if (e.target.closest("[data-next-btn]")) {
        e.preventDefault();

        if ($(this).parents("[data-next-rel]").hasClass("__active")) {
          $(this).parents("[data-next-rel]").removeClass("__active");
        } else {
          $(this).parents("[data-next-rel]").addClass("__active");
        }
      }
    });
  }

  $("body").on("click", "[data-dd-btn]", function () {
    if ($(this).hasClass("__active")) {
      $(this).removeClass("__active");
      $(this).parents("[data-dd-rel]").removeClass("__active");
    } else {
      $(this).addClass("__active");
      $(this).parents("[data-dd-rel]").addClass("__active");
    }
  });
  var sliderInputs = document.querySelectorAll(".sliderInpEl");
  Array.prototype.forEach.call(sliderInputs, function (el) {
    noUiSlider.create(el, {
      connect: true,
      start: [1000, 8000],
      range: {
        'min': [0],
        'max': [10000]
      }
    });
    var min_inp = el.closest("[data-slider-el]").querySelector(".sliderInput__num-min");
    var max_inp = el.closest("[data-slider-el]").querySelector(".sliderInput__num-max");
    el.noUiSlider.on('update', function (values, handle) {
      var value = values[handle];

      if (handle) {
        max_inp.value = Math.round(value);
      } else {
        min_inp.value = Math.round(value);
      }
    });
    min_inp.addEventListener('change', function () {
      el.noUiSlider.set([this.value, null]);
    });
    max_inp.addEventListener('change', function () {
      el.noUiSlider.set([null, this.value]);
    });
    $("body").on("click", "[data-clear-inp]", function () {
      var inp = $(this).parents("[data-focus-rel]").find("[data-focus-inp]");
      var inp_max = +inp.attr("max");
      var inp_min = +inp.attr("min");

      if (inp.hasClass("sliderInput__num-min")) {
        inp.val(inp_min);
        el.noUiSlider.set([inp_min, null]);
      } else {
        inp.val(inp_max);
        el.noUiSlider.set([null, inp_max]);
      }

      $(this).parents("[data-focus-rel]").removeClass("__active");
    });
  });
  var catalog_input_q = 0;
  $(window).on("scroll", function () {
    $("#filter-fxied-btn").remove();
  });
  $(window).on("resize", function () {
    $("#filter-fxied-btn").remove();
  });
  $("body").on("click", function (e) {
    if (!e.target.closest("#filter-fxied-btn")) {
      $("#filter-fxied-btn").remove();
    }
  });
  $("body").on("change", "[data-filter-point]", function () {
    catalog_input_q = 0;
    var btn_pos_top = $(this).parents(".filterInputList__item").offset().top;
    var btn_pos_left = $(this).parents(".filterInputList__item").offset().left + $(this).parents(".filterInputList__item").outerWidth();
    $("#filter-fxied-btn").remove();

    if ($(this).prop("checked")) {
      $(this).parents("#catalog-filter").find("[data-filter-point]").each(function () {
        if ($(this).prop("checked")) {
          catalog_input_q += 1;
        }
      });

      var _btn = $('<div id="filter-fxied-btn" class="filterFly"><a href="#" class="customBtn customBtn-dark"><span class="customBtn__inner">Применить <span class="quantBox">' + catalog_input_q + '</span></span></a></div>');

      _btn.css({
        "top": btn_pos_top + "px",
        "left": btn_pos_left + "px"
      });

      _btn.appendTo("body");
    }

    $("[data-f-quant]").find("[data-f-el]").text(catalog_input_q);

    if (catalog_input_q == 0) {
      $("[data-f-quant]").removeClass("__active");
    } else {
      $("[data-f-quant]").addClass("__active");
    }
  });
  $("body").on("change", "[data-to-label-box]", function () {
    var this_id = $(this).attr("id");
    var this_html = $(this).parents(".filterPoint").find(".filterPoint__text").html();

    if ($(this).prop("checked") == true) {
      $("[data-label-box]").addClass("__active");
      var labelbox = '<div class="choiceFilters__item choiceFilters__label" data-label-choice><label class="choiceLabel" data-label-remove for="' + this_id + '"><span class="choiceLabel__inner">' + this_html + '<span class="choiceLabel__ico"> <svg><use xlink:href="./icons/stack/icons.svg#close"></use></svg></span></span></label></div>';
      $("[data-label-box]").find(".choiceFilters__inner").append(labelbox);
    } else {
      $("[data-label-box]").each(function () {
        $(this).find("[data-label-choice]").each(function () {
          var this_label = $(this).find("[data-label-remove]");

          if (this_label.attr("for") == this_id) {
            this_label.parents("[data-label-choice]").remove();
          }
        });

        if ($(this).find("[data-label-choice]").length == 0) {
          $(this).removeClass("__active");
        }
      });
    }
  });
  $("body").on("click", "[data-choice-del]", function () {
    $("[data-label-remove]").trigger("click");
  });
  $("body").on("click", "[data-label-remove]", function (e) {
    e.preventDefault();
    var this_for = $(this).attr("for");
    $("#" + this_for).prop("checked", false);
    $("#" + this_for).trigger("change");
  }); // открытие фильтра

  $("body").on("click", "[data-open-filer]", function () {
    $("#catalog-filter").addClass("__active");
    $("[data-overlay^='site']").addClass("__active");
    var pad_right = window.innerWidth - document.documentElement.clientWidth;
    $("body").addClass("overflow-hidden");
    $("body").css("padding-right", pad_right + "px");
    $(".mainHeader.__sticky").css("padding-right", pad_right + "px");
  }); // открытие сортировки адаптив

  $("body").on("click", "[data-sort-open]", function () {
    if ($(this).parents("[data-sort-el]").hasClass("__active")) {
      $(this).parents("[data-sort-el]").removeClass("__active");
    } else {
      $(this).parents("[data-sort-el]").addClass("__active");
    }
  });
  $("body").on("click", function (e) {
    if (!e.target.closest("[data-sort-el]")) {
      $("[data-sort-el]").removeClass("__active");
    }
  });
  $("body").on("click", "[data-sort-point]", function () {
    var this_html = $(this).html();
    $(this).parents("[data-sort-el]").find("[data-sort-text]").html(this_html);
  });
});
$(document).ready(function () {
  $(".product-gallery").each(function () {
    var _this = $(this);

    $(this).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      swipeToSlide: true,
      arrows: false,
      asNavFor: _this.parents(".productGallery__inner").find('.sideGallery-slider'),
      responsive: [{
        breakpoint: 1301,
        settings: {
          dots: true
        }
      }]
    });
  });
  var arrowBtn_prev = '<button class="cmpExtraBtn cmpExtraBtn-prev"><span class="cmpExtraBtn__inner"><svg width="9px" height="6px"><use xlink:href="./icons/stack/icons.svg#dropdown"></use></svg></span></button>';
  var arrowBtn_next = '<button class="cmpExtraBtn cmpExtraBtn-next"><span class="cmpExtraBtn__inner"><svg width="9px" height="6px"><use xlink:href="./icons/stack/icons.svg#dropdown"></use></svg></span></button>';
  $(".sideGallery-slider").each(function () {
    var _this = $(this);

    var is_horizontal = !$(this).hasClass("sideGallery-horizontal");
    $(this).slick({
      slidesToShow: is_horizontal ? 4 : 5,
      slidesToScroll: 1,
      arrows: true,
      vertical: is_horizontal,
      verticalSwiping: is_horizontal,
      focusOnSelect: true,
      swipeToSlide: true,
      prevArrow: arrowBtn_prev,
      nextArrow: arrowBtn_next,
      asNavFor: _this.parents(".productGallery__inner").find('.product-gallery')
    });
  });
  $('.sideGallery-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    if (slick.$slides.length <= slick.options.slidesToShow) {
      $(this).find(".slick-track").addClass("stopSlider");
    } else {
      $(this).find(".slick-track").removeClass("stopSlider");
    }
  });
  $("body").on("click", "[data-desc-btn]", function () {
    if (!$(this).hasClass("__active")) {
      $(this).addClass("__active");
      $(this).parents("[data-desc]").addClass("__active");
    } else {
      $(this).removeClass("__active");
      $(this).parents("[data-desc]").removeClass("__active");
    }
  });
  $("body").on("click", "[data-grub-btn]", function () {
    var this_id = $(this).attr("data-grub-btn");
    $(this).parents("[data-grub-box]").find("[data-grub-btn]").removeClass("__active");
    $(this).parents("[data-grub-box]").find("[data-grub]").removeClass("__active");
    $(this).addClass("__active");
    $(this).parents("[data-grub-box]").find("[data-grub]").each(function () {
      if ($(this).attr("data-grub") == this_id) {
        $(this).addClass("__active");
      }
    });
  });
  $(".bigProductGallery").lightGallery({
    selector: ".bigProduct"
  });
});
$(document).ready(function () {
  var mobile_vers = false;

  if ($(window).outerWidth() <= 790) {
    if (!mobile_vers) {
      $("[data-prod-desktop]").each(function () {
        var this_id = $(this).attr("data-prod-desktop");
        $(this).parents("[data-product-cart]").find("[data-prod-mobile=" + this_id + "]").append($(this).html());
        $(this).children().remove();
      });
      mobile_vers = true;
    }
  }

  $("body").on("change", "[data-check-all]", function () {
    var check_status = $(this).prop("checked");
    $("[data-check-prod]").each(function () {
      $(this).prop("checked", check_status);
    });
  });
  $(window).on("resize", function () {
    if ($(window).outerWidth() <= 790) {
      if (!mobile_vers) {
        $("[data-prod-desktop]").each(function () {
          var this_id = $(this).attr("data-prod-desktop");
          $(this).parents("[data-product-cart]").find("[data-prod-mobile=" + this_id + "]").append($(this).html());
          $(this).children().remove();
        });
        mobile_vers = true;
      }
    } else {
      if (mobile_vers) {
        $("[data-prod-mobile]").each(function () {
          var this_id = $(this).attr("data-prod-mobile");
          $(this).parents("[data-product-cart]").find("[data-prod-desktop=" + this_id + "]").append($(this).html());
          $(this).children().remove();
        });
        mobile_vers = false;
      }
    }
  });
});
$(document).ready(function () {
  $(".labelBox").find(".customCb").each(function () {
    if ($(this).prop("checked") == true) {
      $(this).parents(".labelBox").addClass("__active");

      if ($(this)[0].hasAttribute("data-check-grub")) {
        var this_grub = $(this).attr("data-check-grub");
        $(this).parents("[data-check-main]").find("[data-check-content]").each(function () {
          if ($(this).attr("data-check-content") == this_grub) {
            $(this).addClass("__active");
          } else {
            $(this).removeClass("__active");
          }
        });
      }
    }
  });
  $("body").on("change", ".labelBox .customCb", function () {
    var this_name = $(this).attr("name");
    $(".labelBox").find(".customCb").each(function () {
      if ($(this).attr("name") == this_name) {
        $(this).parents(".labelBox").removeClass("__active");
      }
    });

    if ($(this)[0].hasAttribute("data-check-grub")) {
      var this_grub = $(this).attr("data-check-grub");
      $(this).parents("[data-check-main]").find("[data-check-content]").each(function () {
        if ($(this).attr("data-check-content") == this_grub) {
          $(this).addClass("__active");
        } else {
          $(this).removeClass("__active");
        }
      });
    }

    $(this).parents(".labelBox").addClass("__active");
  });
  $("body").on("click", "[data-label-dd-rel]", function () {
    if ($(this).find("[data-label-dd-input]").prop("checked") == true) {
      $(this).find("[data-label-dd]").addClass("__active");
    } // if (!$(this).hasClass("__open")) {
    //     $(this).parents("[data-label-dd-rel]").find("[data-label-dd]").addClass("__active");
    //     $(this).addClass("__open");
    // }
    // else {
    //     $(this).parents("[data-label-dd-rel]").find("[data-label-dd]").removeClass("__active");
    //     $(this).removeClass("__open");
    // }

  });
  $("body").on("click", function (e) {
    if (!e.target.closest("[data-label-dd-rel]")) {
      $("[data-label-dd]").removeClass("__active");
    }
  });
  $("body").on("change", "[data-order-point] .customCb", function (e) {
    if ($(this).prop("checked") == true) {
      var this_text = $(this).parents("[data-order-point]").find(".labelBox__text").html();
      var this_price = $(this).parents("[data-order-point]").find(".labelBox__price").html();
      $(this).parents("[data-label-dd-rel]").find("[data-label-dd-el]").find(".labelBox__text").html(this_text);
      $(this).parents("[data-label-dd-rel]").find("[data-label-dd-el]").find(".labelBox__price").html(this_price);
    }
  });
});
$(document).ready(function () {
  $("body").on("click", "[data-edit-btn]", function () {
    $(this).parents("[data-content-area]").addClass("__edit");
  });
  $("body").on("click", "[data-edit-back]", function () {
    $(this).parents("[data-content-area]").removeClass("__edit");
    $(this).parents("[data-content-area]").removeClass("__password");
  });
  $("body").on("click", "[data-edit-pass-btn]", function () {
    $(this).parents("[data-content-area]").addClass("__password");
  });
  $("body").on("click", "[data-pass-switcher]", function () {
    if (!$(this).hasClass("__active")) {
      $(this).addClass("__active");
      $(this).parents("[data-switcher-block]").find("[type='password']").attr("type", "text");
    } else {
      $(this).removeClass("__active");
      $(this).parents("[data-switcher-block]").find("[type='text']").attr("type", "password");
    }
  });
});
$(document).ready(function () {
  // сравнение
  var col_line = $(".propProductList").eq(0).find(".propProductList__item").length;
  var col_list = $(".propProductList").length;

  var _loop3 = function _loop3(i) {
    var max_h = 0;

    for (var j = 0; j < col_list; j++) {
      var cur_h = $(".propProductList").eq(j).find(".propProductList__item").eq(i).outerHeight();

      if (cur_h > max_h) {
        max_h = cur_h;
      }
    }

    $(".propProductList").each(function () {
      $(this).find(".propProductList__item").each(function (index, element) {
        if (index == i) {
          $(this).css("min-height", max_h + "px");
        }
      });
    });
  };

  for (var i = 0; i < col_line; i++) {
    _loop3(i);
  }

  ;
  $("body").on("mouseenter", ".propProductList__item", function () {
    $(this).addClass("__hover");
    var this_num = $(this).parents(".propProductList").find(this).index();
    $(".propProductList").each(function () {
      $(this).find(".propProductList__item").each(function (index, element) {
        if (index == this_num) {
          $(this).addClass("__hover");
        }
      });
    });
  });
  $("body").on("mouseleave", ".propProductList__item", function () {
    $(this).removeClass("__hover");
    var this_num = $(this).parents(".propProductList").find(this).index();
    $(".propProductList").each(function () {
      $(this).find(".propProductList__item").each(function (index, element) {
        if (index == this_num) {
          $(this).removeClass("__hover");
        }
      });
    });
  });
  $(window).on("resize", function () {
    // сравнение
    var col_line = $(".propProductList").eq(0).find(".propProductList__item").length;
    var col_list = $(".propProductList").length;

    var _loop4 = function _loop4(_i) {
      var max_h = 0;

      for (var j = 0; j < col_list; j++) {
        var cur_h = $(".propProductList").eq(j).find(".propProductList__item").eq(_i).outerHeight();

        if (cur_h > max_h) {
          max_h = cur_h;
        }
      }

      $(".propProductList").each(function () {
        $(this).find(".propProductList__item").each(function (index, element) {
          if (index == _i) {
            $(this).css("min-height", max_h + "px");
          }
        });
      });
    };

    for (var _i = 0; _i < col_line; _i++) {
      _loop4(_i);
    }

    ;
  });
});
$(document).ready(function () {
  $("body").on("click", "[data-answer-open]", function () {
    if (!$(this).hasClass("__active")) {
      $(this).addClass("__active");
      $(this).parents("[data-answer]").addClass("__active");
    } else {
      $(this).removeClass("__active");
      $(this).parents("[data-answer]").removeClass("__active");
    }
  });
  $("body").on("click", "[data-side-open]", function () {
    if ($(window).outerWidth() < 1150) {
      $(this).parents("[data-side-menu]").find("[data-side-fixed]").addClass("__active");
      $("[data-overlay-static]").addClass("__active");
    }
  });
  $("body").on("click", "[data-side-cls]", function () {
    $(this).parents("[data-side-fixed]").removeClass("__active");
    $("[data-overlay-static]").removeClass("__active");
  });
  $("body").on("mousedown touchend", "[data-overlay-static]", function () {
    $(this).removeClass("__active");
    $("[data-side-fixed]").removeClass("__active");
  });
  $("body").on("keydown", function (e) {
    if ($("[data-overlay-static]").hasClass("__active")) {
      if (e.code == "Escape") {
        $("[data-side-fixed]").removeClass("__active");
        $("[data-overlay-static]").removeClass("__active");
      }
    }
  });
  $(".gallerySlides").lightGallery({
    selector: ".gallery-item"
  });
  var adaptStatic = false;

  if ($(window).outerWidth() < 1151) {
    if (!adaptStatic) {
      $(".staticExtra").appendTo(".staticExtra-mb");
      adaptStatic = true;
    }
  }

  $(window).on("resize", function () {
    if ($(window).outerWidth() < 1151) {
      if (!adaptStatic) {
        $(".staticExtra").appendTo(".staticExtra-mb");
        adaptStatic = true;
      }
    } else {
      if (adaptStatic) {
        $(".staticExtra").appendTo(".staticExtra-dt");
        adaptStatic = false;
      }
    }
  });
  $("body").on("click", ".staticLink[href^='#']", function (e) {
    e.preventDefault();

    var _this = $(this);

    var offset_top = $("#main-header").outerHeight();
    $(this).parents("[data-side-fixed]").find(".staticLink").removeClass("__active");
    $(this).addClass("__active");
    $(this).parents("[data-side-fixed]").removeClass("__active");
    $("[data-overlay-static]").removeClass("__active");
    $(this).parents("[data-side-fixed]").on("transitionend", scrollToTag);

    function scrollToTag() {
      $("html, body").animate({
        scrollTop: +$(_this.attr("href")).offset().top - +offset_top + "px"
      }, {
        duration: 500
      });

      _this.parents("[data-side-fixed]").off("transitionend", scrollToTag);
    }
  });
  var arrow_ico = '<svg viewBox="0 0 24 11.4"><path d="M18.3,11.4,16.9,10l3.3-3.3H0v-2H20.2L16.9,1.4,18.3,0,24,5.7Z"/></svg>';
  var arrow_prev = '<button class="sliderArrow sliderArrow-prev"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  var arrow_next = '<button class="sliderArrow sliderArrow-next"><span class="sliderArrow__inner">' + arrow_ico + '</span></button>';
  $(".servSlider__list-slider").each(function () {
    var _this = $(this);

    $(this).slick({
      infinite: false,
      arrows: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipeToSlide: true,
      prevArrow: arrow_prev,
      nextArrow: arrow_next,
      appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-desktop-arrow]"),
      responsive: [{
        breakpoint: 875,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]"),
          swipe: true,
          swipeToSlide: true
        }
      }, {
        breakpoint: 577,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          appendArrows: _this.parents("[data-slider-ctrl]").find("[data-slider-mobile-arrow]"),
          swipe: true,
          swipeToSlide: true
        }
      }]
    });
  });
});
$(document).ready(function () {
  $("body").on("click", "[data-toggle-like]", function () {
    if ($(this).hasClass("__active")) {
      $(this).removeClass("__active");
    } else {
      $(this).parents("[data-toggle-mark]").find("[data-toggle-like]").removeClass("__active");
      $(this).addClass("__active");
    }
  });
  $("body").on("click", "[data-open-rev]", function () {
    $(this).parents("[data-parent-rev]").addClass("__active");
  });
  $("body").on("click", "[data-close-rev]", function () {
    $(this).parents("[data-parent-rev]").removeClass("__active");
  });
  var files = [];

  var changeHandler = function changeHandler(e, input) {
    if (input.closest("[data-load-rel]").querySelector(".loadFile__item-image")) {
      input.closest("[data-load-rel]").querySelector(".loadFile__item-image").remove();
    }

    if (e.isTrusted) {
      files = Array.from(e.target.files);
    }

    var imageWrapper = document.createElement("div");
    imageWrapper.className = "loadFile__item loadFile__item-image";
    var imageList = document.createElement("div");
    imageList.className = "loadImages";
    imageList.addEventListener("click", function (e) {
      removeHandler(e);
    });
    files.forEach(function (file) {
      if (!file.type.match("image")) {
        return;
      }

      var reader = new FileReader();

      reader.onload = function (ev) {
        if (!input.closest("[data-load-rel]").querySelector(".loadFile__item-image")) {
          input.closest("[data-load-rel]").insertAdjacentElement("beforeEnd", imageWrapper);
          imageWrapper.insertAdjacentElement("beforeEnd", imageList);
        }

        var imageItem = document.createElement("div");
        imageItem.className = "loadImages__item";
        imageItem.style.backgroundImage = "url(".concat(ev.target.result, ")");
        var removeImg = document.createElement("button");
        removeImg.setAttribute("type", "button");
        removeImg.setAttribute("data-name", file.name);
        removeImg.className = "loadImages__remove";
        removeImg.innerHTML = "<svg viewBox=\"0 0 20 20\"><path d=\"M11.4,10,20,1.4V0H18.6L10,8.6,1.4,0H0V1.4L8.6,10,0,18.6V20H1.4L10,11.4,18.6,20H20V18.6Z\"/></svg>";
        imageItem.append(removeImg);
        imageList.insertAdjacentElement("beforeEnd", imageItem);
      };

      reader.readAsDataURL(file);
    });
  };

  var removeHandler = function removeHandler(e) {
    if (e.target.closest(".loadImages__remove")) {
      var name = e.target.closest(".loadImages__remove").dataset.name;
      files = files.filter(function (file) {
        return file.name !== name;
      });

      if (files.length === 0) {
        e.target.closest(".loadFile__item-image").remove();
      }

      e.target.closest(".loadImages__item").remove();
    }
  };

  var loadInputs = document.querySelectorAll("[data-load-input]");
  Array.prototype.forEach.call(loadInputs, function (loadInput) {
    loadInput.addEventListener("change", function (event) {
      changeHandler(event, loadInput);
    });
  });
  var dropArea = document.querySelectorAll("[data-load-el]");
  Array.prototype.forEach.call(dropArea, function (dropItem) {
    ;
    ["dragenter", "dragover", "dragleave", "drop"].forEach(function (eventName) {
      dropItem.addEventListener(eventName, preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach(function (eventName) {
      dropItem.addEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach(function (eventName) {
      dropItem.addEventListener(eventName, unhighlight, false);
    });
    dropItem.addEventListener('drop', function (e) {
      handleDrop(e, dropItem);
    }, false);

    function handleDrop(e, context) {
      var dt = e.dataTransfer;
      var files = dt.files;
      handleFiles(files, context);
    }

    function highlight(e) {
      dropItem.classList.add("highlight");
    }

    function unhighlight(e) {
      dropItem.classList.remove("highlight");
    }

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function handleFiles(dropFiles, context) {
    Array.from(dropFiles).forEach(uploadFile);
    files = Array.from(dropFiles);
    context.querySelector("[data-load-input]").value = "";

    if (!/safari/i.test(navigator.userAgent)) {
      context.querySelector("[data-load-input]").type = '';
      context.querySelector("[data-load-input]").type = 'file';
    }

    var event = new Event("change");
    context.querySelector("[data-load-input]").dispatchEvent(event);
  }

  function uploadFile(file) {// let url = 'ВАШ URL ДЛЯ ЗАГРУЗКИ ФАЙЛОВ'
    // let xhr = new XMLHttpRequest()
    // let formData = new FormData()
    // xhr.open('POST', url, true)
    // xhr.addEventListener('readystatechange', function(e) {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         // Готово. Информируем пользователя
    //     }
    //     else if (xhr.readyState == 4 && xhr.status != 200) {
    //         // Ошибка. Информируем пользователя
    //     }
    // })
    // formData.append('file', file)
    // xhr.send(formData)
  }
});
$(document).ready(function () {
  $("body").on("click", "[data-modal]", function (e) {
    if (!e.target.closest("[data-modal-el]")) {
      $(this).removeClass("__active");
      $(this).find("[data-modal-el]").removeClass("__active");
      $("body").removeClass("overflow-hidden");
      $("body").css("padding-right", "0");
      $(".mainHeader.__sticky").css("padding-right", "0");
    }
  });
  $("body").on("click", "[data-modal-close]", function (e) {
    $(this).parents("[data-modal]").removeClass("__active");
    $(this).parents("[data-modal-el]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
  });
  $("body").on("click", "[data-modal-open]", function (e) {
    $("[data-modal]").removeClass("__active");
    $("[data-modal-el]").removeClass("__active");
    $("body").removeClass("overflow-hidden");
    $("body").css("padding-right", "0");
    $(".mainHeader.__sticky").css("padding-right", "0");
    var this_id = $(this).attr("data-modal-open");
    $("[data-modal]").each(function () {
      if ($(this).attr("data-modal") == this_id) {
        $(this).addClass("__active");
        $(this).find("[data-modal-el]").addClass("__active");
        var pad_right = window.innerWidth - document.documentElement.clientWidth;
        $("body").addClass("overflow-hidden");
        $("body").css("padding-right", pad_right + "px");
        $(".mainHeader.__sticky").css("padding-right", pad_right + "px");
      }
    });
  });
});