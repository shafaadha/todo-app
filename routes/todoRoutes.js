const express = require("express");
const router = express.Router();
const Todo = require("../model/todo");
const expressLayouts = require("express-ejs-layouts");
const upload = require("../utils/upload");
const fs = require("fs").promises;

const cron = require("node-cron");
const Pusher = require("pusher");
const path = require("path");

const pusher = new Pusher({
  appId: "",
  key: "",
  secret: "",
  cluster: "",
  useTLS: true,
});

//pengingat otomatis
cron.schedule("* * * * *", async () => {
  const currentTime = new Date();
  const reminderTime = new Date(currentTime.getTime() + 10 * 60000);

  try {
    const todos = await Todo.find({
      dueDate: { $lte: reminderTime, $gte: currentTime },
      completed: false,
    });

    todos.forEach((todo) => {
      pusher.trigger("todo-channel", "reminder-event", {
        message: `Tugas "${todo.title}" akan jatuh tempo dalam 10 menit.`,
      });
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
});

// Menampilkan halaman utama
router.get("/", async (req, res) => {
  const category = req.query.category || "All";
  const dateTime = new Date();
  const day = dateTime.getDate();
  const status = req.query.status || "All";
  const search = req.query.search || "";
  const dueDateFilter = req.query.dueDate || "";

  try {
    // Initialize filter object
    const filter = {};

    if (category !== "All") {
      filter.category = category;
    }

    if (status === "completed") {
      filter.completed = true;
    } else {
      filter.completed = false;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { task: { $regex: search, $options: "i" } },
      ];
    }

    const todos = await Todo.find(filter);

    const sortedByPriority = todos.sort((a, b) => {
      const order = {
        High: 1,
        Medium: 2,
        Low: 3,
      };
      return order[a.priority] - b[b.priority];
    });
    res.render("index", {
      todos: todos,
      category: category,
      date: day,
      search: search,
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send("Error fetching todos");
  }
});

router.get("/work", async (req, res) => {
  try {
    const todos = await Todo.find({ category: "Work" });
    res.render("category", { todos: todos, category: "Work" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

router.get("/personal", async (req, res) => {
  try {
    const todos = await Todo.find({ category: "Personal" });
    res.render("category", { todos: todos, category: "Personal" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// Menambahkan todo baru
router.post("/add", async (req, res) => {
  try {
    // const attachments = req.files ? req.files.map(file => `/uploads/${file.filename}`) : null;
    const todo = new Todo({
      title: req.body.title,
      task: req.body.task,
      category: req.body.category,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      attachments: null,
    });

    await todo.save();
    console.log(todo);
    res.redirect("/");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/upload/:id", (req, res) => {
  const todoId = req.params.id;
  res.render("upload_file", { todoId });
});

//upload file
router.post("/upload/:id", upload.single("attachments"), async (req, res) => {
  try {
    const fileName = req.file.filename;

    await Todo.findByIdAndUpdate(req.params.id, { attachments: fileName });
    console.log(req.file);
    res.redirect("/");
    // res
    //   .status(200)
    //   .json({ message: "File uploaded successfully", file: req.file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed" });
  }
});

// Tandai todo sebagai selesai
router.get("/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = true;
    await todo.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Unable to complete task");
  }
});

// Hapus todo
router.delete("/delete/:id", async (req, res) => {
  try {
    // Fetch by ID
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Task not found");
    }

    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      todo.attachments
    );
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (err) {
      console.error(`Error accessing or deleting file: ${filePath}`, err);
    }
    await Todo.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to delete task");
  }
});

//tampilan edit
// GET route to edit a Todo by ID
router.get("/edit/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.render("edit", {
      layout: "layouts/layout",
      title: "Update note",
      todo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// PUT route to update a Todo by ID
router.put("/edit", async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.body.todo_id }, // Ensure todo_id is used here
      {
        $set: {
          title: req.body.title,
          task: req.body.task,
        },
      }
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to update todo");
  }
});

//proses edit
router.put("/edit", async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.body.todo_id },
      {
        $set: {
          title: req.body.title,
          task: req.body.task,
          category: req.body.category,
        },
      }
    );
    res.redirect("/");
  } catch (err) {
    console.error(err); // Log error
    res.status(500).send("Unable to update todo");
  }
});

module.exports = router;
