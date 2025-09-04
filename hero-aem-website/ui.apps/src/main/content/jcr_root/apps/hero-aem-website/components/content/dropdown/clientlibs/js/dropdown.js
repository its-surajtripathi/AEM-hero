$(document).ready(function () {
    $("#addressList").change(function () {
        const selectedAdd = this.value;
        let x = document.querySelectorAll(".corpaorateOffice");
        $(".corpaorateOffice").hide();
        for (let i = 0; i < x.length; i++) {
            var attadd = x[i].attributes.titleid.nodeValue;
            if (attadd.includes(selectedAdd)) {
                x[i].classList.add('showAdd');
            } else {
                x[i].classList.remove('showAdd');
            }
        }
    });

    function contactZone() {
        var i;
        var x = document.querySelectorAll(".contact-title");
        var text = [];
        for (i = 0; i < x.length; i++) {
            text[i] = x[i].textContent;
        }
        var linkText, html = "";
        for (i = 0; i < text.length; i++) {
            linkText = text[i];
            html += "<option value=" + linkText + ">" + linkText + "</option>";
        }
        $('#addressList').append(html);
        $('#addressList').trigger('change');
    }
    contactZone();

    $('.address-col-val#phoneNumber').each(function () {
        let arr = []
        let element = $(this);
        arr = $(this)[0].innerText.split(",")
        if (arr.length > 0) {
            $(this)[0].innerHTML = ''
            arr.forEach(function (ele) {
                element.append("<a href=Tel:" + ele + ">" + ele + "</a>")
            }

            )
        }
    })
})

