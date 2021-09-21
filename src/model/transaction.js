const mongoose = require('mongoose')


const transactionSchema = mongoose.Schema({
    b_name: {
        type: String,
        required: true,
        trim: true
    },
    s_name: {
        type: String,
        required: true,
        trim: true
    },
    bookId: {
        type: String,
        required: true
    },
    admissionNo: {
        type: String,
        required: true
    },
    date_of_lending: {
        type: Date,
    },
    date_of_return: {
        type: Date
    },
    returned:{
        type: Boolean
    },
    remark:{
        type: String
    }
})




const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
