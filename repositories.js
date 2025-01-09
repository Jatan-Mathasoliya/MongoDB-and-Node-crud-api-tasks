const express = require('express')
const { MongoClient } = require('mongodb')

const app = express()
const port = 3001
const url = "mongodb://127.0.0.1:27017"
const dbName = "mongoDB"

app.use(express.json())

let db, users;

async function connectDB() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true })
        console.log("MongoDB connected")

        db = client.db(dbName)
        users = db.collection('repositories')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connectDB();

app.get('/repo', async (req, res) => {
    try {
        const result = await users.find().toArray()
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.get('/repo/:repoID', async (req, res) => {
    try {
        const id = req.params.repoID;
        const result = await users.findOne({ "repoId": id })
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.post('/repo', async(req, res)=>{
    try{
        const update = req.body;
        const result = await users.insertOne(update);
        res.status(201).send("User added");
    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.patch('/repo/:repoID', async(req, res)=>{
    try{
        const id = req.params.repoID;
        const update = req.body;
        const result = await users.updateOne({"repoId":id},{$set:update})
        res.status(201).send("repo updated");

    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.delete('/repo/:repoID', async(req, res)=>{
    try{
        const id = req.params.repoID;
        const result = await users.deleteOne({"repoId":id})
        res.status(201).send("Repo deleted");
    }catch(err){
        res.status(400).send("Error", err)
    }
})