const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const port = process.env.PORT || 5000;

require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akkku.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");
    
    
    app.post('/addEvent', (req, res) =>{
        const newEvent = req.body;
        console.log(newEvent);
       eventCollection.insertOne(newEvent)
       .then(result =>{
           console.log('inserted result: ', result.insertedCount);
           res.send(result.insertedCount > 0);
       })
    })

    app.get('/events', (req, res) =>{
        eventCollection.find()
        .toArray((err, events) =>{
            res.send(events);
        })
    })

    app.delete('deleteEvent/:id', (req, res) =>{
        const id = ObjectID(req.params.id)
        eventCollection.findOneAndDelete({_id: id})
        .then(result => res.send(result));
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port);