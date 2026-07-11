// frame selected logic here
const selectedFrame = localStorage.getItem("selectedFrame");
console.log("Selected frame:", selectedFrame);

const frameImage = document.getElementById("frame");

if (selectedFrame === "voltaction-1") {
    frameImage.src = "Images/Voltaction Design 1.png";
} else if (selectedFrame === "voltaction-2") {
    frameImage.src = "Images/Voltaction Design 2.png";
} else {
    console.log("No matching frame.");
}

// photo taking
const video = document.getElementById("video");
const takeBtn = document.getElementById("select-take");
const uploadBtn = document.getElementById("select-upload");
const captureBtn = document.getElementById("capture-btn");
const uploadInput = document.getElementById("uploadInput");
const doneBtn = document.getElementById("done-btn");

// photo elements
const photos = [
    document.getElementById("photo-1"),
    document.getElementById("photo-2"),
    document.getElementById("photo-3"),
    document.getElementById("photo-4")
];

// location/position for camera preview
const position = [    
    {top:18, left:21, width:196, height:135},
    {top:175, left:29, width:180, height:138},
    {top:328, left:30, width:180, height:130},
    {top:479, left:25, width:187, height:145}
];

// position coordinates on the high-res final canvas
const canvasSlots = [
    {x:60, y:50, w:575, h:395},
    {x:82, y:510, w:525, h:400},
    {x:85, y:955, w:525, h:380},
    {x:72, y:1395, w:545, h:420}
];

let stream;
let currentPhoto = 0; 
let isUploadMode = false;

const captureCanvas = document.createElement("canvas");
const captureCtx = captureCanvas.getContext("2d");

const finalCanvas = document.getElementById("finalCanvas");
const finalCtx = finalCanvas.getContext("2d");
const frame = document.getElementById("frame");

// for the camera to start
async function startcamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        video.style.display = "block";
    }
    catch (err){
        alert("Camera permission denied or not available.");
        console.error(err);
    }
}

// stopping camera
function stopcamera(){
    if(stream){
        stream.getTracks().forEach(track => track.stop());
        video.style.display = "none";
    }
}

// move camera position for the cutout during photo taking 
function movepreview(index){
    const p = position[index];
    if (p) {
        video.style.top = p.top + "px";
        video.style.left = p.left + "px";
        video.style.width = p.width + "px";
        video.style.height = p.height + "px";
    }
}

// the photo will be drawn on canvas
// function drawPhotoOnCanvas(photoIndex){
//     const slot = canvasSlots[photoIndex];
//     if(photos[photoIndex] && slot) {
//         finalCtx.drawImage(
//             photos[photoIndex],
//             slot.x,
//             slot.y,
//             slot.w,
//             slot.h
//         );
//     }
// }

// A smart drawImage that mimics "object-fit: cover" to prevent stretching
function drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const slotRatio = w / h;
    
    let sx, sy, sw, sh;

    if (imgRatio > slotRatio) {
        // Image is wider than the slot (crop the sides)
        sh = img.height;
        sw = img.height * slotRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
    } else {
        // Image is taller than the slot (crop the top/bottom)
        sw = img.width;
        sh = img.width / slotRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// Update your original function to use the helper above
function drawPhotoOnCanvas(photoIndex){
    const slot = canvasSlots[photoIndex];
    if(photos[photoIndex] && slot) {
        drawImageCover(
            finalCtx,
            photos[photoIndex],
            slot.x,
            slot.y,
            slot.w,
            slot.h
        );
    }
}

function finishstrip(){
    // Ensure the frame image is fully loaded before drawing it over photos
    if(!frame.complete || frame.naturalWidth === 0){
        frame.onload = finishstrip;
        return;
    }

    // Draw the overlay frame last so it goes on top of the images
    finalCtx.drawImage(
        frame,
        0,
        0,
        finalCanvas.width,
        finalCanvas.height
    );

    try {
        localStorage.setItem(
            "photostrip",
            finalCanvas.toDataURL("image/png")
        );
        window.location.href = "decorate.html";
    } catch (e) {
        console.error("Security error saving canvas:", e);
        alert("Please make sure you are running this app using a local server (like Live Server) rather than double clicking the file.");
    }
}

const downloadPhoto = () => {
  elements.canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'photo-strip.png';
    a.click();
  }, 'image/png');
};

function hidebutton(){
    takeBtn.style.display = "none";
    uploadBtn.style.display = "none";
}

takeBtn.addEventListener("click", async()=>{
    hidebutton();
    captureBtn.style.display="block";
    currentPhoto = 0;
    isUploadMode = false;

    finalCtx.clearRect(
        0,
        0,
        finalCanvas.width,
        finalCanvas.height
    );

    await startcamera();
    movepreview(0);
});

captureBtn.addEventListener("click", ()=>{
    if (!stream) return;

    const slot = canvasSlots[currentPhoto];
    if (!slot) return;

    const videoRect = video.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    const scaleX = finalCanvas.width / frameRect.width;
    const scaleY = finalCanvas.height / frameRect.height;

    const targetX = (videoRect.left - frameRect.left) * scaleX;
    const targetY = (videoRect.top - frameRect.top) * scaleY;
    const targetW = videoRect.width * scaleX;
    const targetH = videoRect.height * scaleY;

    finalCtx.save();

    finalCtx.beginPath();
    finalCtx.rect(slot.x, slot.y, slot.w, slot.h);
    finalCtx.clip();

    finalCtx.drawImage(video, targetX, targetY, targetW, targetH);
    finalCtx.restore();

    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    captureCtx.drawImage(
        video,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    photos[currentPhoto].src = captureCanvas.toDataURL("image/png");

    // const imageData = captureCanvas.toDataURL("image/png");
    // photos[currentPhoto].src = imageData;

    // photos[currentPhoto].onload = () => {
    //     // We draw to final canvas inside the load event to avoid blank images
    //     drawPhotoOnCanvas(currentPhoto);
        
        currentPhoto++;

        if (currentPhoto < 4){
            movepreview(currentPhoto);
        }
        else{
            stopcamera();
            captureBtn.style.display = "none";
            finishstrip();
        }
    
});

uploadBtn.addEventListener("click", () =>{
    uploadBtn.style.display = "none";

    // currentPhoto = 0;
    if (currentPhoto === 0){
        finalCtx.clearRect(
            0,
            0,
            finalCanvas.width,
            finalCanvas.height
    );
        takeBtn.style.display = "none"
    }

    uploadInput.click();
});

uploadInput.addEventListener("change", function(){
    const file = this.files[0];

    if(!file){
        uploadBtn.style.display = "block";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event){

        const img = new Image();
        img.onload = function(){
            photos[currentPhoto].src = img.src;
            const slot = canvasSlots[currentPhoto];

            // finalCtx.drawImage(
            //     img, 
            //     slot.x,
            //     slot.y,
            //     slot.w,
            //     slot.h
            // );

            // Inside uploadInput.addEventListener("change", ...) change this line:
            drawImageCover(finalCtx, img, slot.x, slot.y, slot.w, slot.h);

            currentPhoto++;
            uploadInput.value = "";
  
            if (currentPhoto < 4){
                uploadBtn.textContent = `upload photo ${currentPhoto + 1}`;

                uploadBtn.style.display = "block";
            } else{
                uploadBtn.style.display = "none";
                doneBtn.style.display = "block";
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

doneBtn.addEventListener("click", ()=>{
    doneBtn.style.display = "none";
    finishstrip();
});
