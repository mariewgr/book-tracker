/* Petits utilitaires génériques UI (ids, échappement HTML, dialogues, toasts, tri glisser-déposer). */
import {t} from './i18n';

export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
export const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Dialogues intégrés (prompt/confirm/alert natifs bloqués en PWA iOS) */
export let dlgBtns=[];
export function openDlg(title,input,buttons){
  document.getElementById('dlgTitle').textContent=title;
  const inp=document.getElementById('dlgInput');
  if(input!==null){inp.classList.remove('hidden');inp.value=input;setTimeout(()=>inp.focus(),150);}
  else inp.classList.add('hidden');
  dlgBtns=buttons;
  document.getElementById('dlgBtns').innerHTML=buttons.map((b,i)=>
    `<button class="btn ${b.ghost?'ghost':''} ${b.danger?'danger':''}" onclick="dlgAct(${i})">${b.label}</button>`).join('');
  document.getElementById('dlg').classList.add('open');
}
export function dlgAct(i){
  const b=dlgBtns[i];
  const v=document.getElementById('dlgInput').value;
  document.getElementById('dlg').classList.remove('open');
  if(b&&b.fn)b.fn(v);
}
export function askText(title,def,fn){openDlg(title,def||'',[{label:'OK',fn:v=>fn((v||'').trim())},{label:'Annuler',ghost:true}]);}
export function askConfirm(title,fn,label){openDlg(title,null,[{label:label||'Confirmer',danger:true,fn:()=>fn()},{label:'Annuler',ghost:true}]);}
export function confetti(){
  const cols=['#c9a2ff','#f5c86e','#6ee7a8','#ff8a8a','#7fc5ff'];
  for(let i=0;i<36;i++){
    const p=document.createElement('div');
    p.style.cssText='position:fixed;z-index:99;top:-14px;left:'+(Math.random()*100)+'vw;width:'+(6+Math.random()*6)+'px;height:'+(8+Math.random()*8)+'px;background:'+cols[i%5]+';border-radius:2px;pointer-events:none;transition:transform '+(1.6+Math.random())+'s ease-in,opacity .5s '+(1.5+Math.random())+'s';
    document.body.appendChild(p);
    requestAnimationFrame(()=>{
      p.style.transform='translateY(108vh) rotate('+(360+Math.random()*360)+'deg)';
      p.style.opacity='0';
    });
    setTimeout(()=>p.remove(),3300);
  }
}
export function toast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg;t.className='show';
  clearTimeout(t._h);t._h=setTimeout(()=>t.className='',3000);
}
/* Réordonnancement par glisser-déposer (poignée ⠿, tactile + souris) */
export function makeSortable(container,onDone,itemSel){
  if(!container)return;
  itemSel=itemSel||'.sitem';
  container._onDone=onDone;
  container._itemSel=itemSel;
  if(container._sortInit)return;
  container._sortInit=true;
  container.addEventListener('pointerdown',e=>{
    const h=e.target.closest('.drag');
    if(!h)return;
    const row=h.closest(container._itemSel);
    if(!row||row.parentNode!==container)return;
    e.preventDefault();
    row.classList.add('dragging');
    let moved=false;
    const move=ev=>{
      ev.preventDefault();
      moved=true;
      row.style.pointerEvents='none';
      const el=document.elementFromPoint(ev.clientX,ev.clientY);
      row.style.pointerEvents='';
      const t=el&&el.closest?el.closest(container._itemSel):null;
      if(t&&t!==row&&t.parentNode===container){
        const r=t.getBoundingClientRect();
        container.insertBefore(row,ev.clientY<r.top+r.height/2?t:t.nextSibling);
      }
    };
    const up=()=>{
      row.classList.remove('dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
      window.removeEventListener('pointercancel',up);
      if(moved)container._onDone([...container.querySelectorAll(container._itemSel)].map(x=>+x.dataset.i));
    };
    window.addEventListener('pointermove',move,{passive:false});
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
  });
}
/* Icônes : PNG personnalisés si disponibles, sinon SVG intégrés */
export function closeModals(){document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('open'));}

