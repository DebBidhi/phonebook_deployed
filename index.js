const express = require('express')
const app = express()
app.use(express.json());
var morgan=require('morgan')
app.use(express.static('dist'))

morgan.token("data", (request) => {
    return request.method === "POST" ? JSON.stringify(request.body) : " ";
  });

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :data")
  );

let persons=[
    {
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    // console.log('GET /api/persons')
    res.json(persons)
})

app.get('/info', (req, res) => {
    // console.log('GET /info')
    res.send(`<p><div>Phonebook has info for ${persons.length} people</div><br/><div>${new Date()}</div></p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        // console.log(`GET /api/persons/${id}`)
        res.json(person)
    } else {
        // console.log(`GET /api/persons/${id} - Not Found`)
        res.status(404).end()
    }
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    persons = persons.filter(person => person.id !== id)
    // console.log(`DELETE /api/persons/${id}`)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
};
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body) {
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

    const existingPerson = persons.find(person => person.name === body.name);

    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons.push(person);
    // console.log(`POST /api/persons - ${person.name} added`);
    res.status(201).json(person);
});


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
