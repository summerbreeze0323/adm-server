const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const config = require('./config/key')

app.use(cors({ origin: true, credentials: true }));
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// application/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(() => console.log('MongoDB Connected!'))
	.catch(err => console.log(err))

app.use('/api/users', require('./routes/users'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})