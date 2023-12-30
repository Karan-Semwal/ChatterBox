const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

const port = 3000

app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/chat.html')
})

app.listen(port, () => {
    console.log(`Client hosting on port ${port}`)
})
