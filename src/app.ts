const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.get("/notes", async (req: any, res: any) => {
    const tasks = await prisma.Note.findMany();
    res.json(tasks);
});

app.get("/notes/:id", async (req:any, res:any) => {
    // app.ts - Your /newnote route
app.post("/newnote", async (req: any, res: any) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Description required" });
  }

  try {
    const note = await prisma.Note.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(note);
  } catch (error) {
    // 🚨 CATCH THE ERROR HERE 🚨
    console.error("Prisma Create Error:", error);
    // Send a safe 500 error response instead of crashing the server
    res.status(500).json({ error: "Failed to create note due to server error." });
  }
});
});

app.post("/newnote", async (req:any,res:any) => {
    const {title, content} = req.body;

    if (!title || !content) {
        res.status(400).json({ error: "Description required" });
        return;
    }

    const note = await prisma.Note.create({
        data: {
        title,
        content
        },
    });

    res.status(201).json(note);
});

app.put("/notes/:id", async (req:any, res:any) => {
    const id = parseInt(req.params.id, 10);
    try {
        const { title, content } = req.body;

        await prisma.Note.update({
            where: {id},
            data: {
                title,
                content
            }
        })
        res.send(`updated note with id ${id}!`)
    } catch {
        res.status(404).json({ error: "Note not found" });
    }
});

app.delete("/notes/:id", async (req:any, res:any) => {
    const id = parseInt(req.params.id, 10);
    try {
        await prisma.Note.delete({
            where: {id},
        })
        res.send(`deleted note with id ${id}!`)
    } catch {
        res.status(404).json({ error: "Note not found" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});