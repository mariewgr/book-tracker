# Ma Bibli — Guide d'installation

## 1. Mettre l'app en ligne (GitHub Pages, gratuit)

1. Crée un compte gratuit sur [github.com](https://github.com) (si tu n'en as pas).
2. Clique sur **+** en haut à droite → **New repository**.
   - Nom : `ma-bibli`
   - Coche **Public** → **Create repository**.
3. Sur la page du dépôt : **uploading an existing file** (ou Add file → Upload files).
4. Glisse le fichier `index.html` → **Commit changes**.
5. Va dans **Settings** → **Pages** (menu de gauche).
   - Source : **Deploy from a branch**, Branch : **main** / (root) → **Save**.
6. Attends 1 à 2 minutes. Ton app est en ligne à :
   `https://TON-PSEUDO.github.io/ma-bibli/`

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
insert into storage.buckets (id, name, public) values ('bibli','bibli', true);
create policy "upload perso" on storage.objects for insert to authenticated
  with check (bucket_id='bibli' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "maj perso" on storage.objects for update to authenticated
  using (bucket_id='bibli' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "lecture publique" on storage.objects for select using (bucket_id='bibli');
```
4. **Project Settings** → **API** : note l'**URL** du projet et la clé **anon public**.

### b) Connecter l'app

L'URL du projet et la clé publique sont **déjà préremplies** dans l'app. Il suffit de : ⚙️ → **Sync cloud** → entre un e-mail + mot de passe de ton choix → **Créer mon compte** (la première fois ; ensuite « Se connecter » sur tout autre appareil).

C'est tout : chaque modification part en base ~1 s après, et tout appareil connecté au même compte se met à jour **instantanément**. Pour un nouvel appareil : installe l'app (§2), ⚙️ → mêmes URL/clé/identifiants → Se connecter → ta bibliothèque revient.

Note : la clé « anon public » n'est pas un secret — tes données sont protégées par ton compte (règle RLS : seule toi peux lire/écrire ta ligne).

### c) Activer les amis + le fil d'actualité (optionnel)

Pour utiliser la page **👥 Mes amis** et le **📰 Fil d'actualité**, exécute ce script en plus dans le **SQL Editor** :

```sql
-- Profils publics (nom + code ami, visibles par les autres comptes connectés)
create table public.bibli_public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  nom text default '',
  photo text default '',
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
