const dotenv = require('dotenv').config()
const notion = require("./notion")

const { getStudents, addPage, getStudentImg } = require("./notion")
const { Lesson, getStudentsData, Student } = require("./public/javascripts/students")
const { getStudentImage } = require("./public/javascripts/students")
const { getLessons } = require('./public/javascripts/invoices')
const createDailyRoutines = require("./public/javascripts/dailyRoutine")

const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const app = express()
app.set("views", "./views")
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set("layout", "layouts/layout")
app.use(expressLayouts)

let students
setInterval(async () => {
    students = await getStudentsData()
}, 1000 * 60 * 60 * 24);

app.get("/", async (req, res) => {
    students = (students || await getStudentsData())
    res.render("index", { students })
})

// Dailyroutine
app.get("/dailyroutine", async (req, res) => {
    const response = null
    res.render("dailyroutine", { response })
})

app.post("/dailyroutine", async (req, res) => {

    const response = await createDailyRoutines()
    console.log("post dailyrouting" + response)
    res.render("dailyroutine", { response })
})

// New-lesson
app.post("/new-lesson", async (req, res) => {
    students = (students || await getStudentsData())
    const data = req.body
    const { name, img, price, lessonTime, subjects } = students[data.student]
    const lesson = new Lesson(name, data.date, img, price, lessonTime, subjects)
    const newLesson = lesson.addLesson()
    addPage(newLesson)
    res.redirect("/")
})

// Students
app.get("/students", async (req, res) => {
    students = students || await getStudentsData()
    res.render("students", { students })
})
// New student
app.post("/new-student", async (req, res) => {
    students = students || await getStudentsData()
    const data = req.body
    const { name, img, price, lessonTime, subjects, email } = data
    const student = new Student(name, img, price, lessonTime, subjects, email)
    const newStudent = student.addStudent()
    try {
        await addPage(newStudent)
    }
    catch (err) {
        console.log(err)
    }
    students = await getStudentsData()
    res.render("students", { students })
})

// Classes
// app.get("/classes", async (req, res) => {
//     students = null
//     res.redirect("/")
// })

// Invoices
app.get("/invoices", async (req, res) => {
    students = (students || await getStudentsData())
    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
    const date = new Date()
    const month = date.getMonth() - 1
    const data = {
        name: "Lila",
        students,
        months,
        invoiceMonth: months[month]
    }
    res.render("invoices", { data })
})

app.post("/invoices", async (req, res) => {
    students = (students || await getStudentsData())
    const months = {
        "Styczeń": "Jan",
        "Luty": "Feb",
        "Marzec": "Mar",
        "Kwiecień": "Apr",
        "Maj": "May",
        "Czerwiec": "Jun",
        "Lipiec": "Jul",
        "Sierpień": "Aug",
        "Wrzesień": "Sep",
        "Październik": "Oct",
        "Listopad": "Nov",
        "Grudzień": "Dec"
    }
    const response = req.body
    const month = response.month
    const monthEn = months[response.month]
    const student = response.student
    const lessons = await getLessons(student, monthEn)
    // const hourPrice = students[student].price
    const lessonTime = students[student].lessonTime
    const lessonPrice = students[student].price
    const email = students[student].email
    const finalObj = {
        month,
        student,
        lessonTime,
        lessonPrice,
        email,
        ...lessons
    }
    res.render("readyInvoice", finalObj)
})

console.log("PORT =", process.env.PORT);
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
