const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());


// Booklistingadmin222 & zrjXkrebTlHQgzIV

console.log();



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.jds8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const bookCollection = client.db('allBooksDB').collection('books');
        // get or read the books
        app.get('/books', async(req,res) =>{
            const cursor = bookCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })
        // to create single data server for update 
        app.get('/books/:id' ,async (req,res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await bookCollection.findOne(query)
            res.send(result)
            console.log(result);
            
        })
        // create a data through post
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book)
            res.send(result);
        })
        // update any data
        
        // delete data from database 
        app.delete('/books/:id', async(req,res) => {
            const id = req.params.id;
            const qeury ={_id: new ObjectId(id)}
            const result = await bookCollection.deleteOne(qeury)
            res.send(result)    
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('my book list server is running yahooooo')
})

app.listen(port, () => {
    console.log(`port is runninng in ${port}`);

})