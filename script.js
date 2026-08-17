/* NUESTRO ESPACIO - sincronizado con Firebase Realtime Database */
const firebaseConfig={apiKey:"AIzaSyBQ715-AtvVquF68tiqoSfyt3UZmejIo44",authDomain:"ciclo-a8187.firebaseapp.com",databaseURL:"https://ciclo-a8187-default-rtdb.firebaseio.com",projectId:"ciclo-a8187",storageBucket:"ciclo-a8187.firebasestorage.app",messagingSenderId:"418245025071",appId:"1:418245025071:web:dfa24fbaf23110416995da"};
let currentDate=new Date(),selectedProtection="",cloudReady=false,db=null;
const defaults={periodDate:"",periodLength:5,cycleLength:28,relations:[],memories:[],dates:[]};
let data=JSON.parse(localStorage.getItem("loveCalendar")||"null")||structuredClone(defaults);
data={...defaults,...data,relations:data.relations||[],memories:data.memories||[],dates:data.dates||[]};
const $=id=>document.getElementById(id),calendar=$("calendar"),monthTitle=$("monthTitle"),periodDateInput=$("period