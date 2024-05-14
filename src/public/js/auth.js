document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const email = formData.get("email");
    const password = formData.get("password");
    await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((result) => result.json())
      .then((json) => {
        if (json.cartId) localStorage.setItem("cartId", json.cartId);
        if (json.token) window.location.href = "./products";
      });
  });
