const socket = io();

const chatBox = document.getElementById("chatBox");
let messageLogs = document.getElementById("messageLogs");

if (!localStorage.getItem("user")) {
  Swal.fire({
    title: "Identificación",
    input: "text",
    text: "Ingresa tu correo para identificarte",
    inputValidator: (value) => {
      if (!value) {
        return "¡Necesitas un correo para ingresar!";
      }
      return false;
    },
    allowOutsideClick: false,
  }).then((input) => {
    localStorage.setItem("user", input.value);
    socket.emit("user-connected", input.value);
  });
}

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const message = chatBox.value;
    if (message.trim().length > 0) {
      let user = localStorage.getItem("user");
      socket.emit("message", { user, message });
      chatBox.value = "";
    }
  }
});

socket.on("message", (data) => {
  const { user, message } = data;
  messageLogs.innerHTML += `${user} dice: ${message}<br>`;
});

socket.on("user-joined", (username) => {
  Swal.fire({
    text: `El usuario ${username} se ha conectado`,
    toast: true,
    position: "top-right",
    timer: 3000,
    timerProgressBar: true,
  });
});
