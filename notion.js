const {
    NOTION_API_KEY,
    NOTION_DATABASE_ID,
    NOTION_DATE_MANUAL_ID,
    NOTION_YEAR_ID,
    NOTION_SUBJECT_ID,
    NOTION_PRICE_ID,
    NOTION_MONTH_ID,
    NOTION_STUDENT_ID,
    NOTION_NAME_ID
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

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: api_key });


async function getStudentImg(name) {
    const img = await notion.databases.query({
        database_id: database_id,
        filter: {
            property: "Student",
            select: {
                equals: name
            }
        }
    })
    return img.results[0].icon.external.url
}

async function getStudents() {
    const database = await notion.databases.retrieve({ database_id: database_id })
    return notionStudentsById(database.properties)[studentId].select.options.map(option => {
        return { id: option.id, name: option.name }
    })

}
async function addPage(data) {
    const response = await notion.pages.create(data);
}
function notionStudentsById(properties) {
    return Object.values(properties).reduce((obj, property) => {
        const { id, ...rest } = property
        return { ...obj, [id]: rest }
    }, {})
}
module.exports = {
    getStudents,
    addPage,
    getStudentImg
}