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

var position = {x: 320, y: 320}
const speed = 32

const disabledBlocks = [
  {x: 32, y: 64},
  {x: 32, y: 128},
  {x: 32, y: 256},
  {x: 32, y: 224},
  {x: 32, y: 320},
  {x: 32, y: 384},
  {x: 32, y: 416},

  {x: 64, y: 224},
  {x: 64, y: 256},
  {x: 64, y: 416},

  {x: 96, y: 64},
  {x: 96, y: 96},
  {x: 96, y: 192},
  {x: 96, y: 256},
  {x: 96, y: 224},
  {x: 96, y: 416},

  {x: 128, y: 96},
  {x: 128, y: 192},
  {x: 128, y: 256},
  {x: 128, y: 224},
  {x: 128, y: 288},
  {x: 128, y: 416},

  {x: 192, y: 64},
  {x: 192, y: 192},  
  {x: 192, y: 224},
  {x: 192, y: 256},
  {x: 192, y: 384},

  {x: 160, y: 64},
  {x: 160, y: 256},
  {x: 160, y: 224},

  {x: 192, y: 64},
  {x: 192, y: 192},  
  {x: 192, y: 224},
  {x: 192, y: 256},
  {x: 192, y: 384},
  

  {x: 224, y: 64},
  {x: 224, y: 96},
  {x: 224, y: 128},
  
  {x: 224, y: 192},
  {x: 224, y: 224},
  {x: 224, y: 256},
  {x: 224, y: 288},
  {x: 224, y: 320},
  
  {x: 224, y: 384},
  {x: 224, y: 416},
  
  
  {x: 256, y: 96},
  {x: 256, y: 128},
  {x: 256, y: 224},
  {x: 256, y: 256},

  {x: 288, y: 384},
  {x: 288, y: 416},
  
  {x: 320, y: 64},
  
  {x: 352, y: 64},
  {x: 352, y: 224},
  {x: 352, y: 256},
  
  {x: 384, y: 224},
  {x: 384, y: 288},
  
  {x: 416, y: 128},
  {x: 416, y: 160},
  {x: 416, y: 160},
  {x: 416, y: 224},
  {x: 416, y: 288},
  
  {x: 448, y: 64},
  {x: 448, y: 224},
  {x: 448, y: 288},
  {x: 448, y: 384},
  
  {x: 480, y: 64},
  {x: 480, y: 96},
  {x: 480, y: 128},
  {x: 480, y: 160},
  {x: 480, y: 192},
  {x: 480, y: 224},
  {x: 480, y: 288},
  
  {x: 512, y: 224},
  {x: 512, y: 288},
  {x: 512, y: 416},
  
  {x: 544, y: 224},
  {x: 544, y: 256},
  {x: 544, y: 416},
  
  {x: 576, y: 224},
  {x: 576, y: 288},
  {x: 576, y: 384},
]

io.on('connection', socket => {
  console.log("Client connected:", socket.id)
  io.emit("position", position)

  socket.on("move", data => {
    let disabled = false
    switch (data) {
        case "left":
            position.x -= speed
            disabledBlocks.forEach(d => {
              if(position.x < 32 || (d.x === position.x && d.y === position.y)) disabled = true
            })
            if(disabled){
              position.x += speed
              return
            }
            io.emit("position", position)
            break
        case "right":
            position.x += speed
            disabledBlocks.forEach(d => {
              if(position.x > 600 || (d.x === position.x && d.y === position.y)) disabled = true
            })
            if(disabled){
              position.x -= speed
              return
            }
            io.emit("position", position)
            break
        case "up":
            position.y -= speed
            disabledBlocks.forEach(d => {
              if(position.y < 64 || (d.x === position.x && d.y === position.y)) disabled = true
            })
            if(disabled){
              position.y += speed
              return
            }
            io.emit("position", position)
            break
        case "down":
            position.y += speed
            disabledBlocks.forEach(d => {
              if(position.y > 440 || (d.x === position.x && d.y === position.y)) disabled = true
            })
            if(disabled){
              position.y -= speed
              return
            }
            io.emit("position", position)
            break
    
        default:
            break;
    }
    io.emit('PING', data)
  })

})