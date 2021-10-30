const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middle were
app.use(cors());
app.use(express.json());



// Connection URL
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.84pml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// connect to DB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// DB function
async function run() {
    try {
        await client.connect();
        console.log('DB Connected');


        const database = client.db("travelBees");
        const reviewCollection = database.collection("reviews");
        const blogCollection = database.collection("blogs");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("orders");

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({}).sort({ _id: -1 });
            const packages = await cursor.toArray();
            res.send(packages);
        });
        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            // console.log(result);
            res.json(result);
        });
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await packageCollection.findOne(query)
            res.send(package);
        });
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            // console.log(result);
            res.json(result);
        });
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: (email) }
            const orders = await orderCollection.find(query);
            const result = await orders.toArray();
            res.json(result);
        });
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // console.log(query)
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

// call the DB function
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
});

app.listen(port, () => {
    console.log('Server is running');
})