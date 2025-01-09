const express = require('express')
const { MongoClient } = require('mongodb')

const port = 3002;
const app = express();
const url = "mongodb://127.0.0.1:27017";
const dbName = "mongoDB";

app.use(express.json())

async function connectDB() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true })
        console.log("MongoDB connected")

        db = client.db(dbName)
        issues = db.collection('issues')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

connectDB();

app.get('/repositories/:repoID/issues', async (req, res) => {
    try {
        const id = req.params.repoID
        const result = await issues.find({"repoId":id}).toArray()
        res.status(200).json(result)
    } catch (err) {
        res.status(400).send("Error", err)
    }
})

app.post('/issues', async(req, res)=>{
    try{
        const update = req.body;
        const result = await issues.insertOne(update);
        res.status(201).send("Issue added");
    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.patch('/issues/:issueID', async(req, res)=>{
    try{
        const id = req.params.issueID;
        const update = req.body;
        const result = await issues.updateOne({"issueId":id},{$set:update})
        res.status(201).send("Issue updated");

    }catch(err){
        res.status(400).send("Error", err)
    }
})

app.delete('/issues/:issueID', async(req, res)=>{
    try{
        const id = req.params.issueID;
        const result = await issues.deleteOne({"issueId":id})
        res.status(201).send("Issue deleted");
    }catch(err){
        res.status(400).send("Error", err)
    }
})