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
      
        const bookCollection = client.db('allBooksDB').collection('books');
        const userCollection = client.db('allusersDB').collection('users');
        // get or read the books
        app.get('/books', async (req, res) => {
            const cursor = bookCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })
        // to create single data server for update 
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.send(result)

        })
        // create a data through post
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book)
            res.send(result);
        })
        // update any data
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateBook = req.body;
            const Book = {
                $set: {
                    name: updateBook?.name,
                    author: updateBook?.author,
                    category: updateBook?.category,
                    price: updateBook?.price,
                    photo: updateBook?.photo
                }
            }
            const result = await bookCollection.updateOne(filter, Book, options)
            console.log(result);

            res.send(result)
        })
        // delete data from database 
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const qeury = { _id: new ObjectId(id) }
            const result = await bookCollection.deleteOne(qeury)
            res.send(result)
        })
        // to get the user data from server and database 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })
        // create data for users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result);
        })
        // get the single users
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        // update the user
        app.put('/users/:id',async(req,res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = {upsert: true}
            const updateuser = req.body
            const aUser = {
                $set:{
                    name:updateuser?.displayName,
                    photo:updateuser?.photoURL
                }
            } 
            const result = await userCollection.updateOne(filter,aUser,options)
            res.send(result)
            console.log(updateuser);
            
        })
        // delete users from server and database
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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