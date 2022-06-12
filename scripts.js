if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", compra);
} else {
  compra();
}

function compra() {
  var removerItemDelCarritoBoton =
    document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removerItemDelCarritoBoton.length; i++) {
    var button = removerItemDelCarritoBoton[i];
    button.addEventListener("click", removerItemDelCarrito);
  }

  var insumosCompra = document.getElementsByClassName("carrito-cantidad-input");
  for (var i = 0; i < insumosCompra.length; i++) {
    var input = insumosCompra[i];
    input.addEventListener("change", cambioDeCantidad);
  }

  var botoncomprarProducto = document.getElementsByClassName("producto-button");
  for (var i = 0; i < botoncomprarProducto.length; i++) {
    var button = botoncomprarProducto[i];
    button.addEventListener("click", agregadoAlCarrito);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", comprarProducto);
}

function comprarProducto() {
  Swal.fire({
    title: "Gracias por tu compra.",
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#fff ",
    backdrop: `
          rgba(0,0,123,0.4)
          url("https://image.shutterstock.com/image-vector/vector-lettering-gracias-stars-handwritten-260nw-1502688671.jpg")
          left top
          no-repeat
        `,
  });

  var carritoItems = document.getElementsByClassName("carrito-items")[0];
  while (carritoItems.hasChildNodes()) {
    carritoItems.removeChild(carritoItems.firstChild);
  }
  totalDeLaCompra();
}

function removerItemDelCarrito(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  let timerInterval;
  Swal.fire({
    title: "Eliminaste el producto con exito !",
    html: "I will close in <b></b> milliseconds.",
    timer: 900,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
  totalDeLaCompra();
}

function cambioDeCantidad(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  totalDeLaCompra();
}

function agregadoAlCarrito(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var nombre = shopItem.getElementsByClassName("producto-nombre")[0].innerText;
  var costo = shopItem.getElementsByClassName("producto-costo")[0].innerText;
  var imagenSrc = shopItem.getElementsByClassName("producto-imagen")[0].src;
  agregarItemAlCarrito(nombre, costo, imagenSrc);
  totalDeLaCompra();
}

function agregarItemAlCarrito(nombre, costo, imagenSrc) {
  var carritoRow = document.createElement("div");
  carritoRow.classList.add("carrito-row");
  var carritoItems = document.getElementsByClassName("carrito-items")[0];
  var carritoItemNames = carritoItems.getElementsByClassName(
    "carrito-item-nombre"
  );
  for (var i = 0; i < carritoItemNames.length; i++) {
    if (carritoItemNames[i].innerText == nombre) {
      let timerInterval;
      Swal.fire({
        title:
          "Ya agregaste este producto! si deseas agregar otro, haslo desde tu carrito",
        html: "I will close in <b></b> milliseconds.",
        timer: 1250,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
      return;
    }
  }
  var insumosContenido = `
        <div class="carrito-item carrito-column">
            <img class="carrito-item-imagen" src="${imagenSrc}" width="100" height="100">
            <p class="carrito-item-nombre">${nombre}</p>
        </div>
        <p class="carrito-costo carrito-column">${costo}</p>
        <div class="carrito-cantidad carrito-column">
            <input class="carrito-cantidad-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
  carritoRow.innerHTML = insumosContenido;
  carritoItems.append(carritoRow);
  carritoRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removerItemDelCarrito);
  carritoRow
    .getElementsByClassName("carrito-cantidad-input")[0]
    .addEventListener("change", cambioDeCantidad);
}

function totalDeLaCompra() {
  var carritoItemContainer =
    document.getElementsByClassName("carrito-items")[0];
  var carritoRows = carritoItemContainer.getElementsByClassName("carrito-row");
  var total = 0;
  for (var i = 0; i < carritoRows.length; i++) {
    var carritoRow = carritoRows[i];
    var costoElement = carritoRow.getElementsByClassName("carrito-costo")[0];
    var quantityElement = carritoRow.getElementsByClassName(
      "carrito-cantidad-input"
    )[0];
    var costo = parseFloat(costoElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + costo * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("carrito-total-costo")[0].innerText =
    "$" + total;
}
