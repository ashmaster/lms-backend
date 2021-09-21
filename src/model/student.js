const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    s_name: {
        type: String,
        required: true,
        trim: true
    },
    admissionNo: {
        type: String,
        required: true,
        unique: true,
    },
    class: {
        type: String
    },
    division: {
        type: String
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Transaction'
    }]

})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student