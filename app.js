const express = require('express')
// const request = require('request')
const bodyParser = require('body-parser')
const https = require('https')
const mailChimp = require(__dirname.join('/mailchimpapi.js'))
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.sendFile(__dirname.join('/signup.html'))
})

app.post('/', (req, res) => {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email

  const data = {
    members: [{
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  // Declaring variables to make parameters cleaner
  const jsonData = JSON.stringify(data)
  const url = 'https://us10.api.mailchimp.com/3.0/lists/' + mailChimp.listId
  const options = {
    method: 'POST',
    auth: 'ethan1:' + mailChimp.authId
  }

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname.join('/success.html'))
    } else {
      res.sendFile(__dirname.join('/failure.html'))
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)
  request.end()
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000')
})
