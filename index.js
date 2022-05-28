const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
var jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sahbn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

const itemCollection = client.db("computerManufacturer").collection("item");
const orderCollection = client.db('computerManufacturer').collection('order');
const userCollection = client.db('computerManufacturer').collection('user');
const reviewCollection = client.db("computerManufacturer").collection("review");


        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        app.get('/order', async (req, res) => {
            const user = req.query.user;
            const query = { user: user };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //place an order 
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

    }
    finally {
    }
}

run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Computer Manufacturer Server running');
})

app.listen(port, () => {
    console.log(`Computer Manufacturer Server is Listening on port ${port}`)
})

