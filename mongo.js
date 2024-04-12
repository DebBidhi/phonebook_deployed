const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name=process.argv[3]
const number=process.argv[4]

const url =`mongodb+srv://startupver001:${password}@cluster0.y4ukach.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person_', PersonSchema)

if (process.argv.length<4) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

const person_individiual = new Person({
    name: name,
    number: number,
})

person_individiual.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})