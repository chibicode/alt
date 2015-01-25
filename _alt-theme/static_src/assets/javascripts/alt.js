$(function() {
  FastClick.attach(document.body);
  $(".js-logo-menu-trigger").click(function(e) {
    e.preventDefault();
    $(".js-mobile-menu").toggle();
  });
});
