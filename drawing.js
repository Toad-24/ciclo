(() => {
  const templates = {
    gato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><g fill="white" stroke="#333" stroke-width="8" stroke-linejoin="round"><path d="M145 205 L120 90 L220 145 Q300 115 380 145 L480 90 L455 205 Q475 245 465 300 Q450 390 300 405 Q150 390 135 300 Q125 245 145 205Z"/><path d="M205 245 Q225 225 245 245" fill="none"/><path d="M355 245 Q375 225 395 245" fill="none"/><circle cx="225" cy="255" r="7" fill="#333"/><circle cx="375" cy="255" r="7" fill="#333"/><path d="M285 285 Q300 300 315 285 Q300 315 285 285Z" fill="#f58aa8"/><path d="M300 310 Q270 345 235 320 M300 310 Q330 345 365 320" fill="none"/><path d="M155 300 L70 280 M155 325 L65 330 M445 300 L530 280 M445 325 L535 330" fill="none"/></g></svg>`,
    gatito: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><g fill="white" stroke="#333" stroke-width="8" stroke-linejoin="round"><path d="M170 190 L150 85 L245 145 Q300 125 355 145 L450 85 L430 190 Q455 240 445 320 Q425 410 300 420 Q175 410 155 320 Q145 240 170 190Z"/><circle cx="230" cy="255" r="9" fill="#333"/><circle cx="370" cy="255" r="9" fill="#333"/><path d="M280 290 Q300 305 320 290" fill="none"/><path d="M300 300 L300 325" fill="none"/><path d="M300 325 Q270 350 245 330 M300 325 Q330 350 355 330" fill="none"/><path d="M160 300 L80 285 M160 325 L75 330 M440 300 L520 285 M440 325 L525 330" fill="none"/></g></svg>`,
    corazon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><path d="M300 420 L95 225 Q40 165 85 105 Q130 45 205 75 Q255 95 300 150 Q345 95 395 75 Q470 45 515 105 Q560 165 505 225Z" fill="white" stroke="#333" stroke-width="9"/></svg>`,
    pareja: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><g fill="white" stroke="#333" stroke-width="8"><circle cx="220" cy="180" r="70"/><circle cx="380" cy="180" r="70"/><path d="M130 390 Q140 285 220 280 Q300 285 310 390Z"/><path d="M290 390 Q300 285 380 280 Q460 285 470 390Z"/><path d="M280 250 Q300 270 320 250" fill="none"/></g></svg>`
  };
  let canvas,ctx,painting=false,last=null,color="#e9578a",size=8,template="gato",strokes=[],ready=false;
  const $=id=>document.getElementById(id);
  function drawTemplate(name){
    template=name; const img=new Image(); img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);redrawStrokes()};
    img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(templates[name]);
  }
  function point(e){const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height;return{x,y}}
  function start(e){e.preventDefault();painting=true;last=point(e);strokes.push({color,size,points:[last]})}
  function move(e){if(!painting)return;e.preventDefault();const p=point(e),s=strokes[strokes.length-1];s.points.push(p);ctx.strokeStyle=s.color;ctx.lineWidth=s.size;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p}
  async function end(){if(!painting)return;painting=false;last=null;await sync()}
  function redrawStrokes(){for(const s of strokes){ctx.strokeStyle=s.color;ctx.lineWidth=s.size;ctx.lineCap="round";ctx.lineJoin="round";for(let i=1;i<s.points.length;i++){ctx.beginPath();ctx.moveTo(s.points[i-1].x,s.points[i-1].y);ctx.lineTo(s.points[i].x,s.points[i].y);ctx.stroke()}}}
  async function sync(){if(!db)return;try{await db.ref("drawing/shared").set({template,strokes,updatedAt:Date.now()})}catch(e){console.error("Dibujo:",e)}}
  function load(s){const v=s.val();if(!v)return;template=v.template||"gato";strokes=Array.isArray(v.strokes)?v.strokes:[];drawTemplate(template)}
  function setup(){if(ready||!$("drawingSection"))return;if(!db)return;ready=true;canvas=$("drawingCanvas");ctx=canvas.getContext("2d");canvas.width=900;canvas.height=650;canvas.addEventListener("pointerdown",start);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);canvas.addEventListener("pointerleave",end);
    $("brushColor").oninput=e=>color=e.target.value;$("brushSize").oninput=e=>{size=+e.target.value;$("brushSizeValue").textContent=size};
    document.querySelectorAll("[data-drawing]").forEach(b=>b.onclick=()=>{strokes=[];drawTemplate(b.dataset.drawing);sync()});
    $("drawingClear").onclick=async()=>{strokes=[];drawTemplate(template);await sync()};
    $("drawingUndo").onclick=async()=>{strokes.pop();drawTemplate(template);await sync()};
    db.ref("drawing/shared").on("value",load);drawTemplate(template);
  }
  const wait=setInterval(()=>{try{if(typeof db!=="undefined"&&db)setup()}catch(e){} if(ready)clearInterval(wait)},400);
})();