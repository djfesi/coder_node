// Eliminar producto de bbdd
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-delete-product")) {
    const productId = event.target.dataset.productId;
    if (productId) {
      fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Product deleted",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});

// Validacion para los botones del carrito de compra
document.addEventListener("DOMContentLoaded", function () {
  const cartId = localStorage.getItem("cartId");
  if (cartId) {
    const generateCartBtn = document.getElementById("generate-cart-btn");
    const shoppingCartBtn = document.getElementById("shopping-cart-btn");
    if (generateCartBtn) generateCartBtn.style.display = "none";
    if (shoppingCartBtn) shoppingCartBtn.style.display = "block";
    const cartLink = document.getElementById("shopping-cart-link");
    cartLink.href = `/carts/${cartId}`;
  } else {
    const generateCartBtn = document.getElementById("generate-cart-btn");
    const shoppingCartBtn = document.getElementById("shopping-cart-btn");
    if (generateCartBtn) generateCartBtn.style.display = "block";
    if (shoppingCartBtn) shoppingCartBtn.style.display = "none";
    console.log("No hay carrito generado.");
  }
});

// Crear carrito de compras
$(document).ready(function () {
  $("#generate-cart-btn").click(function (event) {
    event.preventDefault();
    fetch("/api/carts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("cartId", data.id);
        window.location.href = "/carts/" + data.id;
      })
      .catch((error) => {
        console.error("Error al generar el carrito:", error);
      });
  });
});

// Agregar productos al carro
document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = button.getAttribute("data-product-id");
      const cartId = localStorage.getItem("cartId");
      if (cartId) {
        fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: "POST",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al agregar producto al carrito");
            }
            Swal.fire({
              text: "Producto agregado al carrito",
              toast: true,
              position: "top-right",
              timer: 3000,
              timerProgressBar: true,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Hubo un error al agregar el producto al carrito",
            });
          });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Primero debes generar un carrito",
        });
      }
    });
  });
});

// Finalizar compra
document.addEventListener("DOMContentLoaded", function () {
  const btnPurcharse = document.querySelector(".purcharse");
  btnPurcharse.addEventListener("click", function () {
    const cartId = localStorage.getItem("cartId");
    if (cartId) {
      fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw err;
            });
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            text: "Compra realizada",
            toast: true,
            position: "top-right",
            timer: 5000,
            timerProgressBar: true,
          }).then(() => {
            if (
              data.unavailableProducts &&
              data.unavailableProducts.length > 0
            ) {
              data.unavailableProducts.forEach((product) => {
                Swal.fire({
                  title: "Producto sin stock",
                  text: `El producto "${product}" no tiene stock disponible.`,
                  toast: true,
                  position: "top-right",
                  timer: 5000,
                  timerProgressBar: true,
                });
                setTimeout(() => {}, 5000);
              });
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "No se pudo completar la compra",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "No tienes generado un carrito de compras",
      });
    }
  });
});

// Cerrar sesion
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("log-out")) {
    fetch(`/api/sessions/logout`, {
      method: "GET",
    })
      .then((response) => {
        localStorage.clear();
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
