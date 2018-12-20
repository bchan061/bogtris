const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
var app = express()

const PORT = 3000

app.use(
    bodyParser.urlencoded({ extended: false })
)

app.use(bodyParser.json())

app.use(
    "/",
    express.static("public")    
)

app.post('/log', function(request, response) {
    fs.writeFile("genetic.json", "previousGeneration = " + JSON.stringify(request.body), (err) => {
        if (err) {
            console.log("Error when writing")
            response.send("Couldn't write")
        } else {
            console.log("Saved to genetic.json")
        }
    })
})

app.listen(PORT)

console.log("Now listening at port " + PORT)
