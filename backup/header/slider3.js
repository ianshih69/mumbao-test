$(document).ready(function(){
$('#link1').click(function(e){
			e.preventDefault();
				$('body, html').animate({
					scrollTop: 0,
				}, 600);
			});		
			$('#link2').click(function(e){
				e.preventDefault();
				$('body, html').animate({
          scrollTop: $('#target2').offset().top,
				}, 600);
			});		
  	$('#link3').click(function(e){
				e.preventDefault();
				$('body, html').animate({
          scrollTop: $('#target3').offset().top,
				}, 600);
			});	
				$('#link4').click(function(e){
				e.preventDefault();
				$('body, html').animate({
          scrollTop: $('#target4').offset().top,
				}, 600);
			});	
 		$('#link5').click(function(e){
				e.preventDefault();
				$('body, html').animate({
          scrollTop: $('#target5').offset().top,
				}, 600);
			});
  	});





  $(function scrolly(){
      //Keep track of last scroll
      var lastScroll = 0;
      $(window).scroll(function(event){
          //Sets the current scroll position
          var st = $(this).scrollTop();
          //Determines up-or-down scrolling
          if (st > lastScroll){
             //Replace this with your function call for downward-scrolling
            //Maybe some timeout?
           // setTimeout( function () {  
            $('nav').addClass('fixedAtTop');
           // }, 800);
          }
          else {
             //Replace this with your function call for upward-scrolling
            
            $('nav').removeClass('fixedAtTop');
            
          }
          //Updates scroll position
          lastScroll = st;
      });
    $('nav').hover(function(){
      $(this).removeClass('fixedAtTop');
    });
  });