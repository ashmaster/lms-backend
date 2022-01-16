const express = require('express')
const router = express.Router()
const Student = require("../model/student");
const Book = require("../model/book");
const Transaction = require("../model/transaction")
//login an admin
router.post('/admin_login', async (req, res) => {
    try {
        let success
        if (req.body.adminID === process.env.ADMIN_ID && req.body.password === process.env.ADMIN_PASS) {
            success = {
                status: true,
                loggedin: true,
                message: "Logged in successfully"
            }
        }
        else {
            success = {
                status: false,
                message: "Login failed"
            }
        }
        res.status(200).send(success)
    } catch (error) {
        const errorRes = {
            status: false,
            message: error,
            loggedin: false
        }
        res.status(400).send(errorRes)
    }
})
//homepage data

router.get('/homepage_data', async (req, res) => {
    try {
        let data = {};
        data.student_count = await Student.countDocuments();
        data.book_count = await Book.countDocuments();
        data.no_of_transactions = await Transaction.countDocuments();
        data.no_of_unreturned = await Transaction.countDocuments({date_of_return : null});
        let success = {
            status : true,
            data
        }
        if(data)
            res.status(200).json(success)
        else
            res.status(200).json({status : false, msg:data})
        
    }
    catch(err){
        const failure = {
            status: false,
            error: err
        }
        res.status(400).send(failure)
    }
})

//add a student

router.post('/create_student', async (req, res) => {
    try {
        const student = new Student(req.body)
        await student.save()
        let success = {
            status: true,
            student: student
        }
        res.status(201).send(success)
    } catch (error) {
        const failure = {
            status: false,
            error: error
        }
        res.status(400).send(failure)
    }
})

//find a student by admissionNo

router.get('/student/:id', async (req, res) => {
    try {
        let student = await Student.find({ admissionNo: req.params.id }).select(["s_name", "class", "division", "lentBooks", "admissionNo"])
        const transaction = await Transaction.find({ admissionNo: req.params.id }).select(["b_name", "bookId", "date_of_lending", "date_of_return"])
        const no_of_transactions = transaction.length;
        const unreturned_tansactions = transaction.filter(item => {
            if(item.date_of_return === null)
                return true
        })
        const no_of_unreturned = unreturned_tansactions.length;
        const data = {};
        data.student = student[0];
        data.transactions = transaction;
        data.transactions = transaction;
        data.no_of_transactions = no_of_transactions;
        data.unreturned_tansactions = unreturned_tansactions;
        data.no_of_unreturned = no_of_unreturned;
        
        
        if (student.length !== 0) {
            let success = {
                status: true,
                data
            }
            res.status(200).json(success)
        }
        else {
            let success = {
                status: false,
                student: {},
                msg: "Student could not be found"
            }
            res.status(200).json(success)
        }

    }

    catch (err) {
        res.status(404).json({ err: "No User Found" })
    }

})

//update a student

router.post('/update_student/:id', async (req, res) => {
    const userDetails = req.body
    try {
        let student = await Student.findOneAndUpdate({ admissionNo: req.params.id }, { ...userDetails })
        if (student) {
            let success = {
                status: true,
                msg: "Student Updated successfully",
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: "Student could not be updated successfully",
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Student could not be updated" })
    }
})

//delete a student
router.post('/delete_student/:id', async (req, res) => {
    try {
        let student = await Student.findOneAndDelete({ admissionNo: req.params.id })
        if (student) {
            let success = {
                status: true,
                msg: "Student deleted successfully"
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: "Student could not be deleted"
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Student could not be deleted" })
    }
})

//add a book
router.post('/create_book', async (req, res) => {
    try {
        const book = new Book(req.body)
        await book.save()
        let success = {
            status: true,
            book: book
        }
        res.status(201).send(success)
    } catch (error) {
        const failure = {
            status: false,
            error: error
        }
        res.status(400).send(failure)
    }
})

//get a book by id

router.get('/book/:id', async (req, res) => {
    try {
        const book = await Book.find({ stock_no: req.params.id }).select(["b_name", "author", "price", "lentBy", "y_o_publish", "bookAvailable", "bookId", "language"])
        const transaction = await Transaction.find({ bookId: req.params.id }).select(["s_name","admissionNo","date_of_lending", "date_of_return"])
        book[0]["transactions"] = transaction;
        if (book.length !== 0) {
            let success = {
                status: true,
                data: book[0],
            }
            res.status(200).json(success)
        }
        else {
            let success = {
                status: false,
                data: {},
                msg: "Book could not be found"
            }
            res.status(200).json(success)
        }

    }

    catch (err) {
        let failure = {
            status: false,
            data: {},
            msg: "Book could not be found"
        }
        res.status(200).json(failure)
    }

})

//get a book by id

router.get('/books/:name', async (req, res) => {
    try {
        const book = await Book.find({'$text':{'$search': req.params.name}})
        /*const transaction = await Transaction.find({ bookId: req.params.id }).select(["s_name","admissionNo","date_of_lending", "date_of_return"])
        book[0]["transactions"] = transaction;*/
        if (book.length !== 0) {
            let success = {
                status: true,
                data: book,
            }
            res.status(200).json(success)
        }
        else {
            let success = {
                status: false,
                data: {},
                msg: "No books with this name"
            }
            res.status(200).json(success)
        }

    }

    catch (err) {
        let failure = {
            status: false,
            data: {},
            msg: err
        }
        res.status(200).json(failure)
    }

})

//delete a book

router.post('/delete_book/:id', async (req, res) => {
    try {
        let book = await Book.findOneAndDelete({ bookId: req.params.id })
        if (book) {
            let success = {
                status: true,
                msg: "Book deleted successfully"
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: "Book could not be deleted"
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Book could not be deleted" })
    }
})

//update a book

router.post('/update_book/:id', async (req, res) => {
    const bookDetails = req.body
    try {
        let book = await Book.findOneAndUpdate({ bookId: req.params.id }, { ...bookDetails })
        if (book) {
            let success = {
                status: true,
                msg: "Book Updated successfully",
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: "Book could not be updated successfully",
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Book could not be updated" })
    }
})

//Student lends book
router.post('/lend_book', async (req, res) => {
    const date = new Date
    const books = req.body.bookList;
    const student = req.body.student;
    let bookArray = [];
    let bookIdArray = [];
    for (let i = 0; i < books.length; i++) {
        bookArray[i] = {};
        bookArray[i].bookId = books[i].bookId;
        bookArray[i].b_name = books[i].b_name;
        bookArray[i].admissionNo = student.admissionNo;
        bookArray[i].s_name = student.s_name;
        bookArray[i].date_of_lending = date;
        bookArray[i].date_of_return = null;
        bookIdArray[i] = books[i].bookId;
    }
    console.log(bookArray);
    try {
        const transaction = await Transaction.insertMany(bookArray);
        let book = await Book.updateMany(
            { bookId:
                {
                    $in:
                        bookIdArray
                },
            },
            { "$set" : { bookAvailable : false }}
        )
        
        if (transaction && book) {
            let success = {
                status: true,
                msg: transaction,
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: "Book could not be updated successfully",
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Book could not be updated", msg: error })
    }
})

//return book

//Student lends book
router.post('/return_book', async (req, res) => {
    const date = new Date
    const remark = req.body.remarks
    const books = req.body.bookList;
    let bookArray = [];
    for (let i = 0; i < books.length; i++) {
        bookArray.push(books[i].bookId);
    }
    console.log(bookArray);
    try {
        let transaction = await Transaction.updateMany(
            { bookId:
                {
                    $in:
                        bookArray
                }    
            },
            {"$set" : {date_of_return : date, remark: remark}}
        )
        let book = await Book.updateMany(
            { bookId:
                {
                    $in:
                        bookArray
                }    
            },
            {"$set" : {bookAvailable : true}}
        )

        if (book && transaction) {
            let success = {
                status: true,
                msg: transaction,
            }
            res.status(200).send(success)
        }
        else {
            let success = {
                status: false,
                msg: transaction,
            }
            res.status(200).send(success)
        }

    }
    catch (error) {
        res.status(400).json({ err: "Book could not be updated", msg: error })
    }
})

//get all books not yet returned

router.get('/pending_return', async (req, res) => {
    try {
        const transaction = await Transaction.find({ date_of_return : null }).select(["s_name","admissionNo","b_name","bookId","date_of_lending", "date_of_return"])

        if (transaction.length !== 0) {
            let success = {
                status: true,
                transactions: transaction,
            }
            res.status(200).json(success)
        }
        else {
            let success = {
                status: true,
                transactions: transaction,
                msg: "No books pending return"
            }
            res.status(200).json(success)
        }

    }

    catch (err) {
        res.status(404).json({ status: false, err: "No User Or Server Error" })
    }

})

//get all transactions

router.get('/all_transactions', async (req, res) => {
    try {
        const transaction = await Transaction.find({}).select(["s_name","admissionNo","b_name","bookId","date_of_lending", "date_of_return", "remark"])

        if (transaction.length !== 0) {
            let success = {
                status: true,
                transactions: transaction,
            }
            res.status(200).json(success)
        }
        else {
            let success = {
                status: false,
                transactions: transaction,
                msg: "No transactions found"
            }
            res.status(200).json(success)
        }

    }

    catch (err) {
        res.status(404).json({ err: "No User Or Server Error" })
    }

})




module.exports = router