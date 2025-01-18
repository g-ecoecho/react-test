const express = require('express')
const app = express()
const port = 3112

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`)
})
