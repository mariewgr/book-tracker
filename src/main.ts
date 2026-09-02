/* Ma Bibli — logique de l'application.
   Migré depuis le <script> inline de index.html : le code ci-dessous est inchangé, seul son
   emplacement a changé (voir la fin du fichier pour l'exposition sur window, nécessaire aux
   attributs onclick="..." inline conservés tels quels dans le HTML généré). */


/* ---------- Données ---------- */
const KEY='mabibli_v1';
const LANG_FIX={FR:'Français',fr:'Français',EN:'Anglais',en:'Anglais'};
const I18N={
  en:{
    'Accueil':'Home',
    'Ajouter':'Add',
    'Ajouter au classement':'Add to ranking',
    'Ajouter un livre':'Add a book',
    'Ajouter une saga':'Add a series',
    'Ajouter un·e ami·e':'Add a friend',
    'Annuler':'Cancel',
    'Aucun livre':'No book',
    'Audio':'Audio',
    'Auteur·ice':'Author',
    'Bibli':'Library',
    'Bois des étagères':'Shelf wood',
    'Ce qui s\'est passé…':'What happened…',
    'Chercher':'Search',
    'Choisis un nouveau mot de passe pour ton compte.':'Choose a new password for your account.',
    'Clair':'Light',
    'Clé API Google Gemini (gratuite)':'Google Gemini API key (free)',
    'Code à 6 caractères':'6-character code',
    'Comment ça se termine…':'How it ends…',
    'Commentaires':'Comments',
    'Compte':'Account',
    'Connecte-toi pour retrouver ta bibliothèque, sur tous tes appareils.':'Sign in to find your library, on all your devices.',
    'Connecté(e)':'Signed in',
    'Couv.':'Cover',
    'Couverture (URL auto via ISBN, photothèque ou photo)':'Cover (auto URL via ISBN, photo library or photo)',
    'Créer l\'étagère liée':'Create the linked shelf',
    'Cumul de livres terminés — année en cours vs précédente':'Cumulative finished books — this year vs last year',
    'DNF':'DNF',
    'Date de fin':'Finish date',
    'Date de parution (optionnel — pour un livre pas encore sorti)':'Release date (optional — for a book not yet out)',
    'Données':'Data',
    'Découvrir des livres':'Discover books',
    'Décris le problème ou ta remarque…':'Describe the problem or your remark…',
    'Défi de la pile':'Stack challenge',
    'Délier (figer la liste actuelle)':'Unlink (freeze the current list)',
    'Email':'Email',
    'En cours':'In progress',
    'Enemies to lovers, dieux…':'Enemies to lovers, gods…',
    'Enregistrer':'Save',
    'Enregistrer le mot de passe':'Save the password',
    'Envoyer par mail':'Send by email',
    'Ex : 123':'E.g.: 123',
    'Ex : 52':'E.g.: 52',
    'Ex : 9782266200127':'E.g.: 9782266200127',
    'Ex : ACOTAR':'E.g.: ACOTAR',
    'Ex : Albert Camus':'E.g.: Albert Camus',
    'Ex : Fourth Wing Yarros':'E.g.: Fourth Wing Yarros',
    'Ex : L\'Étranger':'E.g.: The Stranger',
    'Ex : Mes coups de cœur':'E.g.: My favorites',
    'FMC (héroïne)':'FMC (heroine)',
    'Fermer':'Close',
    'Fermer le mode visiteur':'Close visitor mode',
    'Fiction':'Fiction',
    'Fiction vs non-fiction (terminés)':'Fiction vs non-fiction (finished)',
    'Fil d\'actualité':'Activity feed',
    'Foncé':'Dark',
    'Format':'Format',
    'Français':'French',
    'Genre':'Genre',
    'Hors ligne — tes données locales sont affichées':'Offline — your local data is shown',
    'IA — analyse de fiches de lecture':'AI — reading card analysis',
    'ISBN — saisis-le ou scanne le code-barres':'ISBN — type it or scan the barcode',
    'Image de la tranche / dos (pour les étagères)':'Spine/back image (for shelves)',
    'Journal':'Journal',
    'La 4e de couverture…':'The back-cover blurb…',
    'La fin (spoilers)':'The ending (spoilers)',
    'Langue':'Language',
    'Livre (optionnel)':'Book (optional)',
    'Livres terminés par format':'Finished books by format',
    'Livres terminés par langue':'Finished books by language',
    'Lu le':'Read on',
    'MMC (héros)':'MMC (hero)',
    'Ma Bibli — carnet de lecture':'My Library — reading journal',
    'Mes amis':'My friends',
    'Mes ami·e·s':'My friends',
    'Mode d\'affichage :':'Display mode:',
    'Modifier ce livre':'Edit this book',
    'Modifier l\'étagère':'Edit the shelf',
    'Mot de passe (6 caractères min.)':'Password (6 characters min.)',
    'Mot de passe oublié ?':'Forgot password?',
    'Nom':'Name',
    'Nombre d\'étages':'Number of shelves',
    'Non terminées':'Unfinished',
    'Non-fiction':'Non-fiction',
    'Note globale':'Overall rating',
    'Notes détaillées':'Detailed notes',
    'Nouveau':'New',
    'Nouveau mot de passe (6 caractères min.)':'New password (6 characters min.)',
    'Nouveau post':'New post',
    'Numérique':'Digital',
    'Objectif de lecture annuel (livres)':'Annual reading goal (books)',
    'Page actuelle':'Current page',
    'Pages':'Pages',
    'Pages (l\'épaisseur sur les étagères et dans le défi en découle automatiquement)':'Pages (the thickness on shelves and in the challenge follows automatically)',
    'Paliers':'Milestones',
    'Papier':'Print',
    'Pas de compte ? Crée-en un':'No account? Create one',
    'Photo':'Photo',
    'Photographier la tranche':'Photograph the spine',
    'Photos (optionnel)':'Photos (optional)',
    'Pile':'Stack',
    'Plus':'More',
    'Prendre la photo':'Take the photo',
    'Profil':'Profile',
    'Progression':'Progress',
    'Publier':'Publish',
    'Qu\'en as-tu pensé ?':'What did you think?',
    'Quoi de neuf ?':'What\'s new?',
    'Recherche en ligne — titre, auteur…':'Online search — title, author…',
    'Rechercher':'Search',
    'Recommander ?':'Recommend?',
    'Remplir depuis une photo de fiche de lecture':'Fill in from a reading-card photo',
    'Rogner la photo':'Crop the photo',
    'Roman, SF, Polar…':'Novel, sci-fi, thriller…',
    'Réglages':'Settings',
    'Résumé (pour toi)':'Summary (for you)',
    'Résumé du livre (éditeur — rempli automatiquement)':'Book summary (publisher — filled in automatically)',
    'Saga (optionnel)':'Series (optional)',
    'Sagas':'Series',
    'Sagas liées (dans l\'ordre)':'Linked series (in order)',
    'Sauvegarde':'Backup',
    'Scanner':'Scan',
    'Scanner le code-barres':'Scan the barcode',
    'Se connecter':'Sign in',
    'Se déconnecter':'Sign out',
    'Continuer avec Google':'Continue with Google',
    'ou':'or',
    'Smut':'Smut',
    'Statistiques':'Statistics',
    'Statut':'Status',
    'Supprimer ce livre':'Delete this book',
    'Supprimer l\'étagère':'Delete the shelf',
    'Ta taille (cm) — pour le défi de la pile':'Your height (cm) — for the stack challenge',
    'Terminé':'Finished',
    'Terminées (100 %)':'Finished (100%)',
    'Texte':'Text',
    'Thème':'Theme',
    'Tiens le livre vertical, tranche face à toi':'Hold the book upright, spine facing you',
    'Titre *':'Title *',
    'Titre ou auteur':'Title or author',
    'Tome':'Volume',
    'Ton code ami':'Your friend code',
    'Ton message':'Your message',
    'Ton nom ou pseudo':'Your name or nickname',
    'Top — mon classement':'Top — my ranking',
    'Toutes les sagas':'All series',
    'Tranche':'Spine',
    'Trier : % lu (croissant)':'Sort: % read (ascending)',
    'Trier : % lu (décroissant)':'Sort: % read (descending)',
    'Trier : Nom (A→Z)':'Sort: Name (A→Z)',
    'Tropes':'Tropes',
    'Trouver une tranche':'Find a spine',
    'Type':'Type',
    'Vise le code-barres au dos du livre…':'Aim at the barcode on the back of the book…',
    'Visible publiquement':'Publicly visible',
    'À lire':'To read',
    'Étagère liée':'Linked shelf',
    'Étagères':'Shelves',
    'Reprendre':'Retake',
    'Rogner et utiliser':'Crop and use',
    'Utiliser':'Use',
    'Importer une sauvegarde':'Import a backup',
    'Exporter mes données (JSON)':'Export my data (JSON)',
    '＋ Étagère liée à une saga / parutions à venir':'＋ Shelf linked to a series / upcoming releases',
    'Chercher sur Google Images':'Search on Google Images',
    'Recherche en ligne':'Online search',
    'Sombre':'Dark',
    'Générer mon récap de l\'année':'Generate my year recap',
    'J\'ai terminé ce livre !':'I finished this book!',
    'Voir comme un·e visiteur·se':'View as a visitor',
    'Oui':'Yes',
    'Non':'No',
    '👥 Communauté Ma Bibli':'👥 My Library community',
    'Remarque / signaler un bug':'Feedback / report a bug',
    'Copier mon code':'Copy my code',
    'Récupérer les résumés manquants':'Fetch missing summaries',
    'Hors ligne':'Offline',
    '📷 Ajouter une photo':'📷 Add a photo',
    '📷 Choisir une photo':'📷 Choose a photo',
    'Synchroniser mes livres terminés':'Sync my finished books',
    '🔍 Chercher dans ta bibli…':'🔍 Search your library…',
    '🔍 Chercher une saga…':'🔍 Search a series…',
    '🔍 Livre, auteur ou saga…':'🔍 Book, author or series…',
    '🔍 Rechercher un titre, un auteur, une saga…':'🔍 Search a title, author, series…',
    '🔍 Trouver une tranche':'🔍 Find a spine',
    'Chat':'Cat',
    'Beagle':'Beagle',
    'Panda assis':'Sitting panda',
    'Ta taille !':'Your height!',
    'Autruche':'Ostrich',
    'Girafe':'Giraffe',
    'Modifier':'Edit',
    'Supprimer':'Delete',
    'Confirmer':'Confirm',
    'OK':'OK',
    'Envoyer':'Send',
    'Créer mon compte':'Create my account',
  },
  de:{
    'Accueil':'Start',
    'Ajouter':'Hinzufügen',
    'Ajouter au classement':'Zur Rangliste hinzufügen',
    'Ajouter un livre':'Buch hinzufügen',
    'Ajouter une saga':'Reihe hinzufügen',
    'Ajouter un·e ami·e':'Freund·in hinzufügen',
    'Annuler':'Abbrechen',
    'Aucun livre':'Kein Buch',
    'Audio':'Hörbuch',
    'Auteur·ice':'Autor·in',
    'Bibli':'Bibliothek',
    'Bois des étagères':'Regalholz',
    'Ce qui s\'est passé…':'Was ist passiert…',
    'Chercher':'Suchen',
    'Choisis un nouveau mot de passe pour ton compte.':'Wähle ein neues Passwort für dein Konto.',
    'Clair':'Hell',
    'Clé API Google Gemini (gratuite)':'Google-Gemini-API-Schlüssel (kostenlos)',
    'Code à 6 caractères':'6-stelliger Code',
    'Comment ça se termine…':'Wie es endet…',
    'Commentaires':'Kommentare',
    'Compte':'Konto',
    'Connecte-toi pour retrouver ta bibliothèque, sur tous tes appareils.':'Melde dich an, um deine Bibliothek auf allen Geräten wiederzufinden.',
    'Connecté(e)':'Angemeldet',
    'Couv.':'Cover',
    'Couverture (URL auto via ISBN, photothèque ou photo)':'Cover (automatische URL via ISBN, Fotomediathek oder Foto)',
    'Créer l\'étagère liée':'Verknüpftes Regal erstellen',
    'Cumul de livres terminés — année en cours vs précédente':'Kumulierte beendete Bücher — dieses Jahr vs. letztes Jahr',
    'DNF':'Abgebrochen',
    'Date de fin':'Enddatum',
    'Date de parution (optionnel — pour un livre pas encore sorti)':'Erscheinungsdatum (optional — für ein noch nicht erschienenes Buch)',
    'Données':'Daten',
    'Découvrir des livres':'Bücher entdecken',
    'Décris le problème ou ta remarque…':'Beschreibe das Problem oder deine Anmerkung…',
    'Défi de la pile':'Stapel-Challenge',
    'Délier (figer la liste actuelle)':'Entkoppeln (aktuelle Liste einfrieren)',
    'Email':'E-Mail',
    'En cours':'Laufend',
    'Enemies to lovers, dieux…':'Enemies to lovers, Götter…',
    'Enregistrer':'Speichern',
    'Enregistrer le mot de passe':'Passwort speichern',
    'Envoyer par mail':'Per E-Mail senden',
    'Ex : 123':'Z. B.: 123',
    'Ex : 52':'Z. B.: 52',
    'Ex : 9782266200127':'Z. B.: 9782266200127',
    'Ex : ACOTAR':'Z. B.: ACOTAR',
    'Ex : Albert Camus':'Z. B.: Albert Camus',
    'Ex : Fourth Wing Yarros':'Z. B.: Fourth Wing Yarros',
    'Ex : L\'Étranger':'Z. B.: Der Fremde',
    'Ex : Mes coups de cœur':'Z. B.: Meine Favoriten',
    'FMC (héroïne)':'FMC (Heldin)',
    'Fermer':'Schließen',
    'Fermer le mode visiteur':'Besuchermodus schließen',
    'Fiction':'Belletristik',
    'Fiction vs non-fiction (terminés)':'Belletristik vs. Sachbuch (beendet)',
    'Fil d\'actualité':'Aktivitäts-Feed',
    'Foncé':'Dunkel',
    'Format':'Format',
    'Français':'Französisch',
    'Genre':'Genre',
    'Hors ligne — tes données locales sont affichées':'Offline — deine lokalen Daten werden angezeigt',
    'IA — analyse de fiches de lecture':'KI — Analyse von Lesekarten',
    'ISBN — saisis-le ou scanne le code-barres':'ISBN — eingeben oder Barcode scannen',
    'Image de la tranche / dos (pour les étagères)':'Buchrücken-Bild (für Regale)',
    'Journal':'Journal',
    'La 4e de couverture…':'Der Klappentext…',
    'La fin (spoilers)':'Das Ende (Spoiler)',
    'Langue':'Sprache',
    'Livre (optionnel)':'Buch (optional)',
    'Livres terminés par format':'Beendete Bücher nach Format',
    'Livres terminés par langue':'Beendete Bücher nach Sprache',
    'Lu le':'Gelesen am',
    'MMC (héros)':'MMC (Held)',
    'Ma Bibli — carnet de lecture':'Meine Bibliothek — Lesetagebuch',
    'Mes amis':'Meine Freunde',
    'Mes ami·e·s':'Meine Freund·innen',
    'Mode d\'affichage :':'Anzeigemodus:',
    'Modifier ce livre':'Dieses Buch bearbeiten',
    'Modifier l\'étagère':'Regal bearbeiten',
    'Mot de passe (6 caractères min.)':'Passwort (mind. 6 Zeichen)',
    'Mot de passe oublié ?':'Passwort vergessen?',
    'Nom':'Name',
    'Nombre d\'étages':'Anzahl Etagen',
    'Non terminées':'Nicht abgeschlossen',
    'Non-fiction':'Sachbuch',
    'Note globale':'Gesamtbewertung',
    'Notes détaillées':'Detaillierte Notizen',
    'Nouveau':'Neu',
    'Nouveau mot de passe (6 caractères min.)':'Neues Passwort (mind. 6 Zeichen)',
    'Nouveau post':'Neuer Beitrag',
    'Numérique':'Digital',
    'Objectif de lecture annuel (livres)':'Jährliches Leseziel (Bücher)',
    'Page actuelle':'Aktuelle Seite',
    'Pages':'Seiten',
    'Pages (l\'épaisseur sur les étagères et dans le défi en découle automatiquement)':'Seiten (die Dicke in Regalen und in der Challenge ergibt sich automatisch)',
    'Paliers':'Meilensteine',
    'Papier':'Print',
    'Pas de compte ? Crée-en un':'Kein Konto? Erstelle eins',
    'Photo':'Foto',
    'Photographier la tranche':'Buchrücken fotografieren',
    'Photos (optionnel)':'Fotos (optional)',
    'Pile':'Stapel',
    'Plus':'Mehr',
    'Prendre la photo':'Foto aufnehmen',
    'Profil':'Profil',
    'Progression':'Fortschritt',
    'Publier':'Veröffentlichen',
    'Qu\'en as-tu pensé ?':'Was hast du davon gehalten?',
    'Quoi de neuf ?':'Was gibt es Neues?',
    'Recherche en ligne — titre, auteur…':'Online-Suche — Titel, Autor…',
    'Rechercher':'Suchen',
    'Recommander ?':'Empfehlen?',
    'Remplir depuis une photo de fiche de lecture':'Aus einem Foto einer Lesekarte ausfüllen',
    'Rogner la photo':'Foto zuschneiden',
    'Roman, SF, Polar…':'Roman, Sci-Fi, Krimi…',
    'Réglages':'Einstellungen',
    'Résumé (pour toi)':'Zusammenfassung (für dich)',
    'Résumé du livre (éditeur — rempli automatiquement)':'Buchzusammenfassung (Verlag — automatisch ausgefüllt)',
    'Saga (optionnel)':'Reihe (optional)',
    'Sagas':'Reihen',
    'Sagas liées (dans l\'ordre)':'Verknüpfte Reihen (in Reihenfolge)',
    'Sauvegarde':'Sicherung',
    'Scanner':'Scannen',
    'Scanner le code-barres':'Barcode scannen',
    'Se connecter':'Anmelden',
    'Se déconnecter':'Abmelden',
    'Continuer avec Google':'Mit Google fortfahren',
    'ou':'oder',
    'Smut':'Smut',
    'Statistiques':'Statistiken',
    'Statut':'Status',
    'Supprimer ce livre':'Dieses Buch löschen',
    'Supprimer l\'étagère':'Regal löschen',
    'Ta taille (cm) — pour le défi de la pile':'Deine Größe (cm) — für die Stapel-Challenge',
    'Terminé':'Beendet',
    'Terminées (100 %)':'Beendet (100 %)',
    'Texte':'Text',
    'Thème':'Design',
    'Tiens le livre vertical, tranche face à toi':'Halte das Buch aufrecht, Buchrücken zu dir gerichtet',
    'Titre *':'Titel *',
    'Titre ou auteur':'Titel oder Autor',
    'Tome':'Band',
    'Ton code ami':'Dein Freundescode',
    'Ton message':'Deine Nachricht',
    'Ton nom ou pseudo':'Dein Name oder Spitzname',
    'Top — mon classement':'Top — meine Rangliste',
    'Toutes les sagas':'Alle Reihen',
    'Tranche':'Buchrücken',
    'Trier : % lu (croissant)':'Sortieren: % gelesen (aufsteigend)',
    'Trier : % lu (décroissant)':'Sortieren: % gelesen (absteigend)',
    'Trier : Nom (A→Z)':'Sortieren: Name (A→Z)',
    'Tropes':'Tropen',
    'Trouver une tranche':'Buchrücken finden',
    'Type':'Typ',
    'Vise le code-barres au dos du livre…':'Ziele auf den Barcode auf der Buchrückseite…',
    'Visible publiquement':'Öffentlich sichtbar',
    'À lire':'Zu lesen',
    'Étagère liée':'Verknüpftes Regal',
    'Étagères':'Regale',
    'Reprendre':'Wiederholen',
    'Rogner et utiliser':'Zuschneiden und verwenden',
    'Utiliser':'Verwenden',
    'Importer une sauvegarde':'Sicherung importieren',
    'Exporter mes données (JSON)':'Meine Daten exportieren (JSON)',
    '＋ Étagère liée à une saga / parutions à venir':'＋ Regal verknüpft mit Reihe / kommenden Veröffentlichungen',
    'Chercher sur Google Images':'Auf Google Bilder suchen',
    'Recherche en ligne':'Online-Suche',
    'Sombre':'Dunkel',
    'Générer mon récap de l\'année':'Meinen Jahresrückblick erstellen',
    'J\'ai terminé ce livre !':'Ich habe dieses Buch beendet!',
    'Voir comme un·e visiteur·se':'Als Besucher·in ansehen',
    'Oui':'Ja',
    'Non':'Nein',
    '👥 Communauté Ma Bibli':'👥 Meine-Bibliothek-Community',
    'Remarque / signaler un bug':'Feedback / Fehler melden',
    'Copier mon code':'Meinen Code kopieren',
    'Récupérer les résumés manquants':'Fehlende Zusammenfassungen abrufen',
    'Hors ligne':'Offline',
    '📷 Ajouter une photo':'📷 Foto hinzufügen',
    '📷 Choisir une photo':'📷 Foto auswählen',
    'Synchroniser mes livres terminés':'Meine beendeten Bücher synchronisieren',
    '🔍 Chercher dans ta bibli…':'🔍 In deiner Bibliothek suchen…',
    '🔍 Chercher une saga…':'🔍 Eine Reihe suchen…',
    '🔍 Livre, auteur ou saga…':'🔍 Buch, Autor oder Reihe…',
    '🔍 Rechercher un titre, un auteur, une saga…':'🔍 Titel, Autor, Reihe suchen…',
    '🔍 Trouver une tranche':'🔍 Buchrücken finden',
    'Chat':'Katze',
    'Beagle':'Beagle',
    'Panda assis':'Sitzender Panda',
    'Ta taille !':'Deine Größe!',
    'Autruche':'Strauß',
    'Girafe':'Giraffe',
    'Modifier':'Bearbeiten',
    'Supprimer':'Löschen',
    'Confirmer':'Bestätigen',
    'OK':'OK',
    'Envoyer':'Senden',
    'Créer mon compte':'Mein Konto erstellen',
  },
};
/* ---------- Internationalisation (FR source, EN/DE traduits) ----------
   FR reste la langue "source" : tous les gabarits du code écrivent en français, et cette
   couche traduit après coup le texte affiché — pas besoin de dupliquer chaque gabarit.
   t(s) traduit une chaîne isolée (utile dans un template littéral). translatePage() parcourt
   les nœuds de texte + attributs placeholder/title d'une racine et remplace ceux qui
   correspondent exactement (une fois recadrés) à une clé du dictionnaire. Un MutationObserver
   (tout en bas du fichier) rappelle translatePage() après chaque rendu/ouverture de modale,
   donc aucune fonction render()/open*() n'a besoin d'être modifiée individuellement. */
function curLang(){return (db&&db.settings&&db.settings.lang)||'fr';}
function t(s){const l=curLang(),d=I18N[l];return (d&&d[s])||s;}
/* Tant que la langue n'a jamais quitté le français dans cette session, il n'y a rien à
   traduire NI à restaurer : on peut sauter tout le parcours du DOM (appelé à chaque mutation
   par l'observateur plus bas — sans ce raccourci, chaque rendu de l'appli, même en français,
   revisiterait inutilement tout l'arbre). Dès que l'anglais/allemand a été utilisé une fois,
   on ne le saute plus, pour pouvoir restaurer le français d'origine si on y revient. */
let i18nEverUsed=false;
function translatePage(root){
  const l=curLang();
  if(l!=='fr')i18nEverUsed=true;
  if(l==='fr'&&!i18nEverUsed)return;
  root=root||document.body;
  if(!root||!root.querySelectorAll)return;
  /* Le HTML statique (modales déjà présentes au chargement) n'est jamais régénéré — une fois
     son texte remplacé par une traduction, le français d'origine serait perdu. Chaque nœud
     retient donc son texte français d'origine (1re rencontre) pour pouvoir toujours re-traduire
     à partir de la source, quel que soit l'enchaînement de langues (ex. EN → DE directement). */
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
  const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
  nodes.forEach(node=>{
    const p=node.parentNode;
    if(!p||p.tagName==='SCRIPT'||p.tagName==='STYLE')return;
    let orig=node.__i18nOrig;
    if(orig===undefined){orig=node.textContent;node.__i18nOrig=orig;}
    const trimmed=orig.trim();
    if(!trimmed)return;
    const dict=I18N[l];
    const target=(dict&&dict[trimmed])?orig.replace(trimmed,dict[trimmed]):orig;
    /* Garde anti-boucle : une réécriture avec une valeur identique (ex. « Email »→« Email »,
       ou un retour au français) déclenche quand même une mutation — sans ce test, le
       MutationObserver ci-dessous se re-déclencherait à l'infini. */
    if(node.textContent!==target)node.textContent=target;
  });
  root.querySelectorAll('[placeholder],[title]').forEach(el=>{
    ['placeholder','title'].forEach(attr=>{
      const cacheKey='__i18nOrig_'+attr;
      let orig=el[cacheKey];
      if(orig===undefined){orig=el.getAttribute(attr)||'';el[cacheKey]=orig;}
      if(!orig)return;
      const dict=I18N[l];
      const target=(dict&&dict[orig])?dict[orig]:orig;
      if(el.getAttribute(attr)!==target)el.setAttribute(attr,target);
    });
  });
}
function setLang(l){
  db.settings.lang=l;
  save();
  translatePage(document.getElementById('appRoot'));
  translatePage(document.getElementById('authScreen'));
}
function normalizeDb(d){
  d.books=d.books||[];d.loans=d.loans||[];d.sessions=d.sessions||[];
  d.shelves=d.shelves||[];d.ranking=d.ranking||[];
  d.settings=d.settings||{taille:165};d.meta=d.meta||{updatedAt:0};
  d.settings.lang=d.settings.lang||'fr';
  d.discover=d.discover||{rejected:[]};d.discover.rejected=d.discover.rejected||[];
  d.profile=d.profile||{nom:'',photo:'',publicReading:false,publicStats:false,publicShelves:false,publicPal:false,publicDone:false,publicCoups:false,publicBadges:false,friendCode:''};
  d.profile.sectionOrder=(d.profile.sectionOrder&&d.profile.sectionOrder.length)?d.profile.sectionOrder:['reading','stats','pal','shelves','done','coups','badges'];
  /* Ajoute les sections PAL/Livres terminés/Coups de cœur (nouvelles) aux profils déjà réglés
     avant leur existence, sans perturber l'ordre déjà choisi pour les sections existantes. */
  ['pal','done','coups'].forEach(k=>{if(!d.profile.sectionOrder.includes(k))d.profile.sectionOrder.push(k);});
  /* Uniformise les codes langue abrégés (FR/EN) en toutes lettres, quelle que soit la source */
  d.books.forEach(b=>{if(LANG_FIX[b.langue])b.langue=LANG_FIX[b.langue];});
  return d;
}
let db=normalizeDb({});
/* Stockage local : IndexedDB (~centaines de Mo), migration auto depuis localStorage */
function idbOpen(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open('mabibli',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
}
async function idbGet(k){
  const d=await idbOpen();
  return new Promise((res,rej)=>{
    const t=d.transaction('kv').objectStore('kv').get(k);
    t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);
  });
}
async function idbSet(k,v){
  const d=await idbOpen();
  return new Promise((res,rej)=>{
    const t=d.transaction('kv','readwrite');
    t.objectStore('kv').put(v,k);
    t.oncomplete=res;t.onerror=()=>rej(t.error);
  });
}
function saveLocal(){
  idbSet('db',db).catch(()=>toast('⚠️ Impossible d\'enregistrer localement'));
}
function save(){
  db.meta={updatedAt:Date.now()};
  saveLocal();
  scheduleSync();
}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();

/* ---------- Sync cloud : BDD Supabase (Postgres), temps réel ---------- */
const SBKEY='mabibli_sb';
/* Valeurs par défaut du projet Supabase (clé publique — protégée par RLS) */
let sbCfg={url:'https://nfyxidwrpzeiasxdwnhn.supabase.co',key:'sb_publishable_z5wPhdz64pl4KGXHTj0T7w_rd7TwSf5'};
try{sbCfg={...sbCfg,...JSON.parse(localStorage.getItem(SBKEY)||'{}')};}catch(e){}
if(!sbCfg.url)sbCfg.url='https://nfyxidwrpzeiasxdwnhn.supabase.co';
if(!sbCfg.key)sbCfg.key='sb_publishable_z5wPhdz64pl4KGXHTj0T7w_rd7TwSf5';
let sb=null,sbUser=null,sbChannel=null,sbSocialChannel=null;
function setSyncStatus(t){const e=document.getElementById('syncStatus');if(e)e.textContent=t;}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
/* Empêche un appel réseau bloqué (hors ligne) de figer l'app indéfiniment */
function withTimeout(promise,ms){
  return Promise.race([
    promise,
    new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))
  ]);
}
async function sbClient(){
  if(sb)return sb;
  if(!sbCfg.url||!sbCfg.key)return null;
  if(!window.supabase)await withTimeout(loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'),8000);
  sb=window.supabase.createClient(sbCfg.url,sbCfg.key);
  return sb;
}
/* ---------- Hors ligne : bascule automatique sur les données locales ---------- */
function setOfflineBadge(on){
  const b=document.getElementById('offlineBadge');if(b)b.classList.toggle('hidden',!on);
}
async function offlineFallback(){
  await loadLocalData();
  setOfflineBadge(true);
  if(db.books&&db.books.length){
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appRoot').classList.remove('hidden');
    bootTab();
  }else{
    document.getElementById('authSub').textContent="Impossible de joindre le serveur (hors ligne ?). Reconnecte-toi au réseau pour te connecter la première fois sur cet appareil.";
  }
}
window.addEventListener('offline',()=>{
  setOfflineBadge(true);
  if(sbUser)toast('Hors ligne — tes modifications seront synchronisées au retour du réseau');
});
window.addEventListener('online',async()=>{
  toast('🔌 Connexion rétablie…');
  if(sbUser){
    setOfflineBadge(false);
    doPush();
    pullCloud(true).catch(()=>{});
  }else{
    /* on était en mode hors ligne dès le départ : retente la connexion complète */
    initAuth();
  }
});
/* ---------- Écran de connexion (page dédiée, plein écran) ---------- */
let authMode='signin';
function renderAuthMode(){
  document.getElementById('authSubmitBtn').textContent=authMode==='signin'?'Se connecter':'Créer le compte';
  document.getElementById('authToggleBtn').textContent=authMode==='signin'?'Pas de compte ? Crée-en un':'Déjà un compte ? Se connecter';
  document.getElementById('authForgotBtn').classList.toggle('hidden',authMode!=='signin');
}
function toggleAuthMode(){
  authMode=authMode==='signin'?'signup':'signin';
  document.getElementById('authError').textContent='';
  renderAuthMode();
}
function translateAuthError(msg){
  if(/invalid login credentials/i.test(msg))return 'Email ou mot de passe incorrect.';
  if(/already registered/i.test(msg))return 'Un compte existe déjà avec cet email.';
  if(/password should be at least/i.test(msg))return 'Mot de passe trop court (6 caractères minimum).';
  if(/email not confirmed/i.test(msg))return 'Confirme ton email avant de te connecter (vérifie ta boîte mail).';
  if(/auth session missing/i.test(msg))return "Le lien a expiré ou a déjà été utilisé. Redemande un email via « Mot de passe oublié ? », puis ouvre le lien reçu sur cet appareil, dans le même navigateur.";
  return msg;
}
async function handleAuthSubmit(){
  const email=(document.getElementById('authEmail').value||'').trim();
  const password=document.getElementById('authPassword').value;
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!email||!password){errEl.textContent='Renseigne un email et un mot de passe.';return;}
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — la première connexion nécessite du réseau.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('authSubmitBtn');
  btn.disabled=true;
  try{
    if(authMode==='signup'){
      const {error}=await c.auth.signUp({email,password});
      if(error)throw error;
      errEl.className='isbnmsg ok';
      errEl.textContent='Compte créé ! Si une confirmation par email est demandée, clique sur le lien reçu puis connecte-toi.';
      authMode='signin';renderAuthMode();
    }else{
      const {error}=await c.auth.signInWithPassword({email,password});
      if(error)throw error;
    }
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
async function signInWithOAuth(provider){
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — la première connexion nécessite du réseau.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  /* Redirection vers Google/Apple puis retour sur cette même page — onAuthStateChange (déjà
     en place dans initAuth) détecte la session dans l'URL au retour, comme pour le lien de
     récupération de mot de passe : aucun code de callback séparé n'est nécessaire. */
  const {error}=await c.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+location.pathname}});
  if(error){errEl.className='isbnmsg err';errEl.textContent=translateAuthError(error.message||String(error));}
}
async function handleForgotPassword(){
  const email=(document.getElementById('authEmail').value||'').trim();
  const errEl=document.getElementById('authError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!email){errEl.textContent='Renseigne ton email ci-dessus, puis clique à nouveau sur « Mot de passe oublié ? ».';return;}
  if(!navigator.onLine){errEl.textContent='Pas de connexion réseau — réessaie une fois en ligne.';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('authForgotBtn');
  btn.disabled=true;
  try{
    const {error}=await c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    if(error)throw error;
    errEl.className='isbnmsg ok';
    errEl.textContent='Email envoyé (si ce compte existe) : clique sur le lien reçu pour choisir un nouveau mot de passe. Vérifie aussi tes spams.';
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
function showResetScreen(){
  document.getElementById('authCard').classList.add('hidden');
  document.getElementById('resetCard').classList.remove('hidden');
}
async function handleResetPassword(){
  const pwd=document.getElementById('resetPassword').value;
  const errEl=document.getElementById('resetError');
  errEl.className='isbnmsg err';errEl.textContent='';
  if(!pwd||pwd.length<6){errEl.textContent='Mot de passe trop court (6 caractères minimum).';return;}
  let c;
  try{c=await withTimeout(sbClient(),8000);}catch(e){c=null;}
  if(!c){errEl.textContent="Impossible de joindre Supabase (réseau ou configuration).";return;}
  const btn=document.getElementById('resetSubmitBtn');
  btn.disabled=true;
  try{
    const {data:sessData}=await c.auth.getSession();
    if(!sessData.session){
      errEl.textContent="Le lien a expiré ou a déjà été utilisé. Redemande un email via « Mot de passe oublié ? », puis ouvre le lien reçu sur cet appareil, dans le même navigateur.";
      return;
    }
    const {error}=await c.auth.updateUser({password:pwd});
    if(error)throw error;
    toast('Mot de passe mis à jour ✅');
    document.getElementById('resetCard').classList.add('hidden');
    document.getElementById('authCard').classList.remove('hidden');
    const {data}=await c.auth.getSession();
    handleSession(data.session);
  }catch(e){
    errEl.className='isbnmsg err';
    errEl.textContent=translateAuthError(e.message||String(e));
  }finally{
    btn.disabled=false;
  }
}
async function handleSession(session){
  if(session&&session.user){
    sbUser=session.user;
    setOfflineBadge(false);
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appRoot').classList.remove('hidden');
    document.getElementById('authError').textContent='';
    await loadLocalData();
    bootTab();
    startCloud();
  }else{
    sbUser=null;
    document.getElementById('appRoot').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
  }
}
async function initAuth(){
  renderAuthMode();
  if(!navigator.onLine){await offlineFallback();return;}
  let c;
  try{
    c=await withTimeout(sbClient(),8000);
  }catch(e){await offlineFallback();return;}
  if(!c){
    document.getElementById('authSub').textContent="Configuration Supabase manquante — vérifie sbCfg dans le code (index.html).";
    document.getElementById('authSubmitBtn').disabled=true;
    return;
  }
  /* Seule source de vérité pour l'état de connexion : onAuthStateChange (dont l'évènement
     INITIAL_SESSION, émis une fois au démarrage). Un second appel manuel à getSession() ici
     entrerait en compétition avec PASSWORD_RECOVERY et pouvait écraser l'écran de nouveau
     mot de passe avant que l'utilisateur ait fini de le remplir. */
  /* Si l'URL contient un lien de récupération, on ignore les évènements de session "normaux"
     (ex : INITIAL_SESSION avec une session déjà ouverte sur cet appareil) le temps que
     PASSWORD_RECOVERY arrive — sinon un compte déjà connecté ouvrait directement l'app au lieu
     de proposer le nouveau mot de passe. Filet de sécurité : si ça ne arrive jamais (lien expiré/
     déjà utilisé), on abandonne après quelques secondes pour ne pas bloquer la connexion normale. */
  let recoveryPending=/type=recovery/.test(location.hash)||/type=recovery/.test(location.search);
  /* Une fois le lien traité (avec succès ou non), on nettoie l'URL : sinon le marqueur
     "type=recovery" reste dans la barre d'adresse et refait déclencher ce blocage à CHAQUE
     rechargement suivant (tirer-pour-rafraîchir compris) — avec un lien à usage unique déjà
     consommé, ce qui pouvait empêcher la vraie session de se réafficher. */
  function clearRecoveryMarker(){
    if(!recoveryPending)return;
    recoveryPending=false;
    try{history.replaceState(null,'',location.pathname);}catch(e){}
  }
  if(recoveryPending)setTimeout(()=>{
    if(!recoveryPending)return;
    clearRecoveryMarker();
    c.auth.getSession().then(({data})=>handleSession(data.session));
  },5000);
  c.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY'){clearRecoveryMarker();showResetScreen();return;}
    if(recoveryPending)return;
    handleSession(session);
  });
  try{
    await withTimeout(c.auth.getSession(),8000);
  }catch(e){
    await offlineFallback();
  }
}
async function pullCloud(notify){
  const c=await sbClient();if(!c||!sbUser)return 'none';
  const {data:row,error}=await c.from('bibli').select('data').eq('user_id',sbUser.id).maybeSingle();
  if(error)throw error;
  const remote=row&&row.data;
  const rT=(remote&&remote.meta&&remote.meta.updatedAt)||0;
  const lT=(db.meta&&db.meta.updatedAt)||0;
  if(remote&&remote.books&&rT>lT){
    /* Garde-fou symétrique à sbPush() : le cloud est "plus récent" mais vide alors qu'on a des
       livres en local — plutôt qu'adopter (et donc effacer localement), on traite ça comme
       localNewer, ce qui redéclenche un push et répare le cloud depuis cet appareil. */
    if(!remote.books.length&&db.books.length)return 'localNewer';
    const needsLangFix=remote.books.some(b=>LANG_FIX[b.langue]);
    db=normalizeDb(remote);
    if(needsLangFix)save();else saveLocal();
    render();
    if(notify)toast('Données mises à jour depuis le cloud ✅ ('+db.books.length+' livres)');
    return 'adopted';
  }
  return !remote?'none':(lT>rT?'localNewer':'same');
}
async function startCloud(){
  setSyncStatus('⏳ Récupération…');
  try{
    const st=await pullCloud(true);
    if(st==='none'||st==='localNewer')await sbPush();
    const c=await sbClient();
    if(sbChannel)c.removeChannel(sbChannel);
    /* temps réel : une modif sur un autre appareil arrive instantanément */
    sbChannel=c.channel('bibli-sync').on('postgres_changes',
      {event:'*',schema:'public',table:'bibli',filter:'user_id=eq.'+sbUser.id},
      ()=>{pullCloud(true).catch(()=>{});}
    ).subscribe();
    if(sbSocialChannel)c.removeChannel(sbSocialChannel);
    /* temps réel : amis, fil d'actualité, posts, commentaires, réactions — arrivent
       en direct sans avoir à retirer pour rafraîchir. Ne redessine que si l'onglet
       concerné est affiché (inutile de recharger un fil qu'on ne regarde pas). */
    sbSocialChannel=c.channel('bibli-social')
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_friends'},()=>{if(tab==='friends')renderFriends();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_feed'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_posts'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_comments'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .on('postgres_changes',{event:'*',schema:'public',table:'bibli_reactions'},()=>{if(tab==='feed')scheduleRenderFeed();})
      .subscribe();
    setSyncStatus('✅ Connectée ('+(sbUser.email||'')+') — sync temps réel active');
  }catch(e){setSyncStatus('⚠️ Erreur BDD — la table « bibli » est-elle créée ? (voir guide §3)');}
}
let renderFeedTimer=null;
function scheduleRenderFeed(){clearTimeout(renderFeedTimer);renderFeedTimer=setTimeout(()=>{if(tab==='feed')renderFeed();},400);}
async function sbPush(){
  const c=await sbClient();if(!c||!sbUser)return;
  /* Garde-fou : si l'état local est vide (bug, chargement raté, etc.) alors que le cloud
     contient déjà des livres, on refuse d'écraser — mieux vaut une sync ratée qu'une
     bibliothèque effacée pour de bon. */
  if(!db.books.length){
    const {data:row}=await c.from('bibli').select('data').eq('user_id',sbUser.id).maybeSingle();
    if(row&&row.data&&row.data.books&&row.data.books.length)
      throw new Error('Push refusé : la base locale est vide alors que le cloud contient des livres.');
  }
  const {error}=await c.from('bibli').upsert({user_id:sbUser.id,data:db,updated_at:new Date().toISOString()});
  if(error)throw error;
}
let syncTimer=null,syncing=false;
function scheduleSync(){
  if(!sbUser)return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(doPush,1200);
}
let lastProfileSync=0;
async function doPush(){
  if(!sbUser)return;
  if(syncing){scheduleSync();return;}
  syncing=true;
  try{
    await sbPush();
    /* Le profil public (recalcul HTML + upload) ne doit pas partir à CHAQUE sync — sur une
       session d'édition active (plusieurs livres modifiés d'affilée), ça ajoutait une requête
       réseau supplémentaire à chaque coup, perceptible comme lenteur. Limité à une fois toutes
       les 5 min automatiquement ; saveProfile() le force en plus immédiatement. */
    if(db.profile.friendCode&&Date.now()-lastProfileSync>300000){
      lastProfileSync=Date.now();
      syncPublicProfile();
    }
    setSyncStatus('✅ Synchronisé à '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}));
  }catch(e){setSyncStatus('⚠️ Échec de la sync');}
  syncing=false;
}
async function sbLogout(){
  try{
    const c=await sbClient();
    if(c){if(sbChannel)c.removeChannel(sbChannel);if(sbSocialChannel)c.removeChannel(sbSocialChannel);await c.auth.signOut();}
  }catch(e){}
  sbChannel=null;sbSocialChannel=null;
  closeModals();
  /* onAuthStateChange déclenche handleSession(null) : réaffiche l'écran de connexion */
}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Dialogues intégrés (prompt/confirm/alert natifs bloqués en PWA iOS) */
let dlgBtns=[];
function openDlg(title,input,buttons){
  document.getElementById('dlgTitle').textContent=title;
  const inp=document.getElementById('dlgInput');
  if(input!==null){inp.classList.remove('hidden');inp.value=input;setTimeout(()=>inp.focus(),150);}
  else inp.classList.add('hidden');
  dlgBtns=buttons;
  document.getElementById('dlgBtns').innerHTML=buttons.map((b,i)=>
    `<button class="btn ${b.ghost?'ghost':''} ${b.danger?'danger':''}" onclick="dlgAct(${i})">${b.label}</button>`).join('');
  document.getElementById('dlg').classList.add('open');
}
function dlgAct(i){
  const b=dlgBtns[i];
  const v=document.getElementById('dlgInput').value;
  document.getElementById('dlg').classList.remove('open');
  if(b&&b.fn)b.fn(v);
}
function askText(title,def,fn){openDlg(title,def||'',[{label:'OK',fn:v=>fn((v||'').trim())},{label:'Annuler',ghost:true}]);}
function askConfirm(title,fn,label){openDlg(title,null,[{label:label||'Confirmer',danger:true,fn:()=>fn()},{label:'Annuler',ghost:true}]);}
function confetti(){
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
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg;t.className='show';
  clearTimeout(t._h);t._h=setTimeout(()=>t.className='',3000);
}
/* Réordonnancement par glisser-déposer (poignée ⠿, tactile + souris) */
function makeSortable(container,onDone,itemSel){
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
const IC_FILES={
  book:'book.png',shelf:'shelf.png',trophy:'rank.png',
  chart:'stats.png',calendar:'calendar.png',refresh:'refresh.png',gear:'settings.png',
  search:'search.png',pencil:'modify.png',tablet:'numeric.png',headphones:'audio.png',
  tag:'book_types.png','book-open':'paper.png',paper:'paper.png',
  pile:'book_pile.png',human:'human.png',camera:'photo.png',image:'image.png',saga:'saga.png',
  user:'profile-female.png',friends:'friends.png',feed:'feed.png',mail:'mail.png',lock:'lock.png',unlock:'unlock.png',
  recap:'recap.png',retry:'retry.png',sun:'sun.png',moon:'moon.png',rogner:'rogner.png',
  check:'check.png',import:'import.png',export:'export.png',web:'web.png',preview:'preview.png',
  thumbsup:'thumbsup.png',thumbsdown:'thumbsdown.png',comment:'comment.png',copy:'copy.png',
  badge:'badge.png',heart:'heart.png',add:'add.png',send:'send.png',delete:'delete.png',
  target:'target.png',streak:'streak.png',offline:'offline.png',empty:'empty.png',
  finished:'finished.png',summary:'summary.png',cat:'cat.png',dog:'dog.png',panda:'panda.png',
  soon:'soon.png',clock:'clock.png',crystalball:'crystalball.png',
  flamingo:'flamingo.png',giraffe:'giraffe.png',warning:'warning.png',
  loading:'loading.png',sync:'sync.png'
};
const icSvg=n=>IC_FILES[n]
  ?'<img class="icn icimg" src="'+IC_FILES[n]+'" alt="" onerror="this.outerHTML=\'<svg class=&quot;icn&quot;><use href=&quot;#i-'+n+'&quot;/></svg>\'">'
  :'<svg class="icn"><use href="#i-'+n+'"/></svg>';
/* Icônes personnalisées : fichiers PNG individuels à côté d'index.html.
   Chaque icône marquée data-spr est remplacée si son fichier existe,
   sinon l'icône SVG d'origine reste affichée. */
const SPR_FILES={
  book:'book.png',shelf:'shelf.png',trophy:'rank.png',
  pile:'book_pile.png',chart:'stats.png',calendar:'calendar.png',
  refresh:'refresh.png',gear:'settings.png',
  paper:'paper.png',tablet:'numeric.png',headphones:'audio.png',
  human:'human.png',search:'search.png',pencil:'modify.png',camera:'photo.png',image:'image.png',home:'home.png',tag:'book_types.png',saga:'saga.png',
  user:'profile-female.png',friends:'friends.png',feed:'feed.png',mail:'mail.png',lock:'lock.png',unlock:'unlock.png',
  recap:'recap.png',retry:'retry.png',sun:'sun.png',moon:'moon.png',rogner:'rogner.png',
  check:'check.png',import:'import.png',export:'export.png',web:'web.png',preview:'preview.png',
  thumbsup:'thumbsup.png',thumbsdown:'thumbsdown.png',comment:'comment.png',copy:'copy.png',
  badge:'badge.png',heart:'heart.png',add:'add.png',send:'send.png',delete:'delete.png',
  target:'target.png',streak:'streak.png',offline:'offline.png',empty:'empty.png',
  finished:'finished.png',summary:'summary.png',cat:'cat.png',dog:'dog.png',panda:'panda.png',
  soon:'soon.png',clock:'clock.png',crystalball:'crystalball.png',
  loading:'loading.png',sync:'sync.png'
};
function applySpr(root){
  (root||document).querySelectorAll('[data-spr]').forEach(el=>{
    const f=SPR_FILES[el.dataset.spr];if(!f)return;
    const px=+el.dataset.sprSize||22;
    const im=new Image();
    im.onload=()=>{
      im.className='sprimg';
      im.style.height=px+'px';im.style.width='auto';
      el.innerHTML='';el.appendChild(im);
    };
    im.src=f;
  });
}
applySpr();
function imgFallback(el,cls,n){
  const d=document.createElement('div');
  d.className=cls;d.innerHTML=icSvg(n);
  el.replaceWith(d);
}
function coverEl(url,cls,icon){
  const c='cover '+(cls||'');
  if(!url)return `<div class="${c} ph">${icSvg(icon||'book')}</div>`;
  return `<img class="${c}" src="${esc(url)}" loading="lazy" alt=""
    onerror="imgFallback(this,'${c} ph','${icon||'book'}')">`;
}

/* Épaisseur toujours automatique : ~0,006 cm/page + couverture */
function thickness(b){
  if(b.pages>0)return +(b.pages*0.006+0.5).toFixed(1);
  return 2;
}

/* ---------- Navigation ---------- */
let tab='home';
const TAB_KEYS=['home','lib','shelf','saga','rank','defi','stats','cal','disc','feedback','friends','feed'];
const PLUS_TABS=new Set(['saga','rank','defi','stats','disc','feedback','friends','feed']);
function switchTab(t){
  tab=t;
  try{sessionStorage.setItem('mabibli_tab',t);}catch(e){}
  document.querySelectorAll('nav button').forEach(b=>
    b.classList.toggle('active',b.dataset.v===t||(b.dataset.v==='plus'&&PLUS_TABS.has(t))));
  TAB_KEYS.forEach(v=>document.getElementById('view-'+v).classList.toggle('hidden',v!==t));
  const fab=document.getElementById('fab');
  fab.classList.toggle('hidden',t!=='lib'&&t!=='shelf');
  const FAB_IC={lib:'book',shelf:'shelf'};
  if(FAB_IC[t])fab.innerHTML=icSvg(FAB_IC[t])+'<span class="plus">+</span>';
  render();
  window.scrollTo(0,0);
}
/* Restaure l'onglet actif après un rechargement (tirer-pour-rafraîchir, etc.) au lieu de
   toujours retomber sur Accueil — mémorisé en sessionStorage, donc valable pour la session
   en cours mais pas pour une toute nouvelle ouverture de l'app. */
function bootTab(){
  let t;
  try{t=sessionStorage.getItem('mabibli_tab');}catch(e){}
  if(t&&TAB_KEYS.includes(t)&&t!==tab)switchTab(t);else render();
}
function openPlus(){document.getElementById('plusModal').classList.add('open');}

/* ---------- Accueil ---------- */
function editObjectif(){
  const year=new Date().getFullYear();
  askText('Objectif de lecture '+year+' (nombre de livres)',db.settings.objectif||'',v=>{
    db.settings.objectif=Math.max(0,+v||0);
    save();render();
  });
}
function calcStreak(){
  const ds=new Set(db.sessions.map(s=>s.date));
  const iso=x=>x.toISOString().slice(0,10);
  let n=0;const d=new Date();
  if(!ds.has(iso(d)))d.setDate(d.getDate()-1);
  while(ds.has(iso(d))){n++;d.setDate(d.getDate()-1);}
  return n;
}
function renderHome(){
  const el=document.getElementById('homeWrap');if(!el)return;
  const reading=db.books.filter(b=>b.statut==='reading').sort((a,b)=>(b.dateAjout||0)-(a.dateAjout||0));
  const year=String(new Date().getFullYear());
  const doneY=db.books.filter(b=>b.statut==='done'&&b.dateFin&&b.dateFin.startsWith(year)).length;
  const tbr=db.books.filter(b=>b.statut==='tbr').length;
  const streak=calcStreak();
  const obj=db.settings.objectif||0;
  let out=`<div class="statgrid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:6px">
    <div class="stat"><div class="n">${reading.length}</div><div class="l">En cours</div></div>
    <div class="stat"><div class="n">${doneY}</div><div class="l">Terminés en ${year}</div></div>
    <div class="stat"><div class="n">🔥 ${streak}</div><div class="l">Jour${streak>1?'s':''} d'affilée</div></div>
  </div>`;
  if(obj>0){
    const pct=Math.min(100,Math.round(doneY/obj*100));
    out+=`<div class="book" style="cursor:pointer;margin-top:10px" onclick="editObjectif()">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;font-weight:700">
        <span>Objectif ${year}</span><span style="color:var(--accent)">${doneY}/${obj} · ${pct} %</span></div>
      <div class="pbar" style="height:9px"><div style="width:${pct}%"></div></div>
      ${doneY>=obj?'<div style="font-size:.8rem;color:var(--green);margin-top:6px;font-weight:700">🎉 Objectif atteint !</div>':'<div style="font-size:.75rem;color:var(--txt2);margin-top:6px">Appuie pour modifier l\'objectif</div>'}
    </div>`;
  }else{
    out+=`<div class="book" style="cursor:pointer;margin-top:10px" onclick="editObjectif()">
      <div style="font-size:.85rem;color:var(--txt2)">${icSvg('target')} Appuie pour définir un objectif de lecture ${year}</div>
    </div>`;
  }
  out+=`<h2>Mes lectures en cours</h2>`;
  if(!reading.length)
    out+=`<div class="empty">${icSvg('empty')} Aucune lecture en cours<br>Passe un livre « En cours » depuis la Bibli !</div>`;
  reading.forEach(b=>{
    out+=`<div class="book" onclick="openInfo('${b.id}')">
      <div class="top">${coverEl(b.couverture,'')}
        <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div>
        <div class="meta"><span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span></div></div>
      </div>
      <div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      <button class="quickbtn" onclick="event.stopPropagation();openQuick('${b.id}')">${icSvg('book-open')} Mettre à jour mon avancement</button>
    </div>`;
  });
  const coups=db.books.filter(b=>b.statut==='done'&&b.note>=5);
  if(coups.length){
    out+=`<h2>${icSvg('heart')} Coups de cœur</h2>
      <div class="hscroll">${coups.map(b=>`<div class="hcard" style="cursor:pointer" onclick="openInfo('${b.id}')">
        ${coverEl(b.couverture,'')}<span class="nm">${esc(b.titre)}</span><span class="sub">${esc(b.auteur)||''}</span>
      </div>`).join('')}</div>`;
  }
  const upcoming=db.books.filter(b=>isUpcoming(b)).sort((a,b)=>a.dateParution<b.dateParution?-1:1);
  if(upcoming.length){
    out+=`<h2>📅 Parutions à venir</h2>`;
    upcoming.forEach(b=>{
      out+=`<div class="book" onclick="openInfo('${b.id}')">
        <div class="top">${coverEl(b.couverture,'')}
          <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div></div>
          <span style="color:var(--accent2);font-weight:700;white-space:nowrap">${icSvg('soon')} ${fmtDateFr(b.dateParution)}</span>
        </div>
      </div>`;
    });
  }
  out+=`<h2>Défi de la pile</h2>${defiCardHTML()}`;
  el.innerHTML=out;
}

/* ---------- Bibliothèque ---------- */
let filter='all';
const FILTERS=[['all','Tous'],['reading','En cours'],['tbr','À lire'],['done','Terminés'],['dnf','DNF'],['upcoming','🔜 À paraître']];
const STATUT={tbr:['À lire','b-tbr'],reading:['En cours','b-reading'],done:['Terminé','b-done'],dnf:['DNF','b-dnf']};

function renderChips(){
  document.getElementById('filterChips').innerHTML=FILTERS.map(([v,l])=>{
    const n=v==='all'?db.books.length:(v==='upcoming'?db.books.filter(isUpcoming).length:db.books.filter(b=>b.statut===v).length);
    return `<div class="chip ${filter===v?'active':''}" onclick="setLibFilter('${v}')">${l} (${n})</div>`;
  }).join('');
}
function setLibFilter(v){filter=v;renderLib();}
/* Recherche unifiée : titre, auteur ou saga */
function bookMatch(b,q){
  return (b.titre+' '+(b.auteur||'')+' '+(b.saga||'')).toLowerCase().includes(q);
}

/* Filtres statut/genre/saga réutilisables : peuple des <select> (par id) et teste un livre */
function fillFilterSelects(statusId,genreId,sagaId){
  if(statusId){
    const sel=document.getElementById(statusId);
    if(sel){
      const cur=sel.value;
      sel.innerHTML=FILTERS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
      sel.value=FILTERS.some(f=>f[0]===cur)?cur:'all';
      sel.classList.toggle('on',sel.value!=='all');
    }
  }
  if(genreId){
    const sel=document.getElementById(genreId);
    if(sel){
      const cur=sel.value;
      const genres=[...new Set(db.books.map(b=>b.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
      sel.innerHTML='<option value="">Genre : tous</option>'+
        genres.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');
      if(genres.includes(cur))sel.value=cur;
      sel.classList.toggle('on',!!sel.value);
    }
  }
  if(sagaId){
    const sel=document.getElementById(sagaId);
    if(sel){
      const cur=sel.value;
      const sagas=sagaNames();
      const nbSansSaga=db.books.filter(b=>!b.saga).length;
      sel.innerHTML='<option value="">Saga : toutes</option>'+
        (nbSansSaga?`<option value="__none__">Sans saga (${nbSansSaga})</option>`:'')+
        sagas.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
      if(sagas.includes(cur)||cur==='__none__')sel.value=cur;
      sel.classList.toggle('on',!!sel.value);
    }
  }
}
function filtersActive(statusId,genreId,sagaId){
  if(statusId){const el=document.getElementById(statusId);if(el&&el.value&&el.value!=='all')return true;}
  if(genreId){const el=document.getElementById(genreId);if(el&&el.value)return true;}
  if(sagaId){const el=document.getElementById(sagaId);if(el&&el.value)return true;}
  return false;
}
function pickerMatch(b,statusId,genreId,sagaId){
  if(statusId){const el=document.getElementById(statusId);if(el&&el.value&&el.value!=='all'){
    if(el.value==='upcoming'){if(!isUpcoming(b))return false;}
    else if(b.statut!==el.value)return false;
  }}
  if(genreId){const el=document.getElementById(genreId);if(el&&el.value&&b.genre!==el.value)return false;}
  if(sagaId){const el=document.getElementById(sagaId);if(el&&el.value){
    if(el.value==='__none__'){if(b.saga)return false;}
    else if(b.saga!==el.value)return false;
  }}
  return true;
}

/* ---------- Sagas ---------- */
const sagaNames=()=>[...new Set(db.books.map(b=>b.saga).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
const sagaBooks=n=>db.books.filter(b=>b.saga===n).sort((a,b)=>(a.tome||99)-(b.tome||99));
function sagaMatch(n,q){
  return n.toLowerCase().includes(q)||sagaBooks(n).some(b=>bookMatch(b,q));
}
function renderSagas(){
  const el=document.getElementById('sagaList');if(!el)return;
  fillFilterSelects('sagaListStatus','sagaListGenre',null);
  const active=filtersActive('sagaListStatus','sagaListGenre',null);
  const q=(document.getElementById('sagaSearch').value||'').toLowerCase().trim();
  const completion=document.getElementById('sagaCompletion').value;
  const sort=document.getElementById('sagaSort').value;
  let names=sagaNames();
  if(active)names=names.filter(n=>sagaBooks(n).some(b=>pickerMatch(b,'sagaListStatus','sagaListGenre',null)));
  if(q)names=names.filter(n=>sagaMatch(n,q));
  let sagas=names.map(n=>{
    const bs=sagaBooks(n);
    const lus=bs.filter(b=>b.statut==='done').length;
    const pct=bs.length?Math.round(lus/bs.length*100):0;
    return{n,bs,lus,pct};
  });
  if(completion==='done')sagas=sagas.filter(s=>s.pct===100);
  else if(completion==='progress')sagas=sagas.filter(s=>s.pct<100);
  if(sort==='pctDesc')sagas.sort((a,b)=>b.pct-a.pct||a.n.localeCompare(b.n,'fr'));
  else if(sort==='pctAsc')sagas.sort((a,b)=>a.pct-b.pct||a.n.localeCompare(b.n,'fr'));
  if(!sagas.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('saga')}</span>${sagaNames().length?'Aucune saga ne correspond.':'Aucune saga.<br>Renseigne le champ « Saga » dans la fiche de tes livres !'}</div>`;
    return;
  }
  el.innerHTML=sagas.map(({n,bs,lus,pct})=>{
    const covers=bs.map(b=>
      `<div style="flex:none;cursor:pointer" onclick="openInfo('${b.id}')">${coverEl(b.couverture,'sm')}</div>`).join('');
    return `<div class="book" style="cursor:default">
      <div class="top"><div class="tinfo"><h3>${esc(n)}</h3>
        <div class="auth">${lus}/${bs.length} tome${bs.length>1?'s':''} lu${lus>1?'s':''}</div></div>
        <span class="badge ${lus===bs.length?'b-done':'b-reading'}">${pct} %</span></div>
      <div style="display:flex;gap:5px;margin-top:10px;overflow-x:auto">${covers}</div>
      <div class="pbar"><div style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

function renderGenreFilter(){
  fillFilterSelects(null,'genreFilter','sagaFilter');
}
function setLibViewMode(mode){
  db.settings.libView=mode;
  save();render();
}
/* Livres non encore placés manuellement (nouveaux livres, ou tout premier affichage) : triés
   par saga (tomes dans l'ordre), puis titre — insérés à la suite de la disposition déjà
   personnalisée, qui elle reste inchangée tant qu'on n'y touche pas. */
function libEffItems(){
  const saved=(db.settings.libLayout&&db.settings.libLayout.items)||[];
  const known=new Set(db.books.map(b=>b.id));
  const kept=saved.filter(it=>it.divider||known.has(it.bookId));
  const placed=new Set(kept.filter(it=>!it.divider).map(it=>it.bookId));
  const extra=db.books.filter(b=>!placed.has(b.id))
    .sort((a,b)=>(a.saga||a.titre).localeCompare(b.saga||b.titre)||(a.tome||0)-(b.tome||0)||a.titre.localeCompare(b.titre))
    .map(b=>({bookId:b.id,mode:'spine',row:null}));
  return[...kept,...extra];
}
function renderLibShelf(){
  const el=document.getElementById('libShelfMode');
  if(!db.books.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('book')}</span>Ta bibliothèque est vide.<br>Appuie sur <b>+</b> pour ajouter ton premier livre !</div>`;
    return;
  }
  const rows=(db.settings.libLayout&&db.settings.libLayout.rows)||8;
  const shelf={nom:'',rows,items:libEffItems()};
  el.innerHTML=`<div style="display:flex;justify-content:flex-end;gap:8px;padding:0 10px 8px">
      <button class="smallbtn" onclick="openLibEdit()">${icSvg('pencil')} Modifier</button>
    </div>${shelfVisual(shelf)}`;
}
function renderLib(){
  const mode=db.settings.libView||'list';
  document.getElementById('libListMode').classList.toggle('hidden',mode!=='list');
  document.getElementById('libShelfMode').classList.toggle('hidden',mode!=='shelf');
  [...document.querySelectorAll('#libViewSeg button')].forEach(b=>b.classList.toggle('on',b.dataset.val===mode));
  if(mode==='shelf'){renderLibShelf();return;}
  renderChips();renderGenreFilter();
  const q=document.getElementById('search').value.toLowerCase().trim();
  let list=filter==='upcoming'?db.books.filter(isUpcoming):db.books.filter(b=>filter==='all'||b.statut===filter);
  list=list.filter(b=>pickerMatch(b,null,'genreFilter','sagaFilter'));
  if(q)list=list.filter(b=>bookMatch(b,q));
  list.sort((a,b)=>(b.dateAjout||0)-(a.dateAjout||0));
  const el=document.getElementById('bookList');
  if(!list.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('book')}</span>${db.books.length?'Aucun résultat.':'Ta bibliothèque est vide.<br>Appuie sur <b>+</b> pour ajouter ton premier livre !'}</div>`;
    return;
  }
  el.innerHTML=list.map(b=>{
    const[sl,sc]=STATUT[b.statut];
    return `<div class="book" onclick="openInfo('${b.id}')">
      <div class="top">${coverEl(b.couverture,'')}<div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div></div>
      <span class="badge ${sc}">${sl}</span></div>
      <div class="meta">
        <span>${icSvg(FMT_IC[fmt(b)])} ${FMT[fmt(b)]}</span>
        ${b.genre?`<span>${icSvg('tag')} ${esc(b.genre)}</span>`:''}
        ${b.saga?`<span>${icSvg('saga')} ${esc(b.saga)}${b.tome?' T'+b.tome:''}</span>`:''}
        ${b.pages?`<span>${b.pages} p.</span>`:''}
        ${isUpcoming(b)?`<span style="color:var(--accent2);font-weight:700">${icSvg('soon')} Sortie le ${fmtDateFr(b.dateParution)}</span>`:''}
        ${(b.statut==='done'||b.statut==='dnf')&&b.note?`<span class="stars">${'★'.repeat(b.note)}${'☆'.repeat(5-b.note)}</span>`:''}
        ${b.statut==='reading'?`<span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span>`:''}
        ${b.statut==='dnf'&&b.progression?`<span style="color:var(--red);font-weight:700">arrêté à ${b.progression} %</span>`:''}
      </div>
      ${b.statut==='reading'?`<div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      <button class="quickbtn" onclick="event.stopPropagation();openQuick('${b.id}')">${icSvg('book-open')} Mettre à jour mon avancement</button>`:''}
    </div>`;
  }).join('');
}

/* ---------- Formulaire livre ---------- */
let editId=null,starVal=0;
function segPick(btn){[...btn.parentNode.children].forEach(b=>b.classList.remove('on'));btn.classList.add('on');}
function segVal(id){return document.querySelector('#'+id+' button.on').dataset.val;}
function segSet(id,val){[...document.querySelectorAll('#'+id+' button')].forEach(b=>b.classList.toggle('on',b.dataset.val===val));}
const FMT={papier:'Papier',numerique:'Numérique',audio:'Audio'};
const FMT_IC={papier:'book',numerique:'tablet',audio:'headphones'};
const fmt=b=>b.format||'papier';
function toggleStatutFields(){
  const s=segVal('segStatut'),f=segVal('segFormat');
  document.getElementById('progWrap').classList.toggle('hidden',s!=='reading'&&s!=='dnf');
  document.getElementById('doneWrap').classList.toggle('hidden',s!=='done'&&s!=='dnf');
  /* papier : suivi par page ; numérique & audio : suivi par % */
  document.getElementById('progPages').classList.toggle('hidden',f!=='papier');
  document.getElementById('progPct').classList.toggle('hidden',f==='papier');
}
function renderStars(){
  document.getElementById('starPick').innerHTML=[1,2,3,4,5].map(i=>
    `<span class="${i<=starVal?'on':''}" onclick="setStarVal(${i})">★</span>`).join('');
}
function setStarVal(n){starVal=n;renderStars();}
/* Notes détaillées (fiche de lecture) */
const SUBCATS=[['ecriture','Qualité de l\'écriture'],['histoire','Qualité de l\'histoire'],
  ['personnages','Personnages'],['tension','Tension'],['tristesse','Tristesse'],
  ['romance','Romance'],['drole','Drôle'],['facile','Facile à lire'],['fin','Fin']];
let subVals={},smutVal=0;
function renderSubRatings(){
  document.getElementById('subRatings').innerHTML=SUBCATS.map(([k,l])=>
    `<div class="subrow"><span>${l}</span><span class="substars">${[1,2,3,4,5].map(i=>
      `<span class="${(subVals[k]||0)>=i?'on':''}" onclick="setSub('${k}',${i})">★</span>`).join('')}</span></div>`).join('');
}
function setSub(k,i){subVals[k]=subVals[k]===i?0:i;renderSubRatings();}
function renderSmut(){
  document.getElementById('smutPick').innerHTML=[1,2,3,4,5].map(i=>
    `<span class="pep ${smutVal>=i?'on':''}" onclick="setSmut(${i})">🌶</span>`).join('');
}
function setSmut(i){smutVal=smutVal===i?0:i;renderSmut();}
/* Date de parution : livre pas encore sorti */
function isUpcoming(b){return !!(b.dateParution&&b.dateParution>new Date().toISOString().slice(0,10));}
function fmtDateFr(iso){
  if(!iso)return'';
  const[y,m,d]=iso.split('-');return d+'/'+m+'/'+y;
}
function updateParutionMsg(){
  const el=document.getElementById('parutionMsg');if(!el)return;
  const v=document.getElementById('f_dateParution').value;
  if(!v){el.textContent='';return;}
  const today=new Date().toISOString().slice(0,10);
  el.textContent=v>today?'🔜 Pas encore sorti — sortie prévue le '+fmtDateFr(v):'';
}
function sagaSuggest(){
  const v=document.getElementById('f_saga').value.toLowerCase().trim();
  const names=sagaNames().filter(n=>n.toLowerCase()!==v&&(!v||n.toLowerCase().includes(v))).slice(0,8);
  document.getElementById('sagaSug').innerHTML=names.map(n=>
    `<div class="chip" onclick="pickSaga(this.dataset.n)" data-n="${esc(n)}">${esc(n)}</div>`).join('');
}
function pickSaga(n){
  document.getElementById('f_saga').value=n;
  document.getElementById('sagaSug').innerHTML='';
}
function fillDatalists(){
  const g=[...new Set(db.books.map(b=>b.genre).filter(Boolean))];
  const l=[...new Set(db.books.map(b=>b.langue).filter(Boolean))];
  const s=[...new Set(db.books.map(b=>b.saga).filter(Boolean))];
  document.getElementById('genreList').innerHTML=g.map(x=>`<option value="${esc(x)}">`).join('');
  document.getElementById('langList').innerHTML=l.map(x=>`<option value="${esc(x)}">`).join('');
  document.getElementById('sagaList').innerHTML=s.map(x=>`<option value="${esc(x)}">`).join('');
}
function openAdd(){
  if(tab==='shelf'){newShelf();return;}
  editId=null;starVal=0;subVals={};smutVal=0;
  ['f_fmc','f_mmc','f_tropes','f_resume','f_finNote'].forEach(i=>document.getElementById(i).value='');
  segSet('segRec','');renderSubRatings();renderSmut();
  document.getElementById('bookModalTitle').textContent='Ajouter un livre';
  ['f_titre','f_auteur','f_genre','f_pages','f_avis','f_isbn','f_couverture','f_spine','f_saga','f_tome','f_synopsis','f_dateParution'].forEach(i=>document.getElementById(i).value='');
  isbnMsg('');updateParutionMsg();
  document.getElementById('f_langue').value='Français';
  document.getElementById('f_dateFin').value=new Date().toISOString().slice(0,10);
  document.getElementById('f_noDate').checked=false;
  document.getElementById('f_dateFin').disabled=false;
  document.getElementById('f_prog').value=0;document.getElementById('progVal').textContent='0 %';
  document.getElementById('f_page').value='';
  segSet('segFic','fiction');segSet('segStatut','tbr');segSet('segFormat','papier');
  document.getElementById('delBookBtn').classList.add('hidden');
  resetFormImgs();
  document.getElementById('f_search').value='';
  document.getElementById('searchResults').innerHTML='';searchMsg('');
  document.getElementById('sagaSug').innerHTML='';
  toggleStatutFields();renderStars();fillDatalists();
  document.getElementById('bookModal').classList.add('open');
}
function openEdit(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  editId=id;starVal=b.note||0;
  subVals={...(b.sousNotes||{})};smutVal=b.smut||0;
  document.getElementById('f_fmc').value=b.fmc||'';
  document.getElementById('f_mmc').value=b.mmc||'';
  document.getElementById('f_tropes').value=b.tropes||'';
  document.getElementById('f_resume').value=b.resume||'';
  document.getElementById('f_finNote').value=b.finNote||'';
  segSet('segRec',b.recommande===true?'oui':(b.recommande===false?'non':''));
  renderSubRatings();renderSmut();
  document.getElementById('bookModalTitle').textContent='Modifier le livre';
  document.getElementById('f_titre').value=b.titre;
  document.getElementById('f_isbn').value=b.isbn||'';isbnMsg('');
  document.getElementById('f_couverture').value=b.couverture||'';
  document.getElementById('f_spine').value=b.spine||'';
  document.getElementById('f_auteur').value=b.auteur||'';
  document.getElementById('f_genre').value=b.genre||'';
  document.getElementById('f_langue').value=b.langue||'';
  document.getElementById('f_saga').value=b.saga||'';
  document.getElementById('f_tome').value=b.tome||'';
  document.getElementById('f_synopsis').value=b.synopsis||'';
  document.getElementById('f_pages').value=b.pages||'';
  document.getElementById('f_dateParution').value=b.dateParution||'';updateParutionMsg();
  document.getElementById('f_avis').value=b.avis||'';
  document.getElementById('f_dateFin').value=b.dateFin||new Date().toISOString().slice(0,10);
  const noD=b.statut==='done'&&!b.dateFin;
  document.getElementById('f_noDate').checked=noD;
  document.getElementById('f_dateFin').disabled=noD;
  document.getElementById('f_prog').value=b.progression||0;
  document.getElementById('progVal').textContent=(b.progression||0)+' %';
  document.getElementById('f_page').value=b.pageActuelle||'';
  segSet('segFic',b.fiction===false?'nonfiction':'fiction');
  segSet('segStatut',b.statut);segSet('segFormat',fmt(b));
  document.getElementById('delBookBtn').classList.remove('hidden');
  resetFormImgs();
  document.getElementById('f_search').value='';
  document.getElementById('searchResults').innerHTML='';searchMsg('');
  document.getElementById('sagaSug').innerHTML='';
  toggleStatutFields();renderStars();fillDatalists();
  document.getElementById('bookModal').classList.add('open');
}
function saveBook(){
  const titre=document.getElementById('f_titre').value.trim();
  if(!titre){toast('Le titre est obligatoire 🙂');return;}
  const statut=segVal('segStatut'),format=segVal('segFormat');
  const pages=+document.getElementById('f_pages').value||0;
  let progression=statut==='done'?100:0,pageActuelle=0;
  if(statut==='reading'||statut==='dnf'){
    if(format==='papier'){
      pageActuelle=Math.max(0,+document.getElementById('f_page').value||0);
      if(pages)pageActuelle=Math.min(pageActuelle,pages);
      progression=pages?Math.round(pageActuelle/pages*100):0;
    }else progression=+document.getElementById('f_prog').value;
  }
  const prev=editId?db.books.find(x=>x.id===editId):null;
  const b={
    id:editId||uid(),titre,
    saga:document.getElementById('f_saga').value.trim(),
    tome:+document.getElementById('f_tome').value||0,
    synopsis:document.getElementById('f_synopsis').value.trim(),
    citations:(prev&&prev.citations)||[],
    relectures:(prev&&prev.relectures)||0,
    isbn:isbnClean(document.getElementById('f_isbn').value),
    couverture:formImgs.couverture||document.getElementById('f_couverture').value.trim(),
    spine:formImgs.spine||document.getElementById('f_spine').value.trim(),
    auteur:document.getElementById('f_auteur').value.trim(),
    genre:document.getElementById('f_genre').value.trim(),
    langue:document.getElementById('f_langue').value.trim(),
    dateParution:document.getElementById('f_dateParution').value||'',
    pages,
    fiction:segVal('segFic')==='fiction',
    format,statut,progression,pageActuelle,
    note:(statut==='done'||statut==='dnf')?starVal:0,
    avis:(statut==='done'||statut==='dnf')?document.getElementById('f_avis').value.trim():'',
    fmc:document.getElementById('f_fmc').value.trim(),
    mmc:document.getElementById('f_mmc').value.trim(),
    tropes:document.getElementById('f_tropes').value.trim(),
    resume:document.getElementById('f_resume').value.trim(),
    finNote:document.getElementById('f_finNote').value.trim(),
    sousNotes:{...subVals},
    smut:smutVal,
    recommande:segVal('segRec')==='oui'?true:(segVal('segRec')==='non'?false:null),
    dateFin:((statut==='done'||statut==='dnf')&&!document.getElementById('f_noDate').checked)?document.getElementById('f_dateFin').value:'',
    dateAjout:editId?(db.books.find(x=>x.id===editId)||{}).dateAjout||Date.now():Date.now(),
  };
  /* Journal : pages lues aujourd'hui = différence avec l'état précédent */
  const old=editId?db.books.find(x=>x.id===editId):null;
  const readOf=x=>!x?0:(x.statut==='done'?(x.pages||0):(fmt(x)==='papier'?(x.pageActuelle||0):Math.round((x.progression||0)/100*(x.pages||0))));
  const newRead=statut==='done'?pages:(format==='papier'?pageActuelle:Math.round(progression/100*pages));
  const today=new Date().toISOString().slice(0,10);
  let delta=0;
  if(old)delta=newRead-readOf(old);
  else if(statut==='reading')delta=newRead;
  else if(statut==='done'&&b.dateFin===today)delta=pages;
  if(delta>0)logSession(b.id,titre,delta,today);
  if(statut==='done'&&(!prev||prev.statut!=='done'))confetti();
  if(editId)db.books=db.books.map(x=>x.id===editId?b:x);else db.books.push(b);
  save();closeModals();render();
  if(prev){cleanupOldImage(prev.couverture,b.couverture);cleanupOldImage(prev.spine,b.spine);}
  cacheExternalImage(b.id,'couverture');
  cacheExternalImage(b.id,'spine');
  syncFeedForBook(b);
}
/* ---------- Avancement rapide ---------- */
let quickId=null;
function openQuick(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  quickId=id;
  document.getElementById('quickTitle').textContent=b.titre;
  const paper=fmt(b)==='papier';
  document.getElementById('quickPages').classList.toggle('hidden',!paper);
  document.getElementById('quickPct').classList.toggle('hidden',paper);
  if(paper){
    document.getElementById('q_page').value=b.pageActuelle||'';
    document.getElementById('q_pageHint').textContent=b.pages?'sur '+b.pages+' pages':'';
  }else{
    document.getElementById('q_prog').value=b.progression||0;
    document.getElementById('q_progVal').textContent=(b.progression||0)+' %';
  }
  document.getElementById('q_date').value=new Date().toISOString().slice(0,10);
  document.getElementById('quickModal').classList.add('open');
}
function saveQuick(finish){
  const b=db.books.find(x=>x.id===quickId);if(!b)return;
  const paper=fmt(b)==='papier';
  const today=document.getElementById('q_date').value||new Date().toISOString().slice(0,10);
  const oldRead=paper?(b.pageActuelle||0):Math.round((b.progression||0)/100*(b.pages||0));
  if(!finish){
    if(paper){
      let p=Math.max(0,+document.getElementById('q_page').value||0);
      if(b.pages)p=Math.min(p,b.pages);
      b.pageActuelle=p;
      b.progression=b.pages?Math.round(p/b.pages*100):0;
      if(b.pages&&p>=b.pages)finish=true;
    }else{
      b.progression=+document.getElementById('q_prog').value;
      if(b.progression>=100)finish=true;
    }
  }
  if(finish){
    b.statut='done';b.progression=100;b.pageActuelle=b.pages||0;
    if(!b.dateFin)b.dateFin=today;
    confetti();
  }
  const newRead=b.statut==='done'?(b.pages||0):(paper?(b.pageActuelle||0):Math.round(b.progression/100*(b.pages||0)));
  if(newRead-oldRead>0)logSession(b.id,b.titre,newRead-oldRead,today);
  save();closeModals();render();
  syncFeedForBook(b);
  if(finish&&b.statut==='done')setTimeout(()=>openEdit(b.id),150); /* pour noter + laisser un avis */
}
function logSession(bookId,titre,pages,date){
  const s=db.sessions.find(x=>x.date===date&&x.bookId===bookId);
  if(s)s.pages+=pages;else db.sessions.push({id:uid(),date,bookId,titre,pages});
}
function deleteBook(){
  askConfirm('Supprimer ce livre ?',()=>{
    const delId=editId;
    db.books=db.books.filter(x=>x.id!==delId);
    db.shelves.forEach(s=>s.items=s.items.filter(it=>it.bookId!==delId));
    db.ranking=db.ranking.filter(r=>!(r.type==='book'&&r.id===delId));
    save();closeModals();render();
    syncFeedForBook({id:delId,statut:'deleted'});
  },'Supprimer');
}

/* ---------- ISBN : recherche + scanner ---------- */
const isbnClean=s=>(s||'').replace(/[^0-9Xx]/g,'');
function isbnMsg(txt,cls){const m=document.getElementById('isbnMsg');m.textContent=txt;m.className='isbnmsg '+(cls||'');}
/* Analyse d'une fiche de lecture photographiée (IA Gemini) */
const GKEY='mabibli_gemini';
let gemKey=localStorage.getItem(GKEY)||'';
function ficheMsgSet(t,cls){const m=document.getElementById('ficheMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
function pickFiche(){
  if(!gemKey){ficheMsgSet('Ajoute d\'abord ta clé Gemini gratuite dans ⚙️ Réglages','err');return;}
  document.getElementById('fichePick').click();
}
/* Appel vision Gemini : modèles stables uniquement, bascule auto si quota/indispo */
async function gemModels(){
  const base=['models/gemini-2.5-flash','models/gemini-2.0-flash'];
  try{
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100',
      {headers:{'x-goog-api-key':gemKey}});
    if(r.ok){
      const d=await r.json();
      (d.models||[]).filter(m=>
        (m.supportedGenerationMethods||[]).includes('generateContent')&&
        /flash/i.test(m.name)&&
        !/preview|exp|lite|image|tts|live|audio|thinking|8b|latest/i.test(m.name))
        .sort((a,b)=>b.name.localeCompare(a.name))
        .forEach(m=>{if(!base.includes(m.name))base.push(m.name);});
    }
  }catch(e){}
  return base;
}
async function gemVision(prompt,b64,json){
  const models=await gemModels();
  let lastErr='';
  for(const model of models){
    try{
      const r=await fetch('https://generativelanguage.googleapis.com/v1beta/'+model+':generateContent',{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':gemKey},
        body:JSON.stringify({
          contents:[{parts:[{text:prompt},{inline_data:{mime_type:'image/jpeg',data:b64}}]}],
          generationConfig:json?{response_mime_type:'application/json',temperature:0}:{temperature:0}
        })});
      if(!r.ok){
        const er=await r.json().catch(()=>({}));
        lastErr=((er.error&&er.error.message)||('HTTP '+r.status));
        /* quota atteint ou modèle indisponible → on tente le modèle suivant */
        if(r.status===429||r.status===404||r.status===400)continue;
        throw new Error(lastErr);
      }
      const d=await r.json();
      const txt=((d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts)||[])
        .map(p=>p.text||'').join('').trim();
      if(txt)return txt;
      lastErr='réponse vide du modèle';
    }catch(e){lastErr=e.message||lastErr;}
  }
  throw new Error(lastErr||'aucun modèle Gemini disponible pour cette clé');
}
const FICHE_PROMPT=`Voici la photo d'une fiche de lecture manuscrite en français. Extrais les informations et réponds UNIQUEMENT avec un JSON valide, sans commentaire, avec exactement ces clés (mets null si l'info est absente ou illisible) :
{"titre":string,"auteur":string,"genre":string,"langue":string,"fmc":string,"mmc":string,"tropes":string,
"note":0-5 (grande rangée d'étoiles : compte les étoiles coloriées/surlignées),
"ecriture":0-5,"histoire":0-5,"personnages":0-5,"tension":0-5,"tristesse":0-5,"romance":0-5,"drole":0-5,"facile":0-5,"fin":0-5 (chaque catégorie : étoiles coloriées),
"recommande":"oui" ou "non" (symbole entouré/colorié) ou null,
"smut":0-5 (nombre de piments),
"resume":string,"finNote":string (contenu de l'encadré Fin),"commentaires":string,
"format":"papier" (si l'icône livre est cochée) ou "numerique" (si l'icône liseuse est cochée) ou null}`;
function onFichePicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  ficheMsgSet('⏳ Analyse de la fiche en cours…');
  const img=new Image();
  img.onload=async()=>{
    const maxH=1500,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.82).split(',')[1];
    try{
      let txt=await gemVision(FICHE_PROMPT,b64,true);
      txt=txt.replace(/^```json\s*/i,'').replace(/```\s*$/,'').trim();
      applyFiche(JSON.parse(txt));
      ficheMsgSet('✅ Fiche analysée — vérifie et corrige si besoin','ok');
    }catch(e){ficheMsgSet('⚠️ '+(e.message||'Analyse impossible — réessaie avec une photo plus nette'),'err');}
  };
  img.onerror=()=>ficheMsgSet('Image illisible 😕','err');
  img.src=URL.createObjectURL(f);
}
function applyFiche(v){
  const set=(id,val)=>{if(val)document.getElementById(id).value=val;};
  set('f_titre',v.titre);set('f_auteur',v.auteur);set('f_genre',v.genre);set('f_langue',v.langue);
  set('f_fmc',v.fmc);set('f_mmc',v.mmc);set('f_tropes',v.tropes);
  set('f_resume',v.resume);set('f_finNote',v.finNote);set('f_avis',v.commentaires);
  if(v.format==='papier'||v.format==='numerique')segSet('segFormat',v.format);
  segSet('segStatut','done');
  const n=x=>Math.max(0,Math.min(5,Math.round(+x||0)));
  starVal=n(v.note);
  subVals={ecriture:n(v.ecriture),histoire:n(v.histoire),personnages:n(v.personnages),
    tension:n(v.tension),tristesse:n(v.tristesse),romance:n(v.romance),
    drole:n(v.drole),facile:n(v.facile),fin:n(v.fin)};
  smutVal=n(v.smut);
  segSet('segRec',v.recommande==='oui'?'oui':(v.recommande==='non'?'non':''));
  toggleStatutFields();renderStars();renderSubRatings();renderSmut();
}

/* Recherche en ligne par titre/auteur */
let searchRes=[];
function searchMsg(t,cls){const m=document.getElementById('searchMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
async function searchOnline(){
  const q=document.getElementById('f_search').value.trim();
  if(q.length<3){searchMsg('Entre au moins 3 caractères','err');return;}
  searchMsg('Recherche en cours…');searchRes=[];
  document.getElementById('searchResults').innerHTML='';
  try{
    try{
      const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&country=FR&maxResults=6');
      if(r.ok){
        const d=await r.json();
        (d.items||[]).forEach(it=>{
          const v=it.volumeInfo||{};
          if(!v.title)return;
          const isbn=(v.industryIdentifiers||[]).map(x=>x.identifier).find(x=>/^97[89]\d{10}$/.test(x))||'';
          searchRes.push({titre:v.title,auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
            langue:NV_LANG[v.language]||v.language||'',genre:(v.categories||[])[0]||'',isbn,
            parution:normDate(v.publishedDate),
            couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')});
        });
      }
    }catch(e){}
    if(searchRes.length<3){
      try{
        const r=await fetch('https://openlibrary.org/search.json?q='+encodeURIComponent(q)+'&fields=title,author_name,number_of_pages_median,cover_i,isbn,first_publish_year&limit=6');
        if(r.ok){
          const d=await r.json();
          (d.docs||[]).forEach(v=>{
            if(!v.title)return;
            if(searchRes.some(x=>x.titre.toLowerCase()===v.title.toLowerCase()))return;
            searchRes.push({titre:v.title,auteur:(v.author_name||[]).join(', '),
              pages:v.number_of_pages_median||0,langue:'',genre:'',
              isbn:(v.isbn||[]).find(x=>/^97[89]\d{10}$/.test(x))||'',
              parution:v.first_publish_year?normDate(String(v.first_publish_year)):'',
              couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''});
          });
        }
      }catch(e){}
    }
    if(!searchRes.length){searchMsg('Aucun résultat 😕 — essaie avec l\'ISBN ou remplis à la main','err');return;}
    searchMsg(searchRes.length+' résultat(s) — touche celui qui correspond','ok');
    document.getElementById('searchResults').innerHTML=searchRes.map((v,i)=>
      `<div class="sitem" style="cursor:pointer" onclick="applySearch(${i})">${coverEl(v.couverture,'sm')}
        <span class="nm">${esc(v.titre)}<br><span style="color:var(--txt2);font-size:.75rem">${esc(v.auteur)||'—'}${v.pages?' · '+v.pages+' p.':''}</span></span>
        <button style="color:var(--green)">Utiliser</button></div>`).join('');
  }catch(e){searchMsg('Erreur réseau — vérifie ta connexion','err');}
}
function applySearch(i){
  const v=searchRes[i];if(!v)return;
  document.getElementById('f_titre').value=v.titre;
  if(v.auteur)document.getElementById('f_auteur').value=v.auteur;
  if(v.pages)document.getElementById('f_pages').value=v.pages;
  if(v.langue)document.getElementById('f_langue').value=v.langue;
  if(v.genre&&!document.getElementById('f_genre').value)document.getElementById('f_genre').value=v.genre;
  if(v.isbn)document.getElementById('f_isbn').value=v.isbn;
  if(v.couverture)document.getElementById('f_couverture').value=v.couverture;
  if(v.desc)document.getElementById('f_synopsis').value=v.desc;
  if(v.parution)document.getElementById('f_dateParution').value=v.parution;
  updateParutionMsg();
  document.getElementById('searchResults').innerHTML='';
  searchMsg('✅ Infos remplies — vérifie et complète si besoin','ok');
}
/* Normalise une date de parution (Google Books / Open Library) vers AAAA-MM-JJ */
function normDate(s){
  if(!s)return'';
  s=String(s).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  if(/^\d{4}-\d{2}$/.test(s))return s+'-01';
  if(/^\d{4}$/.test(s))return s+'-01-01';
  const d=new Date(s);
  if(!isNaN(d)&&d.getFullYear()>1000&&d.getFullYear()<3000)return d.toISOString().slice(0,10);
  return'';
}
function isbn13to10(i){
  if(!/^978\d{10}$/.test(i))return null;
  const core=i.slice(3,12);let s=0;
  for(let k=0;k<9;k++)s+=(10-k)*+core[k];
  const c=(11-s%11)%11;
  return core+(c===10?'X':c);
}
function isbn10to13(i){
  if(!/^\d{9}[\dXx]$/.test(i))return null;
  const core='978'+i.slice(0,9);let s=0;
  for(let k=0;k<12;k++)s+=+core[k]*(k%2?3:1);
  return core+((10-s%10)%10);
}
async function lookupISBN(){
  const isbn=isbnClean(document.getElementById('f_isbn').value);
  if(isbn.length!==10&&isbn.length!==13){isbnMsg('ISBN invalide (10 ou 13 chiffres)','err');return;}
  isbnMsg('Recherche en cours…');
  const candidates=[isbn];
  const alt=isbn.length===13?isbn13to10(isbn):isbn10to13(isbn);
  if(alt)candidates.push(alt);
  try{
    let info=null;
    for(const src of [fetchGoogleBooks,fetchOpenLibrary,fetchOpenLibSearch]){
      for(const code of candidates){
        try{info=await src(code);}catch(e){}
        if(info)break;
      }
      if(info)break;
    }
    if(!info){isbnMsg('Introuvable pour l\'ISBN '+isbn+' 😕 — vérifie le numéro ou remplis à la main','err');return;}
    if(info.titre)document.getElementById('f_titre').value=info.titre;
    if(info.auteur)document.getElementById('f_auteur').value=info.auteur;
    if(info.pages)document.getElementById('f_pages').value=info.pages;
    if(info.langue)document.getElementById('f_langue').value=info.langue;
    if(info.genre&&!document.getElementById('f_genre').value)document.getElementById('f_genre').value=info.genre;
    document.getElementById('f_couverture').value=info.couverture||('https://covers.openlibrary.org/b/isbn/'+isbn+'-M.jpg?default=false');
    if(info.desc)document.getElementById('f_synopsis').value=info.desc;
    if(info.parution)document.getElementById('f_dateParution').value=info.parution;
    updateParutionMsg();
    isbnMsg('✅ Infos trouvées — vérifie et complète si besoin','ok');
  }catch(e){isbnMsg('Erreur réseau — vérifie ta connexion','err');}
}
async function fetchGoogleBooks(isbn){
  const r=await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn+'&country=FR');
  if(!r.ok)return null;
  const d=await r.json();
  const v=d.items&&d.items[0]&&d.items[0].volumeInfo;
  if(!v)return null;
  return {titre:v.title||'',auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
    langue:NV_LANG[v.language]||v.language||'',genre:(v.categories||[])[0]||'',
    desc:v.description||'',parution:normDate(v.publishedDate),
    couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')};
}
async function fetchOpenLibrary(isbn){
  const r=await fetch('https://openlibrary.org/api/books?bibkeys=ISBN:'+isbn+'&format=json&jscmd=data');
  if(!r.ok)return null;
  const d=await r.json();const v=d['ISBN:'+isbn];
  if(!v)return null;
  return {titre:v.title||'',auteur:(v.authors||[]).map(a=>a.name).join(', '),
    pages:v.number_of_pages||0,langue:'',genre:(v.subjects&&v.subjects[0]&&v.subjects[0].name)||'',
    parution:normDate(v.publish_date),
    couverture:(v.cover&&(v.cover.medium||v.cover.small))||''};
}
async function fetchOpenLibSearch(isbn){
  const r=await fetch('https://openlibrary.org/search.json?q=isbn:'+isbn+'&fields=title,author_name,number_of_pages_median,cover_i,first_publish_year&limit=1');
  if(!r.ok)return null;
  const d=await r.json();const v=d.docs&&d.docs[0];
  if(!v||!v.title)return null;
  return {titre:v.title,auteur:(v.author_name||[]).join(', '),
    pages:v.number_of_pages_median||0,langue:'',genre:'',
    parution:v.first_publish_year?normDate(String(v.first_publish_year)):'',
    couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''};
}
/* Scanner : BarcodeDetector natif si dispo, sinon ZXing chargé à la demande */
let scanStream=null,zxingReader=null,scanning=false;
function loadZXing(){
  return new Promise((res,rej)=>{
    if(window.ZXing)return res();
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
    s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
}
function onScanned(raw){
  const code=isbnClean(raw);
  if(!(/^97[89]\d{10}$/.test(code)||code.length===10))return false;
  document.getElementById('f_isbn').value=code;
  if(navigator.vibrate)navigator.vibrate(80);
  closeScanner();lookupISBN();
  return true;
}
async function openScanner(){
  document.getElementById('scanModal').classList.add('open');
  const video=document.getElementById('scanVideo'),msg=document.getElementById('scanMsg');
  msg.textContent='Vise le code-barres au dos du livre…';
  scanning=true;
  try{
    if('BarcodeDetector' in window){
      scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});
      video.srcObject=scanStream;await video.play();
      const det=new BarcodeDetector({formats:['ean_13','ean_8']});
      const loop=async()=>{
        if(!scanning)return;
        try{
          const codes=await det.detect(video);
          if(codes.length&&onScanned(codes[0].rawValue))return;
        }catch(e){}
        setTimeout(loop,150);
      };
      loop();
    }else{
      msg.textContent='Chargement du scanner…';
      await loadZXing();
      if(!scanning)return;
      msg.textContent='Vise le code-barres au dos du livre…';
      zxingReader=new ZXing.BrowserMultiFormatReader();
      zxingReader.decodeFromVideoDevice(null,video,(result)=>{
        if(result&&scanning)onScanned(result.getText());
      });
    }
  }catch(e){
    closeScanner();
    toast("Impossible d'accéder à la caméra 😕 Autorise-la dans les réglages, ou saisis l'ISBN à la main.");
  }
}
function closeScanner(){
  scanning=false;
  document.getElementById('scanModal').classList.remove('open');
  if(zxingReader){try{zxingReader.reset();}catch(e){}zxingReader=null;}
  if(scanStream){scanStream.getTracks().forEach(t=>t.stop());scanStream=null;}
  document.getElementById('scanVideo').srcObject=null;
}

/* ---------- Défi pile ---------- */
const MILESTONES=[
  [icSvg('cat'),'Chat',25],[icSvg('dog'),'Beagle',40],[icSvg('panda'),'Panda assis',90],
  [icSvg('human'),'Ta taille !',null],[icSvg('flamingo'),'Autruche',250],[icSvg('giraffe'),'Girafe',500],
];
const COLORS=['#8b5cf6','#c9a2ff','#f5c86e','#6ee7a8','#7fc5ff','#ff9ad5','#ff8a8a'];
function toggleDefiScope(){
  db.settings.defiScope=(db.settings.defiScope==='year')?'all':'year';
  save();render();
}
const PILE_AVATARS=['avatar-explorer.png','avatar-explorer-female.png','avatar-scholar.png','avatar-scholar-female.png','avatar-warrior.png','avatar-warrior-female.png'];
function openPileAvatarPicker(){
  document.getElementById('pileAvatarGrid').innerHTML=PILE_AVATARS.map(a=>
    `<img src="${a}" onclick="choosePileAvatar('${a}')" style="width:80px;cursor:pointer;border-radius:8px;border:2px solid ${(db.settings.pileAvatar||'human.png')===a?'var(--accent)':'transparent'}">`
  ).join('');
  document.getElementById('pileAvatarModal').classList.add('open');
}
function choosePileAvatar(path){
  db.settings.pileAvatar=path;
  save();closeModals();render();
}
function defiCardHTML(){
  const taille=db.settings.taille||165;
  const scope=db.settings.defiScope||'all';
  const y=new Date().getFullYear();
  const allDone=db.books.filter(b=>b.statut==='done');
  const done=scope==='year'?allDone.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y))):allDone;
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(1);
  const scale=180/taille;
  const SPINE_COLORS=['#a5433c','#2e5d8a','#3e6b4f','#c99a3c','#7a3b5e','#37747c','#8a5a3b','#5a4a7a','#94323f','#4a6d3b'];
  const stack=done.slice(-40).map(b=>{
    const hash=[...(b.id||'x')].reduce((s,c)=>s+c.charCodeAt(0),0);
    const col=SPINE_COLORS[hash%SPINE_COLORS.length];
    const dx=(hash%15)-7;
    const rot=(((hash>>3)%5)-2)*0.5;
    return `<div class="sbook r" style="height:${Math.max(4,thickness(b)*scale)}px;--c:${col};transform:translateX(${dx}px) rotate(${rot}deg)" title="${esc(b.titre)}"></div>`;
  }).join('')||`<div style="color:var(--txt2);font-size:.8rem">${icSvg('empty')} Pas encore de pile</div>`;
  const fallback="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:'<svg viewBox=\\'0 0 60 180\\' style=\\'height:176px\\'><g fill=\\'#8b5cf6\\'><circle cx=\\'30\\' cy=\\'11\\' r=\\'9\\'/><path d=\\'M30 21c-10 0-14 9-15 21l-5 35c7 5 33 5 40 0l-5-35c-1-12-5-21-15-21z\\'/><rect x=\\'21\\' y=\\'75\\' width=\\'7.5\\' height=\\'99\\' rx=\\'3.5\\'/><rect x=\\'31.5\\' y=\\'75\\' width=\\'7.5\\' height=\\'99\\' rx=\\'3.5\\'/></g></svg>'}))";
  return `<div class="challenge-card" onclick="toggleDefiScope()" style="cursor:pointer">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <div style="font-size:.8rem;color:var(--txt2);font-weight:700;text-transform:uppercase;letter-spacing:.6px">Défi de la pile</div>
      <div class="chip" style="pointer-events:none;margin:0">${scope==='year'?icSvg('calendar')+' '+y:icSvg('pile')+' Tous les livres'}</div>
    </div>
    <div class="bignum">${h} cm</div>
    <div style="font-size:1rem;font-weight:800;color:var(--accent)">${Math.round(h/taille*100)} % de ta taille</div>
    <div style="font-size:.85rem;color:var(--txt2);margin-top:2px">Objectif : ta taille (${taille} cm) — ${done.length} livre${done.length>1?'s':''} terminé${done.length>1?'s':''}${scope==='year'?' en '+y:''}</div>
    <div class="stackwrap">
      <div class="stack">${stack}</div>
      <div class="human" style="cursor:pointer" onclick="event.stopPropagation();openPileAvatarPicker()">
        <img src="${db.settings.pileAvatar||'human.png'}" style="height:176px;display:block" alt="" onerror="${fallback}">
        <small>${taille} cm</small>
      </div>
    </div>
    <div class="pbar" style="height:10px"><div style="width:${Math.min(100,h/taille*100)}%"></div></div>
    <div style="font-size:.78rem;color:var(--txt2);margin-top:8px">Chaque livre terminé${scope==='year'?' en '+y:''} ajoute son épaisseur à ta pile. <b>Appuie sur la carte</b> pour basculer tous les livres / cette année, <b>ou sur ton avatar</b> pour en changer.</div>
  </div>`;
}
function renderDefi(){
  const taille=db.settings.taille||165;
  document.getElementById('defiCard').innerHTML=defiCardHTML();
  const scope=db.settings.defiScope||'all';
  const y=new Date().getFullYear();
  const allDone=db.books.filter(b=>b.statut==='done');
  const done=scope==='year'?allDone.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y))):allDone;
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(1);
  const ms=MILESTONES.map(([e,n,v])=>[e,n,v===null?taille:v]).sort((a,b)=>a[2]-b[2]);
  document.getElementById('milestones').innerHTML=ms.map(([e,n,v])=>{
    const ok=h>=v;
    return `<div class="mile ${ok?'reached':''}"><span class="emo">${e}</span>
      <span class="name">${n}</span><span class="h">${v} cm</span>${ok?'<span class="check">✓</span>':''}</div>`;
  }).join('');
}

/* ---------- Stats ---------- */
/* Carte stat "cyclable" : un titre fixe et clair + une variante (période) qui change au clic, pour regrouper
   plusieurs déclinaisons de la même statistique (jour/mois/année, cette année/toujours...) sans dupliquer les cartes */
function statCard(title,variants,idx){
  idx=idx||0;
  if(variants.length===1)return `<div class="stat"><div class="n">${variants[0].n}</div><div class="l">${esc(title)}</div></div>`;
  const dots=`<div class="dots">${variants.map((_,i)=>`<span class="${i===idx?'on':''}"></span>`).join('')}</div>`;
  return `<div class="stat cyclable" data-title="${esc(title)}" data-variants="${esc(JSON.stringify(variants))}" data-idx="${idx}" onclick="cycleStat(this)">
    <div class="n">${variants[idx].n}</div><div class="l">${esc(title)}</div><div class="sub">${esc(variants[idx].sub)}</div>${dots}</div>`;
}
function cycleStat(el){
  const variants=JSON.parse(el.dataset.variants);
  const idx=(+el.dataset.idx+1)%variants.length;
  el.dataset.idx=idx;
  el.querySelector('.n').textContent=variants[idx].n;
  el.querySelector('.sub').textContent=variants[idx].sub;
  el.querySelectorAll('.dots span').forEach((d,i)=>d.classList.toggle('on',i===idx));
}
function bars(counts,total){
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length)return '<div style="color:var(--txt2);font-size:.85rem;padding:4px 2px">Pas encore de données.</div>';
  return entries.map(([k,v])=>`<div class="barrow">
    <div class="lbl"><b>${esc(k)}</b><span>${v}</span></div>
    <div class="track"><div class="fill" style="width:${v/total*100}%"></div></div></div>`).join('');
}
function renderStats(){
  const done=db.books.filter(b=>b.statut==='done');
  const pages=done.reduce((s,b)=>s+(b.pages||0),0);
  const noted=done.filter(b=>b.note>0);
  const avg=noted.length?(noted.reduce((s,b)=>s+b.note,0)/noted.length).toFixed(1):'—';
  const y=new Date().getFullYear();
  document.getElementById('statCards').innerHTML=`
    <div class="stat"><div class="n">${done.length}</div><div class="l">Livres terminés (total)</div></div>
    <div class="stat"><div class="n">${pages.toLocaleString('fr-FR')}</div><div class="l">Pages des livres terminés</div></div>
    <div class="stat"><div class="n">${db.books.filter(b=>b.statut==='tbr').length}</div><div class="l">À lire (PAL)</div></div>
    <div class="stat"><div class="n">${avg} ★</div><div class="l">Note moyenne donnée</div></div>`;
  /* Stats pages : moyennes par livre et par période de lecture */
  const doneYear=done.filter(b=>b.dateFin&&b.dateFin.startsWith(String(y)));
  const avgPagesYear=doneYear.length?Math.round(doneYear.reduce((s,b)=>s+(b.pages||0),0)/doneYear.length):0;
  const allWithPages=db.books.filter(b=>b.pages>0);
  const avgPagesAll=allWithPages.length?Math.round(allWithPages.reduce((s,b)=>s+b.pages,0)/allWithPages.length):0;
  const totalSessPages=db.sessions.reduce((s,x)=>s+(x.pages||0),0);
  const sessDays=new Set(db.sessions.map(s=>s.date));
  const sessMonths=new Set(db.sessions.map(s=>s.date.slice(0,7)));
  const sessYears=new Set(db.sessions.map(s=>s.date.slice(0,4)));
  const avgPagesDay=sessDays.size?Math.round(totalSessPages/sessDays.size):0;
  const avgPagesMonth=sessMonths.size?Math.round(totalSessPages/sessMonths.size):0;
  const avgPagesYr=sessYears.size?Math.round(totalSessPages/sessYears.size):0;
  document.getElementById('pageStats').innerHTML=
    statCard('Pages loguées dans le journal',[{n:totalSessPages.toLocaleString('fr-FR'),sub:''}])+
    statCard('Moyenne de pages par livre',[
      {n:avgPagesYear||'—',sub:'en '+y},
      {n:avgPagesAll||'—',sub:'toutes années'}
    ])+
    statCard('Rythme de lecture (moyenne)',[
      {n:avgPagesDay||'—',sub:'pages / jour'},
      {n:avgPagesMonth||'—',sub:'pages / mois'},
      {n:avgPagesYr||'—',sub:'pages / année'}
    ]);
  const count=(arr,fn)=>arr.reduce((o,b)=>{const k=fn(b);if(k)o[k]=(o[k]||0)+1;return o;},{});
  document.getElementById('langBars').innerHTML=bars(count(done,b=>b.langue||'?'),done.length||1);
  document.getElementById('fmtBars').innerHTML=bars(count(done,b=>FMT[fmt(b)]||'Papier'),done.length||1);
  document.getElementById('ficBars').innerHTML=bars(count(done,b=>b.fiction===false?'Non-fiction':'Fiction'),done.length||1);
  /* rythme + graphique cumulé année vs année précédente */
  const cut=new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  const p30=db.sessions.filter(s=>s.date>=cut).reduce((t,s)=>t+s.pages,0);
  const cum=yr=>{
    const m=Array(12).fill(0);
    db.books.forEach(b=>{if(b.statut==='done'&&b.dateFin&&+b.dateFin.slice(0,4)===yr)m[+b.dateFin.slice(5,7)-1]++;});
    let c=0;return m.map(v=>c+=v);
  };
  const a=cum(y),pr=cum(y-1);
  const mx=Math.max(1,...a,...pr);
  const pts=arr=>arr.map((v,i)=>(12+i*25.1)+','+(112-v/mx*95)).join(' ');
  document.getElementById('cumChart').innerHTML=
    `<div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:6px">
      <span><span style="color:var(--accent);font-weight:700">━ ${y}</span> · <span style="color:var(--txt2)">━ ${y-1}</span></span>
      <span style="color:var(--txt2)">${Math.round(p30/30)} p./jour (30 j)</span></div>
    <svg viewBox="0 0 300 120" style="width:100%">
      <line x1="12" y1="112" x2="288" y2="112" stroke="var(--line)" stroke-width="1"/>
      <polyline points="${pts(pr)}" fill="none" stroke="var(--txt2)" stroke-width="2" opacity=".55"/>
      <polyline points="${pts(a)}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
}
/* Récap annuel partageable (image) */
function genRecap(){
  const y=new Date().getFullYear();
  const done=db.books.filter(b=>b.statut==='done'&&b.dateFin&&b.dateFin.startsWith(String(y)));
  if(!done.length){toast('Aucun livre terminé en '+y+' pour l\'instant 😉');return;}
  const pages=done.reduce((t,b)=>t+(b.pages||0),0);
  const top=(fn)=>{const c={};done.forEach(b=>{const k=fn(b);if(k)c[k]=(c[k]||0)+1;});return Object.entries(c).sort((a,b)=>b[1]-a[1])[0];};
  const tg=top(b=>b.genre),ta=top(b=>b.auteur);
  const best=[...done].sort((a,b)=>(b.note||0)-(a.note||0))[0];
  const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;
  const x=cv.getContext('2d');
  const grad=x.createLinearGradient(0,0,0,1350);
  grad.addColorStop(0,'#1e1330');grad.addColorStop(1,'#0f0a18');
  x.fillStyle=grad;x.fillRect(0,0,1080,1350);
  x.fillStyle='#c9a2ff';x.font='800 92px -apple-system,sans-serif';x.textAlign='center';
  x.fillText('Ma Bibli · '+y,540,170);
  x.fillStyle='#f0eaf7';x.font='800 190px -apple-system,sans-serif';
  x.fillText(String(done.length),540,430);
  x.fillStyle='#a89bc0';x.font='600 56px -apple-system,sans-serif';
  x.fillText('livres terminés',540,510);
  x.fillStyle='#f5c86e';x.font='800 100px -apple-system,sans-serif';
  x.fillText(pages.toLocaleString('fr-FR')+' pages',540,680);
  x.fillStyle='#f0eaf7';x.font='600 52px -apple-system,sans-serif';
  if(tg)x.fillText('Genre favori : '+tg[0],540,820);
  if(ta)x.fillText('Auteur·ice de l\'année : '+ta[0],540,910);
  if(best&&best.note)x.fillText('Coup de cœur : '+best.titre.slice(0,30)+' '+'★'.repeat(best.note),540,1000);
  const h=+done.reduce((s,b)=>s+thickness(b),0).toFixed(0);
  x.fillStyle='#8b5cf6';x.font='800 72px -apple-system,sans-serif';
  x.fillText('Pile de '+h+' cm 📚',540,1140);
  x.fillStyle='#6f6390';x.font='500 38px -apple-system,sans-serif';
  x.fillText('fait avec Ma Bibli',540,1270);
  cv.toBlob(blob=>{
    if(!blob){toast('Impossible de générer l\'image 😕');return;}
    recapBlob=blob;recapYear=y;
    document.getElementById('recapImg').src=URL.createObjectURL(blob);
    document.getElementById('recapModal').classList.add('open');
  },'image/png');
}
let recapBlob=null,recapYear=null;
function downloadRecap(){
  if(!recapBlob)return;
  const a2=document.createElement('a');
  a2.href=URL.createObjectURL(recapBlob);
  a2.download='ma-bibli-recap-'+recapYear+'.png';
  a2.click();
  toast('Récap téléchargé 🎉');
}
async function shareRecap(){
  if(!recapBlob)return;
  const file=new File([recapBlob],'ma-bibli-recap-'+recapYear+'.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'Mon récap Ma Bibli '+recapYear});}
    catch(e){/* annulé par l'utilisateur·ice — rien à faire */}
  }else{
    toast('Partage non pris en charge sur cet appareil — utilise Télécharger 👇');
  }
}

/* ---------- Images : upload / photo ---------- */
/* Supprime l'ancien fichier storage quand une image est remplacée (nouvelle photo, re-rognage,
   changement de couverture/tranche/avatar) — sinon chaque remplacement laisse l'ancienne copie
   orpheline dans le bucket pour toujours, ce qui finit par remplir le quota de stockage.
   Best-effort : ignore silencieusement si l'ancienne image n'était pas sur notre storage, ou
   en cas d'erreur (jamais bloquant pour l'utilisateur·ice). */
function cleanupOldImage(oldUrl,newUrl){
  if(!oldUrl||oldUrl===newUrl)return;
  const m=oldUrl.match(/\/storage\/v1\/object\/public\/bibli\/(.+)$/);
  if(!m)return;
  sbClient().then(c=>{if(c)c.storage.from('bibli').remove([m[1]]).catch(()=>{});}).catch(()=>{});
}
/* Photos → Supabase Storage (sync légère) ; repli base64 locale hors connexion */
async function uploadImage(dataUrl,name){
  try{
    const c=await sbClient();
    if(!c||!sbUser)return dataUrl;
    const blob=await (await fetch(dataUrl)).blob();
    const path=sbUser.id+'/'+name+'-'+Date.now()+'.jpg';
    const {error}=await c.storage.from('bibli').upload(path,blob,{contentType:'image/jpeg',upsert:true});
    if(error)return dataUrl;
    const {data}=c.storage.from('bibli').getPublicUrl(path);
    return (data&&data.publicUrl)||dataUrl;
  }catch(e){return dataUrl;}
}
/* Fichier quelconque (pas forcément une image) → Supabase Storage. Retourne null si pas
   connecté ou en cas d'erreur (pas de repli base64 ici : un fichier d'import peut être gros). */
async function uploadFile(blob,name,contentType){
  try{
    const c=await sbClient();
    if(!c||!sbUser)return null;
    const path=sbUser.id+'/'+name+'-'+Date.now();
    const {error}=await c.storage.from('bibli').upload(path,blob,{contentType:contentType||'application/octet-stream',upsert:true});
    if(error)return null;
    const {data}=c.storage.from('bibli').getPublicUrl(path);
    return (data&&data.publicUrl)||null;
  }catch(e){return null;}
}
/* Couvertures récupérées en ligne (recherche, ISBN...) : l'URL externe (Open Library, Google
   Books...) est souvent lente à recharger à chaque affichage. On la télécharge une seule fois,
   juste après l'enregistrement, et on la stocke comme une photo prise depuis le téléphone —
   les affichages suivants utilisent alors notre copie, rapide. Échec silencieux (réseau, CORS…) :
   l'URL externe reste utilisée en secours.
   Même chose pour une couverture encore en base64 (data:...) — cas d'un ajout fait hors ligne,
   ou d'une sauvegarde importée : tant qu'elle reste en base64, elle est embarquée en entier dans
   le JSON synchronisé à CHAQUE modification, ce qui peut largement dépasser la taille de requête
   acceptée par Supabase et faire échouer silencieusement la sync (livres "qui ne remontent pas"). */
function needsCaching(url){
  if(!url)return false;
  if(url.includes('/storage/v1/object/public/bibli/'))return false;
  return /^https?:\/\//.test(url)||/^data:image\//.test(url);
}
async function cacheExternalImage(bookId,field){
  const b=db.books.find(x=>x.id===bookId);if(!b)return;
  const url=b[field];
  if(!needsCaching(url))return;
  try{
    const res=await fetch(url);
    if(!res.ok)return;
    const blob=await res.blob();
    const objUrl=URL.createObjectURL(blob);
    const img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=objUrl;});
    const maxH=520,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(objUrl);
    const stored=await uploadImage(c.toDataURL('image/jpeg',0.72),'book-'+field);
    const cur=db.books.find(x=>x.id===bookId);
    if(cur&&cur[field]===url){
      cur[field]=stored;
      saveLocal();scheduleSync();render();
    }
  }catch(e){}
}
function cacheExternalCover(bookId){return cacheExternalImage(bookId,'couverture');}
let imgTarget=null,formImgs={couverture:'',spine:''};
function resetFormImgs(){
  formImgs={couverture:'',spine:''};
  ['covMsg','spMsg'].forEach(i=>{const m=document.getElementById(i);if(m){m.textContent='';m.className='isbnmsg';}});
}
function pickImage(id,field,camera,kind){
  if(field==='spine'&&camera){openSpineCam({id,field,kind:kind||'book'});return;}
  imgTarget={id,field,kind:kind||'book'};
  const inp=document.getElementById('imgPick');
  if(camera)inp.setAttribute('capture','environment');
  else inp.removeAttribute('capture');
  inp.click();
}
function resizeDataUrl(dataUrl,maxH){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const scale=Math.min(1,maxH/img.height);
      const c=document.createElement('canvas');
      c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      res(c.toDataURL('image/jpeg',0.72));
    };
    img.src=dataUrl;
  });
}
function onImgPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f||!imgTarget)return;
  const target=imgTarget;
  const objUrl=URL.createObjectURL(f);
  openCropper(objUrl,async(cropped)=>{
    URL.revokeObjectURL(objUrl);
    if(!cropped)return; /* rognage annulé */
    const dataUrl=await uploadImage(await resizeDataUrl(cropped,520),(target.kind||'x')+'-'+(target.field||'img'));
    if(target.field==='spine'){const m=currentBookMeta(target.kind,target.id);contributeSpine(m.titre,m.auteur,m.isbn,dataUrl);}
    if(target.kind==='postcompose'){
      pcPhotos.push(dataUrl);
      renderPcPhotos();
      return;
    }
    if(target.kind==='form'){
      formImgs[target.field]=dataUrl;
      const m=document.getElementById(target.field==='couverture'?'covMsg':'spMsg');
      if(m){m.textContent='✅ Image ajoutée — sera utilisée à l\'enregistrement';m.className='isbnmsg ok';}
      return;
    }
    const obj=db.books.find(x=>x.id===target.id);
    if(!obj)return;
    cleanupOldImage(obj[target.field],dataUrl);
    obj[target.field]=dataUrl;
    save();render();
    openInfo(obj.id);
    toast('Image mise à jour ✅');
  });
}
/* Re-rogner une image déjà en place (couverture ou tranche) : on la retélécharge en blob
   (même une image en ligne, type Google Books) pour éviter qu'un canvas "taché" par une
   image cross-origin sans en-têtes CORS bloque le rognage. */
async function reRognerImage(url,onCropped){
  url=(url||'').trim();
  if(!url){toast('Ajoute d\'abord une image à rogner');return;}
  let objUrl;
  try{
    const blob=await (await fetch(url)).blob();
    objUrl=URL.createObjectURL(blob);
  }catch(e){toast('Impossible de charger cette image pour la rogner 😕');return;}
  openCropper(objUrl,async(cropped)=>{
    URL.revokeObjectURL(objUrl);
    if(!cropped)return;
    onCropped(await uploadImage(await resizeDataUrl(cropped,520),'recrop'));
  });
}
/* Depuis le formulaire d'ajout/édition (champ Couverture ou Tranche encore non enregistré). */
function reRognerField(field){
  const inp=document.getElementById(field==='couverture'?'f_couverture':'f_spine');
  reRognerImage(inp.value,dataUrl=>{
    inp.value=dataUrl;
    const m=document.getElementById(field==='couverture'?'covMsg':'spMsg');
    if(m){m.textContent='✅ Image rognée';m.className='isbnmsg ok';}
  });
}
/* Depuis la fiche d'un livre déjà enregistré. */
function reRognerBookImage(id,field){
  const obj=db.books.find(x=>x.id===id);
  if(!obj)return;
  const oldUrl=obj[field];
  reRognerImage(oldUrl,dataUrl=>{
    obj[field]=dataUrl;
    cleanupOldImage(oldUrl,dataUrl);
    save();render();openInfo(id);
    toast('Image rognée ✅');
  });
}
/* ---------- Rognage photo (couverture / tranche), sans dépendance externe ---------- */
let cropState=null;
function openCropper(src,onDone){
  const imEl=document.getElementById('cropImgEl');
  /* Le modal doit être ouvert (donc mis en page) AVANT de mesurer clientWidth/Height,
     sinon l'image est encore display:none et ces mesures valent 0. */
  document.getElementById('cropModal').classList.add('open');
  imEl.onload=()=>{
    const dispW=imEl.clientWidth,dispH=imEl.clientHeight;
    const w=dispW*0.8,h=dispH*0.8;
    cropState={onDone,dispW,dispH,natW:imEl.naturalWidth,natH:imEl.naturalHeight,
      box:{x:(dispW-w)/2,y:(dispH-h)/2,w,h}};
    renderCropBox();
  };
  imEl.src=src;
}
function renderCropBox(){
  const s=cropState,b=s.box,el=document.getElementById('cropBox');
  el.style.left=b.x+'px';el.style.top=b.y+'px';el.style.width=b.w+'px';el.style.height=b.h+'px';
  /* Voile obscurcissant = 4 rectangles bornés à l'image (pas de box-shadow qui déborderait
     sur toute la page), pour que seul ce qui sera rogné reste assombri. */
  const vt=document.getElementById('veilTop'),vb=document.getElementById('veilBottom'),
    vl=document.getElementById('veilLeft'),vr=document.getElementById('veilRight');
  vt.style.left='0px';vt.style.top='0px';vt.style.width=s.dispW+'px';vt.style.height=Math.max(0,b.y)+'px';
  vb.style.left='0px';vb.style.top=(b.y+b.h)+'px';vb.style.width=s.dispW+'px';vb.style.height=Math.max(0,s.dispH-b.y-b.h)+'px';
  vl.style.left='0px';vl.style.top=b.y+'px';vl.style.width=Math.max(0,b.x)+'px';vl.style.height=b.h+'px';
  vr.style.left=(b.x+b.w)+'px';vr.style.top=b.y+'px';vr.style.width=Math.max(0,s.dispW-b.x-b.w)+'px';vr.style.height=b.h+'px';
}
function cropClamp(){
  const s=cropState,b=s.box,MIN=30;
  b.w=Math.max(MIN,Math.min(b.w,s.dispW));
  b.h=Math.max(MIN,Math.min(b.h,s.dispH));
  b.x=Math.max(0,Math.min(b.x,s.dispW-b.w));
  b.y=Math.max(0,Math.min(b.y,s.dispH-b.h));
}
(function(){
  const wrap=document.getElementById('cropWrap');
  let mode=null,startX=0,startY=0,startBox=null;
  wrap.addEventListener('pointerdown',e=>{
    if(!cropState)return;
    const handle=e.target.closest('.cropHandle');
    const box=e.target.closest('#cropBox');
    if(!handle&&!box)return;
    e.preventDefault();
    mode=handle?handle.dataset.c:'move';
    startX=e.clientX;startY=e.clientY;
    startBox={...cropState.box};
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove',e=>{
    if(!mode||!cropState)return;
    e.preventDefault();
    const dx=e.clientX-startX,dy=e.clientY-startY,b=cropState.box;
    if(mode==='move'){
      b.x=startBox.x+dx;b.y=startBox.y+dy;
    }else{
      if(mode.includes('w')){b.x=startBox.x+dx;b.w=startBox.w-dx;}
      if(mode.includes('e'))b.w=startBox.w+dx;
      if(mode.includes('n')){b.y=startBox.y+dy;b.h=startBox.h-dy;}
      if(mode.includes('s'))b.h=startBox.h+dy;
    }
    cropClamp();
    renderCropBox();
  });
  ['pointerup','pointercancel'].forEach(ev=>wrap.addEventListener(ev,()=>{mode=null;}));
})();
function closeCropper(apply){
  document.getElementById('cropModal').classList.remove('open');
  if(!cropState)return;
  const {onDone,box:b,natW,dispW,natH,dispH}=cropState;
  cropState=null;
  if(!apply){onDone(null);return;}
  const scaleX=natW/dispW,scaleY=natH/dispH;
  const c=document.createElement('canvas');
  c.width=Math.round(b.w*scaleX);c.height=Math.round(b.h*scaleY);
  c.getContext('2d').drawImage(document.getElementById('cropImgEl'),
    b.x*scaleX,b.y*scaleY,b.w*scaleX,b.h*scaleY,0,0,c.width,c.height);
  onDone(c.toDataURL('image/jpeg',0.9));
}

/* ---------- Remarque / signaler un bug (envoi par mail) ---------- */
const FEEDBACK_EMAIL='marie.wagnerwagner@gmail.com';
let fbPhotoData='';
function pickFeedbackPhoto(){document.getElementById('fbPhotoPick').click();}
function onFeedbackPhotoPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  const img=new Image();
  img.onload=()=>{
    const maxH=520,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    fbPhotoData=c.toDataURL('image/jpeg',0.72);
    renderFeedbackPreview();
  };
  img.onerror=()=>toast('Image illisible 😕');
  img.src=URL.createObjectURL(f);
}
function removeFeedbackPhoto(){fbPhotoData='';renderFeedbackPreview();}
function renderFeedbackPreview(){
  document.getElementById('fbPhotoPreview').innerHTML=fbPhotoData
    ?`<div style="position:relative;display:inline-block;margin-top:8px">
        <img src="${fbPhotoData}" style="max-width:160px;border-radius:10px;display:block">
        <button onclick="removeFeedbackPhoto()" style="position:absolute;top:6px;right:6px;background:rgba(10,7,15,.75);color:#fff;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer">✕</button>
      </div>`:'';
}
/* mailto: n'accepte pas de pièce jointe — la photo est mise en ligne (comme une couverture)
   et son lien est inclus dans le corps du message. Sans connexion/compte, on prévient plutôt
   que d'essayer de glisser un base64 énorme dans une URL mailto (ça casserait le lien). */
async function sendFeedback(){
  const text=document.getElementById('fbText').value.trim();
  if(!text&&!fbPhotoData){toast('Écris un message ou ajoute une photo 🙂');return;}
  const btn=document.getElementById('fbSendBtn');
  btn.disabled=true;btn.textContent='⏳ Préparation…';
  let photoNote='';
  if(fbPhotoData){
    const uploaded=await uploadImage(fbPhotoData,'feedback');
    photoNote=/^https?:\/\//.test(uploaded)
      ?'\n\nPhoto : '+uploaded
      :'\n\n(Photo non jointe — connecte-toi pour pouvoir l\'envoyer)';
  }
  btn.disabled=false;btn.innerHTML='<span data-spr="mail" data-spr-size="20"><svg class="icn"><use href="#i-mail"/></svg></span> Envoyer par mail';
  applySpr(btn);
  const body=(text||'(pas de description)')+photoNote+'\n\n— Envoyé depuis Ma Bibli';
  const mailto='mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('Ma Bibli — Remarque / bug')+'&body='+encodeURIComponent(body);
  window.location.href=mailto;
  toast('Ton appli mail va s\'ouvrir avec le message prêt 📧');
  document.getElementById('fbText').value='';
  fbPhotoData='';renderFeedbackPreview();
}

/* ---------- Recherche de tranches en ligne (Openverse, sans clé) ---------- */
let sfTarget=null;
function sfMsgSet(t,cls){const m=document.getElementById('sfMsg');m.textContent=t;m.className='isbnmsg '+(cls||'');}
async function openSpineFind(kind,id){
  sfTarget={kind,id};
  document.getElementById('sfGrid').innerHTML='';
  document.getElementById('spineFindModal').classList.add('open');
  let titre,auteur;
  if(kind==='form'){
    titre=document.getElementById('f_titre').value.trim();
    auteur=document.getElementById('f_auteur').value.trim();
  }else{
    const b=db.books.find(x=>x.id===id);if(!b)return;
    titre=b.titre;auteur=b.auteur||'';
  }
  if(!titre){sfMsgSet('Renseigne d\'abord le titre du livre','err');return;}
  document.getElementById('sfCommQ').value=titre;
  document.getElementById('sfCommGrid').innerHTML='';
  document.getElementById('sfCommMsg').textContent='';document.getElementById('sfCommMsg').className='isbnmsg';
  searchCommunitySpines();
  document.getElementById('sfGoogle').href=
    'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(titre+' '+auteur+' tranche livre book spine');
  sfMsgSet('Recherche des tranches de « '+titre+' »…');
  const items=[],seen=new Set();
  /* Openverse : gratuit, sans clé */
  {
    for(const q of [titre+' '+auteur+' book spine',titre+' book spine']){
      try{
        const r=await fetch('https://api.openverse.org/v1/images/?q='+encodeURIComponent(q)+'&page_size=20');
        if(!r.ok)continue;
        const d=await r.json();
        (d.results||[]).forEach(it=>{
          if(!it.url||seen.has(it.url))return;seen.add(it.url);
          items.push({url:it.url,thumb:it.thumbnail||it.url,
            ratio:it.width?it.height/it.width:1});
        });
      }catch(e){}
      if(items.length>=8)break;
    }
  }
  if(!items.length){
    sfMsgSet('Aucune image trouvée automatiquement 😕 — utilise le bouton Google Images ci-dessous, ou la photo 📷','err');
    return;
  }
  /* les images les plus verticales (format tranche) d'abord */
  items.sort((a,b)=>b.ratio-a.ratio);
  document.getElementById('sfGrid').innerHTML=items.slice(0,14).map(it=>
    `<img src="${esc(it.thumb)}" data-u="${esc(it.url)}" loading="lazy"
      style="height:150px;width:auto;border-radius:6px;border:2px solid var(--line2);cursor:pointer"
      onclick="chooseSpine(this.dataset.u)" onerror="this.remove()">`).join('');
  sfMsgSet(Math.min(14,items.length)+' résultat(s) — touche la tranche qui correspond','ok');
}
function chooseSpine(url){
  if(!sfTarget)return;
  if(sfTarget.kind==='form'){
    document.getElementById('f_spine').value=url;
    formImgs.spine='';
    const m=document.getElementById('spMsg');
    if(m){m.textContent='✅ Tranche choisie en ligne';m.className='isbnmsg ok';}
  }else{
    const b=db.books.find(x=>x.id===sfTarget.id);
    if(b){b.spine=url;save();render();openInfo(b.id);}
  }
  document.getElementById('spineFindModal').classList.remove('open');
  toast('Tranche enregistrée ✅');
}
/* ---------- Tranches communautaires (Supabase : bibli_spines) ---------- */
function currentBookMeta(kind,id){
  if(kind==='form')return{
    titre:document.getElementById('f_titre').value.trim(),
    auteur:document.getElementById('f_auteur').value.trim(),
    isbn:isbnClean(document.getElementById('f_isbn').value)
  };
  const b=db.books.find(x=>x.id===id)||{};
  return{titre:b.titre||'',auteur:b.auteur||'',isbn:b.isbn||''};
}
async function contributeSpine(titre,auteur,isbn,url){
  if(!titre||!/^https?:\/\//.test(url))return;
  try{
    const c=await sbClient();
    if(!c||!sbUser)return;
    await c.from('bibli_spines').insert({user_id:sbUser.id,titre,auteur:auteur||'',isbn:isbn||'',url});
  }catch(e){}
}
async function searchCommunitySpines(){
  const q=document.getElementById('sfCommQ').value.trim();
  const grid=document.getElementById('sfCommGrid'),msg=document.getElementById('sfCommMsg');
  grid.innerHTML='';
  if(!q){msg.textContent='Tape un titre ou un auteur';msg.className='isbnmsg err';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.textContent='Connecte-toi (compte cloud, voir ⚙️) pour chercher dans la communauté';msg.className='isbnmsg err';return;}
  msg.textContent='Recherche dans la communauté…';msg.className='isbnmsg';
  try{
    const like='%'+q.replace(/[%_]/g,'\\$&')+'%';
    const[r1,r2]=await Promise.all([
      c.from('bibli_spines').select('*').ilike('titre',like).order('created_at',{ascending:false}).limit(24),
      c.from('bibli_spines').select('*').ilike('auteur',like).order('created_at',{ascending:false}).limit(24)
    ]);
    if(r1.error)throw r1.error;if(r2.error)throw r2.error;
    const seen=new Set();
    const items=[...(r1.data||[]),...(r2.data||[])].filter(it=>!seen.has(it.id)&&seen.add(it.id));
    if(!items.length){msg.textContent='Aucune tranche communautaire pour « '+q+' » 😕';msg.className='isbnmsg';return;}
    msg.textContent=items.length+' tranche(s) de la communauté — touche celle qui correspond';msg.className='isbnmsg ok';
    grid.innerHTML=items.map(it=>`<img src="${esc(it.url)}" data-u="${esc(it.url)}" loading="lazy"
      style="height:150px;width:auto;border-radius:6px;border:2px solid var(--accent);cursor:pointer"
      title="${esc(it.titre)}${it.auteur?' — '+esc(it.auteur):''}" onclick="chooseSpine(this.dataset.u)" onerror="this.remove()">`).join('');
  }catch(e){
    msg.textContent="⚠️ Impossible de charger la communauté — la table bibli_spines existe-t-elle ? (voir le script SQL fourni)";
    msg.className='isbnmsg err';
  }
}

/* ---------- Caméra tranche : détection + surlignage + recadrage auto ---------- */
let scStream=null,scTimer=null,scSpineTarget=null,scRange=null,scDataUrl=null;
const scCv=document.createElement('canvas');
function openSpineCam(target){
  scSpineTarget=target;scRange=null;scDataUrl=null;
  document.getElementById('scPreviewWrap').classList.add('hidden');
  document.getElementById('scShot').classList.remove('hidden');
  document.getElementById('scBox').style.display='none';
  document.getElementById('spineCamModal').classList.add('open');
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false})
    .then(st=>{
      scStream=st;
      const v=document.getElementById('scVideo');
      v.srcObject=st;v.play();
      scTimer=setInterval(scDetect,350);
    })
    .catch(()=>{closeSpineCam();toast("Impossible d'accéder à la caméra 😕");});
}
function scDetect(){
  const v=document.getElementById('scVideo');
  if(!v.videoWidth)return;
  const W=96,H=Math.max(32,Math.round(W*v.videoHeight/v.videoWidth));
  scCv.width=W;scCv.height=H;
  const cx=scCv.getContext('2d',{willReadFrequently:true});
  cx.drawImage(v,0,0,W,H);
  const d=cx.getImageData(0,0,W,H).data;
  /* énergie d'arête verticale par colonne */
  const col=new Float32Array(W);
  for(let y=2;y<H-2;y+=2){
    const row=y*W;
    for(let x=1;x<W-1;x++){
      const i=(row+x)*4;
      col[x]+=Math.abs((d[i+4]+d[i+5]+d[i+6])-(d[i-4]+d[i-3]+d[i-2]));
    }
  }
  const s=new Float32Array(W);
  let mean=0;
  for(let x=1;x<W-1;x++){s[x]=(col[x-1]+col[x]*2+col[x+1])/4;mean+=s[x];}
  mean/=(W-2);
  /* bord gauche = pic dans la moitié gauche, bord droit = pic dans la moitié droite */
  let l=0,lv=0,r=W-1,rv=0;
  for(let x=Math.floor(W*.02);x<W*.46;x++)if(s[x]>lv){lv=s[x];l=x;}
  for(let x=Math.ceil(W*.54);x<W*.98;x++)if(s[x]>rv){rv=s[x];r=x;}
  const conf=mean?Math.min(lv,rv)/mean:0;
  const box=document.getElementById('scBox'),msg=document.getElementById('scMsg');
  if(conf>1.8&&r-l>=W*.06){
    scRange={l:l/W,r:(r+1)/W};
    const vw=v.clientWidth,vh=v.clientHeight;
    box.style.display='block';
    box.style.left=(scRange.l*vw)+'px';
    box.style.top='0px';
    box.style.width=((scRange.r-scRange.l)*vw)+'px';
    box.style.height=vh+'px';
    msg.textContent='Tranche repérée ✅ — la photo sera recadrée dessus';
    msg.className='isbnmsg ok';
  }else{
    scRange=null;box.style.display='none';
    msg.textContent='Tiens le livre vertical, tranche centrée, fond contrasté';
    msg.className='isbnmsg';
  }
}
function spineShoot(){
  const v=document.getElementById('scVideo');
  if(!v.videoWidth)return;
  let sx=0,sw=v.videoWidth;
  if(scRange){
    sx=Math.floor(scRange.l*v.videoWidth);
    sw=Math.max(8,Math.ceil((scRange.r-scRange.l)*v.videoWidth));
  }
  const scale=Math.min(1,640/v.videoHeight);
  const c=document.createElement('canvas');
  c.width=Math.round(sw*scale);c.height=Math.round(v.videoHeight*scale);
  c.getContext('2d').drawImage(v,sx,0,sw,v.videoHeight,0,0,c.width,c.height);
  scDataUrl=c.toDataURL('image/jpeg',0.78);
  document.getElementById('scPreview').src=scDataUrl;
  document.getElementById('scPreviewWrap').classList.remove('hidden');
  document.getElementById('scShot').classList.add('hidden');
  document.getElementById('scMsg').textContent=scRange?'Recadrée sur la tranche repérée ✂️':'Pas de tranche repérée — image entière conservée';
  if(scTimer){clearInterval(scTimer);scTimer=null;}
  v.pause();
  if(navigator.vibrate)navigator.vibrate(60);
}
function spineRetake(){
  scDataUrl=null;
  document.getElementById('scPreviewWrap').classList.add('hidden');
  document.getElementById('scShot').classList.remove('hidden');
  const v=document.getElementById('scVideo');
  v.play();
  if(!scTimer)scTimer=setInterval(scDetect,350);
}
async function spineUse(){
  if(!scDataUrl||!scSpineTarget)return;
  scDataUrl=await uploadImage(scDataUrl,'spine');
  {const m=currentBookMeta(scSpineTarget.kind,scSpineTarget.id);contributeSpine(m.titre,m.auteur,m.isbn,scDataUrl);}
  if(scSpineTarget.kind==='form'){
    formImgs.spine=scDataUrl;
    const m=document.getElementById('spMsg');
    if(m){m.textContent='✅ Tranche capturée — sera utilisée à l\'enregistrement';m.className='isbnmsg ok';}
  }else{
    const b=db.books.find(x=>x.id===scSpineTarget.id);
    if(b){b.spine=scDataUrl;save();render();openInfo(b.id);}
  }
  closeSpineCam();
  toast('Tranche enregistrée ✅');
}
function closeSpineCam(){
  if(scTimer){clearInterval(scTimer);scTimer=null;}
  if(scStream){scStream.getTracks().forEach(t=>t.stop());scStream=null;}
  const v=document.getElementById('scVideo');if(v)v.srcObject=null;
  document.getElementById('spineCamModal').classList.remove('open');
}

/* ---------- Fiche info livre ---------- */
function openInfo(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  const[sl,sc]=STATUT[b.statut];
  const rows=[
    ['Format',FMT[fmt(b)]],
    ['Genre',b.genre],
    ['Langue',b.langue],
    ['Pages',b.pages?b.pages+' p.':''],
    ['Date de parution',b.dateParution?fmtDateFr(b.dateParution)+(isUpcoming(b)?' — 🔜 pas encore sorti':''):''],
    ['ISBN',b.isbn],
    ['Saga',b.saga?b.saga+(b.tome?' — Tome '+b.tome:''):''],
    ['Lu',b.statut==='done'&&b.relectures?(1+b.relectures)+' fois':''],
    ['FMC',b.fmc],
    ['MMC',b.mmc],
    ['Tropes',b.tropes],
    [b.statut==='reading'?'Avancement':'',b.statut==='reading'?(fmt(b)==='papier'&&b.pages?'p. '+(b.pageActuelle||0)+'/'+b.pages+' ('+(b.progression||0)+' %)':(b.progression||0)+' %'):''],
    [b.statut==='dnf'?'Abandonné le':'Terminé le',b.dateFin?new Date(b.dateFin+'T12:00:00').toLocaleDateString('fr-FR'):((b.statut==='done'||b.statut==='dnf')?'Il y a longtemps 🕰':'')],
    ['Arrêté à',b.statut==='dnf'&&b.progression?b.progression+' %':''],
    ['Recommander ?',b.recommande===true?'👍 Oui':(b.recommande===false?'👎 Non':'')],
    ['Smut',b.smut?'🌶'.repeat(b.smut):''],
  ].filter(([l,v])=>l&&v);
  const sn=b.sousNotes||{};
  const subHtml=SUBCATS.filter(([k])=>sn[k]>0).map(([k,l])=>
    `<div class="inforow"><span>${l}</span><b class="stars">${'★'.repeat(sn[k])}${'☆'.repeat(5-sn[k])}</b></div>`).join('');
  const spineImg=b.spine
    ?`<img class="spineimg" src="${esc(b.spine)}" onerror="imgFallback(this,'spineimg ph','book')">`
    :`<div class="spinefake" style="background:${spineColor(b.id)};width:30px;height:118px;margin:0 auto">${esc(b.titre)}</div>`;
  document.getElementById('infoBody').innerHTML=`
    <div style="margin-bottom:12px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div class="imgcol">
          ${coverEl(b.couverture,'lg')}
          <div class="btns">
            <button class="smallbtn" title="Depuis l'appareil" onclick="pickImage('${id}','couverture',false)">${icSvg('image')}</button>
            <button class="smallbtn" title="Prendre une photo" onclick="pickImage('${id}','couverture',true)">${icSvg('camera')}</button>
            ${b.couverture?`<button class="smallbtn" title="Rogner à nouveau" onclick="reRognerBookImage('${id}','couverture')">${icSvg('rogner')}</button>`:''}
          </div>
          <div class="lbl">Couverture</div>
        </div>
        <div class="imgcol">
          ${spineImg}
          <div class="btns">
            <button class="smallbtn" title="Depuis l'appareil" onclick="pickImage('${id}','spine',false)">${icSvg('image')}</button>
            <button class="smallbtn" title="Prendre une photo" onclick="pickImage('${id}','spine',true)">${icSvg('camera')}</button>
            ${b.spine?`<button class="smallbtn" title="Rogner à nouveau" onclick="reRognerBookImage('${id}','spine')">${icSvg('rogner')}</button>`:''}
          </div>
          <div class="btns" style="margin-top:4px">
            <button class="smallbtn" title="Chercher en ligne" onclick="openSpineFind('book','${id}')">🔍</button>
          </div>
          <div class="lbl">Tranche</div>
        </div>
      </div>
      <div style="margin-top:12px">
        <h2 style="margin:0 0 4px">${esc(b.titre)}</h2>
        <div class="auth" style="color:var(--txt2);margin-bottom:8px">${esc(b.auteur)||'—'}</div>
        <span class="badge ${sc}">${sl}</span>
        ${(b.statut==='done'||b.statut==='dnf')&&b.note?`<div class="stars" style="margin-top:8px;font-size:1.1rem">${'★'.repeat(b.note)}${'☆'.repeat(5-b.note)}</div>`:''}
      </div>
    </div>
    ${b.statut==='done'?`<button class="btn ghost" style="margin:4px 0 10px" onclick="rereadBook('${b.id}')">${icSvg('retry')} J'ai relu ce livre${b.relectures?' — déjà '+(1+b.relectures)+' lectures':''}</button>`:''}
    ${rows.map(([l,v])=>`<div class="inforow"><span>${l}</span><b>${esc(String(v))}</b></div>`).join('')}
    ${subHtml?`<div style="margin-top:12px;font-weight:700;font-size:.85rem;color:var(--txt2);text-transform:uppercase;letter-spacing:.5px">Notes détaillées</div>${subHtml}`:''}
    ${b.synopsis?`<details style="margin-top:12px;font-size:.9rem;line-height:1.5"><summary style="color:var(--txt2);cursor:pointer;font-weight:700">${icSvg('summary')} Résumé du livre</summary><div style="margin-top:6px">${esc(b.synopsis)}</div></details>`:''}
    ${b.resume?`<div style="margin-top:12px;font-size:.9rem;line-height:1.5"><span style="color:var(--txt2)">Mon résumé :</span><br>${esc(b.resume)}</div>`:''}
    ${b.finNote?`<details style="margin-top:12px;font-size:.9rem;line-height:1.5"><summary style="color:var(--gold);cursor:pointer;font-weight:700">${icSvg('warning')} La fin (spoilers)</summary><div style="margin-top:6px">${esc(b.finNote)}</div></details>`:''}
    ${b.avis?`<div style="margin-top:12px;font-size:.9rem;line-height:1.5"><span style="color:var(--txt2)">Commentaires :</span><br>${esc(b.avis)}</div>`:''}
    <div style="margin-top:14px">
      <span style="color:var(--txt2);font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Citations</span>
      ${(b.citations||[]).map((q,i)=>`<div class="mile" style="cursor:pointer" onclick="delCitation('${b.id}',${i})"><span class="name" style="font-style:italic">“${esc(q)}”</span></div>`).join('')}
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
        <button class="smallbtn" onclick="addCitation('${b.id}')">＋ Ajouter une citation</button>
        <button class="smallbtn" onclick="ocrCitation('${b.id}')">${icSvg('camera')} Depuis une photo</button>
      </div>
    </div>`;
  document.getElementById('infoEditBtn').onclick=()=>{closeModals();openEdit(id);};
  document.getElementById('infoModal').classList.add('open');
}
function addCitation(id){
  askText('Ta citation','',t=>{
    if(!t)return;
    const b=db.books.find(x=>x.id===id);if(!b)return;
    b.citations=b.citations||[];b.citations.push(t);
    save();openInfo(id);
  });
}
function delCitation(id,i){
  askConfirm('Supprimer cette citation ?',()=>{
    const b=db.books.find(x=>x.id===id);if(!b)return;
    b.citations.splice(i,1);save();openInfo(id);
  },'Supprimer');
}
function rereadBook(id){
  const b=db.books.find(x=>x.id===id);if(!b)return;
  b.relectures=(b.relectures||0)+1;
  save();confetti();openInfo(id);
  toast('Relecture n°'+(1+b.relectures)+' notée 🎉');
}
/* Citation depuis une photo (OCR Gemini) */
let quoteBookId=null;
function ocrCitation(id){
  if(!gemKey){toast('Ajoute ta clé Gemini dans ⚙️ pour l\'OCR');return;}
  quoteBookId=id;
  document.getElementById('quotePick').click();
}
function onQuotePicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f||!quoteBookId)return;
  toast('⏳ Lecture de la citation…');
  const img=new Image();
  img.onload=async()=>{
    const maxH=1400,sc=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    const b64=c.toDataURL('image/jpeg',0.82).split(',')[1];
    try{
      const txt=await gemVision('Transcris exactement le passage surligné ou principal de cette page de livre, sans rien ajouter. Réponds uniquement avec le texte.',b64,false);
      askText('Citation transcrite — corrige si besoin',txt,t=>{
        if(!t)return;
        const b=db.books.find(x=>x.id===quoteBookId);if(!b)return;
        b.citations=b.citations||[];b.citations.push(t);
        save();openInfo(quoteBookId);
      });
    }catch(e){toast('Transcription impossible 😕 — réessaie avec une photo plus nette');}
  };
  img.src=URL.createObjectURL(f);
}

/* ---------- Étagères virtuelles ---------- */
const spineColor=id=>COLORS[[...(id||'x')].reduce((s,c)=>s+c.charCodeAt(0),0)%COLORS.length];
const spineW=b=>Math.max(20,Math.min(42,Math.round(thickness(b)*9)));
function standEl(b,mode){
  if(mode==='cover'){
    if(b.couverture)return `<img class="standcover" src="${esc(b.couverture)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spinefake',style:'background:${spineColor(b.id)};width:90px',textContent:'${esc(b.titre).replace(/'/g,'’')}'}))">`;
    return `<div class="spinefake" style="background:${spineColor(b.id)};width:90px">${esc(b.titre)}</div>`;
  }
  const w=spineW(b);
  if(b.spine)return `<img class="spinebook" src="${esc(b.spine)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'spinefake',style:'background:${spineColor(b.id)};width:${w}px',textContent:'${esc(b.titre).replace(/'/g,'’')}'}))">`;
  return `<div class="spinefake" style="background:${spineColor(b.id)};width:${w}px">${esc(b.titre)}</div>`;
}
function pileEl(b){
  if(b.spine)return `<div class="pilebook"><img src="${esc(b.spine)}" loading="lazy"></div>`;
  return `<div class="pilefake" style="background:${spineColor(b.id)}">${esc(b.titre)}</div>`;
}
function shelfVisual(s,preview){
  const groups=[];let pile=null;
  shelfEffItems(s).forEach(it=>{
    if(it.divider){pile=null;groups.push({divider:true,w:26,row:it.row||null});return;}
    const b=db.books.find(x=>x.id===it.bookId);if(!b)return;
    if(it.mode==='pile'){
      if(!pile){pile={pile:true,books:[],w:118,row:it.row||null};groups.push(pile);}
      pile.books.push(b);
    }else{pile=null;groups.push({pile:false,b,mode:it.mode,w:(it.mode==='cover'?96:spineW(b)+5),row:it.row||null});}
  });
  if(!groups.length)
    return `<div class="shelfviz"><div class="shelfinner">
      <div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Étagère vide — appuie sur Modifier pour y ranger des livres.</div></div>
      <div class="board"></div></div></div>`;
  /* placement : étage imposé si précisé, sinon à la suite avec passage
     à l'étage suivant quand il n'y a plus de place */
  const nRows=Math.max(1,Math.min(8,s.rows||1));
  const holder=document.getElementById('shelfList')||document.getElementById('libShelfMode');
  const cap=Math.max(240,((holder&&holder.clientWidth)||window.innerWidth-32)-44);
  const rows=Array.from({length:nRows},()=>({w:0,els:[]}));
  groups.forEach(g=>{
    if(g.row){
      const r=rows[Math.min(nRows,Math.max(1,g.row))-1];
      r.els.push(g);r.w+=g.w;
    }
  });
  let cur=0;
  groups.forEach(g=>{
    if(g.row)return;
    while(cur<nRows-1&&rows[cur].w+g.w>cap)cur++;
    rows[cur].els.push(g);rows[cur].w+=g.w;
  });
  const click=(b,html)=>preview
    ?`<div style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">${html}</div>`
    :`<div style="cursor:pointer" onclick="openInfo('${b.id}')">${html}</div>`;
  const rowsHtml=rows.map(row=>{
    const inner=row.els.map(g=>{
      if(g.divider)return `<div class="libDivider"></div>`;
      return g.pile
        ?`<div class="pilestack">${g.books.map(b=>click(b,pileEl(b))).join('')}</div>`
        :click(g.b,standEl(g.b,g.mode));
    }).join('');
    return `<div class="shelfrow">${inner}</div><div class="board"></div>`;
  }).join('');
  return `<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
function renderShelves(){
  const el=document.getElementById('shelfList');
  /* Étagère de base : la PAL (automatique, toujours à jour) */
  const tbr=db.books.filter(b=>b.statut==='tbr');
  const pal={nom:'Ma PAL',rows:1,items:tbr.map(b=>({bookId:b.id,mode:'spine'}))};
  let html=`<div class="shelfcard">
    <div class="shelfhead"><h3>${icSvg('pile')} Ma PAL (${tbr.length})</h3>
    <span style="font-size:.72rem;color:var(--txt2)">automatique</span></div>
    ${shelfVisual(pal)}</div>`;
  html+=db.shelves.map((s,i)=>`<div class="shelfcard" data-i="${i}">
    <div class="shelfhead"><div style="display:flex;align-items:center;gap:4px;min-width:0"><span class="drag">⠿</span><h3 style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.nom)} <span style="font-size:.68rem;color:${s.source&&s.source.length?'var(--accent)':'var(--txt2)'};font-weight:700;display:inline-flex;align-items:center;gap:2px">${s.source&&s.source.length?icSvg('lock')+' auto':icSvg('unlock')+' libre'}</span></h3></div>
    <button class="smallbtn" style="flex:none" onclick="openShelfEdit('${s.id}')">${icSvg('pencil')} Modifier</button></div>
    ${shelfVisual(s)}</div>`).join('');
  if(!db.shelves.length)
    html+=`<div class="empty">Crée tes propres étagères avec <b>+</b>, ou depuis tes sagas avec le bouton ci-dessus.</div>`;
  el.innerHTML=html;
  if(db.shelves.length>1)makeSortable(el,order=>{
    db.shelves=order.map(i=>db.shelves[i]).filter(Boolean);
    save();renderShelves();
  },'.shelfcard[data-i]');
}
/* Étagère liée (sagas et/ou parutions à venir, mise à jour automatique) */
function upcomingBooks(){
  return db.books.filter(isUpcoming).sort((a,b)=>a.dateParution<b.dateParution?-1:1);
}
function shelfEffItems(s){
  if(!s.source||!s.source.length)return s.items||[];
  const ids=[],seen=new Set();
  s.source.forEach(src=>{
    const list=src.type==='saga'
      ?sagaBooks(src.id).map(b=>b.id)
      :upcomingBooks().map(b=>b.id);
    list.forEach(id=>{
      if(!seen.has(id)&&db.books.some(b=>b.id===id)){seen.add(id);ids.push(id);}
    });
  });
  const ov=s.overrides||{};
  return ids.map(id=>({bookId:id,mode:(ov[id]&&ov[id].mode)||'spine',row:(ov[id]&&ov[id].row)||null}));
}
function shelfSourceLabel(s){
  return (s.source||[]).map(x=>x.type==='saga'?x.id:'À paraître').join(' + ');
}
let sfcSel=new Set();
function openShelfFromCols(){
  if(!sagaNames().length&&!upcomingBooks().length){toast('Renseigne des sagas, ou ajoute une date de parution à un livre 🗂');return;}
  sfcSel=new Set();
  renderSfc();
  document.getElementById('shelfColsModal').classList.add('open');
}
function sfcToggle(k){sfcSel.has(k)?sfcSel.delete(k):sfcSel.add(k);renderSfc();}
function renderSfc(){
  const up=upcomingBooks();
  document.getElementById('sfcPick').innerHTML=
    (up.length?`<div class="chip ${sfcSel.has('upcoming|upcoming')?'active':''}" onclick="sfcToggle(this.dataset.k)" data-k="upcoming|upcoming">${icSvg('soon')} Livres à paraître (${up.length})</div>`:'')+
    sagaNames().map(n=>{
      const k='saga|'+n;
      return `<div class="chip ${sfcSel.has(k)?'active':''}" onclick="sfcToggle(this.dataset.k)" data-k="${esc(k)}">${esc(n)} (${sagaBooks(n).length} t.)</div>`;
    }).join('');
}
function createShelfFromCols(){
  if(!sfcSel.size){toast('Choisis au moins une saga');return;}
  const source=[...sfcSel].map(k=>{
    const i=k.indexOf('|');
    return {type:k.slice(0,i),id:k.slice(i+1)};
  });
  const s={id:uid(),nom:shelfSourceLabel({source}),rows:1,items:[],source,overrides:{}};
  db.shelves.push(s);save();
  closeModals();render();
  openShelfEdit(s.id);
}
/* Éditeur */
let shelfId=null,shelfItemsW=[],shelfSourcesW=[];
function newShelf(){
  askText("Nom de l'étagère",'',nom=>{
    if(!nom)return;
    const s={id:uid(),nom,items:[]};
    db.shelves.push(s);save();renderShelves();
    openShelfEdit(s.id);
  });
}
function openShelfEdit(id){
  const s=db.shelves.find(x=>x.id===id);if(!s)return;
  shelfId=id;
  const linked=!!(s.source&&s.source.length);
  document.getElementById('s_nom').value=s.nom;
  document.getElementById('s_rows').value=s.rows||1;
  shelfSourcesW=linked?s.source.map(x=>({...x})):[];
  shelfItemsW=shelfEffItems(s).map(x=>({...x}));
  document.getElementById('shelfSearch').value='';
  ['shelfAddStatus','shelfAddGenre','shelfAddSaga'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('shelfLinkMsg').innerHTML=linked
    ?icSvg('lock')+' Liée à des sagas — les livres se mettent à jour automatiquement (mode et étage restent réglables)':'';
  document.getElementById('shelfUnlinkBtn').classList.toggle('hidden',!linked);
  document.getElementById('shelfSourcesWrap').classList.toggle('hidden',!linked);
  document.getElementById('shelfAddWrap').classList.toggle('hidden',linked);
  if(linked)renderShelfSources();
  /* Le modal doit être ouvert (donc mis en page) AVANT renderShelfEditViz(), qui mesure
     clientWidth pour la largeur disponible — sinon la mesure vaut 0 (display:none). */
  document.getElementById('shelfModal').classList.add('open');
  renderShelfEditViz();renderShelfAdd();
}
function shelfSourceLabel2(src){
  return src.type==='saga'?src.id+' ('+sagaBooks(src.id).length+' t.)':'🔜 Livres à paraître ('+upcomingBooks().length+')';
}
function shelfSourcesEffItems(sources){
  const ids=[],seen=new Set();
  sources.forEach(src=>{
    const list=src.type==='saga'?sagaBooks(src.id).map(b=>b.id):upcomingBooks().map(b=>b.id);
    list.forEach(id=>{if(!seen.has(id)&&db.books.some(b=>b.id===id)){seen.add(id);ids.push(id);}});
  });
  return ids;
}
function refreshLinkedShelfItems(){
  const ids=shelfSourcesEffItems(shelfSourcesW);
  const prev={};shelfItemsW.forEach(it=>{prev[it.bookId]={mode:it.mode,row:it.row};});
  shelfItemsW=ids.map(id=>({bookId:id,mode:(prev[id]&&prev[id].mode)||'spine',row:(prev[id]&&prev[id].row)||null}));
  renderShelfEditViz();
}
function renderShelfSources(){
  const wrap=document.getElementById('shelfSourcesEl');
  wrap.innerHTML=shelfSourcesW.map((src,i)=>
    `<div class="sitem" data-i="${i}"><span class="drag">⠿</span>
      <span class="nm">${esc(shelfSourceLabel2(src))}</span>
      <button style="color:var(--red)" onclick="shelfSourceRemove(${i})">✕</button></div>`
  ).join('')||'<div class="isbnmsg">Aucune saga liée.</div>';
  makeSortable(wrap,order=>{
    shelfSourcesW=order.map(i=>shelfSourcesW[i]).filter(Boolean);
    renderShelfSources();refreshLinkedShelfItems();
  });
  renderShelfSourceAdd();
}
function renderShelfSourceAdd(){
  const wrap=document.getElementById('shelfSourceAddEl');
  const usedKeys=new Set(shelfSourcesW.map(s=>s.type+'|'+s.id));
  const up=upcomingBooks();
  const options=[];
  if(up.length&&!usedKeys.has('upcoming|upcoming'))options.push({k:'upcoming|upcoming',label:'🔜 Livres à paraître ('+up.length+')'});
  sagaNames().forEach(n=>{
    const k='saga|'+n;
    if(!usedKeys.has(k))options.push({k,label:n+' ('+sagaBooks(n).length+' t.)'});
  });
  wrap.innerHTML=options.length?options.map(o=>
    `<div class="chip" onclick="shelfSourceAdd(this.dataset.k)" data-k="${esc(o.k)}">${esc(o.label)}</div>`
  ).join(''):'<div class="isbnmsg">Toutes les sagas disponibles sont déjà liées.</div>';
}
function shelfSourceAdd(k){
  const i=k.indexOf('|');
  shelfSourcesW.push({type:k.slice(0,i),id:k.slice(i+1)});
  renderShelfSources();refreshLinkedShelfItems();
}
function shelfSourceRemove(i){
  if(shelfSourcesW.length<=1){toast('Il faut garder au moins une saga liée — utilise « Délier » pour détacher complètement.');return;}
  shelfSourcesW.splice(i,1);
  renderShelfSources();refreshLinkedShelfItems();
}
/* Éditeur visuel : mêmes rendus (tranche/couverture/pile) que l'étagère affichée, mais chaque
   livre est tapable (change de mode) et glissable (change de position / étage) au lieu d'ouvrir
   sa fiche. Regroupe les items 'pile' consécutifs en pile, comme shelfVisual(). */
function shelfEditGroups(){
  const groups=[];let pile=null;
  shelfItemsW.forEach((it,i)=>{
    const b=db.books.find(x=>x.id===it.bookId);if(!b)return;
    if(it.mode==='pile'){
      if(!pile){pile={pile:true,entries:[],w:118,row:it.row||null};groups.push(pile);}
      pile.entries.push({b,i});
    }else{
      pile=null;
      groups.push({pile:false,b,i,mode:it.mode,w:(it.mode==='cover'?96:spineW(b)+5),row:it.row||null});
    }
  });
  return groups;
}
function layoutShelfRows(groups,nRows,cap){
  const rows=Array.from({length:nRows},()=>({w:0,els:[]}));
  groups.forEach(g=>{
    if(g.row){const r=rows[Math.min(nRows,Math.max(1,g.row))-1];r.els.push(g);r.w+=g.w;}
  });
  let cur=0;
  groups.forEach(g=>{
    if(g.row)return;
    while(cur<nRows-1&&rows[cur].w+g.w>cap)cur++;
    rows[cur].els.push(g);rows[cur].w+=g.w;
  });
  return rows;
}
function renderShelfEditViz(dragBookId){
  const wrap=document.getElementById('shelfEditViz');
  if(!wrap)return;
  const s=db.shelves.find(x=>x.id===shelfId);
  const linked=!!(s&&s.source&&s.source.length);
  const groups=shelfEditGroups();
  if(!groups.length){
    wrap.innerHTML='<div class="shelfviz"><div class="shelfinner"><div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Aucun livre pour l\'instant — ajoute-en un ci-dessous.</div></div><div class="board"></div></div></div>';
    return;
  }
  const nRows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
  const cap=Math.max(240,(wrap.clientWidth||window.innerWidth-32)-44);
  const rows=layoutShelfRows(groups,nRows,cap);
  const delBadge=i=>linked?'':`<button class="slotDel" onclick="event.stopPropagation();shelfRemove(${i})">✕</button>`;
  /* Pendant un glisser, le livre déplacé s'affiche comme un espace vide à sa position
     actuelle (le livre lui-même suit le doigt via le "ghost" flottant) — pour voir en direct
     où il atterrirait et le trou qu'il laisse, sans attendre de lâcher. */
  const slot=(i,html,w,h)=>{
    if(dragBookId&&shelfItemsW[i]&&shelfItemsW[i].bookId===dragBookId){
      const dim=(w?`width:${w}px;`:'')+(h?`height:${h}px;`:'');
      return `<div class="shelfSlot shelfPlaceholder" data-i="${i}" style="${dim}"></div>`;
    }
    return `<div class="shelfSlot" data-i="${i}" onclick="shelfSlotTap(${i})">${html}${delBadge(i)}</div>`;
  };
  const rowsHtml=rows.map((row,rIdx)=>{
    const inner=row.els.map(g=>g.pile
      ?`<div class="pilestack">${g.entries.map(e=>slot(e.i,pileEl(e.b),112,24)).join('')}</div>`
      :slot(g.i,standEl(g.b,g.mode),g.w,138)).join('');
    return `<div class="shelfrow" data-row="${rIdx+1}">${inner}</div><div class="board"></div>`;
  }).join('');
  wrap.innerHTML=`<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
function shelfSlotTap(i){
  const modes=['spine','cover','pile'];
  shelfItemsW[i].mode=modes[(modes.indexOf(shelfItemsW[i].mode)+1)%3];
  renderShelfEditViz();
}
function shelfRemove(i){shelfItemsW.splice(i,1);renderShelfEditViz();renderShelfAdd();}
/* Glisser un livre : shelfItemsW est réordonné EN DIRECT pendant le glisser (pas seulement au
   lâcher), avec un espace vide à la position actuelle du livre déplacé — le livre lui-même
   continue de suivre le doigt via le "ghost" flottant. Lâché hors de la zone d'étagère →
   annulé, on restaure l'ordre d'avant le glisser (pas de suppression accidentelle, on garde ça
   pour le bouton ✕ explicite). Un simple tap (peu de mouvement) reste géré par le onclick du slot. */
(function(){
  let dragging=null,movedFar=false,ghostEl=null,origSnapshot=null,lastKey=null;
  const THRESH=8;
  function wrap(){return document.getElementById('shelfEditViz');}
  function startGhost(slot,clientX,clientY){
    const r=slot.getBoundingClientRect();
    ghostEl=slot.cloneNode(true);
    const del=ghostEl.querySelector('.slotDel');if(del)del.remove();
    ghostEl.classList.add('shelfGhost');
    ghostEl.style.width=r.width+'px';ghostEl.style.height=r.height+'px';
    ghostEl.dataset.offX=clientX-r.left;ghostEl.dataset.offY=clientY-r.top;
    ghostEl.style.left=r.left+'px';ghostEl.style.top=r.top+'px';
    document.body.appendChild(ghostEl);
  }
  function moveGhost(clientX,clientY){
    if(!ghostEl)return;
    ghostEl.style.left=(clientX-ghostEl.dataset.offX)+'px';
    ghostEl.style.top=(clientY-ghostEl.dataset.offY)+'px';
  }
  function removeGhost(){if(ghostEl){ghostEl.remove();ghostEl=null;}}
  document.addEventListener('pointerdown',e=>{
    const w=wrap();if(!w||!w.contains(e.target))return;
    const slot=e.target.closest('.shelfSlot');
    if(!slot||e.target.closest('.slotDel'))return;
    const i=+slot.dataset.i;
    dragging={bookId:shelfItemsW[i].bookId,startX:e.clientX,startY:e.clientY,el:slot,dropRow:null};
    movedFar=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-dragging.startX,dy=e.clientY-dragging.startY;
    if(!movedFar){
      if(Math.hypot(dx,dy)<THRESH)return;
      movedFar=true;
      origSnapshot=shelfItemsW.map(it=>({...it}));
      startGhost(dragging.el,e.clientX,e.clientY);
      renderShelfEditViz(dragging.bookId);
    }
    e.preventDefault();
    moveGhost(e.clientX,e.clientY);
    const overEl=document.elementFromPoint(e.clientX,e.clientY);
    const overSlot=overEl&&overEl.closest('.shelfSlot');
    if(overSlot){
      const r=overSlot.getBoundingClientRect();
      const before=e.clientX<r.left+r.width/2;
      const rowEl=overSlot.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      const targetIdx=+overSlot.dataset.i;
      const key=targetIdx+':'+(before?'b':'a');
      if(key!==lastKey){
        lastKey=key;
        const curIdx=shelfItemsW.findIndex(it=>it.bookId===dragging.bookId);
        if(curIdx!==-1&&curIdx!==targetIdx){
          const item=shelfItemsW[curIdx];
          shelfItemsW.splice(curIdx,1);
          let insertAt=targetIdx;
          if(targetIdx>curIdx)insertAt--;
          insertAt=before?insertAt:insertAt+1;
          shelfItemsW.splice(insertAt,0,item);
          renderShelfEditViz(dragging.bookId);
        }
      }
    }else{
      const rowEl=overEl&&overEl.closest&&overEl.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      lastKey=null;
    }
  });
  function finish(e){
    if(!dragging)return;
    removeGhost();
    if(movedFar){
      const w=wrap();
      const r=w&&w.getBoundingClientRect();
      const inside=r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      if(inside)finalizeShelfDrag(dragging.bookId,dragging.dropRow);
      else{shelfItemsW=origSnapshot;renderShelfEditViz();} /* lâché hors zone : annule, on restaure l'ordre d'avant */
    }
    dragging=null;movedFar=false;origSnapshot=null;lastKey=null;
  }
  document.addEventListener('pointerup',finish);
  document.addEventListener('pointercancel',finish);
})();
function finalizeShelfDrag(bookId,dropRow){
  const item=shelfItemsW.find(it=>it.bookId===bookId);
  const targetRow=dropRow||null;
  if(item)item.row=targetRow;
  /* Un livre à étage fixé se place toujours avant les livres à "Auto" dans sa rangée (voir
     layoutShelfRows) : sans ça, déposer un livre "après" un autre dans une rangée encore en
     mode auto le ferait sauter en tête de rangée au lieu de rester où on l'a lâché. On fixe
     donc explicitement l'étage de TOUS les livres de la rangée cible, d'après l'agencement
     actuel — l'ordre visuel affiché pendant le glisser devient alors permanent. */
  if(targetRow){
    const wrap=document.getElementById('shelfEditViz');
    const nRows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
    const cap=Math.max(240,((wrap&&wrap.clientWidth)||window.innerWidth-32)-44);
    const rows=layoutShelfRows(shelfEditGroups(),nRows,cap);
    const rowOfIndex=new Map();
    rows.forEach((row,rIdx)=>row.els.forEach(g=>{
      if(g.pile)g.entries.forEach(e=>rowOfIndex.set(e.i,rIdx+1));
      else rowOfIndex.set(g.i,rIdx+1);
    }));
    shelfItemsW.forEach((it,i)=>{if(rowOfIndex.has(i))it.row=rowOfIndex.get(i);});
  }
  renderShelfEditViz();
}
function renderShelfAdd(){
  fillFilterSelects('shelfAddStatus','shelfAddGenre','shelfAddSaga');
  const q=document.getElementById('shelfSearch').value.toLowerCase().trim();
  const used=new Set(shelfItemsW.map(x=>x.bookId));
  const list=db.books.filter(b=>!used.has(b.id)&&(!q||bookMatch(b,q))&&pickerMatch(b,'shelfAddStatus','shelfAddGenre','shelfAddSaga')).slice(0,12);
  document.getElementById('shelfAddEl').innerHTML=list.map(b=>
    `<div class="sitem">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}</span>
     <button style="color:var(--green)" onclick="shelfAddBook('${b.id}')">＋ Ajouter</button></div>`).join('')
    ||'<div class="isbnmsg">Aucun résultat.</div>';
}
function shelfAddBook(id){shelfItemsW.push({bookId:id,mode:'spine'});renderShelfEditViz();renderShelfAdd();}
function saveShelf(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  const nom=document.getElementById('s_nom').value.trim();
  if(nom)s.nom=nom;
  s.rows=Math.max(1,Math.min(8,+document.getElementById('s_rows').value||1));
  if(s.source&&s.source.length){
    s.source=shelfSourcesW;
    s.overrides={};
    shelfItemsW.forEach(it=>{
      if(it.mode!=='spine'||it.row)s.overrides[it.bookId]={mode:it.mode,row:it.row||null};
    });
  }else{
    s.items=shelfItemsW;
  }
  save();closeModals();render();
}
function shelfUnlink(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  s.items=shelfEffItems(s);
  delete s.source;delete s.overrides;
  save();
  toast('Étagère déliée — la liste est figée et modifiable librement');
  openShelfEdit(s.id);
}
function deleteShelf(){
  const s=db.shelves.find(x=>x.id===shelfId);if(!s)return;
  askConfirm('Supprimer l\'étagère « '+s.nom+' » ? Les livres ne seront pas supprimés.',()=>{
    db.shelves=db.shelves.filter(x=>x.id!==shelfId);
    save();closeModals();render();
  },'Supprimer');
}

/* ---------- Édition de la Bibliothèque (Bibli → vue Bibliothèque) ----------
   Même principe visuel que l'éditeur d'étagère (glisser pour repositionner/changer d'étage,
   taper pour changer tranche/couverture/pile), mais sur libItemsW au lieu de shelfItemsW : pas
   d'ajout/retrait de livre (la bibliothèque contient toujours tous les livres), et on peut en
   plus insérer des séparations en bois (repérées par un id propre, pas par bookId). */
let libItemsW=[];
function openLibEdit(){
  libItemsW=libEffItems().map(x=>({...x}));
  document.getElementById('lib_rows').value=(db.settings.libLayout&&db.settings.libLayout.rows)||8;
  document.getElementById('libEditModal').classList.add('open');
  renderLibEditViz();
}
function libItemKey(it){return it.divider?'d:'+it.id:'b:'+it.bookId;}
function libEditGroups(){
  const groups=[];let pile=null;
  libItemsW.forEach((it,i)=>{
    if(it.divider){pile=null;groups.push({divider:true,i,w:26,row:it.row||null});return;}
    const b=db.books.find(x=>x.id===it.bookId);if(!b)return;
    if(it.mode==='pile'){
      if(!pile){pile={pile:true,entries:[],w:118,row:it.row||null};groups.push(pile);}
      pile.entries.push({b,i});
    }else{
      pile=null;
      groups.push({pile:false,b,i,mode:it.mode,w:(it.mode==='cover'?96:spineW(b)+5),row:it.row||null});
    }
  });
  return groups;
}
function renderLibEditViz(dragKey){
  const wrap=document.getElementById('libEditViz');
  if(!wrap)return;
  const groups=libEditGroups();
  if(!groups.length){
    wrap.innerHTML='<div class="shelfviz"><div class="shelfinner"><div class="shelfrow"><div style="color:var(--txt2);font-size:.85rem;align-self:center;padding:0 10px">Aucun livre.</div></div><div class="board"></div></div></div>';
    return;
  }
  const nRows=Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1));
  const cap=Math.max(240,(wrap.clientWidth||window.innerWidth-32)-44);
  const rows=layoutShelfRows(groups,nRows,cap);
  const slot=(i,html,w,h,removable)=>{
    if(dragKey&&libItemsW[i]&&libItemKey(libItemsW[i])===dragKey){
      const dim=(w?`width:${w}px;`:'')+(h?`height:${h}px;`:'');
      return `<div class="shelfSlot shelfPlaceholder" data-li="${i}" style="${dim}"></div>`;
    }
    const del=removable?`<button class="slotDel" onclick="event.stopPropagation();libRemoveAt(${i})">✕</button>`:'';
    return `<div class="shelfSlot" data-li="${i}" onclick="libSlotTap(${i})">${html}${del}</div>`;
  };
  const rowsHtml=rows.map((row,rIdx)=>{
    const inner=row.els.map(g=>{
      if(g.divider)return slot(g.i,'<div class="libDivider"></div>',26,138,true);
      return g.pile
        ?`<div class="pilestack">${g.entries.map(e=>slot(e.i,pileEl(e.b),112,24,false)).join('')}</div>`
        :slot(g.i,standEl(g.b,g.mode),g.w,138,false);
    }).join('');
    return `<div class="shelfrow" data-row="${rIdx+1}">${inner}</div><div class="board"></div>`;
  }).join('');
  wrap.innerHTML=`<div class="shelfviz"><div class="shelfinner">${rowsHtml}</div></div>`;
}
function libSlotTap(i){
  if(libItemsW[i].divider)return;
  const modes=['spine','cover','pile'];
  libItemsW[i].mode=modes[(modes.indexOf(libItemsW[i].mode)+1)%3];
  renderLibEditViz();
}
function libRemoveAt(i){libItemsW.splice(i,1);renderLibEditViz();}
/* Étage 1 = étage du haut (voir layoutShelfRows) : sans le fixer, une nouvelle séparation
   ajoutée en fin de liste hérite du curseur de remplissage automatique à ce stade (déjà avancé
   par tous les livres précédents) et atterrit en bas au lieu d'en haut. */
function addLibDivider(){libItemsW.push({divider:true,id:uid(),row:1});renderLibEditViz();}
(function(){
  let dragging=null,movedFar=false,ghostEl=null,origSnapshot=null,lastKey=null;
  const THRESH=8;
  function wrap(){return document.getElementById('libEditViz');}
  function startGhost(slot,clientX,clientY){
    const r=slot.getBoundingClientRect();
    ghostEl=slot.cloneNode(true);
    const del=ghostEl.querySelector('.slotDel');if(del)del.remove();
    ghostEl.classList.add('shelfGhost');
    ghostEl.style.width=r.width+'px';ghostEl.style.height=r.height+'px';
    ghostEl.dataset.offX=clientX-r.left;ghostEl.dataset.offY=clientY-r.top;
    ghostEl.style.left=r.left+'px';ghostEl.style.top=r.top+'px';
    document.body.appendChild(ghostEl);
  }
  function moveGhost(clientX,clientY){
    if(!ghostEl)return;
    ghostEl.style.left=(clientX-ghostEl.dataset.offX)+'px';
    ghostEl.style.top=(clientY-ghostEl.dataset.offY)+'px';
  }
  function removeGhost(){if(ghostEl){ghostEl.remove();ghostEl=null;}}
  document.addEventListener('pointerdown',e=>{
    const w=wrap();if(!w||!w.contains(e.target))return;
    const slot=e.target.closest('.shelfSlot');
    if(!slot||e.target.closest('.slotDel'))return;
    const i=+slot.dataset.li;
    dragging={key:libItemKey(libItemsW[i]),startX:e.clientX,startY:e.clientY,el:slot,dropRow:null};
    movedFar=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-dragging.startX,dy=e.clientY-dragging.startY;
    if(!movedFar){
      if(Math.hypot(dx,dy)<THRESH)return;
      movedFar=true;
      origSnapshot=libItemsW.map(it=>({...it}));
      startGhost(dragging.el,e.clientX,e.clientY);
      renderLibEditViz(dragging.key);
    }
    e.preventDefault();
    moveGhost(e.clientX,e.clientY);
    const overEl=document.elementFromPoint(e.clientX,e.clientY);
    const overSlot=overEl&&overEl.closest('.shelfSlot');
    if(overSlot){
      const r=overSlot.getBoundingClientRect();
      const before=e.clientX<r.left+r.width/2;
      const rowEl=overSlot.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      const targetIdx=+overSlot.dataset.li;
      const key=targetIdx+':'+(before?'b':'a');
      if(key!==lastKey){
        lastKey=key;
        const curIdx=libItemsW.findIndex(it=>libItemKey(it)===dragging.key);
        if(curIdx!==-1&&curIdx!==targetIdx){
          const item=libItemsW[curIdx];
          libItemsW.splice(curIdx,1);
          let insertAt=targetIdx;
          if(targetIdx>curIdx)insertAt--;
          insertAt=before?insertAt:insertAt+1;
          libItemsW.splice(insertAt,0,item);
          renderLibEditViz(dragging.key);
        }
      }
    }else{
      const rowEl=overEl&&overEl.closest&&overEl.closest('.shelfrow');
      dragging.dropRow=rowEl?+rowEl.dataset.row:null;
      lastKey=null;
    }
  });
  function finish(e){
    if(!dragging)return;
    removeGhost();
    if(movedFar){
      const w=wrap();
      const r=w&&w.getBoundingClientRect();
      const inside=r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
      if(inside)finalizeLibDrag(dragging.key,dragging.dropRow);
      else{libItemsW=origSnapshot;renderLibEditViz();}
    }
    dragging=null;movedFar=false;origSnapshot=null;lastKey=null;
  }
  document.addEventListener('pointerup',finish);
  document.addEventListener('pointercancel',finish);
})();
function finalizeLibDrag(key,dropRow){
  const item=libItemsW.find(it=>libItemKey(it)===key);
  const targetRow=dropRow||null;
  if(item)item.row=targetRow;
  if(targetRow){
    const wrap=document.getElementById('libEditViz');
    const nRows=Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1));
    const cap=Math.max(240,((wrap&&wrap.clientWidth)||window.innerWidth-32)-44);
    const rows=layoutShelfRows(libEditGroups(),nRows,cap);
    const rowOfIndex=new Map();
    rows.forEach((row,rIdx)=>row.els.forEach(g=>{
      if(g.pile)g.entries.forEach(e=>rowOfIndex.set(e.i,rIdx+1));
      else rowOfIndex.set(g.i,rIdx+1);
    }));
    libItemsW.forEach((it,i)=>{if(rowOfIndex.has(i))it.row=rowOfIndex.get(i);});
  }
  renderLibEditViz();
}
function saveLibLayout(){
  db.settings.libLayout={rows:Math.max(1,Math.min(8,+document.getElementById('lib_rows').value||1)),items:libItemsW};
  save();closeModals();render();
}

/* ---------- Classement (livres + sagas confondus) ---------- */
function rankItems(){
  return db.ranking.map(r=>{
    if(r.type==='book'){const b=db.books.find(x=>x.id===r.id);return b?{...r,b}:null;}
    if(r.type==='saga'){const bs=sagaBooks(r.id);return bs.length?{...r,bs}:null;}
    return null;
  }).filter(Boolean);
}
function renderRank(){
  const el=document.getElementById('rankList');
  db.ranking=db.ranking.filter(r=>r.type==='book'?db.books.some(x=>x.id===r.id):(r.type==='saga'&&sagaBooks(r.id).length));
  const items=rankItems();
  if(!items.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('trophy')}</span>Ton classement est vide.<br>Cherche ci-dessous un livre ou une saga à classer !</div>`;
    renderRankAdd();return;
  }
  el.innerHTML=items.map((it,i)=>{
    const isBook=it.type==='book';
    const name=isBook?it.b.titre:it.id;
    const sub=isBook?(it.b.auteur||''):('saga · '+it.bs.length+' tome'+(it.bs.length>1?'s':''));
    const vis=isBook?coverEl(it.b.couverture,'sm'):coverEl(it.bs[0]&&it.bs[0].couverture,'sm','book-open');
    return `<div class="sitem" data-i="${i}"${isBook?` onclick="openInfo('${it.b.id}')" style="cursor:pointer"`:''}>
      <span class="drag" onclick="event.stopPropagation()">⠿</span>
      <b style="min-width:26px;color:var(--accent)">${i+1}.</b>${vis}
      <span class="nm">${esc(name)}${sub?` <span style="color:var(--txt2)">· ${esc(sub)}</span>`:''}</span>
      <button onclick="event.stopPropagation();rankMove(${i},-1)">↑</button>
      <button onclick="event.stopPropagation();rankMove(${i},1)">↓</button>
      <button style="color:var(--red)" onclick="event.stopPropagation();rankRemove(${i})">✕</button></div>`;
  }).join('');
  makeSortable(el,order=>{
    db.ranking=order.map(i=>db.ranking[i]).filter(Boolean);
    save();renderRank();
  });
  renderRankAdd();
}
function rankMove(i,d){
  const j=i+d;if(j<0||j>=db.ranking.length)return;
  [db.ranking[i],db.ranking[j]]=[db.ranking[j],db.ranking[i]];
  save();renderRank();
}
function rankRemove(i){db.ranking.splice(i,1);save();renderRank();}
function rankAdd(type,id){
  if(db.ranking.some(r=>r.type===type&&r.id===id))return;
  db.ranking.push({type,id});save();renderRank();
}
function renderRankAdd(){
  const q=(document.getElementById('rankSearch').value||'').toLowerCase().trim();
  const inRank=new Set(db.ranking.map(r=>r.type+'|'+r.id));
  const sagas=sagaNames().filter(n=>!inRank.has('saga|'+n)&&(!q||sagaMatch(n,q))).slice(0,6);
  const books=db.books.filter(b=>!inRank.has('book|'+b.id)&&(!q||bookMatch(b,q))).slice(0,8);
  document.getElementById('rankAddEl').innerHTML=
    sagas.map(n=>{
      const bs=sagaBooks(n);
      return `<div class="sitem">${coverEl(bs[0]&&bs[0].couverture,'sm','book-open')}
      <span class="nm">${esc(n)} <span style="color:var(--txt2)">· saga (${bs.length} tome${bs.length>1?'s':''})</span></span>
      <button style="color:var(--green)" onclick="rankAdd('saga','${esc(n).replace(/'/g,'&#39;')}')">＋</button></div>`;
    }).join('')+
    books.map(b=>`<div class="sitem">${coverEl(b.couverture,'sm')}
      <span class="nm">${esc(b.titre)}</span>
      <button style="color:var(--green)" onclick="rankAdd('book','${b.id}')">＋</button></div>`).join('')
    ||'<div class="isbnmsg">Aucun résultat.</div>';
}

/* ---------- Découvrir (recommandations façon Tinder) ---------- */
const discNorm=s=>(s||'').toLowerCase().replace(/[^a-z0-9à-ÿ]/g,'');
let discCards=[],discLoading=false,discTried=false;
/* Nettoie un nom d'auteur, y compris le format inversé « Nom, Prénom » */
function discAuthor(a){
  a=(a||'').split(/[,;]/).map(x=>x.trim()).filter(Boolean);
  if(a.length>=2&&a[0].split(' ').length<=2&&a[1].split(' ').length<=2)return a[1]+' '+a[0];
  return a[0]||'';
}
let discErr='';
async function discQuery(q,why,ctx,lang){
  try{
    const url='https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+
      (lang?'&langRestrict=fr':'')+'&maxResults=15&country=FR';
    const r=await fetch(url);
    if(!r.ok){discErr='Google Books : HTTP '+r.status;return;}
    const d=await r.json();
    (d.items||[]).forEach(it=>{
      const v=it.volumeInfo||{};if(!v.title)return;
      const isbn=(v.industryIdentifiers||[]).map(x=>x.identifier).find(x=>/^97[89]\d{10}$/.test(x))||'';
      const key=isbn||discNorm(v.title);
      if(ctx.seen.has(key)||ctx.have.has(key)||ctx.have.has(discNorm(v.title)))return;
      ctx.seen.add(key);
      ctx.out.push({titre:v.title,auteur:(v.authors||[]).join(', '),pages:v.pageCount||0,
        desc:v.description||'',genre:(v.categories||[])[0]||'',isbn,why,
        langue:NV_LANG[v.language]||v.language||'',
        couverture:((v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||'').replace('http://','https://')});
    });
  }catch(e){discErr='Google Books injoignable';}
}
/* Source de secours : Open Library */
async function discQueryOL(params,why,ctx){
  try{
    const r=await fetch('https://openlibrary.org/search.json?'+params+
      '&fields=title,author_name,number_of_pages_median,cover_i,isbn,language&limit=20');
    if(!r.ok){discErr='Open Library : HTTP '+r.status;return;}
    const d=await r.json();
    (d.docs||[]).forEach(v=>{
      if(!v.title)return;
      const isbn=(v.isbn||[]).find(x=>/^97[89]\d{10}$/.test(x))||'';
      const key=isbn||discNorm(v.title);
      if(ctx.seen.has(key)||ctx.have.has(key)||ctx.have.has(discNorm(v.title)))return;
      ctx.seen.add(key);
      ctx.out.push({titre:v.title,auteur:(v.author_name||[]).join(', '),
        pages:v.number_of_pages_median||0,desc:'',genre:'',isbn,why,langue:'',
        couverture:v.cover_i?('https://covers.openlibrary.org/b/id/'+v.cover_i+'-M.jpg'):''});
    });
  }catch(e){discErr='Open Library injoignable';}
}
async function discLoad(){
  discLoading=true;discTried=true;discErr='';renderDisc();
  const liked=db.books.filter(b=>b.statut==='done'&&(b.note||0)>=4);
  const base=liked.length?liked:db.books;
  const authors=[...new Set(base.map(b=>discAuthor(b.auteur)).filter(Boolean))].slice(0,6);
  const genres=[...new Set(base.map(b=>b.genre).filter(Boolean))].slice(0,4);
  const queries=[];
  authors.forEach(a=>queries.push({q:'inauthor:"'+a+'"',why:'Parce que tu as aimé '+a}));
  genres.forEach(g=>{
    queries.push({q:'subject:"'+g+'"',why:'Genre que tu adores : '+g});
    queries.push({q:g+' roman',why:'Genre que tu adores : '+g});
  });
  const ctx={out:[],seen:new Set(),have:new Set()};
  db.books.forEach(b=>{if(b.isbn)ctx.have.add(b.isbn);ctx.have.add(discNorm(b.titre));});
  db.discover.rejected.forEach(k=>ctx.have.add(k));
  /* 1er essai : en français */
  await Promise.all(queries.slice(0,12).map(({q,why})=>discQuery(q,why,ctx,true)));
  /* 2e essai : sans restriction de langue */
  if(ctx.out.length<5)
    await Promise.all(queries.slice(0,8).map(({q,why})=>discQuery(q,why,ctx,false)));
  /* 3e essai : requêtes génériques */
  if(ctx.out.length<5)
    await Promise.all([
      discQuery('roman fantasy','Populaire en fantasy',ctx,true),
      discQuery('romantasy','Tendance romantasy',ctx,true),
      discQuery('roman romance new adult','Populaire en romance',ctx,true),
    ]);
  /* 4e essai : Open Library en secours */
  if(ctx.out.length<5){
    await Promise.all(authors.slice(0,4).map(a=>
      discQueryOL('author='+encodeURIComponent(a)+'&language=fre','Parce que tu as aimé '+a,ctx)));
    await Promise.all(genres.slice(0,3).map(g=>
      discQueryOL('subject='+encodeURIComponent(g.toLowerCase())+'&language=fre','Genre que tu adores : '+g,ctx)));
    if(!ctx.out.length)
      await discQueryOL('subject=fantasy&language=fre','Populaire en fantasy',ctx);
  }
  const out=ctx.out;
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  discCards=out.slice(0,40);
  discLoading=false;renderDisc();
}
function renderDisc(){
  const el=document.getElementById('discWrap');if(!el)return;
  if(discLoading){el.innerHTML=`<div class="empty">${icSvg('crystalball')} Je cherche des livres qui devraient te plaire…</div>`;return;}
  if(!discCards.length){
    el.innerHTML=`<div class="empty"><span class="big">${icSvg('search')}</span>
      ${discTried
        ?'Aucune suggestion trouvée 😕'+(discErr?'<br><span style="font-size:.8rem">Détail : '+esc(discErr)+'</span>':'<br>Vérifie ta connexion et réessaie.')
        :'Des suggestions basées sur tes lectures préférées (auteurs et genres notés ★★★★+).'}<br><br>
      <button class="btn" style="max-width:280px;margin:0 auto" onclick="discLoad()">${discTried?'Réessayer':'Trouver des livres'}</button></div>`;
    return;
  }
  const c=discCards[0];
  el.innerHTML=`
  <div class="disccard" id="discCard">
    ${c.couverture?`<img class="disccover" src="${esc(c.couverture)}" onerror="imgFallback(this,'disccover ph','book')">`:`<div class="disccover ph">${icSvg('book')}</div>`}
    <h3>${esc(c.titre)}</h3>
    <div style="color:var(--txt2);font-size:.9rem;margin-top:3px">${esc(c.auteur)||'—'}</div>
    <div style="color:var(--txt2);font-size:.8rem;margin-top:4px">${c.pages?c.pages+' p.':''}${c.pages&&c.genre?' · ':''}${esc(c.genre)}</div>
    <div class="discwhy">${esc(c.why||'')}</div>
    ${c.desc?`<p class="discdesc">${esc(c.desc.slice(0,320))}${c.desc.length>320?'…':''}</p>`:''}
  </div>
  <div class="discbtns">
    <button class="discno" onclick="discSwipe(false)" title="Pas intéressée">✕</button>
    <button class="discyes" onclick="discSwipe(true)" title="À lire !">♥</button>
  </div>
  <div style="text-align:center;color:var(--txt2);font-size:.75rem;margin-top:10px">
    ${discCards.length} suggestion${discCards.length>1?'s':''} — glisse la carte (→ à lire, ← passer)</div>`;
  attachSwipe(document.getElementById('discCard'));
}
function discSwipe(like){
  const c=discCards.shift();if(!c)return;
  if(like){
    db.books.push({id:uid(),titre:c.titre,auteur:c.auteur,genre:c.genre,synopsis:c.desc||'',
      langue:c.langue||'Français',pages:c.pages,epaisseur:0,fiction:true,
      format:'papier',statut:'tbr',progression:0,pageActuelle:0,note:0,avis:'',
      isbn:c.isbn,couverture:c.couverture,spine:'',dateFin:'',dateAjout:Date.now()});
    toast('Ajouté à ta pile à lire : '+c.titre+' 📚');
  }else{
    db.discover.rejected.push(c.isbn||discNorm(c.titre));
    if(db.discover.rejected.length>600)db.discover.rejected=db.discover.rejected.slice(-600);
  }
  save();renderLib();renderStats();renderDisc();
  if(!discCards.length)discLoad();
}
function attachSwipe(card){
  if(!card)return;
  let sx=0,dx=0,active=false;
  const start=e=>{active=true;const t=e.touches?e.touches[0]:e;sx=t.clientX;card.style.transition='none';};
  const move=e=>{
    if(!active)return;
    const t=e.touches?e.touches[0]:e;
    dx=t.clientX-sx;
    card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    card.style.opacity=String(1-Math.min(.5,Math.abs(dx)/320));
  };
  const end=()=>{
    if(!active)return;active=false;
    if(Math.abs(dx)>90){
      const like=dx>0;
      card.style.transition='transform .25s,opacity .25s';
      card.style.transform=`translateX(${like?520:-520}px) rotate(${like?30:-30}deg)`;
      card.style.opacity='0';
      setTimeout(()=>discSwipe(like),240);
    }else{
      card.style.transition='transform .2s,opacity .2s';
      card.style.transform='';card.style.opacity='1';
    }
    dx=0;
  };
  card.addEventListener('touchstart',start,{passive:true});
  card.addEventListener('touchmove',move,{passive:true});
  card.addEventListener('touchend',end);
  card.addEventListener('mousedown',e=>{
    start(e);
    const mm=ev=>move(ev),mu=()=>{end();removeEventListener('mousemove',mm);removeEventListener('mouseup',mu);};
    addEventListener('mousemove',mm);addEventListener('mouseup',mu);
  });
}

/* ---------- Journal (calendrier) ---------- */
const MOIS_FULL=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
let calRef=new Date(),calSel=null;
function calMove(d){calRef=new Date(calRef.getFullYear(),calRef.getMonth()+d,1);calSel=null;renderCal();}
function selectCalDay(iso){calSel=iso;renderCal();}
function renderCal(){
  const y=calRef.getFullYear(),m=calRef.getMonth();
  document.getElementById('calTitle').textContent=MOIS_FULL[m]+' '+y;
  const off=(new Date(y,m,1).getDay()+6)%7;
  const nb=new Date(y,m+1,0).getDate();
  const today=new Date().toISOString().slice(0,10);
  const pagesBy={},finBy={};
  db.sessions.forEach(s=>{pagesBy[s.date]=(pagesBy[s.date]||0)+s.pages;});
  db.books.forEach(b=>{if(b.statut==='done'&&b.dateFin)(finBy[b.dateFin]=finBy[b.dateFin]||[]).push(b);});
  let html='<div class="calgrid">'+['L','M','M','J','V','S','D'].map(d=>`<div class="calwd">${d}</div>`).join('');
  for(let i=0;i<off;i++)html+='<div></div>';
  for(let d=1;d<=nb;d++){
    const iso=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const pg=pagesBy[iso],fin=finBy[iso];
    const cover=fin&&fin[0]&&fin[0].couverture;
    html+=`<div class="calday ${iso===today?'today':''} ${calSel===iso?'sel':''} ${cover?'hascover':''}"
      ${cover?`style="background-image:url('${esc(cover)}')"`:''}
      onclick="selectCalDay('${iso}')">
      <div class="dnum">${d}</div>
      ${fin&&!cover?`<div class="fin">${icSvg('book')}</div>`:''}
      ${fin&&fin.length>1?`<div class="calmore">+${fin.length-1}</div>`:''}
      ${pg?`<div class="pg">${pg} p.</div>`:'<div></div>'}
    </div>`;
  }
  document.getElementById('calGrid').innerHTML=html+'</div>';
  const det=document.getElementById('dayDetail');
  if(!calSel){det.innerHTML='<div class="empty" style="padding:24px 10px">Touche un jour pour voir le détail.<br>couverture = livre terminé ce jour-là · p. = pages lues</div>';return;}
  const fin=finBy[calSel]||[],ses=db.sessions.filter(s=>s.date===calSel);
  const dstr=new Date(calSel+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  let out=`<h2>${dstr}</h2>`;
  if(!fin.length&&!ses.length)out+=`<div class="empty" style="padding:14px">${icSvg('empty')} Rien noté ce jour-là</div>`;
  fin.forEach(b=>out+=`<div class="mile" style="cursor:pointer" onclick="openInfo('${b.id}')">${coverEl(b.couverture,'sm')}<span class="name">Terminé : ${esc(b.titre)}</span>${b.note?`<span class="h stars">${'★'.repeat(b.note)}</span>`:''}</div>`);
  ses.forEach(s=>{
    const bk=db.books.find(b=>b.id===s.bookId);
    out+=`<div class="swipeRow">
      <div class="swipeAction" onclick="deleteSession('${s.id}')">Supprimer</div>
      <div class="swipeContent mile">
        <div style="display:flex;align-items:center;gap:12px;min-width:0${bk?';cursor:pointer':''}"${bk?` onclick="openInfo('${bk.id}')"`:''}>${coverEl(bk&&bk.couverture,'sm','book-open')}<span class="name">${esc(s.titre)}</span></div>
        <span class="h">+${s.pages} p.</span>
      </div>
    </div>`;
  });
  det.innerHTML=out;
}
function deleteSession(id){
  askConfirm('Supprimer cette entrée du journal ? Les pages lues ce jour-là seront retirées.',()=>{
    db.sessions=db.sessions.filter(s=>s.id!==id);
    save();renderCal();
  });
}
/* Glisser une ligne du journal vers la gauche révèle le bouton "Supprimer" derrière —
   délégation sur #dayDetail puisque les lignes sont reconstruites à chaque renderCal(). */
(function(){
  const MAXR=90,THRESH=70;
  let active=null,startX=0,startY=0,curX=0,dragging=false,axis=null;
  function closeOthers(except){
    document.querySelectorAll('#dayDetail .swipeRow.open').forEach(r=>{
      if(r!==except){r.classList.remove('open');r.querySelector('.swipeContent').style.transform='';}
    });
  }
  function onDown(e){
    const row=e.target.closest('.swipeRow');
    if(!row)return;
    closeOthers(row);
    active=row;startX=e.clientX;startY=e.clientY;curX=row.classList.contains('open')?-MAXR:0;
    dragging=false;axis=null;
  }
  function onMove(e){
    if(!active)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(axis===null){
      if(Math.abs(dx)<6&&Math.abs(dy)<6)return;
      axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
      if(axis==='y'){active=null;return;} /* laisse le scroll vertical normal */
    }
    if(axis!=='x')return;
    dragging=true;
    e.preventDefault();
    const base=active.classList.contains('open')?-MAXR:0;
    curX=Math.max(-MAXR,Math.min(0,base+dx));
    active.querySelector('.swipeContent').style.transform='translateX('+curX+'px)';
  }
  function onUp(){
    if(!active)return;
    if(dragging){
      const openNow=curX<-THRESH;
      active.classList.toggle('open',openNow);
      active.querySelector('.swipeContent').style.transform=openNow?'translateX(-'+MAXR+'px)':'';
    }
    active=null;dragging=false;axis=null;
  }
  const el=document.getElementById('dayDetail');
  el.addEventListener('pointerdown',onDown);
  el.addEventListener('pointermove',onMove,{passive:false});
  el.addEventListener('pointerup',onUp);
  el.addEventListener('pointercancel',onUp);
})();

/* ---------- Réglages / sauvegarde ---------- */
/* Récupère les résumés éditeur manquants pour toute la bibliothèque */
let gbFail=0;
async function gbDescLang(q,lang){
  try{
    const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&country=FR&maxResults=5'+lang);
    if(!r.ok){gbFail++;return null;}
    const d=await r.json();
    const it=(d.items||[]).find(x=>x.volumeInfo&&x.volumeInfo.description);
    return it?it.volumeInfo.description:null;
  }catch(e){gbFail++;return null;}
}
const gbDescFr=q=>gbDescLang(q,'&langRestrict=fr');
const gbDescAny=q=>gbDescLang(q,'');
async function gbDesc(q){return (await gbDescFr(q))||(await gbDescAny(q));}
/* Booknode (résumés en français) via proxy CORS */
const unHtml=s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value;};
async function viaProxy(url){
  for(const p of ['https://api.allorigins.win/raw?url=','https://corsproxy.io/?url=']){
    try{
      const r=await fetch(p+encodeURIComponent(url));
      if(r.ok){const t=await r.text();if(t&&t.length>300)return t;}
    }catch(e){}
  }
  return null;
}
async function bnDesc(titre,auteur){
  try{
    const sh=await viaProxy('https://booknode.com/recherche?q='+encodeURIComponent(titre+' '+(auteur||'')));
    if(!sh)return null;
    const m=sh.match(/href="(https:\/\/booknode\.com\/[a-z0-9_]+_0?\d{4,})"/i)
      ||sh.match(/href="(\/[a-z0-9_]+_0?\d{4,})"/i);
    if(!m)return null;
    let u=m[1];if(u.startsWith('/'))u='https://booknode.com'+u;
    const ph=await viaProxy(u);
    if(!ph)return null;
    /* 1. données structurées JSON-LD */
    const lds=ph.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)||[];
    for(const s of lds){
      try{
        const j=JSON.parse(s.replace(/<script[^>]*>|<\/script>/gi,''));
        const o=Array.isArray(j)?j[0]:j;
        if(o&&o.description&&o.description.length>80)return unHtml(o.description);
      }catch(e){}
    }
    /* 2. og:description */
    const og=ph.match(/property=["']og:description["'] content=["']([^"']{80,})["']/i);
    if(og)return unHtml(og[1]);
    /* 3. bloc « Résumé » de la page */
    const rs=ph.match(/R[ée]sum[ée][\s\S]{0,500}?<p[^>]*>([\s\S]{100,3000}?)<\/p>/i);
    if(rs)return unHtml(rs[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
  }catch(e){}
  return null;
}
/* Secours : Open Library (édition → œuvre → description) */
async function olDesc(isbn,titre,auteur){
  try{
    let workKey=null;
    if(isbn){
      const r=await fetch('https://openlibrary.org/isbn/'+isbn+'.json');
      if(r.ok){const d=await r.json();workKey=d.works&&d.works[0]&&d.works[0].key;}
    }
    if(!workKey&&titre){
      const r=await fetch('https://openlibrary.org/search.json?title='+encodeURIComponent(titre)+
        (auteur?'&author='+encodeURIComponent(auteur):'')+'&fields=key&limit=1');
      if(r.ok){const d=await r.json();workKey=d.docs&&d.docs[0]&&d.docs[0].key;}
    }
    if(!workKey)return null;
    const r2=await fetch('https://openlibrary.org'+workKey+'.json');
    if(!r2.ok)return null;
    const w=await r2.json();
    return typeof w.description==='string'?w.description:((w.description&&w.description.value)||null);
  }catch(e){return null;}
}
async function backfillSynopsis(){
  const btn=document.getElementById('bfBtn');
  const missing=db.books.filter(b=>!b.synopsis);
  if(!missing.length){toast('Tous tes livres ont déjà un résumé ✅');return;}
  btn.disabled=true;gbFail=0;
  let ok=0,i=0;
  for(const b of missing){
    i++;
    btn.textContent='⏳ '+i+'/'+missing.length+' — '+b.titre.slice(0,22)+'…';
    let d=null;
    /* priorité au français */
    if(b.isbn)d=await gbDescFr('isbn:'+b.isbn);
    if(!d)d=await gbDescFr('intitle:"'+b.titre+'" '+(b.auteur||''));
    if(!d)d=await bnDesc(b.titre,b.auteur);
    if(!d&&b.isbn)d=await gbDescAny('isbn:'+b.isbn);
    if(!d)d=await gbDescAny(b.titre+' '+(b.auteur||''));
    if(!d)d=await olDesc(b.isbn,b.titre,b.auteur);
    if(d){b.synopsis=d;ok++;save();}
    await new Promise(r=>setTimeout(r,250));
  }
  save();render();
  btn.disabled=false;
  btn.innerHTML=icSvg('summary')+' Récupérer les résumés manquants';
  if(!ok&&gbFail>0)toast('⚠️ Google Books semble inaccessible depuis ton réseau ('+gbFail+' échecs) — Open Library n\'a rien trouvé non plus');
  else toast(ok+' résumé'+(ok>1?'s':'')+' récupéré'+(ok>1?'s':'')+' sur '+missing.length+' livre'+(missing.length>1?'s':'')+' ✅');
}
/* Variante silencieuse (pas de bouton à mettre à jour) : lancée en arrière-plan après un import,
   pour ne pas laisser une sauvegarde pleine de couvertures/tranches en base64 dans l'état à
   synchroniser. */
async function cacheAllCoversQuiet(){
  for(const b of db.books){
    if(needsCaching(b.couverture))await cacheExternalImage(b.id,'couverture');
    if(needsCaching(b.spine))await cacheExternalImage(b.id,'spine');
  }
}
function openSettings(){
  segSet('segLang',db.settings.lang||'fr');
  document.getElementById('s_taille').value=db.settings.taille||'';
  document.getElementById('s_objectif').value=db.settings.objectif||'';
  segSet('segTheme',db.settings.theme||'sombre');
  segSet('segBois',db.settings.bois||'sombre');
  document.getElementById('g_key').value=gemKey||'';
  document.getElementById('accountEmail').textContent=(sbUser&&sbUser.email)||'';
  setSyncStatus(sbUser?'✅ Sync temps réel active':'Non connectée');
  document.getElementById('settingsModal').classList.add('open');
}
function saveSettings(){
  db.settings.lang=segVal('segLang');
  db.settings.taille=+document.getElementById('s_taille').value||165;
  db.settings.objectif=+document.getElementById('s_objectif').value||0;
  db.settings.theme=segVal('segTheme');
  db.settings.bois=segVal('segBois');
  gemKey=document.getElementById('g_key').value.trim();
  localStorage.setItem(GKEY,gemKey);
  save();closeModals();render();
  translatePage(document.getElementById('appRoot'));
}
let pfPhotoData='';
function renderProfilePreview(){
  const url=pfPhotoData||db.profile.photo;
  document.getElementById('pfPhotoPreview').innerHTML=url
    ?`<img src="${url}" style="width:88px;height:88px;object-fit:cover;border-radius:50%;display:block;margin-top:6px">`
    :'<div class="isbnmsg" style="margin-top:6px">Aucune photo pour l\'instant.</div>';
}
const PROFILE_SECTIONS={reading:'Livres en cours de lecture et leur avancement',stats:'Statistiques',pal:'Ma PAL',shelves:'Étagères',done:'Livres terminés',coups:'Coups de cœur',badges:'Badges'};
const profileField=key=>'public'+key.charAt(0).toUpperCase()+key.slice(1);
let pfSectionsW=[];
function renderProfileSections(){
  const wrap=document.getElementById('pfSectionsEl');
  wrap.innerHTML=pfSectionsW.map((s,i)=>`<div class="sitem" data-i="${i}">
    <span class="drag">⠿</span>
    <span class="nm">${esc(PROFILE_SECTIONS[s.key])}</span>
    <button type="button" class="smallbtn" onclick="pfToggleSection(${i})" title="${s.on?'Public — touche pour rendre privé':'Privé — touche pour rendre public'}">
      <span data-spr="${s.on?'unlock':'lock'}" data-spr-size="16"><svg class="icn"><use href="#i-${s.on?'unlock':'lock'}"/></svg></span>
    </button>
  </div>`).join('');
  applySpr(wrap);
  makeSortable(wrap,order=>{
    pfSectionsW=order.map(i=>pfSectionsW[i]).filter(Boolean);
    renderProfileSections();
  });
}
function pfToggleSection(i){
  pfSectionsW[i].on=!pfSectionsW[i].on;
  renderProfileSections();
}
function openProfile(){
  document.getElementById('pf_nom').value=db.profile.nom||'';
  pfSectionsW=db.profile.sectionOrder.map(key=>({key,on:!!db.profile[profileField(key)]}));
  renderProfileSections();
  pfPhotoData='';
  renderProfilePreview();
  document.getElementById('profileModal').classList.add('open');
}
function pickProfilePhoto(){document.getElementById('pfPhotoPick').click();}
function onProfilePhotoPicked(inp){
  const f=inp.files[0];inp.value='';
  if(!f)return;
  const img=new Image();
  img.onload=()=>{
    const maxH=400,scale=Math.min(1,maxH/img.height);
    const c=document.createElement('canvas');
    c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(img.src);
    pfPhotoData=c.toDataURL('image/jpeg',0.8);
    renderProfilePreview();
  };
  img.onerror=()=>toast('Image illisible 😕');
  img.src=URL.createObjectURL(f);
}
async function saveProfile(){
  db.profile.nom=document.getElementById('pf_nom').value.trim();
  db.profile.sectionOrder=pfSectionsW.map(s=>s.key);
  pfSectionsW.forEach(s=>{db.profile[profileField(s.key)]=s.on;});
  if(pfPhotoData){
    const oldPhoto=db.profile.photo;
    db.profile.photo=await uploadImage(pfPhotoData,'profile');
    cleanupOldImage(oldPhoto,db.profile.photo);
  }
  save();closeModals();render();
  lastProfileSync=Date.now();
  syncPublicProfile();
  toast('Profil enregistré ✅');
}
/* ---------- Aperçu visiteur : rendu en lecture seule des sections cochées, dans l'ordre choisi ---------- */
/* Encode les champs connus d'un livre en attribut data-book (JSON échappé) pour un clic sur
   sa carte — utilisé aussi bien sur son propre appareil que sur le profil déjà synchronisé
   d'un·e ami·e (aucune donnée JS partagée dans ce cas, juste le HTML publié : tout ce qu'on
   peut proposer d'ajouter doit donc être embarqué directement dans le HTML). */
function bookDataAttr(b){
  return esc(JSON.stringify({
    titre:b.titre||'',auteur:b.auteur||'',couverture:b.couverture||'',genre:b.genre||'',
    pages:b.pages||0,isbn:b.isbn||'',langue:b.langue||'',synopsis:b.synopsis||b.resume||''
  }));
}
function hstripHTML(books){
  return `<div class="hscroll">${books.map(b=>`<div class="hcard" style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
    ${coverEl(b.couverture,'')}<span class="nm">${esc(b.titre)}</span><span class="sub">${esc(b.auteur)||''}</span>
  </div>`).join('')}</div>`;
}
let bookPreviewData=null;
function openBookPreview(d){
  bookPreviewData=d;
  document.getElementById('bookPreviewBody').innerHTML=`<div style="text-align:center;margin-bottom:14px">
    <div style="display:flex;justify-content:center">${coverEl(d.couverture,'lg')}</div>
    <h2 style="margin:10px 0 2px">${esc(d.titre)}</h2>
    <div style="color:var(--txt2)">${esc(d.auteur)||'—'}</div>
  </div>
  ${(d.genre||d.pages||d.langue)?`<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:10px">
    ${d.genre?`<span class="chip">${esc(d.genre)}</span>`:''}
    ${d.pages?`<span class="chip">${d.pages} pages</span>`:''}
    ${d.langue?`<span class="chip">${esc(d.langue)}</span>`:''}
  </div>`:''}
  ${d.synopsis?`<p style="font-size:.85rem;color:var(--txt2);white-space:pre-wrap">${esc(d.synopsis)}</p>`:''}`;
  document.getElementById('bookPreviewModal').classList.add('open');
}
function closeBookPreview(){document.getElementById('bookPreviewModal').classList.remove('open');bookPreviewData=null;}
function addBookFromPreview(){
  const d=bookPreviewData;
  if(!d||!d.titre)return;
  const exists=db.books.some(b=>(b.titre||'').toLowerCase()===d.titre.toLowerCase()&&(b.auteur||'').toLowerCase()===(d.auteur||'').toLowerCase());
  if(exists){toast('Ce livre est déjà dans ta bibliothèque 📚');return;}
  /* Volontairement sans fiche de lecture : ni note, ni avis, ni notes détaillées — ce sont
     des jugements personnels, pas des infos objectives du livre qu'on peut copier de chez
     quelqu'un d'autre. Juste les infos du livre lui-même, en « à lire ». */
  const b={
    id:uid(),titre:d.titre,auteur:d.auteur||'',saga:'',tome:0,synopsis:d.synopsis||'',citations:[],relectures:0,
    isbn:d.isbn||'',couverture:d.couverture||'',spine:'',genre:d.genre||'',langue:d.langue||'',dateParution:'',
    pages:d.pages||0,fiction:true,format:'papier',statut:'tbr',progression:0,pageActuelle:0,note:0,avis:'',
    fmc:'',mmc:'',tropes:'',resume:'',finNote:'',sousNotes:{},smut:0,recommande:null,dateFin:'',dateAjout:Date.now()
  };
  db.books.push(b);
  save();render();
  if(b.couverture)cacheExternalCover(b.id);
  closeBookPreview();
  toast('Ajouté à ta bibliothèque ✅');
}
function profileSectionHTML(key){
  if(key==='reading'){
    const reading=db.books.filter(b=>b.statut==='reading');
    let h='<h2>📖 En cours de lecture</h2>';
    if(!reading.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucune lecture en cours</div>`;
    reading.forEach(b=>{
      h+=`<div class="book" style="cursor:pointer" data-book="${bookDataAttr(b)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        <div class="top">${coverEl(b.couverture,'')}
          <div class="tinfo"><h3>${esc(b.titre)}</h3><div class="auth">${esc(b.auteur)||'—'}</div>
          <div class="meta"><span style="color:var(--accent);font-weight:700">${fmt(b)==='papier'&&b.pages?`p. ${b.pageActuelle||0}/${b.pages}`:(b.progression||0)+' %'}</span></div></div>
        </div>
        <div class="pbar"><div style="width:${b.progression||0}%"></div></div>
      </div>`;
    });
    return h;
  }
  if(key==='stats'){
    const done=db.books.filter(b=>b.statut==='done');
    const pages=done.reduce((s,b)=>s+(b.pages||0),0);
    const noted=done.filter(b=>b.note>0);
    const avg=noted.length?(noted.reduce((s,b)=>s+b.note,0)/noted.length).toFixed(1):'—';
    return `<h2>📊 Statistiques</h2><div class="statgrid">
      <div class="stat"><div class="n">${done.length}</div><div class="l">Livres terminés</div></div>
      <div class="stat"><div class="n">${pages.toLocaleString('fr-FR')}</div><div class="l">Pages lues</div></div>
      <div class="stat"><div class="n">${avg} ★</div><div class="l">Note moyenne</div></div>
    </div>`;
  }
  if(key==='pal'){
    const tbr=db.books.filter(b=>b.statut==='tbr');
    let h=`<h2>📖 Ma PAL (${tbr.length})</h2>`;
    if(!tbr.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun livre à lire pour l'instant</div>`;
    return h+hstripHTML(tbr);
  }
  if(key==='shelves'){
    let h='<h2>📚 Étagères</h2>';
    if(!db.shelves.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucune étagère</div>`;
    db.shelves.forEach(s=>{
      h+=`<h3 style="margin:14px 2px 8px;font-size:.9rem">${esc(s.nom)}</h3>${shelfVisual(s,true)}`;
    });
    return h;
  }
  if(key==='done'){
    const done=db.books.filter(b=>b.statut==='done');
    let h=`<h2>${icSvg('finished')} Livres terminés (${done.length})</h2>`;
    if(!done.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun livre terminé pour l'instant</div>`;
    return h+hstripHTML(done);
  }
  if(key==='coups'){
    const coups=db.books.filter(b=>b.statut==='done'&&b.note>=5);
    let h=`<h2>${icSvg('heart')} Coups de cœur (${coups.length})</h2>`;
    if(!coups.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun coup de cœur pour l'instant</div>`;
    return h+hstripHTML(coups);
  }
  if(key==='badges'){
    const taille=db.settings.taille||165;
    const doneAll=db.books.filter(b=>b.statut==='done');
    const hgt=+doneAll.reduce((s,b)=>s+thickness(b),0).toFixed(1);
    const reached=MILESTONES.map(([e,n,v])=>[e,n,v===null?taille:v]).filter(([,,v])=>hgt>=v);
    let h=`<h2>${icSvg('human')} Badges</h2>`;
    if(!reached.length)return h+`<div class="empty" style="padding:14px">${icSvg('empty')} Aucun badge débloqué pour l'instant</div>`;
    return h+`<div style="display:flex;flex-wrap:wrap;gap:10px">${reached.map(([e,n])=>
      `<div class="mile reached" style="flex:none"><span class="emo">${e}</span><span class="name">${esc(n)}</span><span class="check">✓</span></div>`
    ).join('')}</div>`;
  }
  return '';
}
function openProfileVisitor(){
  const p=db.profile,name=(document.getElementById('pf_nom').value||'').trim()||'Sans nom';
  const photo=pfPhotoData||p.photo;
  let out=`<div style="text-align:center;margin-bottom:20px">
    <div style="display:flex;justify-content:center;margin-bottom:10px">${avatarHTML(photo,96)}</div>
    <h2 style="margin:0">${esc(name)}</h2>
    <div style="color:var(--txt2);font-size:.8rem;margin-top:4px">${icSvg('preview')} Aperçu — ce que verrait un·e visiteur·se</div>
  </div>`;
  const sections=pfSectionsW.filter(s=>s.on);
  out+=sections.length?sections.map(s=>profileSectionHTML(s.key)).join(''):'<div class="empty">Rien n\'est encore visible publiquement.<br>Coche au moins une section ci-dessus.</div>';
  document.getElementById('pfVisitorBody').innerHTML=out;
  document.getElementById('profileVisitorModal').classList.add('open');
}
function closeProfileVisitor(){document.getElementById('profileVisitorModal').classList.remove('open');}

/* ---------- Amis + Fil d'actualité ----------
   Nécessite 3 tables Supabase en plus de "bibli" : bibli_public_profiles (code ami + nom,
   lisible par tous les comptes connectés), bibli_friends (demandes/relations), bibli_feed
   (livres terminés, visibles par soi-même + ami·e·s accepté·e·s via RLS). Voir le script SQL
   fourni pour les créer — sans ces tables, ces fonctions échouent proprement (message d'erreur
   explicite) sans jamais toucher aux données locales. */
function genFriendCode(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; /* évite 0/O, 1/I/l */
  let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];
  return s;
}
/* Instantané HTML des sections rendues publiques (mêmes cartes en lecture seule que l'aperçu
   visiteur), envoyé au cloud pour que les ami·e·s voient le vrai profil tel que réglé dans
   Profil → « Visible publiquement », pas seulement ses livres terminés. */
function computeProfileHTML(){
  const order=(db.profile.sectionOrder&&db.profile.sectionOrder.length)?db.profile.sectionOrder:['reading','stats','pal','shelves','done','coups','badges'];
  const on=order.filter(key=>db.profile[profileField(key)]);
  return on.map(profileSectionHTML).join('');
}
async function syncPublicProfile(){
  const c=await sbClient();
  if(!c||!sbUser||!db.profile.friendCode)return;
  try{
    await c.from('bibli_public_profiles').upsert({
      user_id:sbUser.id,code:db.profile.friendCode,
      nom:db.profile.nom||'',photo:db.profile.photo||'',
      html:computeProfileHTML(),
      updated_at:new Date().toISOString()
    });
  }catch(e){}
}
async function ensureFriendCode(){
  if(db.profile.friendCode)return db.profile.friendCode;
  db.profile.friendCode=genFriendCode();
  save();
  await syncPublicProfile();
  return db.profile.friendCode;
}
function copyFriendCode(){
  const code=db.profile.friendCode;
  if(!code)return;
  if(navigator.clipboard)navigator.clipboard.writeText(code).then(()=>toast('Code copié ✅')).catch(()=>toast('Ton code : '+code));
  else toast('Ton code : '+code);
}
function avatarHTML(photo,size,uid){
  const s=size||32,cur=uid?'cursor:pointer;':'',oc=uid?` onclick="openFriendProfile('${uid}')"`:'';
  if(photo)return `<img src="${esc(photo)}" loading="lazy" style="width:${s}px;height:${s}px;object-fit:cover;border-radius:50%;flex:none;${cur}" onerror="this.outerHTML='<div style=&quot;width:${s}px;height:${s}px;border-radius:50%;background:var(--card2);flex:none;${cur}&quot;></div>'"${oc}>`;
  const isz=Math.round(s*.55);
  return `<div style="width:${s}px;height:${s}px;border-radius:50%;background:var(--card2);display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;${cur}"${oc}><img src="profile-female.png" alt="" style="width:${isz}px;height:${isz}px;object-fit:contain" onerror="this.outerHTML='<svg class=&quot;icn&quot; style=&quot;width:${isz}px;height:${isz}px;color:var(--txt2)&quot;><use href=&quot;#i-user&quot;/></svg>'"></div>`;
}
async function openFriendProfile(uid){
  document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg">Chargement…</div>';
  document.getElementById('friendProfileModal').classList.add('open');
  const c=await sbClient();
  if(!c){document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg err">Connecte-toi pour voir les profils.</div>';return;}
  try{
    const{data:prof,error}=await c.from('bibli_public_profiles').select('nom,photo,html').eq('user_id',uid).maybeSingle();
    if(error)throw error;
    const nom=(prof&&prof.nom)||'Sans nom',photo=prof&&prof.photo;
    let out=`<div style="text-align:center;margin-bottom:16px">
      <div style="display:flex;justify-content:center">${avatarHTML(photo,88)}</div>
      <h2 style="margin:10px 0 0">${esc(nom)}</h2>
    </div>`;
    out+=(prof&&prof.html)?prof.html:`<div class="empty">${icSvg('empty')} Rien n'est visible publiquement sur ce profil pour l'instant</div>`;
    document.getElementById('friendProfileBody').innerHTML=out;
  }catch(e){
    document.getElementById('friendProfileBody').innerHTML='<div class="isbnmsg err">⚠️ Impossible de charger ce profil — la colonne "html" existe-t-elle sur bibli_public_profiles ? (voir le script SQL fourni)</div>';
  }
}
function closeFriendProfile(){document.getElementById('friendProfileModal').classList.remove('open');}
let friendsLoadedOnce=false;
async function renderFriends(){
  const el=document.getElementById('friendCodeDisplay');
  const msg=document.getElementById('friendsSyncMsg');
  /* Marqueur de chargement seulement au tout premier affichage, pas à chaque nouvel appel
     (accepter/refuser/retirer un·e ami·e, mise à jour temps réel…) — même principe que
     renderFeed(), sinon la liste clignote en blanc à chaque action. */
  if(!friendsLoadedOnce)document.getElementById('friendsListEl').innerHTML='<div class="empty" style="padding:24px 10px"><span style="display:inline-block;animation:ptrspin .7s linear infinite">'+icSvg('loading')+'</span><br>Chargement…</div>';
  friendsLoadedOnce=true;
  const c=await sbClient();
  if(!c||!sbUser){
    el.textContent='------';
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Connecte-toi (compte cloud, voir ⚙️) pour utiliser les amis.';
    ['friendRequestsIn','friendRequestsOut','friendsListEl'].forEach(id=>document.getElementById(id).innerHTML='');
    return;
  }
  msg.textContent='';msg.className='isbnmsg';
  el.textContent=await ensureFriendCode();
  try{
    const {data:rows,error}=await c.from('bibli_friends').select('*').or('user_id.eq.'+sbUser.id+',friend_id.eq.'+sbUser.id);
    if(error)throw error;
    const ids=new Set();
    rows.forEach(r=>{ids.add(r.user_id);ids.add(r.friend_id);});
    ids.delete(sbUser.id);
    const profiles={};
    if(ids.size){
      const {data:profs}=await c.from('bibli_public_profiles').select('user_id,nom,photo,code').in('user_id',[...ids]);
      (profs||[]).forEach(p=>profiles[p.user_id]=p);
    }
    const nameOf=uid=>(profiles[uid]&&profiles[uid].nom)||'Sans nom';
    const photoOf=uid=>profiles[uid]&&profiles[uid].photo;
    const incoming=rows.filter(r=>r.friend_id===sbUser.id&&r.status==='pending');
    const outgoing=rows.filter(r=>r.user_id===sbUser.id&&r.status==='pending');
    const accepted=rows.filter(r=>r.status==='accepted');
    document.getElementById('friendRequestsIn').innerHTML=incoming.length?('<h2>Demandes reçues</h2>'+incoming.map(r=>
      `<div class="sitem">${avatarHTML(photoOf(r.user_id),32,r.user_id)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${r.user_id}')">${esc(nameOf(r.user_id))}</span>
        <button style="color:var(--green)" onclick="acceptFriendRequest('${r.id}')">✓ Accepter</button>
        <button style="color:var(--red)" onclick="declineFriendRequest('${r.id}')">✕</button></div>`
    ).join('')):'';
    document.getElementById('friendRequestsOut').innerHTML=outgoing.length?('<h2>Demandes envoyées</h2>'+outgoing.map(r=>
      `<div class="sitem">${avatarHTML(photoOf(r.friend_id),32,r.friend_id)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${r.friend_id}')">${esc(nameOf(r.friend_id))}</span><span class="h">En attente…</span>
        <button style="color:var(--red)" onclick="cancelFriendRequest('${r.id}')">✕</button></div>`
    ).join('')):'';
    document.getElementById('friendsListEl').innerHTML=accepted.length?accepted.map(r=>{
      const otherId=r.user_id===sbUser.id?r.friend_id:r.user_id;
      return `<div class="sitem">${avatarHTML(photoOf(otherId),32,otherId)}<span class="nm" style="cursor:pointer" onclick="openFriendProfile('${otherId}')">${esc(nameOf(otherId))}</span>
        <button style="color:var(--red)" onclick="removeFriend('${r.id}')">✕</button></div>`;
    }).join(''):'<div class="isbnmsg">Aucun·e ami·e pour l\'instant — partage ton code ci-dessus !</div>';
  }catch(e){
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Impossible de charger tes amis — la table bibli_friends existe-t-elle ? (voir le script SQL fourni)';
  }
}
async function sendFriendRequest(){
  const code=document.getElementById('friendCodeInput').value.trim().toUpperCase();
  const msg=document.getElementById('friendAddMsg');
  msg.className='isbnmsg';msg.textContent='';
  if(code.length!==6){msg.className='isbnmsg err';msg.textContent='Le code fait 6 caractères.';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.className='isbnmsg err';msg.textContent="Connecte-toi d'abord.";return;}
  try{
    const {data:found,error}=await c.from('bibli_public_profiles').select('user_id,nom').eq('code',code).maybeSingle();
    if(error)throw error;
    if(!found){msg.className='isbnmsg err';msg.textContent='Aucun compte avec ce code 😕';return;}
    if(found.user_id===sbUser.id){msg.className='isbnmsg err';msg.textContent="C'est ton propre code 😉";return;}
    const {error:insErr}=await c.from('bibli_friends').insert({user_id:sbUser.id,friend_id:found.user_id,status:'pending'});
    if(insErr){
      if(insErr.code==='23505'){msg.className='isbnmsg err';msg.textContent='Demande déjà envoyée (ou déjà ami·e·s).';}
      else throw insErr;
    }else{
      msg.className='isbnmsg ok';
      msg.textContent='Demande envoyée à '+(found.nom||'ce compte')+' ✅';
      document.getElementById('friendCodeInput').value='';
    }
    renderFriends();
  }catch(e){msg.className='isbnmsg err';msg.textContent='Erreur réseau — réessaie.';}
}
async function acceptFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').update({status:'accepted'}).eq('id',id);
  renderFriends();
  toast('Ami·e ajouté·e ✅');
}
async function declineFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').delete().eq('id',id);
  renderFriends();
}
async function cancelFriendRequest(id){
  const c=await sbClient();if(!c)return;
  await c.from('bibli_friends').delete().eq('id',id);
  renderFriends();
}
function removeFriend(id){
  askConfirm("Retirer cet·te ami·e ? Ses livres terminés n'apparaîtront plus dans ton fil.",async()=>{
    const c=await sbClient();if(!c)return;
    await c.from('bibli_friends').delete().eq('id',id);
    renderFriends();
  },'Retirer');
}
const REACTION_EMOJIS=['👍','❤️','😂','😮','😢'];
let feedLoadedOnce=false;
async function renderFeed(){
  const el=document.getElementById('feedListEl');
  /* Marqueur de chargement seulement au tout premier affichage du fil (chargement souvent
     lent) — pas à chaque rafraîchissement temps réel (nouveau commentaire/réaction d'un·e
     ami·e) ni après une action locale, sinon le fil clignote en blanc à chaque fois. */
  if(!feedLoadedOnce)el.innerHTML='<div class="empty" style="padding:24px 10px"><span style="display:inline-block;animation:ptrspin .7s linear infinite">'+icSvg('loading')+'</span><br>Chargement du fil…</div>';
  feedLoadedOnce=true;
  const c=await sbClient();
  if(!c||!sbUser){el.innerHTML='<div class="isbnmsg">Connecte-toi (compte cloud, voir ⚙️) pour voir le fil de tes amis.</div>';return;}
  let feedRows=[];
  try{
    const {data,error}=await c.from('bibli_feed').select('*')
      .order('date_fin',{ascending:false,nullsFirst:false}).order('updated_at',{ascending:false}).limit(60);
    if(error)throw error;
    feedRows=data||[];
  }catch(e){
    el.innerHTML='<div class="isbnmsg err">⚠️ Impossible de charger le fil — la table bibli_feed existe-t-elle ? (voir le script SQL fourni)</div>';
    return;
  }
  /* Posts/commentaires/réactions : fonctionnalité additive — si les tables n'existent
     pas encore (SQL pas encore lancé), le fil des livres terminés reste affiché normalement. */
  let postRows=[],comments=[],reactions=[];
  try{
    const {data:posts,error:pe}=await c.from('bibli_posts').select('*').order('created_at',{ascending:false}).limit(60);
    if(pe)throw pe;
    postRows=posts||[];
    const postIds=postRows.map(p=>p.id);
    if(postIds.length){
      const[{data:cs},{data:rs}]=await Promise.all([
        c.from('bibli_comments').select('*').in('post_id',postIds).order('created_at',{ascending:true}),
        c.from('bibli_reactions').select('*').in('post_id',postIds)
      ]);
      comments=cs||[];reactions=rs||[];
    }
  }catch(e){}
  if(!feedRows.length&&!postRows.length){el.innerHTML="<div class=\"empty\">Rien à afficher pour l'instant.<br>Ajoute des ami·e·s, poste quelque chose, ou synchronise tes livres terminés ci-dessus.</div>";return;}
  const ids=new Set();
  feedRows.forEach(r=>ids.add(r.user_id));
  postRows.forEach(r=>ids.add(r.user_id));
  comments.forEach(r=>ids.add(r.user_id));
  const profiles={};
  if(ids.size){
    const {data:profs}=await c.from('bibli_public_profiles').select('user_id,nom,photo').in('user_id',[...ids]);
    (profs||[]).forEach(p=>profiles[p.user_id]=p);
  }
  const nameOf=uid=>uid===sbUser.id?'Toi':((profiles[uid]&&profiles[uid].nom)||'Un·e ami·e');
  const photoOf=uid=>profiles[uid]&&profiles[uid].photo;
  const items=[
    ...feedRows.map(r=>({type:'book',date:r.date_fin||r.updated_at,data:r})),
    ...postRows.map(r=>({type:'post',date:r.created_at,data:r}))
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));
  el.innerHTML=items.map(it=>{
    if(it.type==='book'){
      const r=it.data,isMe=r.user_id===sbUser.id;
      return `<div class="book" style="cursor:pointer" data-book="${bookDataAttr(r)}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        <div class="top">${coverEl(r.couverture,'')}
          <div class="tinfo"><h3>${esc(r.titre)}</h3><div class="auth">${esc(r.auteur)||'—'}</div>
          <div class="meta"><span style="font-weight:700;color:${isMe?'var(--accent)':'var(--txt2)'}">${esc(nameOf(r.user_id))}</span>${r.note?` <span class="stars">${'★'.repeat(r.note)}</span>`:''}</div></div>
        </div>
        ${r.date_fin?`<div style="font-size:.75rem;color:var(--txt2);margin-top:4px">Terminé le ${fmtDateFr(r.date_fin)}</div>`:''}
      </div>`;
    }
    const p=it.data;
    const postReactions=reactions.filter(r=>r.post_id===p.id);
    const grouped={};
    postReactions.forEach(r=>{grouped[r.emoji]=(grouped[r.emoji]||0)+1;});
    const mine=new Set(postReactions.filter(r=>r.user_id===sbUser.id).map(r=>r.emoji));
    const postComments=comments.filter(cm=>cm.post_id===p.id);
    return `<div class="book" style="cursor:default">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        ${avatarHTML(photoOf(p.user_id),32,p.user_id)}
        <div style="cursor:pointer" onclick="openFriendProfile('${p.user_id}')"><div style="font-weight:700;font-size:.85rem">${esc(nameOf(p.user_id))}</div>
        <div style="font-size:.7rem;color:var(--txt2)">${fmtDateFr((p.created_at||'').slice(0,10))}</div></div>
      </div>
      ${p.book_titre?`<div style="display:flex;gap:8px;align-items:center;background:var(--card2);border-radius:10px;padding:6px;margin-bottom:8px;cursor:pointer" data-book="${bookDataAttr({titre:p.book_titre,auteur:p.book_auteur,couverture:p.book_couverture})}" onclick="openBookPreview(JSON.parse(this.dataset.book))">
        ${coverEl(p.book_couverture,'')}<div style="font-size:.8rem;font-weight:700">${esc(p.book_titre)}${p.book_auteur?`<div style="font-weight:400;color:var(--txt2);font-size:.72rem">${esc(p.book_auteur)}</div>`:''}</div>
      </div>`:''}
      ${p.texte?`<div style="white-space:pre-wrap;font-size:.88rem;margin-bottom:8px">${esc(p.texte)}</div>`:''}
      ${(p.photos&&p.photos.length)?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${p.photos.map(u=>`<img src="${esc(u)}" loading="lazy" style="width:90px;height:90px;object-fit:cover;border-radius:8px">`).join('')}</div>`:''}
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">
        ${REACTION_EMOJIS.map(em=>`<button class="smallbtn" style="${mine.has(em)?'border-color:var(--accent);color:var(--accent)':''}" onclick="toggleReaction('${p.id}','${em}')">${em}${grouped[em]?' '+grouped[em]:''}</button>`).join('')}
        <button class="smallbtn" onclick="toggleComments('${p.id}')">💬 ${postComments.length||''} Commentaire${postComments.length>1?'s':''}</button>
        ${p.user_id===sbUser.id?`<button class="smallbtn" style="color:var(--red)" onclick="deletePost('${p.id}')">${icSvg('delete')}</button>`:''}
      </div>
      <div id="comments-${p.id}" class="hidden">
        ${postComments.map(cm=>`<div class="sitem">${avatarHTML(photoOf(cm.user_id),24)}<span class="nm"><b>${esc(nameOf(cm.user_id))}</b> ${esc(cm.texte)}</span></div>`).join('')}
        <div class="isbnrow"><input id="cinput-${p.id}" placeholder="Écrire un commentaire…" onkeydown="if(event.key==='Enter'){event.preventDefault();addComment('${p.id}');}">
        <button class="btn" style="width:auto;margin-top:0;flex:none;padding:0 14px" onclick="addComment('${p.id}')">${icSvg('send')}</button></div>
      </div>
    </div>`;
  }).join('');
}
function toggleComments(postId){
  const el=document.getElementById('comments-'+postId);
  if(el)el.classList.toggle('hidden');
}
async function addComment(postId){
  const inp=document.getElementById('cinput-'+postId);
  const texte=(inp&&inp.value||'').trim();
  if(!texte)return;
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    await c.from('bibli_comments').insert({post_id:postId,user_id:sbUser.id,texte});
    if(inp)inp.value='';
    renderFeed();
  }catch(e){toast("⚠️ Impossible d'envoyer le commentaire");}
}
async function toggleReaction(postId,emoji){
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    const {data:existing}=await c.from('bibli_reactions').select('id').eq('post_id',postId).eq('user_id',sbUser.id).eq('emoji',emoji).maybeSingle();
    if(existing)await c.from('bibli_reactions').delete().eq('id',existing.id);
    else await c.from('bibli_reactions').insert({post_id:postId,user_id:sbUser.id,emoji});
    renderFeed();
  }catch(e){}
}
function deletePost(id){
  askConfirm('Supprimer ce post ?',async()=>{
    const c=await sbClient();if(!c)return;
    await c.from('bibli_posts').delete().eq('id',id);
    renderFeed();
  },'Supprimer');
}
let pcPhotos=[];
let pcBookId='';
function openPostCompose(){
  const c1=document.getElementById('postComposeModal');
  if(!sbUser){toast('Connecte-toi (compte cloud, voir ⚙️) pour publier');return;}
  pcPhotos=[];pcBookId='';
  document.getElementById('pc_texte').value='';
  document.getElementById('pc_photos').innerHTML='';
  const msg=document.getElementById('pc_msg');msg.textContent='';msg.className='isbnmsg';
  document.getElementById('pc_bookSearch').value='';
  document.getElementById('pc_bookResults').innerHTML='';
  renderPcBookChip();
  c1.classList.add('open');
}
function closePostCompose(){document.getElementById('postComposeModal').classList.remove('open');}
function renderPcBookChip(){
  const el=document.getElementById('pc_bookChip');
  const b=pcBookId&&db.books.find(x=>x.id===pcBookId);
  if(!b){pcBookId='';el.innerHTML='';return;}
  el.innerHTML=`<div class="sitem">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}${b.auteur?' — '+esc(b.auteur):''}</span>
    <button type="button" onclick="clearPcBook()">✕</button></div>`;
}
function clearPcBook(){pcBookId='';renderPcBookChip();}
function pcPickBook(id){
  pcBookId=id;
  document.getElementById('pc_bookSearch').value='';
  document.getElementById('pc_bookResults').innerHTML='';
  renderPcBookChip();
}
function renderPcBookResults(){
  const q=document.getElementById('pc_bookSearch').value.toLowerCase().trim();
  const el=document.getElementById('pc_bookResults');
  if(!q){el.innerHTML='';return;}
  const list=db.books.filter(b=>bookMatch(b,q)).slice(0,8);
  el.innerHTML=list.length?list.map(b=>
    `<div class="sitem" style="cursor:pointer" onclick="pcPickBook('${b.id}')">${coverEl(b.couverture,'sm')}<span class="nm">${esc(b.titre)}${b.auteur?' — '+esc(b.auteur):''}</span></div>`
  ).join(''):'<div class="isbnmsg">Aucun résultat.</div>';
}
function pickPostPhoto(camera){
  imgTarget={id:null,field:'postphoto',kind:'postcompose'};
  const inp=document.getElementById('imgPick');
  if(camera)inp.setAttribute('capture','environment');else inp.removeAttribute('capture');
  inp.click();
}
function renderPcPhotos(){
  document.getElementById('pc_photos').innerHTML=pcPhotos.map((u,i)=>
    `<div style="position:relative"><img src="${esc(u)}" style="width:70px;height:70px;object-fit:cover;border-radius:8px">
      <button type="button" onclick="pcPhotos.splice(${i},1);renderPcPhotos()" style="position:absolute;top:-6px;right:-6px;background:var(--red);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:.7rem;line-height:1;cursor:pointer">✕</button>
    </div>`).join('');
}
async function submitPost(){
  const texte=document.getElementById('pc_texte').value.trim();
  const bookId=pcBookId;
  const msg=document.getElementById('pc_msg');
  if(!texte&&!pcPhotos.length&&!bookId){msg.className='isbnmsg err';msg.textContent='Ajoute au moins un texte, une photo ou un livre.';return;}
  const c=await sbClient();
  if(!c||!sbUser){msg.className='isbnmsg err';msg.textContent="Connecte-toi d'abord.";return;}
  const b=bookId?db.books.find(x=>x.id===bookId):null;
  try{
    const {error}=await c.from('bibli_posts').insert({
      user_id:sbUser.id,
      book_id:bookId||'',book_titre:(b&&b.titre)||'',book_auteur:(b&&b.auteur)||'',book_couverture:(b&&b.couverture)||'',
      texte,photos:pcPhotos
    });
    if(error)throw error;
    closePostCompose();
    toast('Post publié ✅');
    renderFeed();
  }catch(e){
    msg.className='isbnmsg err';
    msg.textContent='⚠️ Impossible de publier — la table bibli_posts existe-t-elle ? (voir le script SQL fourni)';
  }
}
async function syncFeedForBook(b){
  const c=await sbClient();
  if(!c||!sbUser)return;
  try{
    if(b.statut==='done'){
      await c.from('bibli_feed').upsert({user_id:sbUser.id,book_id:b.id,titre:b.titre,auteur:b.auteur||'',
        couverture:b.couverture||'',note:b.note||null,date_fin:b.dateFin||null,updated_at:new Date().toISOString()});
    }else{
      await c.from('bibli_feed').delete().eq('user_id',sbUser.id).eq('book_id',b.id);
    }
  }catch(e){}
}
async function backfillFeed(){
  const c=await sbClient();
  if(!c||!sbUser){toast("Connecte-toi d'abord");return;}
  const done=db.books.filter(b=>b.statut==='done');
  if(!done.length){toast('Aucun livre terminé à synchroniser');return;}
  toast('Synchronisation de '+done.length+' livre(s)…');
  for(const b of done)await syncFeedForBook(b);
  toast('Synchronisation terminée ✅');
  renderFeed();
}
function applyTheme(){
  document.body.dataset.theme=db.settings.theme||'sombre';
  document.body.dataset.bois=db.settings.bois||'sombre';
}
function exportData(){
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='mabibli-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}
/* Conversion depuis une sauvegarde Book Nova */
const NV_LANG={fr:'Français',en:'Anglais',es:'Espagnol',de:'Allemand',it:'Italien',pt:'Portugais',nl:'Néerlandais',ja:'Japonais'};
const NV_GENRE={'science-fiction':'Science-fiction',fantasy:'Fantasy',romance:'Romance',contemporary:'Contemporain','non-fiction':'Non-fiction',thriller:'Thriller',mystery:'Policier',horror:'Horreur',classics:'Classique',historical:'Historique','young-adult':'Young adult',poetry:'Poésie',biography:'Biographie'};
function nvDate(t){return t?new Date(t).toISOString().slice(0,10):'';}
function fromBookNova(d){
  const books=(d.books||[]).map(b=>{
    const pages=+b.pageCount||0;
    const done=!!(b.completedAt||b.finishReadingDate||b.completionType||(pages>0&&(b.currentPage||0)>=pages));
    const reading=!done&&(!!b.startReadingDate||(b.currentPage||0)>0);
    const statut=done?'done':(reading?'reading':'tbr');
    const g=(b.genres||[])[0]||'';
    const NV_FMT={paper:'papier',ebook:'numerique',audio:'audio',audiobook:'audio'};
    return {
      id:b.id||uid(),
      titre:b.title||'Sans titre',
      synopsis:b.description||'',
      isbn:b.isbn||'',
      couverture:(b.imageUrl&&/^https?:/.test(b.imageUrl))?b.imageUrl:(b.isbn?'https://covers.openlibrary.org/b/isbn/'+b.isbn+'-M.jpg?default=false':''),
      format:NV_FMT[b.format]||'papier',
      pageActuelle:statut==='reading'?(b.currentPage||0):0,
      auteur:(b.authors||[]).join(', '),
      genre:NV_GENRE[g]||(g?g.charAt(0).toUpperCase()+g.slice(1):''),
      langue:NV_LANG[b.language]||b.language||'',
      pages,
      epaisseur:b.thickness>0?+(b.thickness*100).toFixed(1):0,
      fiction:(b.category||'fiction')!=='non-fiction',
      statut,
      progression:done?100:(pages?Math.min(100,Math.round((b.currentPage||0)/pages*100)):0),
      note:b.rating?Math.min(5,Math.round(b.rating)):0,
      avis:'',
      dateFin:done?nvDate(b.finishReadingDate||b.completedAt):'',
      dateAjout:b.createdAt||Date.now(),
    };
  });
  const nvLoan=(l,type)=>({
    id:l.id||uid(),
    titre:l.bookTitle||l.title||'?',
    personne:l.personName||l.person||l.borrowerName||l.lenderName||l.name||'?',
    type,date:nvDate(l.loanDate||l.date||l.borrowedDate||l.createdAt),
    note:l.notes||l.note||'',
    rendu:!!(l.returned||l.returnedAt||l.isReturned),
    dateAjout:l.createdAt||Date.now(),
  });
  const loans=[...(d.bookLoans||[]).map(l=>nvLoan(l,'prete')),
               ...(d.borrowedBooks||[]).map(l=>nvLoan(l,'emprunte'))];
  const sessions=[];
  (d.books||[]).forEach(b=>(b.readingSessions||[]).forEach(s=>{
    if(s.pages>0&&s.timestamp)sessions.push({id:uid(),date:nvDate(s.timestamp),bookId:b.id,titre:b.title||'',pages:s.pages});
  }));
  return {books,loans,sessions,settings:{...db.settings}};
}
function importData(input){
  const f=input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      if(!Array.isArray(d.books))throw 0;
      /* Book Nova ou format natif ? */
      const isNative=!d.books.length||d.books[0].titre!==undefined;
      const inc=isNative?{books:d.books,loans:d.loans||[],sessions:d.sessions||[],shelves:d.shelves||[],ranking:d.ranking||[],settings:d.settings||db.settings}:fromBookNova(d);
      const apply=merge=>{
        let addedCount=inc.books.length;
        if(merge){
          const ids=new Set(db.books.map(b=>b.id));
          const newBooks=inc.books.filter(b=>!ids.has(b.id));
          addedCount=newBooks.length;
          db.books.push(...newBooks);
          const lids=new Set(db.loans.map(l=>l.id));
          db.loans.push(...(inc.loans||[]).filter(l=>!lids.has(l.id)));
          const skey=s=>s.date+'|'+s.bookId;
          const sids=new Set(db.sessions.map(skey));
          db.sessions.push(...(inc.sessions||[]).filter(s=>!sids.has(skey(s))));
          const shids=new Set(db.shelves.map(s=>s.id));
          db.shelves.push(...(inc.shelves||[]).filter(s=>!shids.has(s.id)));
          const rids=new Set(db.ranking.map(r=>r.type+'|'+r.id));
          db.ranking.push(...(inc.ranking||[]).filter(r=>!rids.has(r.type+'|'+r.id)));
        }else{
          db=normalizeDb({books:inc.books,loans:inc.loans||[],sessions:inc.sessions||[],shelves:inc.shelves||[],ranking:inc.ranking||[],settings:inc.settings||db.settings});
        }
        save();closeModals();render();
        /* Convertit en arrière-plan toute couverture encore en base64 (import hors ligne, vieille
           sauvegarde…) vers notre storage — sinon la sync peut échouer silencieusement si le total
           dépasse la taille de requête acceptée par Supabase (gros fichiers d'import notamment). */
        cacheAllCoversQuiet();
        toast(merge
          ?'Import réussi ✅ '+addedCount+' nouveau'+(addedCount>1?'x':'')+' livre'+(addedCount>1?'s':'')+' ajouté'+(addedCount>1?'s':'')+' ('+db.books.length+' au total)'+(isNative?'':' — Book Nova')
          :'Import réussi ✅ '+addedCount+' livre'+(addedCount>1?'s':'')+' ('+db.books.length+' au total)'+(isNative?'':' — Book Nova'));
      };
      if(db.books.length)
        openDlg('Ta bibliothèque contient déjà '+db.books.length+' livres. Que faire de l\'import ('+inc.books.length+' livres) ?',null,[
          {label:'Fusionner (ajouter)',fn:()=>apply(true)},
          {label:'Tout remplacer',danger:true,fn:()=>apply(false)},
          {label:'Annuler',ghost:true}
        ]);
      else apply(false);
    }catch(e){offerImportFailureReport(f);}
  };
  r.readAsText(f);input.value='';
}
/* Format non reconnu : propose d'envoyer le fichier (avec le nom de l'appli d'origine) pour
   qu'on puisse ajouter la prise en charge de ce format, sur le même principe que sendFeedback
   (mailto + fichier hébergé, mailto n'acceptant pas de pièce jointe). */
async function sendImportFailureReport(file,appName){
  toast('Préparation…');
  const url=sbUser?await uploadFile(file,'import-fail',file.type||'application/json'):null;
  const fileNote=url?'\n\nFichier : '+url:'\n\n(Fichier non joint — connecte-toi pour pouvoir l\'envoyer)';
  const body='Fichier d\'import non reconnu, venant de : '+(appName||'(non précisé)')+fileNote+'\n\n— Envoyé depuis Ma Bibli';
  const mailto='mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('Ma Bibli — Format d\'import non reconnu')+'&body='+encodeURIComponent(body);
  window.location.href=mailto;
  toast('Ton appli mail va s\'ouvrir avec le fichier prêt 📧');
}
function offerImportFailureReport(file){
  openDlg('Fichier non reconnu 😕 De quelle application vient-il ? On peut t\'aider à l\'importer si tu nous l\'envoies.','',[
    {label:'Envoyer',fn:v=>sendImportFailureReport(file,(v||'').trim())},
    {label:'Annuler',ghost:true}
  ]);
}
function closeModals(){document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('open'));}

/* ---------- Rendu global ---------- */
function render(){
  applyTheme();
  const map={home:renderHome,lib:renderLib,shelf:renderShelves,saga:renderSagas,
    rank:renderRank,defi:renderDefi,stats:renderStats,cal:renderCal,disc:renderDisc,feedback:()=>{},
    friends:renderFriends,feed:renderFeed};
  (map[tab]||renderHome)();
}
async function loadLocalData(){
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
    if(d&&d.books)db=normalizeDb(d);
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
