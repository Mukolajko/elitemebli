$(document).ready(function () {
    //phone button clicked
    $("a").click(function (event) {
        event.preventDefault();
    });
    $('#order-phone, #order-phone-footer, #get-consult').on('click', function (e) {
        e.preventDefault();
        $('#return-content').bPopup({
            closeClass: "close",
            contentContainer: '#return-content',
            loadUrl: '/popup' //Uses jQuery.load()
        });
    });

    //load catalog buttons
    $("#get-catalog-kitchen, #get-catalog-closet").on('click', function () {
        var name = $(this).attr("id").split("-")[2];
        window.location = "/download?name=" + name;
    });
    //change css after focus on input
    $("body").on('focus', 'input', function () {
        $(this).css({border: "3px solid #ffc300"});
    })
});

//add animation of pictures in content
/*$(document).scroll(function () {
    var position = $(".tasks-moving").position();
    var botCalc = position.top + $('.tasks-moving').outerHeight(true) - $(window).scrollTop();

    if (!$(".tasks-moving").hasClass("animated")) {
        if ($(window).scrollTop() > position.top - $(window).height()) {
            $(".tasks-moving li > .image").each(function () {
                $(this).css({width: "0px"}).animate({
                    width: "515px"
                }, 500)
            });
            $(".tasks-moving").addClass("animated");
        }
    }

    if ($(window).scrollTop() < 101 || botCalc < 50) {
        $(".tasks-moving").removeClass("animated");
    }
});*/

//pop-up form validation and ajax send request
function validate() {
    $("form > span").remove();
    $("#send-order").attr("disabled", true);
    var errors = 0;
    $("form > input.main").each(function () {
        if ($(this).val().length == 0) {
            $(this).css({border: "3px solid red"});
            $(this).after("<span>Поле не може бути пустим</span>");
            errors++;
        }
        else if ($(this).attr("name") == "phone") {
            var inputVal = $(this).val();
            var check = /^[0-9]{10}/;
            if (!check.test(inputVal) || inputVal.length > 10) {
                $(this).css({border: "3px solid red"});
                $(this).after("<span>Невірний формат номера. Введіть 10-значний номер</span>");
                errors++;
            }
        }
    });

    if (errors == 0) {
        sendForm();
    }
    else {
        $("#send-order").attr("disabled", false);
    }
}
function sendForm() {
    $.ajax({
        url: '/sendmail',
        type: "POST",
        data: {
            captcha: $("#g-recaptcha-response").val(),
            name: $("form input[name = 'name']").val(),
            phone: $("form input[name = 'phone']").val(),
            message: $("form input[name = 'message']").val()
        },
        success: function (responce) {
            $("#return-content").bPopup().close();
            $("#return-content > *").remove();
            $('#return-content').bPopup({
                loadUrl: '/popup/done?status=200', //Uses jQuery.load()
                autoClose: 2500
            });
        },
        error: function (responce) {
            if (responce.status == 412 ) {
                $(".g-recaptcha").css({border: "3px solid red"});
                $("#g-recaptcha-response").after("<span>Підтвердіть що ви не робот</span>");
                $("#send-order").attr("disabled", false);
            }
            else {
                $("#return-content").bPopup().close();
                $("#return-content > *").remove();
                $('#return-content').bPopup({
                    loadUrl: '/popup/done?status=' + responce.status, //Uses jQuery.load()
                    autoClose: 3000
                });
            }
        }
    });
}
//gmaps init function
/*function initialize() {
    //ternopil tarnavskogo location
    var myLatlng = new google.maps.LatLng(49.564438, 25.632667);
    var myMap = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(49.564438, 25.632667),
        zoom: 17,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //init map
    var map = new google.maps.Map(myMap, mapOptions);

    //add marker
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'We are here!'
    });
}

google.maps.event.addDomListener(window, 'load', initialize);*/


$(function () {
    $('#dg-container-one').gallery();
});
$(function () {
    $('#dg-container-two').gallery();
});