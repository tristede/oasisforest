# Spécification — Galerie et sponsors éditables

Objectif : permettre à un **bénévole non technique** de gérer les photos de la galerie
et les logos de sponsors sans jamais toucher au code, depuis un ordinateur ou un
téléphone.

Contexte : site statique mono-fichier (`index.html`) hébergé sur **GitHub Pages**,
dépôt `tristede/oasisforest`. Pas de serveur, pas d'étape de build.

Solution retenue : **Sveltia CMS**, un CMS Git qui écrit directement dans le dépôt.
Chaque publication = un commit = un redéploiement automatique de GitHub Pages.

---

## Étape 1 — Sortir les données du HTML

Aujourd'hui les 6 vignettes de la galerie et les 5 sponsors sont **codés en dur**
dans `index.html`. Il faut les externaliser en JSON, puis les rendre en JS au
chargement de la page.

### `data/gallery.json`

```json
{
  "photos": [
    {
      "image": "/img/D85A3835.webp",
      "legende": "Match de D2 à domicile",
      "categorie": "d2"
    }
  ]
}
```

- `categorie` : `"d2"` | `"academie"` — doit correspondre aux filtres existants.
- Ordre du tableau = ordre d'affichage.

### `data/sponsors.json`

```json
{
  "sponsors": [
    {
      "nom": "Nom du sponsor",
      "logo": "/img/sponsors/nom-sponsor.svg",
      "url": "https://exemple.be",
      "principal": true
    }
  ]
}
```

- `principal: true` → affiché avec l'icône couronne (rôle actuel de « Sponsor Maillot »).
- `url` facultative : si absente, le logo ne doit pas être cliquable.

### Rendu attendu

**Galerie** — générer les vignettes dans `#gallery-page` à partir du JSON, en
conservant strictement le markup actuel (`aspect-square`, `rounded-3xl`,
`glass-panel`, survol avec zoom `group-hover:scale-110`, clic → `openLightbox()`).

**Filtres** — les trois boutons « Tout / D2 Nationale / Académie » sont
actuellement **purement décoratifs**, aucun JS derrière. Les rendre fonctionnels :
filtrage sur `categorie`, état actif visuel repris du bouton « Tout »
(`bg-accent text-night`), les autres en `glass-panel`.

**Sponsors** — le bandeau défilant (`#sponsors-marquee`) contient deux copies
identiques du contenu pour boucler à l'infini. Le JS doit **générer les deux**
à partir du même JSON ; la seconde copie garde `aria-hidden="true"`.

### Contraintes

- Zéro dépendance ajoutée. `fetch()` + template literals suffisent.
- Prévoir le cas « JSON introuvable ou vide » : ne pas casser la page,
  masquer proprement la section concernée.
- Les images du site (hero, ligne du temps) restent en dur : elles ne sont pas
  éditables et font partie du design.

---

## Étape 2 — Interface d'édition

### `admin/index.html`

Page autonome chargeant Sveltia CMS depuis son CDN. Une dizaine de lignes,
pas de framework.

### `admin/config.yml`

Deux collections de type `files` (fichiers uniques, pas des dossiers d'articles) :

```yaml
backend:
  name: github
  repo: tristede/oasisforest
  branch: main
  base_url: https://<worker>.workers.dev   # voir étape 3

media_folder: img
public_folder: /img

collections:
  - name: galerie
    label: Galerie photos
    files:
      - name: photos
        label: Photos
        file: data/gallery.json
        fields:
          - name: photos
            label: Photos
            widget: list
            fields:
              - { name: image, label: Photo, widget: image }
              - { name: legende, label: Légende, widget: string }
              - name: categorie
                label: Catégorie
                widget: select
                options:
                  - { label: "D2 Nationale", value: "d2" }
                  - { label: "Académie", value: "academie" }

  - name: sponsors
    label: Sponsors
    files:
      - name: liste
        label: Liste des sponsors
        file: data/sponsors.json
        fields:
          - name: sponsors
            widget: list
            fields:
              - { name: nom, label: Nom, widget: string }
              - { name: logo, label: Logo, widget: image }
              - { name: url, label: Site web, widget: string, required: false }
              - { name: principal, label: Sponsor maillot, widget: boolean, default: false }
```

Le widget `list` donne au bénévole l'ajout, la suppression et le **réordonnancement
par glisser-déposer** — exactement le besoin exprimé.

---

## Étape 3 — Authentification

GitHub Pages ne peut pas héberger de backend OAuth. Deux éléments à créer :

1. Une **OAuth App GitHub** (Settings → Developer settings → OAuth Apps).
2. Le **Worker Cloudflare officiel** `sveltia/sveltia-cms-auth`, déployé en
   quelques clics, gratuit. Son URL alimente `base_url` dans `config.yml`.

Le bénévole devra disposer d'un **compte GitHub ajouté en collaborateur** du dépôt.
C'est la contrainte inhérente aux CMS Git — à anticiper avant de lui promettre l'accès.

---

## Points d'attention

- **Poids des images.** Le CMS accepte n'importe quel JPEG de 5 Mo sorti d'un
  reflex. Documenter dans l'interface (via `hint:` sur le champ image) une
  consigne claire : redimensionner à 1600 px de large maximum. Sans garde-fou,
  la galerie deviendra injouable sur mobile.
- **Formats.** Le site utilise `.webp`. Ne pas rejeter les `.jpg`/`.png` déposés
  par le bénévole, mais privilégier le WebP dans la documentation.
- Ajouter un fichier vide **`.nojekyll`** à la racine : GitHub Pages passe les
  sites par Jekyll par défaut, ce qui ignore silencieusement les dossiers
  commençant par un underscore.
- Vérifier après coup que le **lazy loading** est bien présent sur les vignettes
  générées (`loading="lazy"`), sinon la galerie chargera toutes les photos d'un coup.

---

## Critère de réussite

Un bénévole qui n'a jamais vu le code doit pouvoir, depuis son téléphone après un
match : ouvrir `/admin`, se connecter, ajouter 5 photos taguées « Académie »,
publier, et les voir en ligne moins de deux minutes plus tard.
