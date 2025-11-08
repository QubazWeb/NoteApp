const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const joi = require("joi");
import path from 'path';
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use((req:any , res:any, next:any) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

app.get("/", (req:any, res:any) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

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
    console.error("Prisma Create Error:", error);
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

app.get("/signup", (req:any, res:any) => {
  res.sendFile(__dirname + '/public/signup.html');
})

app.post("/signup", async (req:any, res:any) => {
  try {
    const JoiObject = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().min(8).required(),
    });

    const { error, value } = JoiObject.validate({
      username: req.body.username,
      password: req.body.password
    });

    if (error) {
      res.status(400).send("there was an error with validation");
      return;
    }

    const UserExists = await prisma.User.findUnique({where: {username:value.username}})

    if (UserExists) {
    res.status(409).send("Failed to create user, already exists :(");
    return;
    }

    const encrypted_password = await bcrypt.hash(value.password, 10);
    await prisma.User.create({data: {username: value.username, password: encrypted_password}})
    res.status(201).send("User created! " + value.username);
    return;

  } catch (error) {
    console.error("Database Error: " + error)
    res.status(500).send("error with database");
  }
});

app.get("/login", (req:any, res:any) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post("/login", async (req:any, res:any) => {
  try {
    const JoiObject = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().min(8).required(),
    });

    const { error, value } = JoiObject.validate({
      username: req.body.username,
      password: req.body.password
    });

    if (error) {
      res.status(400).send("there was an error with validation");
      return;
    }

    const UserExists = await prisma.User.findUnique({where: {username:value.username}})
    bcrypt.compare(value.password, UserExists.password, function(err:any,result:any) {
        if (UserExists && result) {
            // do logic 
            res.status(200).send("succesfully logged in");
            return;
        }
        else {
            res.status(401).send("Password or username is incorrect");
        }
    });
  } catch (error) {
    console.error("Database Error: " + error)
    res.status(500).send("error with database");
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});