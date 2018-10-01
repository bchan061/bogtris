var express = require('express')
var app = express()

const PORT = 3000

app.use(
    "/",
    express.static("public")    
)

app.listen(PORT)

console.log("Now listening at port " + PORT)
