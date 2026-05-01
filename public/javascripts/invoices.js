const dotenv = require('dotenv').config()
const NOTION_API_KEY = "secret_FBpD7YJDveoYnQ5i0qAcwhKTojIfeMqq5wpBSWuxws0"
const DATABASE_ID = process.env.NOTION_DATABASE_ID
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: NOTION_API_KEY });
const currentYear = new Date().getFullYear();

async function getLessons(student = "Lila", month = "Jun") {
    const lessons = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
            "and": [{
                "property": "Student",
                "select": {
                    "equals": student
                }
            },
            {
                "property": "Month",
                "select": {
                    "equals": month
                }
            },
            {
                "property": "Year",
                "select": {
                    "equals": currentYear.toString()
                }
            }]
        }

    })
    let obj = {
        dates: [],
        lessonsNumber: 0,
        total: 0,
        err: false
    }
    if (!lessons.results.length) {
        obj.err = "No lessons in that month."
        return obj
    }

    const res = lessons.results[0].properties

    lessons.results.forEach(el => {
        obj.dates.push(el.properties.Date.formula.date.start)
        obj.lessonsNumber++
        obj.total += el.properties.Price.number
    })
    return obj
}
module.exports = { getLessons }