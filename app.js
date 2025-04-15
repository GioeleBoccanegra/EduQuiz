//App.js

const bodyParser = require('body-parser')
const express = require('express')
const { loadQuestions, saveQuestions, correggiQuiz } = require('./server.js')
const { body, validationResult } = require('express-validator');
const app = express()
const quizDomande = loadQuestions()
app.use(bodyParser.urlencoded())
// npm install express-validator -save ---- serve per i controlli nelle richieste
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))

app.use(express.json())

app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

app.get('/api/questions', function (req, res) {
  res.json(quizDomande)
})

app.post('/api/questions', [
  body('domanda').isString().notEmpty().withMessage('la domanda deve essere una stringa con almeno n alettera'),
  body('opzioni').isArray().withMessage('Problema formato opzioni, devi inserire un array di possibili opzioni'),
  body('rispostaCorretta').isInt().withMessage('Probblema nella rispostaCorretta, deve essere un numero').custom((value, { req }) => {
    if (req.body.rispostaCorretta > (req.body.opzioni.length + 1)) {
      console.log('la risposta deve essere un numero che indichi la posizione della risposta tra le opzioni quindi non può essere maggiore del numero di opzioni')
    }
    return true;
  })
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

app.get('/', (req, res) => {
  res.render('quiz', { questions: quizDomande })
})

app.post('/answers', (req, res) => {
  console.log(req.body)
  const punteggio = correggiQuiz(req.body, quizDomande)
  const totale = quizDomande.length
  res.render('answers', { punteggio: punteggio, totale: totale })
})
