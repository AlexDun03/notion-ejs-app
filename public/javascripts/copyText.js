const div = document.getElementById("invoice");
const span = document.getElementById("email");

div.onclick = function () {
    document.execCommand("copy");
}

div.addEventListener("copy", function (event) {
    event.preventDefault();
    if (event.clipboardData) {
        event.clipboardData.setData("text/plain", div.innerText);
        console.log(event.clipboardData.getData("text"))
    }
});

span.onclick = function () {
    document.execCommand("copy");
}
span.addEventListener("copy", function (event) {
    event.preventDefault();
    if (event.clipboardData) {
        event.clipboardData.setData("text/plain", span.innerText);
        console.log(event.clipboardData.getData("text"))
    }
});