require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
app.use(express.static('dist'))
app.use(express.json())
const morgan = require('morgan')
// //for crosss site
const cors = require('cors')
app.use(cors())// allow all

morgan.token('data', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ' '
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p><div>Phonebook has info for ${persons.length} people</div><br/><div>${new Date()}</div></p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    // eslint-disable-next-line no-undef
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log('body', body)

  if (body === undefined) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name is required'
    })
  }

  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number is required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(saveperson => {
    res.json(saveperson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
