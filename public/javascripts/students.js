
const {
    NOTION_API_KEY,
    NOTION_DATABASE_ID,
    NOTION_DATE_MANUAL_ID,
    NOTION_YEAR_ID,
    NOTION_SUBJECT_ID,
    NOTION_PRICE_ID,
    NOTION_MONTH_ID,
    NOTION_STUDENT_ID,
    NOTION_NAME_ID,
    STUDENTS_DATABASE_ID
} = process.env;

const api_key = NOTION_API_KEY;
const database_id = NOTION_DATABASE_ID;
const dateManualId = NOTION_DATE_MANUAL_ID;
const yearId = NOTION_YEAR_ID;
const subjectId = NOTION_SUBJECT_ID;
const priceId = NOTION_PRICE_ID;
const monthId = NOTION_MONTH_ID;
const studentId = NOTION_STUDENT_ID;
const nameId = NOTION_NAME_ID;
const studentsDatabase = STUDENTS_DATABASE_ID

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: api_key });

async function getStudentsData() {
    const obj = {}
    const students = await notion.databases.query({
        database_id: studentsDatabase,
    })
    for (let student of students.results) {
        const { Name, Img, Subject, Price, 'Lesson Time': lessonTime, Email } = student.properties
        obj[Name.title[0].plain_text] = {
            name: Name.title[0].plain_text,
            img: Img.rich_text[0].plain_text,
            subjects: Subject.multi_select.map(e => { return { ["name"]: e.name } }),
            price: Price.number,
            lessonTime: lessonTime.number,
            email: Email.email
        }
    }
    return obj
}
class Student {
    constructor(name, img, price, lessonTime, subjects, email) {
        this.name = name
        this.img = img
        this.price = price
        this.lessonTime = lessonTime
        this.subjects = subjects.split(" ").map(e => { return { "name": e } })
        this.email = email
    }
    addStudent() {
        return {
            icon: {
                type: "external",
                external: {
                    url: this.img,
                },
            },
            parent: {
                database_id: studentsDatabase,
            },
            properties: {

                'Name': {
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: this.name,
                            },
                        },
                    ],
                },
                "Student": {
                    select: {
                        name: this.name
                    }
                },
                "Img": {
                    type: "rich_text",
                    rich_text: [{
                        type: "text",
                        text: {
                            content: this.img
                        },
                        plain_text: this.img
                    }]
                },
                "Price": {
                    type: 'number',
                    number: Number(this.price)
                },
                "Lesson Time": {
                    type: 'number',
                    number: Number(this.lessonTime)
                },
                "Subject": {
                    multi_select: this.subjects
                },
                "Email": {
                    type: "email",
                    email: this.email
                }
            },
        }
    }
}

class Lesson {
    constructor(name, date, img, price, lessonTime, subjects) {
        this.name = name
        this.date = date
        this.img = img
        this.price = price
        this.lessonTime = lessonTime
        this.subjects = subjects
    }
    addLesson() {
        const database_id = process.env.NOTION_DATABASE_ID
        const day = this.date.slice(-2)
        const month = this.date.slice(5, 7)
        const year = this.date.slice(0, 4)
        const entryName = `${this.name.slice(0, 1)} / ${day}.${month}.${year}`
        console.log(entryName)
        const monthWord = function () {
            if (month == "01") return "Jan"
            if (month == "02") return "Feb"
            if (month == "03") return "Mar"
            if (month == "04") return "Apr"
            if (month == "05") return "May"
            if (month == "06") return "Jun"
            if (month == "07") return "Jul"
            if (month == "08") return "Aug"
            if (month == "09") return "Sep"
            if (month == "10") return "Oct"
            if (month == "11") return "Nov"
            if (month == "12") return "Dec"
        }

        return {
            icon: {
                type: "external",
                external: {
                    url: this.img,
                },
            },
            parent: {
                database_id: database_id,
            },
            properties: {
                'Name': {
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: entryName
                            },
                        },
                    ],
                },
                "Student": {
                    select: {
                        name: this.name
                    }
                },
                "Price": {
                    number: this.price
                },
                "Lesson Time": {
                    type: 'number',
                    number: this.lessonTime
                },
                "Month": {
                    select: {
                        name: monthWord()
                    }
                },
                "Subject": {
                    multi_select: this.subjects
                },
                "Year": {
                    select: {
                        name: year
                    }
                },
                'Date (manual)': {
                    type: 'date',
                    date: {
                        start: this.date
                    },
                },
            },
        }
    }
}

module.exports = { Lesson, getStudentsData, Student }