//start button => to frame option 
const button = document.getElementById("menu-start-button");
function handlebuttonClick() {
    window.location.href = "frame.html";
}
button.addEventListener("click", handlebuttonClick);

//read us button => to read us page
const readUsButton = document.getElementById("menu-read-us-button");
function handleReadUsButtonClick() {
    window.location.href = "readus.html";
}
readUsButton.addEventListener("click", handleReadUsButtonClick);


const creditsButton = document.getElementById("credit-button");
function handlecreditsButtonClick() {
    window.location.href = "credits.html";
}
creditsButton.addEventListener("click", handlecreditsButtonClick);