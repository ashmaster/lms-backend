const mongoose = require('mongoose')


const bookSchema = mongoose.Schema({
    b_name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true
    },
    reciept_number: {
        type: String,
    },

    y_o_buying: {
        type: Date
    },
    recieved_from: {
        type: String
    },
    y_o_publish: {
        type: Date
    },
    bookId: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number
    },
    bookAvailable: {
        type: Boolean
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Transaction'
    }],
    date_o_deletion: {
        type: Date,
    },
    reason_for_deletion: {
        type: String
    },
    remarks: {
        type: String
    }, 
    language: {
        type: String,
        enum: ['E', 'M', 'H']
    }
})




const Book = mongoose.model('Book', bookSchema)

module.exports = Book
