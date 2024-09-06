// ------sticky nav bar-------

window.addEventListener("scroll", function () {
  var header = document.getElementById("Mainheader");
  header.classList.toggle("sticky", window.scrollY > 0);
});
