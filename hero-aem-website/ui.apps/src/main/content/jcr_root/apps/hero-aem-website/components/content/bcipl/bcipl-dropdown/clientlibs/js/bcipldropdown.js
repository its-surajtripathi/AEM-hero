$(document).ready(function () {
    $('.selectPressBox').on('change' , function(){
     $('.list-item').addClass('d-none');
     let selectedVal = $(this).val();
     $('#gov_'+selectedVal).removeClass('d-none');
    })
 });