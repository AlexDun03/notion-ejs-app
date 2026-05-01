let currentDate = new Date();
const dateInputs = document.getElementsByClassName('date-input');
window.addEventListener("load", () => {
    for (let input of dateInputs) input.value = currentDate.toISOString().split("T")[0]
})
function increaseDate(e) {
    const studentName = e.className
    const dateInput = document.getElementById(studentName);
    currentDate.setDate(currentDate.getDate() + 1);
    dateInput.value = currentDate.toISOString().split("T")[0]
}

function decreaseDate(e) {
    const studentName = e.className
    const dateInput = document.getElementById(studentName);
    currentDate.setDate(currentDate.getDate() - 1);
    dateInput.value = currentDate.toISOString().split("T")[0]
}

