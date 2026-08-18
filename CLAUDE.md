# Union Oasis Forest — site du club

Site vitrine one-page d'un club de futsal bruxellois (Forest, 1190).
Hébergé sur **GitHub Pages** depuis la branche principale du dépôt `tristede/oasisforest`.

## Stack

- **Un seul fichier** : `index.html` — HTML, CSS et JS inclus. Pas de build, pas de bundler.
- **Tailwind CSS via CDN** (`cdn.tailwindcss.com`), configuré en ligne dans une balise `<script>` du `<head>`.
  ⚠️ Le CDN affiche un warning en production. Migration vers Tailwind CLI/PostCSS à prévoir avant la mise en ligne définitive.
- **Font Awesome 6.4** (CDN) pour les icônes.
- **Google Fonts** : Montserrat (texte) + Caveat (`font-handwriting`, légendes des polaroids).
- **Instagram embed.js** (CDN Meta, `//www.instagram.com/embed.js`) pour la bannière « Actu
  Instagram ». Seule dépendance externe hors JSON du site — voir `data/instagram.json`.

## Fichiers du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Le site entier |
| `favicon.svg` | Icône webapp iOS (logo sur fond sombre) |
| `white logo.svg` | Icône d'onglet (⚠️ espace dans le nom → encoder en `%20`) |
| `logo_uof.svg` | Logo source (déjà inliné dans `index.html`) |
| `img/*.webp` | Photos du club (`D85A3835`, `IMG_8135`, `IMG_8323`) — dossier média du CMS |
| `data/gallery.json` | Vignettes de la galerie (généré au chargement par JS) |
| `data/categories.json` | Liste des filtres de la galerie (`value`/`label`, éditable, ordre = ordre d'affichage) |
| `data/sponsors.json` | Bandeau sponsors (généré par JS, deux pistes) |
| `data/hero.json` | Polaroids du hero : liste d'images par polaroid, **tirage aléatoire à chaque visite** |
| `data/instagram.json` | URL du post Instagram mis en avant dans la bannière « Actu » (vide = bannière masquée) |
| `admin/index.html` + `admin/config.yml` | Interface Sveltia CMS (`/admin`) |
| `.nojekyll` | Empêche Jekyll d'ignorer les dossiers en underscore sur GitHub Pages |

## Conventions de code

- **Commentaires en français**, comme le reste du projet.
- Le logo est déclaré **une seule fois** en `<symbol id="club-logo">` juste après `<body>`, puis réutilisé via `<use href="#club-logo">`. Ne jamais dupliquer les tracés.
- Classe `.reveal` + IntersectionObserver pour les apparitions au scroll. Ajouter `reveal` à tout nouveau bloc.
- Classe `.zone-unie` (`#070f20`) : fond de couleur **unie** couvrant de la section « Nos Équipes » jusqu'à « Devenez Partenaire ». Un seul dégradé toléré, très léger, sur `#partenaires` (`to-accent/5`).
- `section[id] { scroll-margin-top: 11rem; }` compense la navbar + le bandeau sponsors, tous deux fixes. À conserver pour toute nouvelle section ancrée.
- Bascule desktop → menu mobile au breakpoint **`lg`** (1024px), pas `md`. En dessous, les liens s'écrasaient contre le logo.
- Couleur d'accent : `accent` = `#38bdf8`, `night` = `#020617`.
- **Contenus éditables** (galerie, sponsors, polaroids du hero) : ne jamais recoder les
  images en dur. Ajouter la donnée dans `data/*.json` + le champ correspondant dans
  `admin/config.yml`. Le rendu JS est regroupé dans `index.html` (bloc « RENDU DES CONTENUS
  ÉDITABLES »), avec dégradation propre si le JSON manque (image de secours pour le hero,
  section masquée pour les sponsors, état vide pour la galerie).
- **Chemins d'images** : le CMS écrit des chemins absolus `/img/…`, mais le rendu les
  convertit en relatifs (`toRel()` retire le `/` initial) — indispensable tant qu'il n'y a
  pas de `CNAME` (GitHub Pages sert alors sur le sous-chemin `/oasisforest/`).
- **Filtres de la galerie** : la liste des catégories (`data/categories.json`) est éditable
  via `/admin`, mais le champ « Catégorie » d'une photo reste un champ **texte libre**
  (widget `select` impossible : Sveltia CMS ne peut pas lire dynamiquement les options
  depuis un autre fichier JSON dans une config statique). Le volontaire doit taper la même
  valeur que la colonne « Valeur » d'un filtre — un `pattern` regex limite la casse/les
  caractères, mais ne garantit pas la correspondance exacte.

## Pièges rencontrés

- **Pas de `localStorage`** dans les aperçus d'artefacts Claude.ai (fonctionne normalement sur GitHub Pages).
- L'effet **parallax sur les polaroids** provoquait des chevauchements de texte dans la ligne du temps. Il en a été retiré — ne pas le réintroduire là-bas.
- Vérifier que les classes Tailwind utilisées **existent bien dans l'échelle par défaut** (`bottom-26` n'existe pas ; utiliser `bottom-[6.5rem]`).
- Les guillemets `«»` et le chevron de la ligne du temps utilisent `scale-x-[…]` pour resserrer leur angle.

## Chantiers ouverts

1. **Galerie et sponsors éditables par un bénévole** — priorité n°1.
   Spécification : `SPEC-cms.md`.
   - ✅ **Étape 1 faite** : galerie, sponsors et polaroids du hero sortis en JSON
     (`data/*.json`), rendus par JS au chargement. Filtres galerie fonctionnels.
     Polaroids du hero : liste d'images tirée au hasard à chaque visite.
   - ✅ **Étape 2 faite** : `admin/` (Sveltia CMS) avec collections Accueil / Galerie / Sponsors.
   - ⏳ **Étape 3 à finir par le club (actions externes)** : créer une **OAuth App GitHub**
     et déployer le **Worker Cloudflare** `sveltia/sveltia-cms-auth`, puis renseigner son URL
     dans `admin/config.yml` (`base_url`, actuellement un placeholder). Détail : `admin/README.md`.
   - Reste aussi à fournir les **vrais logos de sponsors** (placeholders « Partenaire B »… en attendant).
   - ✅ **Aperçu galerie** (section avant « Nos Réseaux ») et **bannière Actu Instagram**
     (section après « Nos Réseaux », embed officiel Meta) ajoutés, même logique de rendu
     JS + JSON éditable. `data/instagram.json.postUrl` est vide par défaut : coller l'URL
     d'un post via `/admin` (collection « Actu Instagram ») pour activer la bannière.
2. **Tailwind en production** — remplacer le CDN par un CSS compilé.
3. **Pop-up de recrutement** — envisagé, avec cooldown (mémorisation via `localStorage`).
   Uniquement sur des échéances **réelles** : places limitées par catégorie d'âge,
   dates d'affiliation RBFA, portes ouvertes, séance d'essai.
   ⚠️ Ne jamais implémenter de fausse promotion, faux compte à rebours ou fausse
   rareté : ces pratiques figurent sur la liste noire de la directive européenne
   2005/29/CE et sont interdites en toutes circonstances. Le club est une ASBL qui
   s'adresse à des familles — le risque réputationnel local s'ajoute au risque légal.
   Le contenu du pop-up doit être éditable via le CMS de l'étape 1.

## Contact du club (déjà dans le site)

- Complexe sportif : Bd. de la 2ème Armée Britannique 600, 1190 Forest
- Email : union@oasisforest.be — WhatsApp : +32 477 02 20 21
- Réseaux : `oasisforestfutsal` (Instagram, TikTok, Facebook)
