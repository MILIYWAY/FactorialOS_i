function updateTime() {
    let currentTime=new Date().toLocaleString();
    let timeText=document.querySelector("#timeDisplay");
    timeText.innerHTML= currentTime;
    }
setInterval(updateTime, 1000);

dragElement(document.getElementById("startWindow"));

function dragElement(element) {

  let usableW = window.innerWidth;
  let usableH = window.innerHeight;
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;

  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    initialX = e.clientX;
    initialY = e.clientY;
  
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();

    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}