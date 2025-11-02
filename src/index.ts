const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// GET all tasks
app.get("/tasks", async (req: any, res: any) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// GET single task
app.get("/tasks/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(task);
});

// POST create task
app.post("/tasks", async (req: any, res: any) => {
  const { description } = req.body;

  if (!description) {
    res.status(400).json({ error: "Description required" });
    return;
  }

  const task = await prisma.task.create({
    data: {
      description,
      status: false,
    },
  });

  res.status(201).json(task);
});

// PUT update task
app.put("/tasks/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  const { description, status } = req.body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(description && { description }),
      ...(status !== undefined && { status }),
    },
  });

  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.task.delete({
    where: { id },
  });

  res.json({ message: "Task deleted" });
  } catch {
    res.status(404).json({ error: "Task not found" })
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});