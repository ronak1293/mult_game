const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket=io();

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio=window.devicePixelRatio||1

canvas.width = innerWidth*devicePixelRatio
canvas.height = innerHeight*devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2


const FrontEndPlayers={};
socket.on('updatePlayers',(backendPlayers)=>{
  for(const id in backendPlayers){
    const backendPlayer=backendPlayers[id];
    
    if(!FrontEndPlayers[id]){
      FrontEndPlayers[id]= new Player({
      x:backendPlayer.x,
      y:backendPlayer.y,
      radius:10,
      color: backendPlayer.color})
    }
    else{
      FrontEndPlayers[id].x=backendPlayer.x,
      FrontEndPlayers[id].y=backendPlayer.y
    }
  }

  for(const id in FrontEndPlayers){
    if(!backendPlayers[id]){
      delete FrontEndPlayers[id];
    }
  }
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for(const id in FrontEndPlayers){
    const player=FrontEndPlayers[id];
    player.draw();
  }

  
}

animate()

window.addEventListener('keydown',(event)=>{
  if(!FrontEndPlayers[socket.id]) return 
  switch (event.code){
    case "KeyW":
      FrontEndPlayers[socket.id].y-=30;
      socket.emit('keydown','KeyW')
      break
    case "KeyA":
       FrontEndPlayers[socket.id].x-=30;
      socket.emit('keydown','KeyA')
      break
    case "KeyS":
       FrontEndPlayers[socket.id].y+=30;
      socket.emit('keydown','KeyS')
      break
    case "KeyD":
       FrontEndPlayers[socket.id].x+=30;
      socket.emit('keydown','KeyD')
      break 
    
  }
})