const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('Computer Manufacturer Server running');
})

app.listen(port, () => {
    console.log(`Computer Manufacturer Server is Listening on port ${port}`)
})
