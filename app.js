const express = require("express"),
app = express(),
http = require("http").createServer(app),
io = require("socket.io")(http),
fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
let name = "";

io.on("connection", (socket) => {
    console.log("User connected!");
    socket.on("disconnect", () => {
        console.log("User disconnected!");
    });

    socket.on("send msg", (msg) => {
        // console.log(msg);
        io.emit("send msg", msg);
        fs.appendFileSync(__dirname + "/log.txt", msg + "\n");
    });

});

app.get("/", (req, res) => {
    res.render("chat");
});

http.listen(process.env.PORT || 3000, () => console.log("Server listening on port 3000"));