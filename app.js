const express = require('express')
const app = express()

const http=require('http')
const server=http.createServer(app);
const {Server}=require('socket.io')
const io=new Server(server,{
  pingInterval:2000,
  pingTimeout:4000
});

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const backendPlayers={}
io.on('connection',(socket)=>{
  console.log('user connected');
  backendPlayers[socket.id]={
    x:500*Math.random(),
    y:500*Math.random(),
    color:`hsl(${360*Math.random()},100%,50%)`
  }
  io.emit('updatePlayers',backendPlayers)

  socket.on('disconnect',(reason)=>{
    console.log(reason);

    delete backendPlayers[socket.id];
    io.emit('updatePlayers',backendPlayers);
    
  })

  socket.on('keydown',(keycode)=>{

    switch (keycode){
    case "KeyW":
      backendPlayers[socket.id].y-=30;
      break
    case "KeyA":
      backendPlayers[socket.id].x-=30;
      break
    case "KeyS":
      backendPlayers[socket.id].y+=30;
      break
    case "KeyD":
      backendPlayers[socket.id].x+=30;
      break 
    
  }
  })

})

setInterval(()=>{
   io.emit('updatePlayers',backendPlayers)
},15)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
