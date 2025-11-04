const username = document.getElementById("username");
const password = document.getElementById("password");

async function ValidateAndUpload() {
  event.preventDefault();
  if (!username.value || !password.value) {
    console.error("Username and password required");
    return;
  }

  await fetch("https://noteapp-ri4x.onrender.com/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
}
