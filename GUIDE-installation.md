# Ma Bibli — Guide d'installation

## 1. Mettre l'app en ligne (GitHub Pages, gratuit)

Depuis le passage du code à TypeScript (voir §7), l'app n'est plus un simple `index.html` à
envoyer tel quel : elle doit être **compilée** avant d'être publiée. Ça se fait automatiquement
via GitHub Actions à chaque envoi de code — il faut juste l'activer une fois.

1. Crée un compte gratuit sur [github.com](https://github.com) (si tu n'en as pas).
2. Clique sur **+** en haut à droite → **New repository**.
   - Nom : `ma-bibli`
   - Coche **Public** → **Create repository**.
3. Envoie tout le contenu du projet (dossier `src/`, `public/`, `.github/`, `index.html`,
   `package.json`, `vite.config.ts`, `tsconfig.json`…) dans le dépôt — le plus simple est
   d'utiliser `git push` depuis un terminal plutôt que le glisser-déposer web (voir §7 pour
   les commandes).
4. Va dans **Settings** → **Pages** (menu de gauche).
   - Source : choisis **GitHub Actions** (et non « Deploy from a branch »).
5. Va dans l'onglet **Actions** du dépôt : le premier envoi de code déclenche automatiquement
   le workflow *Build and deploy to GitHub Pages*. Attends qu'il passe au vert (1 à 2 minutes).
6. Ton app est en ligne à : `https://TON-PSEUDO.github.io/ma-bibli/`

Pour toute modification future : `git push` sur `main` republie automatiquement la nouvelle
version — plus besoin de re-uploader un fichier à la main.

## 2. Ajouter le raccourci sur ton iPhone

1. Ouvre l'URL dans **Safari** (obligatoirement Safari).
2. Appuie sur le bouton **Partager** (carré avec flèche).
3. Choisis **« Sur l'écran d'accueil »** → **Ajouter**.

L'app s'ouvre alors en plein écran, comme une vraie app.

## 3. Activer la BDD cloud (Supabase — sauvegarde + sync temps réel)

Tes données sont stockées dans une base Postgres gratuite et synchronisées instantanément entre tous tes appareils.

### a) Créer le projet (une seule fois, ~5 min)

1. Crée un compte gratuit sur [supabase.com](https://supabase.com) → **New project** (nom : `ma-bibli`, région Europe, choisis un mot de passe de base — tu n'en auras plus besoin ensuite).
2. Dans le projet : **SQL Editor** → colle ce script → **Run** :

```sql
create table public.bibli (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.bibli enable row level security;
create policy "acces perso" on public.bibli
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
alter publication supabase_realtime add table public.bibli;
```

3. **Authentication** → **Sign In / Providers** → **Email** : désactive « Confirm email » (plus simple pour un usage perso).
4. *(Recommandé — photos)* Toujours dans **SQL Editor**, exécute aussi ce script pour que les photos soient stockées dans le cloud (sync beaucoup plus rapide) :

```sql
insert into storage.buckets (id, name, public) values ('bibli','bibli', true)
  on conflict (id) do nothing;
create policy "upload perso" on storage.objects for insert to authenticated
  with check (bucket_id='bibli' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "maj perso" on storage.objects for update to authenticated
  using (bucket_id='bibli' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "lecture publique" on storage.objects for select using (bucket_id='bibli');
create policy "suppression perso" on storage.objects for delete to authenticated
  using (bucket_id='bibli' and (storage.foldername(name))[1] = auth.uid()::text);
```

**Sans cette étape**, les photos restent embarquées dans tes données au lieu d'être hébergées à
part — chaque sauvegarde/synchronisation devient beaucoup plus lourde, et ça peut faire gonfler
inutilement l'espace utilisé (couvertures/tranches en base64 au lieu de simples liens). Si tu as
commencé à utiliser l'app sans avoir lancé ce script, va dans ⚙️ Réglages → Données → **« Convertir
mes photos en stockage cloud »** une fois le script exécuté pour rattraper les photos déjà là.
4. **Project Settings** → **API** : note l'**URL** du projet et la clé **anon public**.

### b) Connecter l'app

L'URL du projet et la clé publique sont **déjà préremplies** dans l'app. Il suffit de : ⚙️ → **Sync cloud** → entre un e-mail + mot de passe de ton choix → **Créer mon compte** (la première fois ; ensuite « Se connecter » sur tout autre appareil).

C'est tout : chaque modification part en base ~1 s après, et tout appareil connecté au même compte se met à jour **instantanément**. Pour un nouvel appareil : installe l'app (§2), ⚙️ → mêmes URL/clé/identifiants → Se connecter → ta bibliothèque revient.

Note : la clé « anon public » n'est pas un secret — tes données sont protégées par ton compte (règle RLS : seule toi peux lire/écrire ta ligne).

### c) Activer les amis + le fil d'actualité (optionnel)

Pour utiliser la page **👥 Mes amis** et le **📰 Fil d'actualité**, exécute ce script en plus dans le **SQL Editor** :

```sql
-- Profils publics (nom + code ami + rendu HTML des sections publiques, visibles par les
-- autres comptes connectés)
create table public.bibli_public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  nom text default '',
  photo text default '',
  html text default '',
  updated_at timestamptz not null default now()
);
alter table public.bibli_public_profiles enable row level security;
create policy "lecture publique" on public.bibli_public_profiles for select using (true);
create policy "ecriture perso" on public.bibli_public_profiles for insert to authenticated
  with check (auth.uid() = user_id);
create policy "maj perso" on public.bibli_public_profiles for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Demandes d'amis + relations
create table public.bibli_friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, friend_id)
);
alter table public.bibli_friends enable row level security;
create policy "voir mes relations" on public.bibli_friends for select to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "envoyer une demande" on public.bibli_friends for insert to authenticated
  with check (auth.uid() = user_id);
create policy "repondre/annuler" on public.bibli_friends for update to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "supprimer" on public.bibli_friends for delete to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- Fil d'actualité : un livre terminé par entrée, visible par soi-même + ami·e·s accepté·e·s
create table public.bibli_feed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  titre text not null,
  auteur text default '',
  couverture text default '',
  note int,
  date_fin date,
  updated_at timestamptz not null default now(),
  unique (user_id, book_id)
);
alter table public.bibli_feed enable row level security;
create policy "voir le fil" on public.bibli_feed for select to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.bibli_friends f
      where f.status = 'accepted'
        and ((f.user_id = auth.uid() and f.friend_id = bibli_feed.user_id)
          or (f.friend_id = auth.uid() and f.user_id = bibli_feed.user_id))
    )
  );
create policy "ecrire mon fil" on public.bibli_feed for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Ensuite, dans l'app : ouvre **👥 Mes amis** (menu ➕), partage ton code à 6 caractères, et clique sur **🔄 Synchroniser mes livres terminés** dans le **📰 Fil d'actualité** pour envoyer tes livres déjà terminés.

### d) Activer les tranches communautaires (optionnel)

Pour que le bouton **🔍 Trouver une tranche** (dans la fiche d'un livre) propose aussi les photos de tranches ajoutées par d'autres utilisateurs de l'app, exécute ce script en plus :

```sql
create table public.bibli_spines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titre text not null,
  auteur text default '',
  isbn text default '',
  url text not null,
  created_at timestamptz not null default now()
);
alter table public.bibli_spines enable row level security;
create policy "lecture publique" on public.bibli_spines for select using (true);
create policy "ajout perso" on public.bibli_spines for insert to authenticated
  with check (auth.uid() = user_id);
create policy "suppression perso" on public.bibli_spines for delete to authenticated
  using (auth.uid() = user_id);
```

Dès qu'une photo de tranche que tu prends toi-même est enregistrée sur un livre, elle est automatiquement partagée dans cette base commune (titre/auteur pour la retrouver). Les tranches trouvées en ligne (recherche Google/Openverse) ne sont, elles, jamais partagées.

### e) Activer les posts (avec photos, commentaires, réactions) + le temps réel

Pour publier un post depuis le fil (texte + livre + photos, avec commentaires et réactions de tes ami·e·s), exécute ce script :

```sql
-- Posts : texte, livre associé (optionnel), photos
create table public.bibli_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text default '',
  book_titre text default '',
  book_auteur text default '',
  book_couverture text default '',
  texte text default '',
  photos text[] default '{}',
  created_at timestamptz not null default now()
);
alter table public.bibli_posts enable row level security;
create policy "voir les posts" on public.bibli_posts for select to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.bibli_friends f
      where f.status='accepted'
        and ((f.user_id=auth.uid() and f.friend_id=bibli_posts.user_id)
          or (f.friend_id=auth.uid() and f.user_id=bibli_posts.user_id))
    )
  );
create policy "creer mes posts" on public.bibli_posts for insert to authenticated
  with check (auth.uid() = user_id);
create policy "supprimer mes posts" on public.bibli_posts for delete to authenticated
  using (auth.uid() = user_id);

-- Commentaires (visibles par qui peut voir le post)
create table public.bibli_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.bibli_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  texte text not null,
  created_at timestamptz not null default now()
);
alter table public.bibli_comments enable row level security;
create policy "voir les commentaires" on public.bibli_comments for select to authenticated
  using (
    exists (
      select 1 from public.bibli_posts p
      where p.id = bibli_comments.post_id
        and (p.user_id = auth.uid()
          or exists (
            select 1 from public.bibli_friends f
            where f.status='accepted'
              and ((f.user_id=auth.uid() and f.friend_id=p.user_id)
                or (f.friend_id=auth.uid() and f.user_id=p.user_id))
          ))
    )
  );
create policy "ecrire un commentaire" on public.bibli_comments for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.bibli_posts p
      where p.id = bibli_comments.post_id
        and (p.user_id = auth.uid()
          or exists (
            select 1 from public.bibli_friends f
            where f.status='accepted'
              and ((f.user_id=auth.uid() and f.friend_id=p.user_id)
                or (f.friend_id=auth.uid() and f.user_id=p.user_id))
          ))
    )
  );
create policy "supprimer mes commentaires" on public.bibli_comments for delete to authenticated
  using (auth.uid() = user_id);

-- Réactions emoji (un·e utilisateur·ice ne peut poser deux fois le même emoji)
create table public.bibli_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.bibli_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, emoji)
);
alter table public.bibli_reactions enable row level security;
create policy "voir les reactions" on public.bibli_reactions for select to authenticated
  using (
    exists (
      select 1 from public.bibli_posts p
      where p.id = bibli_reactions.post_id
        and (p.user_id = auth.uid()
          or exists (
            select 1 from public.bibli_friends f
            where f.status='accepted'
              and ((f.user_id=auth.uid() and f.friend_id=p.user_id)
                or (f.friend_id=auth.uid() and f.user_id=p.user_id))
          ))
    )
  );
create policy "reagir" on public.bibli_reactions for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.bibli_posts p
      where p.id = bibli_reactions.post_id
        and (p.user_id = auth.uid()
          or exists (
            select 1 from public.bibli_friends f
            where f.status='accepted'
              and ((f.user_id=auth.uid() and f.friend_id=p.user_id)
                or (f.friend_id=auth.uid() and f.user_id=p.user_id))
          ))
    )
  );
create policy "retirer ma reaction" on public.bibli_reactions for delete to authenticated
  using (auth.uid() = user_id);

-- Temps réel : amis, fil, posts, commentaires, réactions arrivent en direct sur tous les
-- appareils connectés (sans avoir à tirer pour rafraîchir). Sans authentifiée, la publication
-- respecte quand même les policies ci-dessus.
alter publication supabase_realtime add table public.bibli_friends;
alter publication supabase_realtime add table public.bibli_feed;
alter publication supabase_realtime add table public.bibli_posts;
alter publication supabase_realtime add table public.bibli_comments;
alter publication supabase_realtime add table public.bibli_reactions;
```

Ensuite, dans l'app : ouvre le **📰 Fil d'actualité** → **✍️ Nouveau post** pour publier un texte, choisir un livre et ajouter des photos. Tes ami·e·s peuvent réagir avec un emoji et répondre en commentaire, et tout apparaît en direct sans recharger la page.

### f) Voir le vrai profil d'un·e ami·e (pas que ses livres terminés)

Si tu as créé `bibli_public_profiles` **avant** l'ajout de la colonne `html` ci-dessus (section c), ajoute-la avec :

```sql
alter table public.bibli_public_profiles add column if not exists html text default '';
```

Dès qu'un compte enregistre son Profil (ou synchronise), les sections cochées dans **Profil → Visible publiquement** (lecture en cours, statistiques, étagères, badges) sont envoyées telles quelles. Cliquer sur la photo/le nom d'un·e ami·e affiche désormais son vrai profil, avec exactement ce qu'iel a choisi de montrer — plus seulement ses livres terminés.

## 4. À savoir

- **Tes données restent sur ton téléphone** (rien n'est envoyé en ligne). Personne d'autre ne voit tes livres, même si l'URL est publique.
- **Fais des sauvegardes** : ⚙️ → « Exporter mes données ». Le fichier JSON s'enregistre dans Fichiers. Tu peux le réimporter à tout moment.
- Important : ouvre l'app depuis le raccourci régulièrement. Si tu supprimes le raccourci ou effaces les données Safari, les données locales peuvent être perdues — d'où les sauvegardes.
- **Pour modifier l'app plus tard** : remplace `index.html` dans ton dépôt GitHub (Upload files → même nom → Commit).

## 5. Analyse de fiches de lecture (IA, optionnel)

Pour remplir un livre en photographiant une fiche de lecture manuscrite :

1. Va sur [aistudio.google.com](https://aistudio.google.com) → connecte-toi avec un compte Google → **Get API key** → **Create API key** (gratuit).
2. Dans l'app : ⚙️ → **IA — analyse de fiches** → colle la clé → Enregistrer.
3. Dans « Ajouter un livre » : **📄 Remplir depuis une photo de fiche** → prends la fiche en photo. Titre, auteur, notes détaillées, piments, résumé… tout se remplit — vérifie et enregistre.

## 6. Réglage du défi

⚙️ → entre ta taille en cm. Chaque livre terminé ajoute son épaisseur à la pile (réelle si tu la renseignes, sinon estimée d'après le nombre de pages).

## 7. Développer en local (TypeScript + Vite)

Le code est passé d'un unique `index.html` (HTML + tout le JS mélangé dedans) à une vraie
structure de projet, pour rester lisible à mesure que l'app grossit :

```
book-tracker/
  index.html        squelette HTML (structure des pages, quasi plus de logique)
  src/
    main.ts         toute la logique de l'app (TypeScript)
    style.css       tout le CSS
  public/           images, manifest, service worker — copiés tels quels au build
  package.json, vite.config.ts, tsconfig.json
```

**Lancer l'app en local** (nécessite [Node.js](https://nodejs.org)) :

```bash
npm install   # une seule fois
npm run dev   # démarre le serveur de développement (rechargement automatique)
```

**Construire la version publiée** (fait automatiquement par GitHub Actions à chaque push,
inutile de le faire à la main sauf pour vérifier avant d'envoyer) :

```bash
npm run build     # génère dist/
npm run preview   # sert dist/ pour vérifier le résultat final
```

Note sur le TypeScript : le typage est actuellement permissif (`strict: false` dans
`tsconfig.json`) — le code migré depuis l'ancien `index.html` fonctionne tel quel sans qu'il
ait fallu annoter chaque variable. Le typage peut être resserré progressivement au fil des
modifications, fichier par fichier, sans tout casser d'un coup.

Les fonctions appelées depuis des attributs `onclick="..."` dans le HTML (partout dans l'app)
sont explicitement exposées sur `window` à la fin de `src/main.ts` — c'est nécessaire en
module ES (contrairement à un `<script>` classique) et permet de garder ces centaines
d'attributs HTML inchangés plutôt que de tout réécrire en écouteurs d'évènements.
