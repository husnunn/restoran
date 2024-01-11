var parent_pages = "halaman";
var dataHalaman = "dashboard.html";

$(document).ready(function () {
  if (localStorage.getItem("halaman")) {
    load_halaman(localStorage.getItem("halaman"));
  } else {
    save_halaman(dataHalaman);
  }
});

$(".sidebar-link").on("click", function () {
  $(".sidebar-item").each(function (index, element) {
    $(element).removeClass("active");
  });

  $(this).parent().addClass("active");
  if ($(this).hasClass("drpd")) {
  } else {
    save_halaman($(this).attr("data-pages"));
  }
});

function save_halaman(halaman_nama) {
  localStorage.setItem("halaman", halaman_nama);
  load_halaman(halaman_nama);
}

function load_halaman(halaman_nama) {
  $("#mainkonten").load(parent_pages + "/" + halaman_nama);
}
