/*
 * jQuery Simple Shopping Cart v0.1
 * Basis shopping cart using javascript/Jquery.
 *
 * Authour : Sirisha
 */

/* '(function(){})();' this function is used, to make all variables of the plugin Private */
var totalhargaSemua = 0;

(function ($, window, document, undefined) {
  /* Default Options */
  var defaults = {
    cart: [],
    addtoCartClass: ".sc-add-to-cart",
    cartProductListClass: ".cart-products-list",
    totalCartCountClass: ".total-cart-count",
    totalCartCostClass: ".total-cart-cost",
    showcartID: "#show-cart",
    namas: ".namas",
    itemCountClass: ".item-count",
  };

  function Item(name, price, hargaasli, count) {
    this.name = name;
    this.price = price;
    this.count = count;
    this.hargaasli = hargaasli;
  }
  /*Constructor function*/
  function simpleCart(domEle, options) {
    /* Merge user settings with default, recursively */
    this.options = $.extend(true, {}, defaults, options);
    //Cart array
    this.cart = [];
    //Dom Element
    this.cart_ele = $(domEle);
    //Initial init function
    this.init();
  }

  /*plugin functions */
  $.extend(simpleCart.prototype, {
    init: function () {
      this._setupCart();
      this._setEvents();
      this._loadCart();
      this._updateCartDetails();
    },
    _setupCart: function () {
      this.cart_ele.addClass("cart-grid panel panel-defaults");
      this.cart_ele.append(`<div class='panel-heading cart-heading  mb-3'><div class='total-cart-count'>Your Cart 0 items</div>
      
      <div class='spacer'></div>
      
      <div class="input-group mt-2">
      <span class="input-group-text" id="basic-addon1">
      <i class="fas fa-map"></i>
      </span>
      <input type="number" class="form-control"  id='mejanomor' style='padding:7px!important;text-align:start'  placeholder="Meja Nomor" >
      </div>

      <div class='d-flex'><div class='total-cart-costs'></div></div><div></div></div>`);
      this.cart_ele.append("<div class='panel-body cart-body'><div class='cart-products-list' id='show-cart'><!-- Dynamic Code from Script comes here--></div></div>");
      this.cart_ele.append(
        `<div class='cart-summary-container mt-4'>

        
      
          <div class='cart-offer'></div>
                  <div class='cart-total-amount'>
                  <label class='d-block mt-4 mb-2 fw-bold'>
                  Pakai Kode Voucher
                  </label>


                <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                <i class="fas fa-gift"></i>

                </span>
                <input type="text" class="form-control"  id='kodevoucher' style='padding:7px!important;text-align:start'  placeholder="KODE VOUCHER" aria-label="Username" aria-describedby="basic-addon1">
                <button class='btn btn-success'  onclick="cekvoucher()">Cek</button>
                </div>

                      <div class='spacer'></div>
                      <div class='d-flex justify-content-between align-items-center'>
                      <div class='fs-5'>Total</div>
                      <div class='d-flex fw-medium fs-5' >Rp.<div id='coret' class='total-cart-cost'>0</div>
                      <div class='total-cart-diskon ms-1'> - Diskon : Rp0</div>

                      </div>
                      </div></div>
                      <div class='cart-checkout'>
                      <input type='hidden' class='form-control fw-bold' id='kodeorder'/>
                      <button class='mt-4 btn btn-primary' onclick="proses_pesanan()">Proceed To Checkout</button>
                  </.div>
            </div>`
      );
    },
    _addProductstoCart: function () {},
    _updateCartDetails: function () {
      var mi = this;
      $(this.options.totalCartCostClass).hide();
      $(this.options.totalCartCostClass).fadeIn();

      $(this.options.cartProductListClass).html(mi._displayCart());
      $(this.options.totalCartCountClass).html("Your Cart " + mi._totalCartCount() + " items");
      $(this.options.totalCartCostClass).html(mi._totalCartCost());
    },
    _setCartbuttons: function () {},
    _setEvents: function () {
      var mi = this;
      $(this.options.addtoCartClass).on("click", function (e) {
        e.preventDefault();
        var name = $(this).attr("data-name");
        var cost = Number($(this).attr("data-price"));
        mi._addItemToCart(name, cost, cost, 1);
        mi._updateCartDetails();
      });

      $(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {
        var ci = this;
        e.preventDefault();
        var count = $(this).val();
        var name = $(this).attr("data-name");
        var cost = Number($(this).attr("data-price"));
        mi._removeItemfromCart(name, cost, cost, count);
        mi._updateCartDetails();
      });
    },
    /* Helper Functions */
    _addItemToCart: function (name, price, hargaasli, count) {
      for (var i in this.cart) {
        if (this.cart[i].name === name) {
          this.cart[i].count++;
          this.cart[i].price = price * this.cart[i].count;
          this.cart[i].hargaasli = price;
          this._saveCart();
          return;
        }
      }
      var item = new Item(name, price, hargaasli, count);
      this.cart.push(item);
      this._saveCart();
    },
    _removeItemfromCart: function (name, price, hargaasli, count) {
      for (var i in this.cart) {
        if (this.cart[i].name === name) {
          var singleItemCost = Number(price / this.cart[i].count);
          this.cart[i].count = count;
          this.cart[i].hargaasli = price;
          this.cart[i].price = singleItemCost * count;
          if (count == 0) {
            this.cart.splice(i, 1);
          }
          break;
        }
      }
      this._saveCart();
    },
    _clearCart: function () {
      this.cart = [];
      this._saveCart();
    },
    _totalCartCount: function () {
      return this.cart.length;
    },
    _displayCart: function () {
      var cartArray = this._listCart();
      console.log(cartArray);
      var output = "";
      if (cartArray.length <= 0) {
        output = "<h4>Your cart is empty</h4>";
      }
      for (var i in cartArray) {
        output +=
          "<div class='cart-each-product row'>\n\
                       <div class='namas name col-sm-4'>" +
          cartArray[i].name +
          "</div>\n\
                       <div class='quantityContainer col-sm-2'>\n\
                            <input type='number' id='input_" +
          cartArray[i].name.replaceAll(" ", "-") +
          "' class='quantity form-control item-count col-sm-4 ' data-name='" +
          cartArray[i].name +
          "' data-price='" +
          cartArray[i].price +
          "' min='0' value=" +
          cartArray[i].count +
          " name='number'>\n\
                       </div>\n\
          <div class='quantity-am col-sm-4'>Rp." +
          new Intl.NumberFormat().format(cartArray[i].price) +
          "</div>\n\
          <div class='quantity-am col-sm-1 text-end'><button onclick='del_list(this)' target-del='input_" +
          cartArray[i].name.replaceAll(" ", "-") +
          "' class='btn btn-danger py-0 border-0 btn-sm'>-</button></div></div>";
      }
      return output;
    },
    _totalCartCost: function () {
      var totalCost = 0;
      for (var i in this.cart) {
        totalCost += this.cart[i].price;
      }
      return new Intl.NumberFormat().format(totalCost);
    },
    _listCart: function () {
      var cartCopy = [];
      for (var i in this.cart) {
        var item = this.cart[i];
        var itemCopy = {};
        for (var p in item) {
          itemCopy[p] = item[p];
        }
        cartCopy.push(itemCopy);
      }
      return cartCopy;
    },
    _calGST: function () {
      var GSTPercent = 18;
      var totalcost = this.totalCartCost();
      var calGST = Number((totalcost * GSTPercent) / 100);
      return calGST;
    },
    _saveCart: function () {
      localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
    },
    _loadCart: function () {
      this.cart = JSON.parse(localStorage.getItem("shoppingCart"));
      if (this.cart === null) {
        this.cart = [];
      }
    },
  });
  /* Defining the Structure of the plugin 'simpleCart'*/
  $.fn.simpleCart = function (options) {
    return this.each(function () {
      $.data(this, "simpleCart", new simpleCart(this));
      console.log($(this, "simpleCart"));
    });
  };
})(jQuery, window, document);

function del_list(elems) {
  $("#" + $(elems).attr("target-del")).val(0);
  $("#" + $(elems).attr("target-del")).change();
}
var kodeorder = "#" + Math.floor(Math.random() * 999999);
var totalHargaDiskon = 0;
var pVoucher = 0;

function proses_pesanan() {
  // Collecting data for the table
  var data_meja = {
    nomormeja: $("#mejanomor").val(),
    kodeorderan: kodeorder,
  };

  // Combining table and order details into a single object
  var orderData = {
    datame: data_meja,
    datapes: JSON.parse(localStorage.getItem("shoppingCart")),
  };

  var tanggalSekarang = new Date();

  totalPesananJumlah = 0;
  $.each(JSON.parse(localStorage.getItem("shoppingCart")), function (indexInArray, valueOfElement) {
    totalPesananJumlah = Number(totalPesananJumlah) + Number(valueOfElement.count);
  });
  totalhargaSemua = $(".total-cart-cost").text().replaceAll(",", "");
  if (totalHargaDiskon == 0) {
    totalHargaDiskon = totalhargaSemua;
  }

  var dataLaporan = {
    tanggal: tanggalSekarang.toLocaleDateString("id-ID"),
    kodeorderan: kodeorder,
    nomormeja: $("#mejanomor").val(),
    totalItem: totalPesananJumlah,
    hargaAsli: totalhargaSemua,
    potonganVoucher: pVoucher,
    hargaDanPotongan: totalHargaDiskon,
  };
  var identifier = "kasir";
  // // Sending a POST request to the server
  $.ajax({
    type: "POST",
    url: "https://informatikaunwaha.com/restaurant/api_faris/add_dapur.php",
    data: { orderData: JSON.stringify(orderData) },
    dataType: "JSON",
    success: function (response) {
      var kodeorder = "#" + Math.floor(Math.random() * 999999);

      $.ajax({
        type: "POST",
        url: "https://informatikaunwaha.com/restaurant/notif/kirim.php",
        data: {
          pesan: "ORDERAN BARU MASUK",
        },
        dataType: "JSON",
        success: function (response) {},
      });
    },
  });
  masukkan_laporan(dataLaporan);
  alert("Ord");
}

function masukkan_laporan(arrays) {
  // alert(JSON.stringify(arrays));
  $.ajax({
    type: "POST",
    url: "https://informatikaunwaha.com/restaurant/api_sulton/api_inputlaporan.php",
    data: { dataLaporanFix: JSON.stringify(arrays) },
    dataType: "JSON",
    success: function (response) {
      alert(response.status);
      $.ajax({
        type: "GET",
        url: "https://informatikaunwaha.com/restaurant/api_ajeng/update_statusvou.php?kodevoucher=" + $("#kodevoucher").val(),
        dataType: "JSON",
        success: function (response) {
          localStorage.setItem("shoppingCart", "");
          $("#kodevoucher").val("");

          alert(JSON.stringify(arrays));
        },
      });
    },
  });
}

function cekvoucher(elem) {
  totalhargaSemua = $(".total-cart-cost").text().replaceAll(",", "");

  $.ajax({
    type: "GET",
    url: "https://informatikaunwaha.com/restaurant/api_ajeng/api.php/cari/kode_voucher/lk/" + $("#kodevoucher").val(),

    dataType: "JSON",
    success: function (response) {
      if (response.data) {
        if (response.data[0]["status"] == 0) {
          console.log(response.data[0]["potongan"] + "%");
          var has = Number(totalhargaSemua) * (Number(response.data[0]["potongan"]) / 100);
          totalHargaDiskon = totalhargaSemua - has;

          pVoucher = Number(response.data[0]["potongan"]);

          $("#coret").css("text-decoration", "line-through");
          $("#coret").css("color", "red");
          $(".total-cart-diskon").text(" - Diskon : Rp." + totalHargaDiskon);
        } else {
          alert("Voucher Sudah Di Gunakan");
        }
      } else {
        totalHargaDiskon = totalhargaSemua;
        alert("Kode Voucher Tidak Di Temukan");
      }
    },
  });
}
