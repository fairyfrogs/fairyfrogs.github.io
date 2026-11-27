(()=>{'use strict';
const endpoint='https://lqmwirnifapxctzmkmll.supabase.co/functions/v1/bewerbungsstatus';
const apikey='sb_publishable_4vWZiD2xePd7EwFAdTUDAg_lv8KEXKs';
const hub=document.getElementById('leader-hub'),state=document.getElementById('intake-state'),toggle=document.getElementById('intake-toggle'),refresh=document.getElementById('intake-refresh'),feedback=document.getElementById('intake-feedback');
if(!hub||!state||!toggle||!refresh||!feedback)return;
let open=null,busy=false,generation=0;
function render(){state.textContent=open===null?'Status unbekannt':open?'● Bewerbungsfach geöffnet':'● Bewerbungsfach geschlossen';toggle.textContent=open===null?'Status zuerst laden':open?'Bewerbungsfach schließen':'Bewerbungsfach öffnen';toggle.disabled=busy||open===null||hub.hidden;refresh.disabled=busy||hub.hidden;}
async function request(change){if(hub.hidden||busy)return;const token=sessionStorage.getItem('pl_leitung_session');if(!token){feedback.textContent='Bitte erneut anmelden.';return;}const run=++generation;busy=true;render();feedback.textContent=change?'Änderung wird gespeichert …':'Status wird geladen …';try{const options={cache:'no-store',headers:{apikey}};if(change){options.method='POST';options.headers['Content-Type']='application/json';options.body=JSON.stringify({token,open:!open});}const res=await fetch(endpoint,options);const data=await res.json();if(!res.ok||typeof data.open!=='boolean')throw Error(data.error||'Status nicht verfügbar');if(run!==generation||hub.hidden)return;open=data.open;feedback.textContent=change?'Änderung gespeichert. Der neue Status gilt für alle Besucher.':'';}catch(e){if(run!==generation||hub.hidden)return;open=null;feedback.textContent='Status konnte nicht bestätigt werden. '+e.message+' Bitte aktualisieren.';}finally{if(run===generation){busy=false;render();}}}
toggle.addEventListener('click',()=>{if(open!==null)request(true);});refresh.addEventListener('click',()=>request(false));
new MutationObserver(()=>{if(hub.hidden){generation++;busy=false;open=null;feedback.textContent='';render();}else request(false);}).observe(hub,{attributes:true,attributeFilter:['hidden']});
render();if(!hub.hidden)request(false);
})();
