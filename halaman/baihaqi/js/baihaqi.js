function edit_data(datas, jenisdata) {
  console.log(datas);
  $.ajax({
    type: "POST",
    url: "https://tugasapi.informatikaunwaha.com/baihaqi/api/apiedit.php",
    data: datas,
    dataType: "JSON",
    success: function (response) {
      sukses("success", "Berhasil Mengupdate");
      $("tbody").empty();
      ambil_laporan(jenisdata);
    },
  });
}

function ambil_laporan(jeniss) {
  $.ajax({
    type: "GET",
    url: "https://tugasapi.informatikaunwaha.com/baihaqi/api/api.php",
    data: {
      jenis: jeniss,
    },
    dataType: "JSON",
    success: function (response) {
      var dataresponse = response.data;

      $.each(dataresponse, function (indexArray, isidariArray) {
        var elemen_tr = `
          <tr>
                <td >${indexArray + 1}</td>
                <td >${isidariArray.tanggal}</td>
                <td dataid="${isidariArray.id}" datap="${isidariArray.keterangan}" >${isidariArray.keterangan}</td>
                <td >${konvert_status(isidariArray.status)}</td>
                
                <td>
                 <a href="#" class="btn btn-sm btn-warning rounded-2 me-2" onclick="edit(this)">edit</a>
                 <a href="#" idp="${isidariArray.id}" class="btn btn-sm btn-danger rounded-2 me-2" onclick="confirm_delete(this)">hapus</a>
                </td>       
              </tr>
          `;

        $(".table tbody").append(elemen_tr);
      });

      $("table").dataTable();
    },
  });
}
function konvert_status(status) {
  if (status == 0) {
    return `<span class="badge bg-danger">Belum Di Tangani</span>`;
  } else if (status == 1) {
    return `<span class="badge bg-success">Sudah Di Tangani</span>`;
  } else if (status == 2) {
    return `<span class="badge bg-warning">Di Pertimbangkan</span>`;
  } else if (status == 3) {
    return `<span class="badge bg-secondary">Di Tolak</span>`;
  }
}
function syncOfflineData() {
  var offlineData = JSON.parse(localStorage.getItem("insert")) || [];

  if (offlineData.length > 0) {
    offlineData.forEach(function (record) {
      $.ajax({
        type: "POST",
        url: "https://tugasapi.informatikaunwaha.com/baihaqi/api/apitambah.php",
        data: record,
        dataType: "JSON",
        success: function (response) {
          console.log("Offline data synced successfully:", response);
        },
        error: function (error) {
          console.error("Error syncing offline data:", error);
        },
      });
    });

    localStorage.removeItem("insert");
  }
}
function tambah() {
  var jenisv = $("#jenis").val();
  var keteranganv = $("#keterangan").val();

  if (navigator.onLine) {
    $.ajax({
      type: "POST",
      url: "https://tugasapi.informatikaunwaha.com/baihaqi/api/apitambah.php",
      data: {
        jenis: jenisv,
        keterangan: keteranganv,
      },
      dataType: "JSON",
      success: function (response) {
        console.log("Data submitted successfully:", response);
        $("#keterangan").val("");
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  } else {
    var offlineData = JSON.parse(localStorage.getItem("insert")) || [];

    if (!Array.isArray(offlineData)) {
      offlineData = [];
    }

    offlineData.push({ jenis: jenisv, keterangan: keteranganv });
    localStorage.setItem("insert", JSON.stringify(offlineData));
  }
}

function tambah_aduan() {
  localStorage.setItem("halaman", "baihaqi/tambah_aduan.html");
  window.location.reload();
}
