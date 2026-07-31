# 📚 Ma Bibli

Application web de suivi de lecture, pensée pour iPhone (plein écran depuis l'écran d'accueil), en un seul fichier `index.html` — sans serveur, sans framework, sans build.

## Fonctionnalités

### Bibliothèque
- Livres avec statuts **À lire / En cours / Terminé**, format **papier / numérique / audio**, genre, langue, pages, épaisseur, ISBN, couverture et image de tranche.
- Ajout d'un livre par **recherche en ligne** (titre/auteur), par **ISBN** saisi, par **scan du code-barres** (caméra), ou par **photo d'une fiche de lecture manuscrite** analysée par IA (clé Gemini requise, voir plus bas).
- Suivi de l'avancement adapté au format : **page actuelle** pour le papier, **%** pour le numérique et l'audio. Bouton de mise à jour rapide sur la fiche, passage automatique en « Terminé » à 100 %.
- Fiche de lecture complète pour les livres terminés : note globale ★, **9 notes détaillées** (écriture, histoire, personnages, tension, tristesse, romance, drôle, facile à lire, fin), FMC/MMC, tropes, Recommander 👍/👎, Smut 🌶, résumé, la fin (repliée derrière un avertissement spoilers), commentaires, date de fin (ou « lu il y a longtemps » sans date).
- Recherche par **titre, auteur ou saga**, filtres par statut, genre et saga.
- Images de couverture/tranche par URL, **photothèque ou photo** (compressées automatiquement).

### Étagères virtuelles
- Étagères visuelles avec **nombre d'étages** configurable : livres debout (image de tranche ou dos coloré, largeur proportionnelle à l'épaisseur réelle), de face (couverture), ou couchés en **piles**.
- Étage précis par livre ou placement automatique à la suite (passage à l'étage suivant quand il n'y a plus de place).
- Toucher un livre ouvre sa fiche complète.

### Sagas
- Regroupement des tomes d'une même saga (champ Saga + numéro de tome sur la fiche livre), suivi de progression (tomes lus / total).

### Top (classement)
- Un classement unique mêlant **livres et sagas**, réordonnable.

### Défi de la pile
- Chaque livre terminé ajoute son **épaisseur réelle** (ou estimée d'après les pages) à une pile visuelle comparée à **ta taille**, avec paliers (chat, beagle, panda, autruche, girafe…).

### Stats
- Livres terminés, pages lues, PAL, note moyenne ; répartitions par genre, langue, format, fiction/non-fiction et par mois.

### Journal
- Calendrier mensuel : **couverture du livre terminé en fond de case** (+N si plusieurs), pages lues par jour (enregistrées automatiquement à chaque mise à jour d'avancement). Détail par jour, fiches accessibles au toucher.

### Découvrir
- Recommandations **façon Tinder** basées sur tes auteurs/genres les mieux notés (Google Books, livres en français) : swipe → = ajouté en « À lire », swipe ← = jamais reproposé.

### Données
- Stockage local + **sync cloud temps réel** via Supabase (Postgres) : sauvegarde automatique ~1 s après chaque modification, récupération sur n'importe quel appareil connecté au même compte.
- **Export/Import JSON**, et import direct des sauvegardes **Book Nova** (livres, statuts, notes, sessions de lecture).
- Icônes personnalisables : dépose des PNG (`book.png`, `shelf.png`, etc.) à côté d'`index.html` — repli automatique sur les icônes SVG intégrées.

## Déploiement (GitHub Pages)

1. Pousse le contenu du dossier sur un dépôt GitHub public (`index.html` + les `.png` d'icônes).
2. Sur GitHub : **Settings → Pages** → Source : *Deploy from a branch* → Branch : `main` / `(root)` → **Save**.
3. Après 1-2 min, l'app est en ligne : `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`.
4. Sur iPhone : ouvre l'URL dans **Safari** → **Partager** → **« Sur l'écran d'accueil »**. L'app s'ouvre en plein écran.
5. Mise à jour : remplace `index.html` dans le dépôt, puis bouton 🔄 dans l'app.

## Configuration

### Sync cloud (Supabase) — recommandé
1. Crée un projet gratuit sur [supabase.com](https://supabase.com), puis dans **SQL Editor** exécute :
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
2. **Authentication → Sign In / Providers → Email** : désactive « Confirm email ».
3. Dans l'app : ⚙️ → **Sync cloud** → l'URL et la clé publique du projet sont préremplies (modifie-les si tu utilises ton propre projet) → e-mail + mot de passe → **Créer mon compte**.

La clé « anon/publishable » est publique par conception : les données sont protégées par le compte (règle RLS, chaque utilisateur ne voit que sa ligne).

### Analyse de fiches par IA (optionnel)
Clé gratuite sur [aistudio.google.com](https://aistudio.google.com) → *Get API key* → à coller dans ⚙️ → **IA — analyse de fiches**. La clé reste sur l'appareil (jamais dans les exports ni la base).

### Divers
- ⚙️ → taille (cm) pour le défi de la pile.
- Recherche ISBN/titre : Google Books puis Open Library (aucune clé requise).
- Le scan de code-barres et la caméra exigent HTTPS (le cas sur GitHub Pages) et l'autorisation caméra.

## Notes techniques

- Un seul fichier `index.html` : HTML + CSS + JS vanilla, icônes SVG intégrées, aucune dépendance au chargement (ZXing et supabase-js sont chargés à la demande depuis un CDN).
- Données en `localStorage` (miroir local de la base), photos compressées en JPEG ~520 px.
- Conflits de sync résolus en « dernière écriture gagnante » (horodatage `meta.updatedAt`).
