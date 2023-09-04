const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
          console.log("connected to db successfully")
        })
        .catch(() => {
          console.error("connected to db fall")
        })

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {type: String,
            unique: true
  }
})
const user = mongoose.model('user', userSchema)

const exercise_Schema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
})
const exercise = mongoose.model('exercise', exercise_Schema);

// const done

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const cur_user = req.body.username
  user.findOne({username: cur_user})
      .then((user_found) => {
        //
        if ( ! user_found) {
        const userDoc = new user({
          username: cur_user
        })
        userDoc.save()
               .then(() => {
                 console.log("luu userDoc thanh cong")
               })
               .catch((err) => {
                 console.error(err)
               })
        res.json(userDoc)
      } else {
          res.json(user_found)
      }
        //
      })
      .catch((err) => {
          console.error(err)
      })
      })
app.get('/api/users', (req, res) => {
  user.find()
      .then((userArr) => {
        res.json(userArr)
      })
      .catch((err) => {
        console.log(err)
      })
})
// POST to /api/users/:_id/exercises

app.post('/api/users/:_id/exercises', (req, res) => {
  const date = req.body.date
  user.findById(req.params._id)
      .then((user1) => {
        const exerciseDoc = new exercise({
          username: user1.username,
          description: req.body.description,
          duration: +req.body.duration,
          date: date ? new Date(date).toDateString() : new Date().toDateString()
        })
        exerciseDoc.save()
                   .then(() => console.log("luu exercise thanh cong"))
                   .catch((err) => console.log(err))
        res.json({
        _id: req.params._id,
        username: user1.username,
        date: date ? new Date(date).toDateString() : new Date().toDateString(),
        duration: +req.body.duration,
        description: req.body.description,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  
})
// GET request to /api/users/:_id/logs

app.get('/api/users/:_id/logs', async (req, res) => {
  const obj1 = await user.findById(req.params._id)
  const user1 = obj1.username
  let exer1 = await exercise.find({username: user1})
                              .select({_id: 0, username: 0})

  if (req.query.from) {
    const fromDate = new Date(req.query.from)
    exer1 = exer1.filter((ex) => ex.date >= fromDate)
  }
  if (req.query.to) {
    const toDate = new Date(req.query.to)
    exer1 = exer1.filter((ex) => ex.date <= toDate)
  }
  if (req.query.limit) {
    exer1 = exer1.slice(0, req.query.limit)
  }
  
  const exer2 = exer1.map((ex) => {
    return {
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString()
    }
  })
  
  res.json({
    username: user1,
    count: exer1.length,
    _id: req.params._id,
    log: exer2
  })
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
