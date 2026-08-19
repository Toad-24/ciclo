(() => {
  let canvas, ctx, painting = false, last = null, color = '#e9578a', size = 8, tool = 'brush';
  let strokes = [], ready = false, applyingRemote = false;
  const $ = id => document.getElementById(id);
  function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
  function paintStroke(s){if(!s?.points?.length)return;ctx.save();ctx.strokeStyle=s.tool==='eraser'?'#fff':s.color;ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=s.size;ctx.lineCap='round';ctx.lineJoin='round';if(s.points.length===1){ctx.beginPath();ctx.arc(s.points[0].x,s.points[0].y,s.size/2,0,Math.PI*2);ctx.fill();}else{ctx.beginPath();ctx.moveTo(s.points[0].x,s.points[0].y);for(let i=1;i<s.points.length;i++)ctx.lineTo(s.points[i].x,s.points[i].y);ctx.stroke();}ctx.restore();}
  function redraw(){ctx.clearRect(0,0,canvas.width,canvas.height);strokes.forEach(paintStroke);}
  async function sync(){if(!db||applyingRemote)return;try{await db.ref('drawing/shared').set({strokes,updatedAt:Date.now()});}catch(e){console.error('Dibujo:',e);}}
  function start(e){e.preventDefault();painting=true;last=point(e);const s={color,size,tool,points:[last]};strokes.push(s);paintStroke(s);canvas.setPointerCapture?.(e.pointerId);}
  function move(e){if(!painting)return;e.preventDefault();const p=point(e),s=strokes[strokes.length-1];s.points.push(p);ctx.save();ctx.strokeStyle=s.tool==='eraser'?'#fff':s.color;ctx.lineWidth=s.size;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();last=p;}
  async function end(e){if(!painting)return;e?.preventDefault();painting=false;last=null;await sync();}
  function setup(){if(ready||!$('drawingSection')||typeof db==='undefined'||!db)return;ready=true;canvas=$('drawingCanvas');ctx=canvas.getContext('2d');canvas.width=900;canvas.height=560;canvas.style.touchAction='none';
    canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
    $('brushColor').oninput=e=>color=e.target.value;$('brushSize').oninput=e=>{size=+e.target.value;$('brushSizeValue').textContent=size};
    $('brushBtn').onclick=()=>{tool='brush';$('brushBtn').classList.add('active');$('eraserBtn').classList.remove('active');};
    $('eraserBtn').onclick=()=>{tool='eraser';$('eraserBtn').classList.add('active');$('brushBtn').classList.remove('active');};
    $('drawingUndo').onclick=async()=>{strokes.pop();redraw();await sync();};
    $('drawingClear').onclick=async()=>{if(!confirm('¿Borrar todo el dibujo para los dos?'))return;strokes=[];redraw();await sync();};
    $('drawingDownload').onclick=()=>{const a=document.createElement('a');a.download='nuestro-dibujo.png';a.href=canvas.toDataURL('image/png');a.click();};
    db.ref('drawing/shared').on('value',snap=>{const v=snap.val();if(!v)return;applyingRemote=true;strokes=Array.isArray(v.strokes)?v.strokes:[];redraw();applyingRemote=false;});
    redraw();
  }
  const wait=setInterval(()=>{try{setup();}catch(e){console.error(e);}if(ready)clearInterval(wait);},400);
})();