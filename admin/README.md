# Administration du site (Sveltia CMS)

Interface pour gérer **galerie**, **sponsors** et **polaroids de l'accueil** sans toucher
au code, depuis un ordinateur ou un téléphone. Chaque publication = un commit = le site se
met à jour tout seul en ~1 min.

URL une fois en ligne : `https://oasisforest.be/admin/` (ou `…github.io/oasisforest/admin/`).

---

## ⚠️ Étape restante avant que ça marche : l'authentification

GitHub Pages ne peut pas gérer la connexion GitHub tout seul. Deux choses à créer **une
seule fois** (gratuit). Ce sont des actions à faire par le club, pas par le code.

### 1. Créer une OAuth App GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Remplir :
   - **Application name** : `Union Oasis Forest CMS`
   - **Homepage URL** : `https://oasisforest.be/`
   - **Authorization callback URL** : l'URL du Worker de l'étape 2, suivie de `/callback`
     (ex. `https://oasisforest-cms-auth.<compte>.workers.dev/callback`).
3. Noter le **Client ID** et générer un **Client Secret** (à garder secret).

### 2. Déployer le Worker Cloudflare `sveltia/sveltia-cms-auth`

1. Créer un compte Cloudflare (gratuit) si besoin.
2. Déployer le Worker officiel : https://github.com/sveltia/sveltia-cms-auth
   (bouton « Deploy to Cloudflare » / `wrangler deploy`).
3. Dans les **variables** du Worker, renseigner `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`
   (ceux de l'étape 1).
4. Récupérer l'URL publique du Worker (`https://….workers.dev`).

### 3. Brancher le Worker dans la config

Dans [`config.yml`](./config.yml), remplacer le placeholder :

```yaml
base_url: https://REMPLACER-PAR-VOTRE-WORKER.workers.dev
```

par l'URL réelle du Worker.

### 4. Donner l'accès au bénévole

Le bénévole doit avoir un **compte GitHub** ajouté en **collaborateur** du dépôt
`tristede/oasisforest` (Settings → Collaborators). C'est la contrainte des CMS Git.

---

## Critère de réussite

Un bénévole ouvre `/admin` sur son téléphone après un match, se connecte avec GitHub,
ajoute 5 photos taguées « Académie », publie, et les voit en ligne < 2 min plus tard.
