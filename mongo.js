const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Syötä salasana argumenttina')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-tyz3h.mongodb.net/puhelinluettelo-app?retryWrite=true`

mongoose.connect(url, {useNewUrlParser: true})

const conn = mongoose.connection

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('Puhelinluettelo:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    conn.close()
  })
}

const name = process.argv[3]

if (process.argv.length === 4) {
  console.log(`Lisätäksesi henkilön ${name}, syötä myös numero`)
  process.exit(1)
}

const number = process.argv[4]

if (process.argv.length === 5) {
  console.log(`Lisätään ${name} numerolla ${number} luetteloon`)
  const person = new Person({
    name,
    number
  })
  person.save().then(result => {
    console.log('Lisätty!')
    conn.close()
  })
}

if (process.argv.length > 5) {
  console.log('Liian monta argumenttia. Syötä vain salasana, nimi ja numero.')
  process.exit(1)
}

