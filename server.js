const express = require('express'); //alt+shift+f  prittier
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('mypublic'));
app.use(express.json())
const path = require('path');
const { mongoClient } = require("./db");
const { ObjectId } = require("mongodb");

app.use('/file', express.static(path.join(__dirname, 'public')))
// 1) entity shape ?
// 2) routes (api) ?
// 3) how to mark finished todo task, server api that task has ended

app.get("/", async (req, res) => {
    const mongoconn = await mongoClient.connect();
    const mytasks = await mongoconn.db('mydatabase').collection('mytasks').find().toArray();
    res.json(mytasks)
})

app.post("/", async (req, res) => {
    const todo = {
        title: req.body.title,
        isCompleted: false
    }
    const mongoconn = await mongoClient.connect();
    mongoconn.db('mydatabase').collection('mytasks').insertOne(todo);
    res.json(todo);
})

app.put("/finishtask/:id", async (req, res) => {
    // mark task as completed
    let id = req.params.id;
    const mongoconn = await mongoClient.connect();
    mongoconn.db('mydatabase').collection('mytasks').updateOne({ _id: new ObjectId(id) }, { $set: { isCompleted: true } });
    mongoconn.db('mydatabase').collection('mytasks').updateOne({ _id: new ObjectId(id) }, { $set: { title: "changed title" } });

    res.json("task finished");
    //finish task
})

// allow update title

app.delete("/:id", async (req, res) => {
    let id = req.params.id;
    const mongoconn = await mongoClient.connect();
    mongoconn.db('mydatabase').collection('mytasks').deleteOne({ _id: new ObjectId(id) });
    res.json("deleted");
})

app.listen(4000, () => {
    console.log("listening on port")
})


