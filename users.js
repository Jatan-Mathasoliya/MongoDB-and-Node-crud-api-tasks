const express = require('express')
const { MongoClient } = require('mongodb')

const app = express()
const port = 3000
const url = "mongodb://127.0.0.1:27017"
const dbName = "mongoDB"

app.use(express.json())

let db, users;

async function connectDB() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true })
        console.log("MongoDB connected")

        db = client.db(dbName)
        users = db.collection('users')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connectDB();

app.get('/users', async (req, res) => {
    try {
        const result = await users.find().toArray()
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.get('/users/:userID', async (req, res) => {
    try {
        const id = req.params.userID;
        const result = await users.findOne({ "userId": id })
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.post('/users', async(req, res)=>{
    try{
        const update = req.body;
        const result = await users.insertOne(update);
        res.status(201).send("User added");
    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.patch('/users/:userID', async(req, res)=>{
    try{
        const id = req.params.userID;
        const update = req.body;
        const result = await users.updateOne({"userId":id},{$set:update})
        res.status(201).send("User updated");

    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.delete('/users/:userID', async(req, res)=>{
    try{
        const id = req.params.userID;
        const result = await users.deleteOne({"userId":id})
        res.status(201).send("User deleted");
    }catch(err){
        res.status(400).send("Error", err)
    }
})