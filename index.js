require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.MONGODB_URI)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})