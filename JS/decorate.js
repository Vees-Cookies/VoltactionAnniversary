const Width = 700, height = 2100;

const canvas = document.getElementById("finalCanvas"),
    ctx = canvas.getContext("2d"),
    addplantbtn = document.getElementById("plant"),
    addflowerbtn = document.getElementById("flower"),
    addloadingbtn = document.getElementById("loading"),
    addkanataunbtn = document.getElementById("kanataun"),
    downBtn = document.getElementById("download"),
    returnbtn = document.getElementById("return");

canvas.width = Width;
canvas.height = height;

let stickers = [], dragOffset = {x:0, y:0}, selectedSticker = null;

const finalmg = new Image(), dataURL = localStorage.getItem("photostrip")
if (dataURL){
    finalmg.src = dataURL;
    finalmg.onload = drawCanvas;
    // localStorage.removeItem(`photostrip`);
} else alert("no photo found");

function drawCanvas(){
    ctx.clearRect(0, 0, Width, height);
    ctx.drawImage(finalmg, 0, 0, Width, height);
    stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
}

function addsticker(src){
    const img = new Image();
    img.src = src;
    img.onload = () => {
        stickers.push({
            img,
            x: Width/2 - img.width/4,
            y: height/2 - img.height/4,
            width: img.width/2.5,
            height: img.height/2.5,
            dragging: false
        });
        drawCanvas();
    }
}

function getPointerPos(e){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width/rect.width;
    const scaleY = canvas.height/rect.height;

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    return {
        x:(clientX - rect.left) * scaleX, 
        y: (clientY - rect.top) * scaleY};
};

function pointerDown(e) {
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (mouseX >= s.x && mouseX <= s.x + s.width && mouseY >= s.y && mouseY <= s.y + s.height) {
      selectedSticker = s;
      s.dragging = true;
      dragOffset.x = mouseX - s.x;
      dragOffset.y = mouseY - s.y;


      stickers.splice(i, 1);
      stickers.push(s);

      drawCanvas();
      e.preventDefault();
      break;
    }
  }
}
function pointerMove(e) {
  if (!selectedSticker?.dragging) return;
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  selectedSticker.x = mouseX - dragOffset.x;
  selectedSticker.y = mouseY - dragOffset.y;
  drawCanvas();
  e.preventDefault();
}
function pointerUp() { if (selectedSticker) selectedSticker.dragging = false; selectedSticker = null; }

// mouse events
canvas.addEventListener('mousedown', pointerDown);
canvas.addEventListener('mousemove', pointerMove);
canvas.addEventListener('mouseup', pointerUp);
canvas.addEventListener('mouseleave', pointerUp);

// touch events
canvas.addEventListener('touchstart', pointerDown);
canvas.addEventListener('touchmove', pointerMove);
canvas.addEventListener('touchend', pointerUp);
canvas.addEventListener('touchcancel', pointerUp);

addkanataunbtn.addEventListener("click", ()=> addsticker("Images/sticker-kanataun.png"));
addflowerbtn.addEventListener("click", ()=> addsticker("Images/sticker-flower.png"));
addloadingbtn.addEventListener("click", ()=>addsticker("Images/sticker-loading.png"));
addplantbtn.addEventListener("click", ()=>addsticker("Images/sticker-plant.png"));


downBtn.addEventListener('click', () => {
    drawCanvas();
    canvas.toBlob(blob =>{ 
        {if (!blob){
            alert("export fail")
            return;
        }}
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); 
        a.download = 'anniv-photobooth.png'; 
        a.click();

        URL.revokeObjectURL(a.href);
    }, `image/png`);
});

returnbtn.addEventListener(
    "click", () => window.location.href = "index.html"
);



