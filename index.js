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
                 console.log("save doc successfuly")
               })
               .catch((err) => {
                 console.error(err)
               })
      } else {
          res.json(user_found)
          console.log("hung")
      }
        //
      })
      .catch((err) => {
          console.error(err)
      })
      })





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
