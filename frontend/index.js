const express = require('express')
const app = express()
const port = 8080

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send("Go to http://localhost:8080/main.html");
})

app.listen(port, () => {
  console.log(`Go to http://localhost:8080/main.html`)
})