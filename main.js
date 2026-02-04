//tablero

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const block_size = 22
const board_width = 14
const board_height = 30

canvas.width = block_size * board_width
canvas.height = block_size * board_height

context.scale(block_size,block_size)

// 🎨 estilos centralizados
const STYLES = {
    background: context.createLinearGradient(0, 0, 0, board_height),
    board: "#74a555",
    piece: "#9ec366",
    outline: "#5d8849"
}

STYLES.background.addColorStop(0, "#5d8c73")
STYLES.background.addColorStop(0.5, "#749d7a")
STYLES.background.addColorStop(1, "#a9c692")

const board = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,1,0,0,0,0,0,0,0,0],
    [0,0,1,0,1,1,0,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,0,1,1,1,1],

]

// pieces
const piece = {
    position: {x:5,y:5},
    shape:[[1,1],[1,1]]
}

// piezas random
const pieces = [
    [[1,1],[1,1]],
    [[1,1,1,1]],
    [[1,1,0],[0,1,1]],
    [[0,1,1],[1,1,0]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[1,1,1],[1,0,0]]
]

// game loop
let dropCounter = 0
let lastTime = 0

function update (time = 0){
    const deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime

    if (dropCounter > 200){
        piece.position.y++
        dropCounter = 0

        if (checkCollision()){
            piece.position.y--
            solidifypiece()
            removerows()
        }
    }

    draw()
    window.requestAnimationFrame(update)
}

// el dibujo en canvas
function draw (){
    context.fillStyle = STYLES.background
    context.fillRect(0,0, canvas.width,canvas.height)

    board.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value === 1){
                context.fillStyle = STYLES.board
                context.fillRect(x,y,1,1)

                context.strokeStyle = STYLES.outline
                context.lineWidth = 0.05
                context.strokeRect(x, y, 1, 1)
            }
        })
    })

    piece.shape.forEach((row,y)=>{
        row.forEach((value,x)=>{
          if (value){
            context.fillStyle = STYLES.piece
            context.fillRect(x+piece.position.x,y+piece.position.y,1,1)

            context.strokeStyle = STYLES.outline
            context.lineWidth = 0.05
            context.strokeRect(
            x + piece.position.x,
            y + piece.position.y,
            1,
            1,)
          }  
        })
    })
}

// precion de teclas
document.addEventListener("keydown",event =>{
    if (event.key === "ArrowLeft") {
        piece.position.x--
        if (checkCollision()) piece.position.x++
    }
    if (event.key === "ArrowRight") {
        piece.position.x++
        if (checkCollision()) piece.position.x--
    }
    if (event.key === "ArrowDown") {
        piece.position.y++
        if(checkCollision()){
            piece.position.y--
            solidifypiece()
            removerows()
        }
    }
    if(event.key === "ArrowUp"){
        const rotated = []

        for (let i = 0; i<piece.shape[0].length;i++){
            const row = []
            for (let j = piece.shape.length -1;j>=0;j--){
                row.push(piece.shape[j][i])
            }
            rotated.push(row)
        }

        const previousShape = piece.shape
        piece.shape = rotated
        if (checkCollision()) piece.shape = previousShape
    }
})

// colicion de la pieza
function checkCollision(){
    return piece.shape.find((row,y)=>{
        return row.find((value,x)=>{
            return(
                value != 0 &&
                board[y+piece.position.y]?.[x+piece.position.x] != 0
            )
        })
    })
}

// solidificacion de la pieza
function solidifypiece(){
    piece.shape.forEach((row,y) => {
        row.forEach((value,x)=>{
            if (value === 1){
                board[y+piece.position.y][x+piece.position.x]=1
            }
        })
    })

    piece.shape = pieces[Math.floor(Math.random()* pieces.length)]
    piece.position.x = Math.floor(board_width / 2 - 2)
    piece.position.y = 0

    if (checkCollision()){
        window.alert("GAME OVER! ponme HBO")
        board.forEach((row)=> row.fill(0))
    }
}

// eliminacion de linea solidificada
function removerows(){
    const rowsToRemove = []

    board.forEach((row,y)=>{
        if (row.every(value => value === 1)){
            rowsToRemove.push(y)
        }
    })

    rowsToRemove.forEach(y =>{
        board.splice(y,1)
        board.unshift(Array(board_width).fill(0))
    })
}

update()
