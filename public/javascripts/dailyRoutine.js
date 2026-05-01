const DATABASE_ID = "0fa0a4d4aed646efb7ed59a1226551d7"
const dotenv = require('dotenv').config()
NOTION_API_KEY = "secret_FBpD7YJDveoYnQ5i0qAcwhKTojIfeMqq5wpBSWuxws0"

const { Client } = require('@notionhq/client');
const notion = new Client({ auth: NOTION_API_KEY });
const date = new Date()

async function getDailyRoutines() {


    return await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
            property: 'Date',
            date: {
                past_week: {},
            },
        },
        // "sorts": [
        //     {
        //         property: "Date",
        //         direction: "ascending"
        //     }
        // ]
    });
}

async function createDailyRoutines(go = false) {
    const obj = createEntryNames()
    const render = []
    go = await shouldCreate()
    if (go === false) return render

    for (let d of obj) {
        const { date, name } = d
        if (date === null) {
            console.log("no date")
            return
        }
        if (name === null) {
            console.log("no name")
            return
        }
        render.push({ date, name })
        const data = {
            icon: {
                type: "external",
                external: {
                    url: "https://img.icons8.com/ios/250/FFFFFF/user.png",
                },
            },
            parent: {
                database_id: DATABASE_ID,
            },
            properties: {
                'Day type': {
                    select: {
                        name: 'Work',
                        color: 'purple'
                    }
                },
                "Date": {
                    date: {
                        start: date
                    }
                },
                'Day Plan': {
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: name,
                            },
                        }
                    ]
                }
            }
        }
        const response = await notion.pages.create(data);
        (response ? console.log("success") : console.log("failure"))
    }
    return render
}

async function existingDailyRoutines() {
    const cws = []
    const response = await getDailyRoutines()
    for (let day of response.results) {
        cws.push(day.properties.Date.date.start)
    }
    return cws
}

function createEntryNames() {
    const DATE = new Date();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const cw = getWeek(DATE);

    function entryNames() {
        const dayOfWeek = DATE.getDay() - 1;
        DATE.setDate(DATE.getDate() - dayOfWeek);
        let newDate = new Date(DATE);
        let obj = [];
        for (let i = 0; i < 7; i++) {
            const newISO = newDate.toISOString();
            newDate.setDate(newDate.getDate() + 1);
            const day = newISO.slice(8, 10);
            const month = newISO.slice(5, 7);
            const year = newISO.slice(2, 4);
            const fullYear = newISO.slice(0, 4);
            const fullDate = `${fullYear}-${month}-${day}`;
            const weekDay = days[i];
            obj.push({
                ["name"]: `${weekDay} / CW${cw} / Y${year}`,
                ["date"]: fullDate
            });
        }
        return obj;
    }

    function getWeek(date) {
        const target = new Date(date);
        target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
        const firstThursday = new Date(target.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
        const weekNumber = 1 + Math.round(
            ((target - firstThursday) / (7 * 24 * 60 * 60 * 1000))
        );

        return weekNumber;
    }
    return entryNames();
}

async function shouldCreate() {
    const arr1 = await existingDailyRoutines()
    const arr2 = []
    for (let i of createEntryNames()) {
        arr2.push(i.date)
    }
    console.log(arr2)
    return !arr1.some(r => arr2.includes(r))
}

module.exports = createDailyRoutines