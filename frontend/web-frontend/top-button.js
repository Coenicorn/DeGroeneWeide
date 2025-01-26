let topButton = document.getElementById("top-button");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    // console.log(document.body.scrollTop);
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}