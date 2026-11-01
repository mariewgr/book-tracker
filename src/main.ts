import {spineColor} from './core/book-utils';
import {translatePage} from './core/i18n';
import {icSvg,imgFallback} from './core/icons';
import {closeCropper,onImgPicked,pickImage,reRognerBookImage,reRognerField} from './core/images';
import {openPlus,switchTab,tab} from './core/navigation';
import {KEY,db,idbGet,idbSet,normalizeDb,save,setDb} from './core/state';
import {initAuth,pullCloud,sbLogout} from './core/supabase';
import {closeModals,dlgAct,esc} from './core/utils';
import {handleAuthSubmit,handleForgotPassword,handleResetPassword,signInWithOAuth,toggleAuthMode} from './pages/auth';
import {exportData,importData} from './pages/backup';
import {openAdd,pickSaga,renderStars,sagaSuggest,saveBook,segPick,setProg,setSmut,setStarVal,setSub,toggleStatutFields,updateParutionMsg} from './pages/book-form';
import {addCitation,delCitation,ocrCitation,onQuotePicked,openInfo,rereadBook} from './pages/book-info';
import {choosePileAvatar,openPileAvatarPicker,renderDefi,toggleDefiScope} from './pages/defi';
import {discLoad,discSwipe,renderDisc} from './pages/discover';
import {addComment,backfillFeed,clearPcBook,closePostCompose,deletePost,openPostCompose,pcPickBook,pickPostPhoto,renderFeed,renderPcBookChip,renderPcBookResults,renderPcPhotos,submitPost,toggleComments,toggleReaction} from './pages/feed';
import {onFeedbackPhotoPicked,pickFeedbackPhoto,removeFeedbackPhoto,sendFeedback} from './pages/feedback';
import {acceptFriendRequest,cancelFriendRequest,closeFriendProfile,copyFriendCode,declineFriendRequest,openFriendProfile,removeFriend,renderFriends,sendFriendRequest} from './pages/friends';
import {editObjectif,goPal,renderHome} from './pages/home';
import {applySearch,closeScanner,lookupISBN,onFichePicked,openScanner,pickFiche,searchOnline} from './pages/isbn-scan';
import {calMove,deleteSession,renderCal,selectCalDay} from './pages/journal';
import {renderLib,setLibFilter,setLibViewMode} from './pages/library';
import {addLibDeco,addLibDivider,libRemoveAt,libSlotTap,openLibEdit,renderLibEditViz,saveLibLayout} from './pages/library-shelf-editor';
import {addBookFromPreview,closeBookPreview,closeProfileVisitor,openBookPreview,openProfileVisitor} from './pages/profile-visitor';
import {deleteBook,openQuick,quickSetStatut,saveQuick} from './pages/quick-update';
import {rankAdd,rankMove,rankRemove,renderRank,renderRankAdd} from './pages/ranking';
import {renderSagas} from './pages/sagas';
import {closeTandem,deleteTandem,onTandemPicked,openTandem,openTandemForm,openTandemQuick,pickTandemPhoto,renderTandem,saveTandem,saveTandemQuick,setTandemLink,tandemLinksRefresh,tandemQuickTick,tandemTick} from './pages/tandem';
import {applyTheme,backfillSynopsis,onProfilePhotoPicked,openProfile,openSettings,pfToggleSection,pickProfilePhoto,saveProfile,saveSettings} from './pages/settings';
import {createShelfFromCols,deleteShelf,openShelfEdit,openShelfFromCols,renderShelfAdd,renderShelfEditViz,renderShelves,saveShelf,sfcToggle,shelfAddBook,shelfRemove,shelfSlotTap,shelfSourceAdd,shelfSourceRemove,shelfUnlink} from './pages/shelves';
import {chooseSpine,closeSpineCam,openSpineFind,searchCommunitySpines,spineRetake,spineShoot,spineUse} from './pages/spine-tools';
import {cycleStat,downloadRecap,genRecap,renderStats,shareRecap} from './pages/stats';

/* Ma Bibli — logique de l'application.
   Migré depuis le <script> inline de index.html : le code ci-dessous est inchangé, seul son
   emplacement a changé (voir la fin du fichier pour l'exposition sur window, nécessaire aux
   attributs onclick="..." inline conservés tels quels dans le HTML généré). */


/* ---------- Données ---------- */
export function render(){
  applyTheme();
  const map={home:renderHome,lib:renderLib,shelf:renderShelves,saga:renderSagas,
    rank:renderRank,defi:renderDefi,stats:renderStats,cal:renderCal,disc:renderDisc,feedback:()=>{},
    friends:renderFriends,feed:renderFeed,tandem:renderTandem};
  (map[tab]||renderHome)();
}
export async function loadLocalData(){
  try{
    let d=await idbGet('db');
    if(!d){
      /* migration depuis l'ancien stockage localStorage */
      try{d=JSON.parse(localStorage.getItem(KEY));}catch(e){}
      if(d&&d.books){
        await idbSet('db',d);
        try{localStorage.removeItem(KEY);}catch(e){}
      }
    }
    /* IMPORTANT : ne jamais appeler save() ici. Cette fonction charge ce qu'il y a en local,
       qui peut être arbitrairement périmé (cet appareil pas ouvert depuis des jours pendant que
       d'autres synchronisaient des changements plus récents). Appeler save() tamponnerait
       l'heure actuelle sur un contenu périmé, ce qui le ferait paraître "plus récent" que le
       cloud lors de la comparaison dans pullCloud() — et écraserait de vraies données plus
       récentes avec cette version périmée. La correction FR/EN reste appliquée en mémoire via
       normalizeDb() (donc affichée correctement) et ne sera persistée que lors d'une vraie
       sauvegarde (édition, ou adoption d'une version cloud plus récente).
       (Bug réel rencontré : voir commit "Normalize FR/EN..." puis son correctif.) */
    if(d&&d.books)setDb(normalizeDb(d));
  }catch(e){}
}
document.getElementById('fab').innerHTML=icSvg('book')+'<span class="plus">+</span>';
initAuth();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

/* Tirer pour rafraîchir : remplace l'ancien bouton — actif sur tout écran (tabs, connexion…),
   sauf si une modale est ouverte (pour ne pas recharger et perdre une saisie en cours). */
(function(){
  const el=document.getElementById('ptrIndicator');
  const THRESHOLD=68;
  let startY=0,dist=0,pulling=false,armed=false;
  const topScroll=()=>(document.scrollingElement||document.documentElement).scrollTop;
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||document.querySelector('.overlay.open')||topScroll()>0){pulling=false;return;}
    startY=e.touches[0].clientY;dist=0;pulling=true;armed=false;
    el.classList.remove('snap');
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    if(!pulling)return;
    dist=e.touches[0].clientY-startY;
    if(dist<=0||topScroll()>0){pulling=false;el.classList.remove('show','ready');el.style.transform='';return;}
    e.preventDefault();
    const d=Math.min(dist*0.45,100);
    armed=d>=THRESHOLD;
    el.classList.add('show');
    el.classList.toggle('ready',armed);
    el.style.transform='translateY('+d+'px) rotate('+(d*2.4)+'deg)';
  },{passive:false});
  function release(){
    if(!pulling)return;
    pulling=false;
    el.classList.add('snap');
    if(armed){
      el.classList.add('loading');
      el.style.transform='translateY('+THRESHOLD+'px)';
      location.reload();
    }else{
      el.classList.remove('show','ready');
      el.style.transform='';
    }
  }
  document.addEventListener('touchend',release);
  document.addEventListener('touchcancel',release);
})();

/* Bloque le scroll du fond tant qu'une modale/page (.overlay.open) est ouverte, pour empêcher
   le scroll de fuiter vers la page du dessous (surtout la fiche/l'édition d'un livre, en plein
   écran). Observe les classes plutôt que de patcher chaque fonction d'ouverture/fermeture. */
(function(){
  let savedY=0;
  function apply(){
    const open=!!document.querySelector('.overlay.open');
    const locked=document.body.classList.contains('scrollock');
    if(open&&!locked){
      savedY=window.scrollY;
      document.body.classList.add('scrollock');
      document.body.style.top='-'+savedY+'px';
    }else if(!open&&locked){
      document.body.classList.remove('scrollock');
      document.body.style.top='';
      window.scrollTo(0,savedY);
    }
  }
  new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
})();

/* Traduction automatique : retraduit tout contenu nouvellement rendu (onglets, modales,
   fiches…) sans avoir à appeler translatePage() dans chaque fonction render()/open*(). Se
   stabilise seule après un passage (le texte déjà traduit ne correspond plus à une clé FR,
   donc plus de mutation à observer). */
translatePage(document.getElementById('appRoot'));
translatePage(document.getElementById('authScreen'));
new MutationObserver(()=>{
  translatePage(document.getElementById('appRoot'));
  translatePage(document.getElementById('authScreen'));
}).observe(document.body,{childList:true,subtree:true,characterData:true});

/* ---------- Exposition globale (attributs onclick="..." inline dans le HTML) ----------
   En module ES, les déclarations de haut niveau ne sont plus accessibles depuis window
   comme avec un <script> classique — nécessaire pour que le HTML (statique et généré
   dynamiquement par les fonctions render*) puisse continuer à appeler ces fonctions via
   onclick="..." sans réécrire des centaines d'attributs en écouteurs d'évènements. */
declare global { interface Window { [key: string]: any } }
window.acceptFriendRequest=acceptFriendRequest;
window.addBookFromPreview=addBookFromPreview;
window.addCitation=addCitation;
window.addComment=addComment;
window.applySearch=applySearch;
window.backfillFeed=backfillFeed;
window.backfillSynopsis=backfillSynopsis;
window.calMove=calMove;
window.cancelFriendRequest=cancelFriendRequest;
window.chooseSpine=chooseSpine;
window.closeBookPreview=closeBookPreview;
window.closeCropper=closeCropper;
window.closeFriendProfile=closeFriendProfile;
window.clearPcBook=clearPcBook;
window.closeModals=closeModals;
window.closePostCompose=closePostCompose;
window.closeProfileVisitor=closeProfileVisitor;
window.closeScanner=closeScanner;
window.closeSpineCam=closeSpineCam;
window.copyFriendCode=copyFriendCode;
window.createShelfFromCols=createShelfFromCols;
window.cycleStat=cycleStat;
window.declineFriendRequest=declineFriendRequest;
window.delCitation=delCitation;
window.deleteBook=deleteBook;
window.quickSetStatut=quickSetStatut;
window.deletePost=deletePost;
window.deleteSession=deleteSession;
window.deleteShelf=deleteShelf;
window.discLoad=discLoad;
window.discSwipe=discSwipe;
window.dlgAct=dlgAct;
window.editObjectif=editObjectif;
window.esc=esc;
window.exportData=exportData;
window.genRecap=genRecap;
window.goPal=goPal;
window.shareRecap=shareRecap;
window.downloadRecap=downloadRecap;
window.handleAuthSubmit=handleAuthSubmit;
window.signInWithOAuth=signInWithOAuth;
window.handleForgotPassword=handleForgotPassword;
window.handleResetPassword=handleResetPassword;
window.imgFallback=imgFallback;
window.importData=importData;
window.lookupISBN=lookupISBN;
window.ocrCitation=ocrCitation;
window.onFeedbackPhotoPicked=onFeedbackPhotoPicked;
window.onFichePicked=onFichePicked;
window.onImgPicked=onImgPicked;
window.onProfilePhotoPicked=onProfilePhotoPicked;
window.onQuotePicked=onQuotePicked;
window.openAdd=openAdd;
window.openBookPreview=openBookPreview;
window.openFriendProfile=openFriendProfile;
window.openInfo=openInfo;
window.openPlus=openPlus;
window.openPostCompose=openPostCompose;
window.openProfile=openProfile;
window.openProfileVisitor=openProfileVisitor;
window.openQuick=openQuick;
window.openScanner=openScanner;
window.openSettings=openSettings;
window.openShelfEdit=openShelfEdit;
window.openShelfFromCols=openShelfFromCols;
window.openLibEdit=openLibEdit;
window.libSlotTap=libSlotTap;
window.libRemoveAt=libRemoveAt;
window.addLibDivider=addLibDivider;
window.addLibDeco=addLibDeco;
window.saveLibLayout=saveLibLayout;
window.renderLibEditViz=renderLibEditViz;
window.openSpineFind=openSpineFind;
window.pcPickBook=pcPickBook;
window.pfToggleSection=pfToggleSection;
window.pickFeedbackPhoto=pickFeedbackPhoto;
window.pickFiche=pickFiche;
window.pickImage=pickImage;
window.pickPostPhoto=pickPostPhoto;
window.pickProfilePhoto=pickProfilePhoto;
window.pickSaga=pickSaga;
window.rankAdd=rankAdd;
window.rankMove=rankMove;
window.rankRemove=rankRemove;
window.removeFeedbackPhoto=removeFeedbackPhoto;
window.removeFriend=removeFriend;
window.renderCal=renderCal;
window.renderLib=renderLib;
window.renderPcBookChip=renderPcBookChip;
window.renderPcBookResults=renderPcBookResults;
window.renderPcPhotos=renderPcPhotos;
window.renderRankAdd=renderRankAdd;
window.renderSagas=renderSagas;
Object.assign(window,{closeTandem,deleteTandem,onTandemPicked,openTandem,openTandemForm,openTandemQuick,pickTandemPhoto,saveTandem,saveTandemQuick,setTandemLink,tandemLinksRefresh,tandemQuickTick,tandemTick});
window.renderShelfAdd=renderShelfAdd;
window.renderShelfEditViz=renderShelfEditViz;
window.renderStars=renderStars;
window.rereadBook=rereadBook;
window.reRognerBookImage=reRognerBookImage;
window.reRognerField=reRognerField;
window.sagaSuggest=sagaSuggest;
window.saveBook=saveBook;
window.saveProfile=saveProfile;
window.saveQuick=saveQuick;
window.saveSettings=saveSettings;
window.saveShelf=saveShelf;
window.sbLogout=sbLogout;
window.searchCommunitySpines=searchCommunitySpines;
window.searchOnline=searchOnline;
window.segPick=segPick;
window.selectCalDay=selectCalDay;
window.sendFeedback=sendFeedback;
window.sendFriendRequest=sendFriendRequest;
window.setLibFilter=setLibFilter;
window.setLibViewMode=setLibViewMode;
window.setSmut=setSmut;
window.setStarVal=setStarVal;
window.setProg=setProg;
window.setSub=setSub;
window.sfcToggle=sfcToggle;
window.shelfAddBook=shelfAddBook;
window.shelfRemove=shelfRemove;
window.shelfSlotTap=shelfSlotTap;
window.shelfSourceAdd=shelfSourceAdd;
window.shelfSourceRemove=shelfSourceRemove;
window.shelfUnlink=shelfUnlink;
window.spineColor=spineColor;
window.spineRetake=spineRetake;
window.spineShoot=spineShoot;
window.spineUse=spineUse;
window.submitPost=submitPost;
window.switchTab=switchTab;
window.toggleAuthMode=toggleAuthMode;
window.toggleComments=toggleComments;
window.toggleDefiScope=toggleDefiScope;
window.openPileAvatarPicker=openPileAvatarPicker;
window.choosePileAvatar=choosePileAvatar;
window.toggleReaction=toggleReaction;
window.toggleStatutFields=toggleStatutFields;
window.updateParutionMsg=updateParutionMsg;
