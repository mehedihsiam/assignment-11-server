const express = require('express');
const { MongoClient } = require('mongodb');
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