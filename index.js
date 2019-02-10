const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

morgan.token('person', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(bodyParser.json());
app.use(morgan(":method :url :status :res[context-length] - :response-time ms :person"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-21423123"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-4323234"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-784232"
  }
]

const infoTemplate = () => {
  return (`
    <div>
      <p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
      <p>${new Date()}</p>
    </div>
  `)
}

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/info', (req, res) => {
  res.send(infoTemplate());
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = persons.find(person => person.id === id);

  if (found) {
    res.send(found);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  const person = req.body;
  console.log(person);
  if (person.name === undefined || person.number === undefined) {
    return res.status(400).json({
      error: 'Name or number missing'
    })
  } else if (persons.map(p => p.name).includes(person.name)) {
    return res.status(409).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000) + 5,
    name: person.name,
    number: person.number
  }

  persons = persons.concat(newPerson);
  res.json(newPerson);
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})