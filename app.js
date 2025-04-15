const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const quizDomande = require('./server.js')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
const jsonParser = bodyParser.json()

app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

app.get('/api/questions', function (req, res) {
  res.json(quizDomande)

})
