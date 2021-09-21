const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://fgmhs:Bxr9zSSFjml5qkC0@librarymanagement.vno01.mongodb.net/library?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Successfully connected to MongoDB')
}).catch(err => console.log(err))