const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();

const modal=$("#modal"), modalContent=$("#modalContent");
function openModal(name){
  const t=document.getElementById(name+"Template");
  if(!t)return;
  modalContent.innerHTML=""; modalContent.append(t.content.cloneNode(true));
  modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
  initTool(name);
}
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");modalContent.innerHTML=""}
document.addEventListener("click",e=>{
  const btn=e.target.closest(".open-tool"); if(btn)openModal(btn.dataset.modal);
  if(e.target.matches("[data-close]"))closeModal();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("open");

const units={
 length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,yd:.9144,ft:.3048,in:.0254},
 weight:{kg:1,g:.001,mg:.000001,lb:.45359237,oz:.0283495231,ton:1000},
 temperature:{C:"C",F:"F",K:"K"},
 area:{m2:1,km2:1e6,cm2:.0001,ft2:.09290304,yd2:.83612736,acre:4046.8564224},
 speed:{mps:1,kph:.2777777778,mph:.44704,knot:.5144444444},
 time:{sec:1,min:60,hour:3600,day:86400,week:604800},
 data:{B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776}
};
const labels={
 length:{m:"Meter",km:"Kilometer",cm:"Centimeter",mm:"Millimeter",mi:"Mile",yd:"Yard",ft:"Foot",in:"Inch"},
 weight:{kg:"Kilogram",g:"Gram",mg:"Milligram",lb:"Pound",oz:"Ounce",ton:"Metric ton"},
 temperature:{C:"Celsius",F:"Fahrenheit",K:"Kelvin"},
 area:{m2:"Square meter",km2:"Square kilometer",cm2:"Square centimeter",ft2:"Square foot",yd2:"Square yard",acre:"Acre"},
 speed:{mps:"Meter/second",kph:"Kilometer/hour",mph:"Mile/hour",knot:"Knot"},
 time:{sec:"Second",min:"Minute",hour:"Hour",day:"Day",week:"Week"},
 data:{B:"Byte",KB:"KB",MB:"MB",GB:"GB",TB:"TB"}
};
let currentConv="length";
function fillUnits(){
  const a=$("#convFrom"),b=$("#convTo"); if(!a)return;
  a.innerHTML=b.innerHTML="";
  Object.entries(labels[currentConv]).forEach(([k,v])=>{a.add(new Option(v,k));b.add(new Option(v,k))});
  b.value=Object.keys(labels[currentConv])[1]||Object.keys(labels[currentConv])[0];
  convert();
}
function convert(){
  const v=parseFloat($("#convValue")?.value); if(!Number.isFinite(v)){$("#convResult").textContent="—";return}
  const from=$("#convFrom").value,to=$("#convTo").value;
  let out;
  if(currentConv==="temperature"){
    let c=from==="C"?v:from==="F"?(v-32)*5/9:v-273.15;
    out=to==="C"?c:to==="F"?c*9/5+32:c+273.15;
  }else out=v*units[currentConv][from]/units[currentConv][to];
  $("#convResult").textContent=`${format(out)} ${labels[currentConv][to]}`;
}
function format(n){return Math.abs(n)>=1e9||Math.abs(n)<1e-7?n.toExponential(8).replace(/\.?0+e/,"e"):Number(n.toFixed(8)).toLocaleString()}
$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");currentConv=t.dataset.converter;fillUnits()});
$("#convValue").oninput=convert;$("#convFrom").onchange=convert;$("#convTo").onchange=convert;$("#swapBtn").onclick=()=>{const a=$("#convFrom"),b=$("#convTo"),x=a.value;a.value=b.value;b.value=x;convert()};fillUnits();

function initTool(name){
  if(name==="basicCalc"){
    let expr="",disp=$("#calcDisplay");
    $$(".calc-grid button").forEach(b=>b.onclick=()=>{
      const v=b.dataset.calc;
      if(v==="C"){expr="";disp.value="0";return}
      if(v==="⌫"){expr=expr.slice(0,-1);disp.value=expr||"0";return}
      if(v==="="){try{if(!/^[0-9+*/%(). -]+$/.test(expr))throw 0;let r=Function(`"use strict";return (${expr})`)();expr=String(r);disp.value=expr}catch{disp.value="Error";expr=""}return}
      expr+=v;disp.value=expr;
    });
  }
  if(name==="percentCalc"){$("#pBtn").onclick=()=>$("#pAns").textContent=Number($("#p1").value)*Number($("#p2").value)/100;$("#pBtn2").onclick=()=>{$("#pAns2").textContent=Number($("#p4").value)?(Number($("#p3").value)/Number($("#p4").value)*100).toFixed(4)+"%":"Cannot divide by zero"}}
  if(name==="ageCalc")$("#ageBtn").onclick=()=>{const d=new Date($("#dob").value),n=new Date();if(isNaN(d))return $("#ageAns").textContent="Choose a date.";let age=n.getFullYear()-d.getFullYear();const m=n.getMonth()-d.getMonth();if(m<0||(m===0&&n.getDate()<d.getDate()))age--;$("#ageAns").textContent=`You are ${age} years old.`};
  if(name==="discountCalc")$("#discountBtn").onclick=()=>{const p=+$("#price").value,d=+$("#discount").value;if(p<0||d<0||d>100)return $("#discountAns").textContent="Enter valid values.";const s=p*d/100;$("#discountAns").textContent=`You save ${s.toFixed(2)}. Sale price: ${(p-s).toFixed(2)}.`};
  if(name==="bmiCalc")$("#bmiBtn").onclick=()=>{const w=+$("#bmiWeight").value,h=+$("#bmiHeight").value/100;if(w<=0||h<=0)return $("#bmiAns").textContent="Enter valid values.";const b=w/(h*h);const c=b<18.5?"Underweight":b<25?"Healthy range":b<30?"Overweight":"Obesity";$("#bmiAns").textContent=`BMI: ${b.toFixed(1)} — ${c}`};
  if(name==="scientificCalc")$("#sciBtn").onclick=()=>{let s=$("#sciExpr").value.toLowerCase().replace(/\^/g,"**").replace(/\bpi\b/g,"Math.PI").replace(/\bsqrt\b/g,"Math.sqrt").replace(/\bsin\b/g,"Math.sin").replace(/\bcos\b/g,"Math.cos").replace(/\btan\b/g,"Math.tan").replace(/\blog\b/g,"Math.log10").replace(/\bln\b/g,"Math.log").replace(/\babs\b/g,"Math.abs");try{if(!/^[0-9+\-*/%().,\s*a-zA-Z]+$/.test(s)||/(constructor|window|document|globalThis)/.test(s))throw 0;$("#sciAns").textContent=Function(`"use strict";return (${s})`)()}catch{$("#sciAns").textContent="Invalid expression."}};
  if(name==="jpgPdf")$("#jpgBtn").onclick=async()=>{const files=[...$("#jpgFiles").files];if(!files.length)return $("#jpgAns").textContent="Choose images.";const {jsPDF}=window.jspdf;const pdf=new jsPDF();for(let i=0;i<files.length;i++){const img=await fileDataURL(files[i]);const props=pdf.getImageProperties(img),pw=210,ph=pw*props.height/props.width;if(i)pdf.addPage();pdf.addImage(img,"JPEG",0,10,pw,Math.min(ph,277));}downloadBlob(pdf.output("blob"),"quicktools-images.pdf");$("#jpgAns").textContent="PDF created."};
  if(name==="mergePdf")$("#mergeBtn").onclick=async()=>{const fs=[...$("#mergeFiles").files];if(fs.length<1)return $("#mergeAns").textContent="Choose PDFs.";try{const out=await PDFLib.PDFDocument.create();for(const f of fs){const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p))}downloadBytes(await out.save(),"merged.pdf","application/pdf");$("#mergeAns").textContent="Merged PDF created."}catch(e){$("#mergeAns").textContent="Could not merge this PDF."}};
  if(name==="splitPdf")$("#splitBtn").onclick=async()=>{const f=$("#splitFile").files[0],spec=$("#splitPages").value;if(!f)return $("#splitAns").textContent="Choose a PDF.";try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer()),ids=parsePages(spec,src.getPageCount());const out=await PDFLib.PDFDocument.create();const pages=await out.copyPages(src,ids);pages.forEach(p=>out.addPage(p));downloadBytes(await out.save(),"split-pages.pdf","application/pdf");$("#splitAns").textContent="Pages extracted."}catch{$("#splitAns").textContent="Check the page range."}};
  if(name==="compressPdf")$("#compressBtn").onclick=async()=>{const f=$("#compressFile").files[0];if(!f)return $("#compressAns").textContent="Choose a PDF.";try{const src=await PDFLib.PDFDocument.load(await f.arrayBuffer());const bytes=await src.save({useObjectStreams:true});downloadBytes(bytes,"compressed.pdf","application/pdf");$("#compressAns").textContent=`Processed. Original: ${prettyBytes(f.size)}, output: ${prettyBytes(bytes.length)}.`}catch{$("#compressAns").textContent="Could not process this PDF."}};
  if(name==="pdfJpg")$("#pdfJpgBtn").onclick=async()=>{const f=$("#pdfJpgFile").files[0],page=+$("#pdfJpgPage").value;if(!f)return $("#pdfJpgAns").textContent="Choose a PDF.";try{const pdf=await loadPdfJs();const doc=await pdf.getDocument({data:await f.arrayBuffer()}).promise;if(page<1||page>doc.numPages)throw 0;const p=await doc.getPage(page),vp=p.getViewport({scale:1.7}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await p.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;c.toBlob(b=>downloadBlob(b,`page-${page}.jpg`),"image/jpeg",.92);$("#pdfJpgAns").textContent="JPG created."}catch{$("#pdfJpgAns").textContent="Could not render this PDF page."}};
}
function fileDataURL(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function downloadBytes(bytes,name,type){downloadBlob(new Blob([bytes],{type}),name)}
function prettyBytes(n){return `${(n/1024/1024).toFixed(2)} MB`}
function parsePages(spec,total){const set=new Set();for(const part of spec.split(",")){const [a,b]=part.trim().split("-").map(Number);if(!a||a<1||a>total)throw 0;if(b){if(b<a||b>total)throw 0;for(let i=a;i<=b;i++)set.add(i-1)}else set.add(a-1)}return [...set].sort((a,b)=>a-b)}
async function loadPdfJs(){if(window.__pdfjs)return window.__pdfjs;const m=await import("https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/4.4.168/pdf.min.mjs");m.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/4.4.168/pdf.worker.min.mjs";window.__pdfjs=m;return m}

$("#toolSearch").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  $$(".tool-card").forEach(c=>c.classList.toggle("hidden",q&&!c.dataset.tool.includes(q)));
  if(q)document.querySelector($$(".tool-card:not(.hidden)").length?"#calculators":"#home")?.scrollIntoView({behavior:"smooth",block:"start"});
});
