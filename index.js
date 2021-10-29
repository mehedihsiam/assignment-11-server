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
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await packageCollection.findOne(query)
            res.send(package);
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