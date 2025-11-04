const joi = import("joi");

const JoiObject = joi.object({
  username: joi.string().required(),
  password: joi.string().min(8).required(),
});
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const submit = document.getElementById("submit");

async function ValidateAndUpload() {
  const { value, error } = JoiObject.validate({ username, password });
  if (error) {
    console.error("error on line 14, something wrong with joi validation");
  } else {
    await fetch("https://noteapp-ri4x.onrender.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
  }
}
