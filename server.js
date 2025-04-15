const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'quiz.json')
function loadQuestions() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath)
    return JSON.parse(data)
  }
  return []
}

function saveQuestions(questions) {
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
}

function correggiQuiz(answers, quizDomande) {
  let punteggio = 0
  quizDomande.forEach((domanda) => {
    const chiave = `question_${domanda.id}`
    const rispostaUtente = parseInt(answers[chiave])
    if (rispostaUtente == domanda.rispostaCorretta) {
      punteggio += 1
    }
  })
  return punteggio
}

module.exports = { loadQuestions, saveQuestions, correggiQuiz }


