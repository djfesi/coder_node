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
