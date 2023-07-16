require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(express.json())

// define a token for logging request data
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

// serve the phonebook frontend from part2
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then((persons) => {
    const info = `Phonebook has info for ${persons.length} people`
    const now = new Date()

    response.send(`<p>${info}</p><p>${now}</p>`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  // if (persons.map((p) => p.name).includes(name)) {
  //   return response.status(400).json({ error: 'name must be unique' })
  // }

  const person = new Person({ name, number })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
