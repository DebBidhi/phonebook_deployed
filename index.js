require('dotenv').config()
const express = require('express')
const app = express()
const Person=require("./models/person")
app.use(express.static('dist'))
app.use(express.json());
var morgan=require('morgan')
// //for crosss site 
// const cors = require('cors')
// app.use(cors())//allow all//** */

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " ";
  });

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :data")
  );


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons=>{
        res.join(persons)
    })
    
})

// app.get('/info', (req, res) => {
//     // console.log('GET /info')
//     res.send(`<p><div>Phonebook has info for ${persons.length} people</div><br/><div>${new Date()}</div></p>`)
// })

app.get('/api/persons/:id', (req, res,next) => {
    Person.findById(request.params.id)
    .then(person=>{
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }

    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    persons = persons.filter(person => person.id !== id)
    // console.log(`DELETE /api/persons/${id}`)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(body.content===undefined) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    if (!body.name) {
        return res.status(400).json({
            error: 'name is required'
        });
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number is required'
        });
    }

    const person=new Person({
        name:body.name,
        number:body.number
    })

    // const existingPerson = persons.find(person => person.name === body.name);

    // if (existingPerson) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     });
    // }

    person.save().then(saveperson=>{
        res.json(saveperson)
    })
});


const unknownEndpoint = (request, response) => {
response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


// error handler
const errorHandler = (error, request, response, next) => {
console.error(error.message)

if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
} 

next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
