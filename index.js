const express = require('express')
const basicRouter = require('./src/router/basic')
const port = process.env.PORT||3001
require('./src/db/db')
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const app = express()


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json())
app.use(basicRouter)
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})