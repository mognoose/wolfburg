const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

var corsOptions = {
  origin: "*"
}

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const db = require("./app/models");
// db.sequelize.sync();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// require("dotenv").config();

// require("./app/routes/user.routes")(app);
// require("./app/routes/restaurant.routes")(app);
// require("./app/routes/stamp.routes")(app);
// require("./app/routes/favorite.routes")(app);

const server = app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})

const io = require("socket.io")(server, {
  cors:{
    origins: ["*"],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true
      });
      res.end();
    }
  }
});

var position = {
    x: 320,
    y: 320
}
const speed = 16

io.on('connection', socket => {
  console.log("Client connected:", socket.id)
  io.emit("position", position)

  socket.on("move", data => {
    switch (data) {
        case "left":
            position.x -= speed
            io.emit("position", position)
            break
        case "right":
            position.x += speed
            io.emit("position", position)
            break
        case "up":
            position.y -= speed
            io.emit("position", position)
            break
        case "down":
            position.y += speed
            io.emit("position", position)
            break
    
        default:
            break;
    }
    io.emit('PING', data)
  })

})