$(document).ready(function () {
    var maxWidth = window.matchMedia("(max-width: 600px)");
// Calendar script start
if ($('.rescalendar').length) {
    (function ($) {

        $.fn.rescalendar = function (options) {

            function alert_error(error_message) {

                return [
                    '<div class="error_wrapper">',

                    '<div class="thumbnail_image vertical-center">',

                    '<p>',
                    '<span class="error">',
                    error_message,
                    '</span>',
                    '</p>',
                    '</div>',

                    '</div>'
                ].join('');

            }

            function set_template(targetObj, settings) {

                var template = '',
                    id = targetObj.attr('id') || '';

                if (id == '' || settings.dataKeyValues.length == 0) {

                    targetObj.html(alert_error(settings.lang.init_error + ': No id or dataKeyValues'));
                    return false;

                }

                if (settings.refDate.length != 10) {

                    targetObj.html(alert_error(settings.lang.no_ref_date));
                    return false;

                }


                template = settings.template_html(targetObj, settings);

                targetObj.html(template);

                return true;

            };

            function dateInRange(date, startDate, endDate) {

                if (date == startDate || date == endDate) {
                    return true;
                }

                var date1 = moment(startDate, settings.format),
                    date2 = moment(endDate, settings.format),
                    date_compare = moment(date, settings.format);

                return date_compare.isBetween(date1, date2, null, '[]');

            }

            function dataInSet(data, name, date) {

                var obj_data = {};

                for (var i = 0; i < data.length; i++) {

                    obj_data = data[i];

                    if (
                        name == obj_data.name &&
                        dateInRange(date, obj_data.startDate, obj_data.endDate)
                    ) {

                        return obj_data;

                    }

                }

                return false;

            }

            function setData(targetObj, dataKeyValues, data) {

                var html = '',
                    dataKeyValues = settings.dataKeyValues,
                    data = settings.data,
                    arr_dates = [],
                    name = '',
                    content = '',
                    hasEventClass = '',
                    customClass = '',
                    classInSet = false,
                    obj_data = {};

                targetObj.find('td.day_cell').each(function (index, value) {

                    arr_dates.push($(this).attr('data-cellDate'));
                    var currentDate = new Date();

                    var result = new Date(currentDate.setDate(currentDate.getDate()));
                    var daysavailble = new Date(currentDate.setDate(currentDate.getDate() + 16));

                    disableDays($(this),result,daysavailble);


                });

                for (var i = 0; i < dataKeyValues.length; i++) {

                    content = '';
                    date = '';
                    name = dataKeyValues[i];

                    html += '<tr class="dataRow">';
                    html += '<td class="firstColumn">' + name + '</td>';

                    for (var j = 0; j < arr_dates.length; j++) {

                        title = '';
                        date = arr_dates[j];
                        obj_data = dataInSet(data, name, date);

                        if (typeof obj_data === 'object') {

                            if (obj_data.title) { title = ' title="' + obj_data.title + '" '; }

                            content = '<a href="#" ' + title + '>&nbsp;</a>';
                            hasEventClass = 'hasEvent';
                            customClass = obj_data.customClass;

                        } else {

                            content = ' ';
                            hasEventClass = '';
                            customClass = '';

                        }

                        html += '<td data-date="' + date + '" data-name="' + name + '" class="data_cell ' + hasEventClass + ' ' + customClass + '">' + content + '</td>';
                    }

                    html += '</tr>';

                }

                // targetObj.find('.rescalendar_data_rows').html( html );
            }

            function setDayCells(targetObj, refDate) {

                var format = settings.format,
                    f_inicio = moment(refDate, format).subtract(settings.jumpSize, 'days'),
                    f_fin = moment(refDate, format).add(settings.jumpSize, 'days'),
                    today = moment().startOf('day'),
                    html = '',
                    f_aux = '',
                    f_aux_format = '',
                    dia = '',
                    dia_semana = '',
                    num_dia_semana = 0,
                    mes = '',
                    clase_today = '',
                    clase_middleDay = '',
                    clase_disabled = '',
                    middleDay = targetObj.find('input.refDate').val();
                     //settings.jumpSize = $(targetObj).index();

                for (var i = 0; i < (settings.calSize + 1); i++) {

                    clase_disabled = '';

                    f_aux = moment(f_inicio).add(i, 'days');
                    f_aux_format = f_aux.format(format);

                    dia = f_aux.format('DD');
                    mes = f_aux.locale(settings.locale).format('MMM').replace('.', '');
                    dia_semana = f_aux.locale(settings.locale).format('ddd');
                    num_dia_semana = f_aux.day();

                    f_aux_format == today.format(format) ? clase_today = 'today' : clase_today = '';
                    f_aux_format == middleDay ? clase_middleDay = 'middleDay' : clase_middleDay = '';

                    if (
                        settings.disabledDays.indexOf(f_aux_format) > -1 ||
                        settings.disabledWeekDays.indexOf(num_dia_semana) > -1
                    ) {

                        clase_disabled = 'disabledDay';
                    }

                    html += [
                        '<td class="day_cell ' + clase_today + ' ' + clase_middleDay + ' ' + clase_disabled + '" data-cellDate="' + f_aux_format + '">',
                        '<span class="dia">' + dia + '</span>',
                        '<span class="dia_semana">' + dia_semana + '</span>',
                        //'<span class="mes">' + mes + '</span>',
                        '</td>'
                    ].join('');

                }
                targetObj.find('.rescalendar_day_cells').html(html);

                addTdClickEvent(targetObj);

                setData(targetObj);


            }
            function addTdClickEvent(targetObj) {

                var day_cell = targetObj.find('td.day_cell');
              //  showTime(day_cell);
                day_cell.on('click', function (e) {

                    var cellDate = e.currentTarget.attributes['data-cellDate'].value;
                    $(this).removeClass('today');
                    targetObj.find('input.refDate').val(cellDate);
                    targetObj.find('input.month-selection').val(moment(cellDate).format('MMMM YYYY'));
                     settings.jumpSize = $(e.currentTarget).index();
                    setDayCells(targetObj, moment(cellDate, settings.format));

                    $('.refDate').css('visibility','visible');
                    if($('#timePicker').text() !== ''){
                    $('#book-serve-first').find('.nxt-btn').removeClass('disabled');
                    }

                });
            }
            function change_day(targetObj, action, num_days) {

                var refDate = targetObj.find('input.refDate').val(),
                    f_ref = '';

                if (action == 'subtract') {
                    f_ref = moment(refDate, settings.format).subtract(num_days, 'days');
                } else {
                    f_ref = moment(refDate, settings.format).add(num_days, 'days');
                }

                targetObj.find('input.refDate').val(f_ref.format(settings.format));

                setDayCells(targetObj, f_ref);
            }
             function disableDays(targetObj,mindate,maxdate) {
                var refDate = new Date(targetObj.attr('data-cellDate'));
                $('.refDate').css('visibility','hidden');
                if(refDate < mindate){
                    targetObj.addClass('disabled');
                }else if( refDate > maxdate){
                     targetObj.addClass('disabled');
                }else{
                     targetObj.removeClass('disabled');
                }
            }
            // INITIALIZATION
            if (maxWidth.matches){
                var settings = $.extend({
                    id: 'rescalendar',
                    format: 'YYYY-MM-DD',
                    refDate: moment().format('YYYY-MM-DD'),
                    monthYear: moment().format('MMMM YYYY'),
                    jumpSize: 1,
                    calSize: 3,
                    locale: 'en',
                    disabledDays: [],
                    disabledWeekDays: [],
                    dataKeyField: 'name',
                    dataKeyValues: [],
                    data: {},
    
                    lang: {
                        'init_error': 'Error when initializing',
                        'no_data_error': 'No data found',
                        'no_ref_date': 'No refDate found',
                        'today': 'Today'
                    },
                    template_html: function (targetObj, settings) {
    
                        var id = targetObj.attr('id'),
                            refDate = settings.refDate;
                        monthYear = settings.monthYear;
    
                        return [
    
                            '<div class="rescalendar ', id, '_wrapper">',
                            '<div class="rescalendar_controls">',
                            '<h5 class="select-date service-sub-heading">Select a Date </h5>',
                            '<input class="refDate" type="text" value="' + refDate + '" />',
                            '</div>',
                            '<div class="calendar-slider-dontainer">',
                            '<input class="month-selection" type="text" value="' + monthYear + '" />',
                            '<div class="previous-button">',
                            '<button class="move_to_yesterday"> < </button>',
                            '</div>',
                            '<table class="rescalendar_table">',
                            '<thead>',
                            '<tr class="rescalendar_day_cells"></tr>',
                            '</thead>',
                            '</tbody>',
                            '</table>',
                            '<div class="next-button">',
                            '<button class="move_to_tomorrow"> > </button>',
                            '</div>',
                            '</div>',
                            '</div>',
    
                        ].join('');
                    }
                }, options);
            }else{
                var settings = $.extend({
                    id: 'rescalendar',
                    format: 'YYYY-MM-DD',
                    refDate: moment().format('YYYY-MM-DD'),
                    monthYear: moment().format('MMMM YYYY'),
                    jumpSize: 1,
                    calSize: 15,
                    locale: 'en',
                    disabledDays: [],
                    disabledWeekDays: [],
                    dataKeyField: 'name',
                    dataKeyValues: [],
                    data: {},
    
                    lang: {
                        'init_error': 'Error when initializing',
                        'no_data_error': 'No data found',
                        'no_ref_date': 'No refDate found',
                        'today': 'Today'
                    },
                    template_html: function (targetObj, settings) {
    
                        var id = targetObj.attr('id'),
                            refDate = settings.refDate;
                        monthYear = settings.monthYear;
    
                        return [
    
                            '<div class="rescalendar ', id, '_wrapper">',
                            '<div class="rescalendar_controls">',
                            '<h5 class="select-date service-sub-heading">Select a Date </h5>',
                            '<input class="refDate" type="text" value="' + refDate + '" />',
                            '</div>',
                            '<div class="calendar-slider-dontainer">',
                            '<input class="month-selection" type="text" value="' + monthYear + '" />',
                            '<div class="previous-button">',
                            '<button class="move_to_yesterday"> < </button>',
                            '</div>',
                            '<table class="rescalendar_table">',
                            '<thead>',
                            '<tr class="rescalendar_day_cells"></tr>',
                            '</thead>',
                            '</tbody>',
                            '</table>',
                            '<div class="next-button">',
                            '<button class="move_to_tomorrow"> > </button>',
                            '</div>',
                            '</div>',
                            '</div>',
    
                        ].join('');
                    }
                }, options);
            }
            
            return this.each(function () {

                var targetObj = $(this);

                set_template(targetObj, settings);

                setDayCells(targetObj, settings.refDate);

                // Events
                var move_to_yesterday = targetObj.find('.move_to_yesterday'),
                    move_to_tomorrow = targetObj.find('.move_to_tomorrow'),
                    refDate = targetObj.find('.refDate');

                move_to_yesterday.on('click', function (e) {
                    change_day(targetObj, 'subtract', 1);
                    $('.day_cell').removeClass('today');
                    e.preventDefault();
                    showTime();
                });
                move_to_tomorrow.on('click', function (e) {
                    change_day(targetObj, 'add', 1);
                    $('.day_cell').removeClass('today');
                    e.preventDefault();
                    showTime();
                });
                refDate.on('blur', function (e) {
                    var refDate = targetObj.find('input.refDate').val();
                    setDayCells(targetObj, refDate);

                });
                return this;
            });

        } // end rescalendar plugin


    }(jQuery));

// Customization js code
$(function () {
    $('#my_calendar_en').rescalendar({
        id: 'my_calendar_en',
        format: 'YYYY-MM-DD',
        refDate: new Date().toISOString().slice(0, 10),
        jumpSize: 1,
        data: [
            {
                id: 1,
                name: 'item1',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10)+15,
                customClass: 'greenClass'
            },
            {
                id: 2,
                name: 'item2',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10)+15,
                customClass: 'blueClass',
                title: 'Title 2 en'
            },
            {
                id: 3,
                name: 'item5',
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10)+15,
                customClass: 'greenClass'
            }
        ],

        dataKeyField: 'name',
        dataKeyValues: ['item1', 'item2', 'item3', 'item4', 'item5']

    });
});
}
/* Book service show hide start */
$('.book-serv-pages').hide();
$('#book-serve-first').show();
$('.nxt-btn').addClass('disabled');
$('.nxt-btn').click(function () {
    $('.book-serv-pages').hide();
    $(this).closest('.book-serv-pages').hide().next('.book-serv-pages').show();
    return false;
});
$('.book-now-back-btn').click(function(){
    $(this).closest('.book-serv-pages').hide().prev('.book-serv-pages').show();
});
/* Book service show hide end */
//Slider time picker end here
function showTime(){
$('.day_cell').each(function(){
if($(this).hasClass('middleDay')){

        if($(this).hasClass('disabled')){
            $('.refDate').css('visibility','hidden');
        }else{
             $('.refDate').css('visibility','visible');
        }
    }
});

}

});