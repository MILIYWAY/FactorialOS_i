function updateTime() {
    let currentTime=new Date().toLocaleString();
    let timeText=document.querySelector("#dateDisplay");
    timeText.innerHTML= currentTime;
    }
setInterval(updateTime, 1000);

function type(el, speed = 70) {
  let text = el.textContent; 
  el.textContent = " ";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

type(document.getElementById("ostitle"))

setTimeout(() => {type(document.getElementById("dateDisplay"), 50)}, 3000);

