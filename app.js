//App.js

const bodyParser = require('body-parser')
const express = require('express')
const { loadQuestions, saveQuestions } = require('./server.js')
const { body, validationResult } = require('express-validator');
const app = express()
const quizDomande = loadQuestions()
// npm install express-validator -save ---- serve per i controlli nelle richieste
app.set('view engine', 'ejs')

app.use(express.json())

app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

app.get('/api/questions', function (req, res) {
  res.json(quizDomande)
})

app.post('/api/questions', [
  body('domanda').isLength({ min: 1 }).isString().withMessage('la domanda deve essere una stringa con almeno n alettera'),
  body('opzioni').isArray().withMessage('Problema formato opzioni, devi inserire un array di possibili opzioni').custom((value, { req }) => {
    if (!value.includes(req.body.rispostaCorretta)) {
      throw new Error('La risposta corretta deve essere una delle opzioni');
    }
    return true;
  }),
  body('rispostaCorretta').isLength({ min: 1 }).withMessage('Probblema nella rispostaCorretta, deve avere almeno un carattere')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newQuestion = {
    id: quizDomande.length + 1,
    domanda: req.body.domanda,
    opzioni: req.body.opzioni,
    rispostaCorretta: req.body.rispostaCorretta
  };

  quizDomande.push(newQuestion)
  saveQuestions(quizDomande)
  res.status(200).json({ message: 'Dati ricevuti correttamente!', questions: quizDomande });
})
