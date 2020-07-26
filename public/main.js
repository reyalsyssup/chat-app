const socket = io();
const form = document.querySelector("form");
const input = document.querySelector("#msg-input");
const chatlog = document.querySelector("#log");
const changeNameBtn = document.querySelector("#change-name-btn");
const changeNameInput = document.querySelector("#change-name-input");

let name = "";

try {
    name = localStorage.getItem("name");
    changeNameInput.value = name;
} catch{}

function addMsg(msg, type) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(`${msg}`));
    chatlog.appendChild(li);
    if(type === "error") li.style.backgroundColor = "#ff4f4f";
    else if(type === "warning") li.style.backgroundColor = "#ffbb3d";
    else if(type === "success") li.style.backgroundColor = "#84ff70";
    window.scrollTo(0,document.body.scrollHeight);
}

// checking if you press enter in the change name area
document.addEventListener("keydown", (event) => {
    // 69 is keycode 'e'
    if(event.keyCode === 13) {
        // user is focused in the change name box
        if(document.activeElement === changeNameInput) {
            if(changeNameInput.value !== "") {
                name = changeNameInput.value;
                localStorage.setItem("name", name);
            }
            else addMsg("Name must not be empty!", "error");
        }
    }
});

changeNameBtn.addEventListener("click", () => {
    if(changeNameInput.value.replace(/[\s\u2800]/g, '').length !== 0) {
        name = changeNameInput.value;
        addMsg(`Succesfully changed name to "${name}"`, "success");
    }
    else addMsg("Name must not be empty!", "error");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if(name !== null) {
        let msg = input.value;
        // if the string is only whitespace
        if(msg.replace(/[\s\u2800]/g, '').length !== 0) {
            socket.emit("send msg", `${name}: ${msg}`);
            input.value = "";
        } else addMsg("Message cannot be empty!", "warning");
    } else addMsg("Please enter a name in the top right!", "error");
});

socket.on("send msg", (msg) => {
    addMsg(msg);
});