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

module.exports = { loadQuestions, saveQuestions }