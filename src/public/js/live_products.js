const socket = io();

socket.on("newProduct", (product) => {
  Swal.fire({
    text: `New product: ${product.title}`,
    toast: true,
    position: "top-right",
    timer: 2000,
    showConfirmButton: false,
  });
  const card_product = document.getElementById("row-products-live");
  card_product.innerHTML += `
  <div class="col-md-4 mb-4">
  <div class="card">
    <img
      src="${product.thumbnail}"
      class="card-img-top"
      alt="Product Thumbnail"
    />
    <div class="card-body">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text">${product.description}</p>
      <p class="card-text">Price: ${product.price}</p>
    </div>
    <button class="btn btn-danger btn-delete-product" data-product-id="${product._id}">Delete</button>
  </div>
</div>`;
});

socket.on("removeProduct", (productId) => {
  const productElement = document.querySelector(
    `[data-product-id="${productId}"]`
  );
  if (productElement) {
    productElement.closest(".col-md-4.mb-4").remove();
    Swal.fire({
      text: `A product has been removed`,
      toast: true,
      position: "top-right",
      timer: 3000,
      showConfirmButton: false,
    });
  }
});
