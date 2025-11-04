$(document).ready(function () {
  // Task 4 Scroll progress bar
  $(function () {
    const bar = $("<div>", { id: "scrollBar" }).appendTo("body");

    $(window).on("scroll", function () {
      const scroll = $(window).scrollTop();
      const height = $(document).height() - $(window).height();
      const scrolled = (scroll / height) * 100;
      bar.css("width", scrolled + "%");
    });
  });
$("counter").show();
  // Task 5 Animated number counter
  $(".count-num").each(function () {
    const $this = $(this);
    const target = +$this.data("target");
    $({ count: 0 }).animate(
      { count: target },
      {
        duration: 2000,
        easing: "swing",
        step: function (now) {
          $this.text(Math.floor(now));
        },
      }
    );
  });
});
