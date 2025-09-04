$(document).ready(function() {
    $('.mobile-good-life-plans-wrapper ul.term-list').each(function(){
      var LiN = $(this).find('li').length;

      if( LiN > 0){    
        $('li', this).hide().addClass('toggleable');
        $(this).append('<li class="more">Show More</li>');    
      }  
    });
    $('ul.term-list').on('click','.more', function(){
      $(this).closest('.plans-card').find('.card-second-row').addClass('show-card-details');
      if( $(this).hasClass('less') ){    
        $(this).text('Show More').removeClass('less');  
      }else{
        $(this).text('Show Less').addClass('less'); 
      }
      $(this).siblings('li.toggleable').slideToggle(); 
    }); 
    $('ul.term-list').on('click','.less', function(){
      $(this).closest('.plans-card').find('.card-second-row').removeClass('show-card-details');
    });
    $('ul.term-list .more:first').click();
});