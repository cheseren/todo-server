const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//create express app
const app = express()

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//parse application/json
app.use(bodyParser.json())
app.use(express.json());
// mongoose.Promise = global.Promise;

//connecting to database
mongoose.connect(
  'mongodb://localhost:27017/todosDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false

  }
)
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch(error => {
    console.log('Could not connect to the database. Exiting now ...', error);
    process.exit();

  })



//define a simple route
app.get('/', (req, res) => {
  res.json({ "message": "welcome to Todo App" });
});

app.use(require('./app/routes/todo.routes'))
//listen to request
app.listen(4000, () => {
  console.log('Server is listening on port 4000');
})