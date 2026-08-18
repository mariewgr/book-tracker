import { defineConfig } from 'vite';

// base: './' — chemins relatifs dans le build, pour que l'app fonctionne aussi bien servie
// à la racine (dev local) que depuis un sous-dossier (GitHub Pages : /book-tracker/).
export default defineConfig({
  base: './',
});
