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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run() {
    try {
        await client.connect();

const itemCollection = client.db("computerManufacturer").collection("item");
const orderCollection = client.db('computerManufacturer').collection('order');
const userCollection = client.db('computerManufacturer').collection('user');
const reviewCollection = client.db("computerManufacturer").collection("review");

        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'forbidden' });
            }
        }
        //get all items
        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        //get item by id
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });
        //add an item
        app.post('/item', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send(result);
        })
       
        //delete an item
        app.delete('/item/:id', async (req, res) => {
            const id = req.params._id;
            const filter = { id: id };
            const result = await itemCollection.deleteOne(filter);
            res.send(result);
        });

        //update modified item
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const item = req.body;
            const filter = { id: id };
            const options = { upsert: true };
            const updateDoc = {
                $set: item,
            };
            const result = await itemCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //get all orders of all users
        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //post or place order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

       //get order by id
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query);
            res.send(order);
        })

        //delete an order by id
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { id: id };
            const result = await orderCollection.deleteOne(filter);
            res.send(result);
        });

        //update modified order
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const order = req.body;
            const filter = { id: id };
            const options = { upsert: true };
            const updateDoc = {
                $set: order,
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //get all reviews
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //post a review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // get review by id
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        
        //get an admin by email
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        //update after making a user an admin
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        //get all users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        //post or place order
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        
        //update user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
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

