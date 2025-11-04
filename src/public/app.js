const title = document.getElementById("input").value;
const content = document.getElementById("textarea").value;
const Notes = document.getElementById("Notes");

async function OnClick() {
  event.preventDefault();
  const title = document.getElementById("input").value;
  const content = document.getElementById("textarea").value;
  if (content && title) {
    await fetch("https://noteapp-ri4x.onrender.com/newnote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
  }
  Notes.innerHTML = "";
  await Main();
}

async function EditNote() {
  event.preventDefault();
  const id = document.getElementById("EditID").value;
  const title = document.getElementById("EditTitle").value;
  const content = document.getElementById("EditContent").value;
  if (content && title && id > 0) {
    await fetch(`https://noteapp-ri4x.onrender.com/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
  }
  Notes.innerHTML = "";
  await Main();
}

async function DeleteNote() {
  event.preventDefault();
  const id = document.getElementById("DeleteID").value;
  if (id > 0) {
    await fetch(`https://noteapp-ri4x.onrender.com/notes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }
  Notes.innerHTML = "";
  await Main();
}

async function Main() {
  const response = await fetch("https://noteapp-ri4x.onrender.com/notes");
  const data = await response.json();
  if (data && data.length > 0) {
    data.forEach((note) => {
      const h2 = document.createElement("h2");
      const h3 = document.createElement("h3");
      const h4 = document.createElement("h4");
      h2.innerText = note.title;
      h3.innerText = note.content;
      h4.innerText = "ID: " + note.id;
      Notes.append(h2);
      Notes.append(h3);
      Notes.append(h4);
    });
  }
}

Main();
