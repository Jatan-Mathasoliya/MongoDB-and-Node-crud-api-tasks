const express = require('express')
const { MongoClient } = require('mongodb')

const port = 3004;
const app = express();
const url = "mongodb://127.0.0.1:27017";
const dbName = "mongoDB";

app.use(express.json())

async function connectDB() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true })
        console.log("MongoDB connected")

        db = client.db(dbName)
        pr = db.collection('commits')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connectDB();

app.get('/repositories/:repoId/commits', async (req, res) => {
    try {
        const id = req.params.repoId
        const result = await pr.find({"repoId":id}).toArray()
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.post('/commits', async(req, res)=>{
    try{
        const update = req.body;
        const result = await pr.insertOne(update);
        res.status(201).send("Issue added");
    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.delete('/commits/:commitId', async(req, res)=>{
    try{
        const id = req.params.commitId;
        const result = await pr.deleteOne({"commitId":id})
        res.status(201).send("Issue deleted");
    }catch(err){
        res.status(400).send("Error", err)
    }
})