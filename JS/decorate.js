const Width = 700, height = 2100;

const canvas = document.getElementById("finalCanvas"),
    ctx = canvas.getContext("2d"),
    add01btn = document.getElementById("01"),
    add02btn = document.getElementById("02"),
    add03btn = document.getElementById("03"),
    add04btn = document.getElementById("04"),
    add05btn = document.getElementById("05"),
    add06btn = document.getElementById("06"),
    add07btn = document.getElementById("07"),
    add08btn = document.getElementById("08"),
    add09btn = document.getElementById("09"),
    add10btn = document.getElementById("10"),
    add11btn = document.getElementById("11"),
    add12btn = document.getElementById("12"),
    add13btn = document.getElementById("13"),
    add14btn = document.getElementById("14"),
    add15btn = document.getElementById("15"),
    add16btn = document.getElementById("16"),
    add17btn = document.getElementById("17"),
    add18btn = document.getElementById("18"),
    add19btn = document.getElementById("19"),
    add20btn = document.getElementById("20"),
    add21btn = document.getElementById("21"),
    add22btn = document.getElementById("22"),
    add23btn = document.getElementById("23"),
    add24btn = document.getElementById("24"),
    add25btn = document.getElementById("25"),
    add26btn = document.getElementById("26"),
    add27btn = document.getElementById("27"),
    add28btn = document.getElementById("28"),
    add29btn = document.getElementById("29"),
    add30btn = document.getElementById("30"),
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
            x: Width/2 - 40,
            y: height/2 -40,
            width: 270,
            height: 270,
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

add04btn.addEventListener("click", ()=> addsticker("Images/sticker-04.png"));
add02btn.addEventListener("click", ()=> addsticker("Images/sticker-02.png"));
add03btn.addEventListener("click", ()=>addsticker("Images/sticker-03.png"));
add01btn.addEventListener("click", ()=>addsticker("Images/sticker-01.png"));
add05btn.addEventListener("click", ()=>addsticker("Images/sticker-05.png"));
add06btn.addEventListener("click", ()=>addsticker("Images/sticker-06.png"));
add07btn.addEventListener("click", ()=>addsticker("Images/sticker-07.png"));
add08btn.addEventListener("click", ()=>addsticker("Images/sticker-08.png"));
add09btn.addEventListener("click", ()=>addsticker("Images/sticker-09.png"));
add10btn.addEventListener("click", ()=>addsticker("Images/sticker-10.png"));
add11btn.addEventListener("click", ()=>addsticker("Images/sticker-11.png"));
add12btn.addEventListener("click", ()=>addsticker("Images/sticker-12.png"));
add13btn.addEventListener("click", ()=>addsticker("Images/sticker-13.png"));
add14btn.addEventListener("click", ()=>addsticker("Images/sticker-14.png"));
add15btn.addEventListener("click", ()=>addsticker("Images/sticker-15.png"));
add16btn.addEventListener("click", ()=>addsticker("Images/sticker-16.png"));
add17btn.addEventListener("click", ()=>addsticker("Images/sticker-17.png"));
add18btn.addEventListener("click", ()=>addsticker("Images/sticker-18.png"));
add19btn.addEventListener("click", ()=>addsticker("Images/sticker-19.png"));
add20btn.addEventListener("click", ()=>addsticker("Images/sticker-20.png"));
add21btn.addEventListener("click", ()=>addsticker("Images/sticker-21.png"));
add22btn.addEventListener("click", ()=>addsticker("Images/sticker-22.png"));
add23btn.addEventListener("click", ()=>addsticker("Images/sticker-23.png"));
add24btn.addEventListener("click", ()=>addsticker("Images/sticker-24.png"));
add25btn.addEventListener("click", ()=>addsticker("Images/sticker-25.png"));
add26btn.addEventListener("click", ()=>addsticker("Images/sticker-26.png"));
add27btn.addEventListener("click", ()=>addsticker("Images/sticker-27.png"));
add28btn.addEventListener("click", ()=>addsticker("Images/sticker-28.png"));
add29btn.addEventListener("click", ()=>addsticker("Images/sticker-29.png"));
add30btn.addEventListener("click", ()=>addsticker("Images/sticker-30.png"));


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



