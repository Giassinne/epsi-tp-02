# TP02 - API de gestion de produits avec enrichissement par Jina.AI

## Objectif

Ce projet a pour but de développer une API REST permettant de gérer des produits (CRUD) avec une fonctionnalité supplémentaire : l'enrichissement automatique des descriptions de produits via un appel à l'API Jina.AI.

---

## Structure du projet

- `routes/product.js` : contient les routes Express pour les opérations CRUD et l'enrichissement.
- `models/product.js` : contient les opérations de base de données (SQLite) pour les produits.
- `service/jina.js` : gère la communication avec l'API Jina.AI (non fourni ici).
- `database/db.js` : configuration de la base SQLite.
- `README.md` : document d’explication et de justification.

---

## Fonctionnalités

- **GET /api/products** : récupérer tous les produits.
- **GET /api/products/:id** : récupérer un produit par son ID.
- **POST /api/products** : créer un nouveau produit.
- **PUT /api/products/:id** : modifier un produit existant.
- **DELETE /api/products/:id** : supprimer un produit.
- **POST /api/products/:id/enrich** : enrichir la description d’un produit en appelant l’API Jina.AI.

---

## Problèmes rencontrés et solutions

### 1. **Erreur 400 lors de la création d’un produit**
- **Problème** : Une erreur 400 (`"Le nom du produit est requis"`) survenait même lorsque le champ `"name"` était présent dans le corps de la requête.
- **Cause** : L'erreur venait du format ou de la manière dont les données étaient envoyées (probablement un mauvais `Content-Type` ou `body-parser` mal configuré).
- **Solution** : Vérifier que les requêtes sont envoyées avec le bon `Content-Type: application/json` et que `express.json()` est bien utilisé dans le serveur.

### 2. **Erreur HTTP non descriptive avec Standalion**
- **Problème** : L'erreur `HttpException: Bad Request` apparaissait sans détails explicites.
- **Cause** : Le framework Standalion ne donnait pas assez de détails sur les erreurs du corps de requête.
- **Solution** : Utiliser des outils comme Postman ou cURL avec un corps bien formé pour tester, et s'assurer que le format des données correspond à ce que le serveur attend.

---

## Gestion des erreurs

Dans la route d’enrichissement `/api/products/:id/enrich` :

- Un **bloc `try-catch`** est utilisé pour capturer les erreurs pouvant survenir lors de l’appel à l’API Jina.AI.
- En cas d’échec (réseau, format de réponse, etc.), une réponse JSON structurée est renvoyée avec un message clair et le détail de l’erreur.

---

## Limitations

- Aucun timeout ou validation stricte n’a encore été mis en place pour les champs `tone` et `length`. Les valeurs par défaut sont utilisées si aucune valeur n’est fournie.
- Le fichier `product.js` dans `models` utilise des **callbacks** classiques et ne bénéficie donc pas de blocs `try-catch`. La gestion d’erreur est déléguée à la logique du contrôleur.

---

## Lancement

```bash
npm install
ng serve
