const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fillColor"),
  sizeSlider = document.querySelector("#sizeSlider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#colorPicker"),
  clearCanvas = document.querySelector(".clearCanvas"),
  saveImage = document.querySelector(".saveImg");

const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "pencil";
let brushWidth = 5;
let selectedColor = "#000";

let history = [];
let historyStep = -1;

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active")?.classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log("Selected tool:", selectedTool);
  });
});

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  console.log("Mouse down at:", prevMouseX, prevMouseY);

  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;

  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  console.log("Drawing at:", e.offsetX, e.offsetY);

  ctx.putImageData(snapshot, 0, 0);

  if (
    selectedTool === "pencil" ||
    selectedTool === "brush" ||
    selectedTool === "eraser"
  ) {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
};

function saveState() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  historyStep++;
  console.log("Saved state, history length:", history.length);
}

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  console.log("Mouse up, stopping drawing.");
  saveState();
});
