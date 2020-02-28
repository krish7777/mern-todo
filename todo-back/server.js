const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const request = require("request");
const Todo = require("./models/todo.models");
var extractCss = require("extract-css");
const axios = require("axios");

const todoRoutes = express.Router();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());
mongoose.connect("mongodb://127.0.0.1:27017/todos", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/todos", todoRoutes);

// request("http://stackabuse.com", function(err, res, body) {
//   console.log(body);
// });

todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      console.log(todos);
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route("/add").post((req, res) => {
  let todo = new Todo(req.body);
  console.log(req.body);
  console.log(todo);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send("data is not found");
    todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;
    todo
      .save()
      .then(todo => {
        res.json("Todo updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

todoRoutes.route("/delete/:id").get((req, res) => {
  console.log("almost ");
  Todo.deleteOne({ _id: req.params.id }, err => {
    if (err) console.log(err);
  });
  res.json("Deleted");
});

axios.get("https://www.google.com/").then(res => {
  console.log(res);
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
