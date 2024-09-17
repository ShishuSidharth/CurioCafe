const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");
const questionsRoute = require("./routes/questionsRoute");
const questionActionsRoute = require("./routes/questionActionsRoute");
const path = require("path");
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/questions", questionsRoute);
app.use("/api/question-actions", questionActionsRoute);
// const __dirname1=path.resolve();
// if(process.env.NODE_ENV==="production"){
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));
//   app.get('*', (req,res)=>{
//     res.sendFile(path.resolve(__dirname1,"client", "build", "index.html"));
//   })
// }else{
//   app.get('/',(req,res)=>{
//     res.send('API ia running successfully')
//   });
// }
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);

// socket io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
    // join room
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    // listen for new notification
    socket.on("newNotification", (notification) => {
        socket.to(notification.userId).emit("newNotification", notification);
    });
});



__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}else{
  app.get('/',(req,res)=>{
        res.send('API ia running successfully')
      });
}

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
