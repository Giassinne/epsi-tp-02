# TP02 : Application de gestion de produits avec Angular et Jina.AI

Ce TP a pour objectif de développer une application Angular qui se connecte à une API existante pour gérer des produits et utiliser l'IA générative (Jina.AI) pour enrichir automatiquement les descriptions de produits.

## Objectifs pédagogiques

- Créer une application Angular complète
- Implémenter des fonctionnalités CRUD
- Interagir avec une API REST
- Intégrer une solution d'IA générative
- Gérer les états et les données dans une application front-end

## Mise en place de l'API

Avant de commencer à développer l'application Angular, vous devez mettre en place l'API backend fournie.

### Prérequis

- Node.js & NPM
- Clé API Jina.AI (gratuite, sans création de compte nécessaire)

### Installation de l'API

1. Clonez le dépôt de l'API
2. Installez les dépendances :
   ```
   cd epsi-tp-02
   npm install
   ```
3. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
   ```
   PORT=3000
   JINA_API_KEY=votre_clé_api_jina
   DATABASE_FILE=./database/products.sqlite
   ```
   
   > **Notes sur la configuration** :
   > - Vous pouvez modifier la valeur du `PORT` si le port 3000 est déjà utilisé sur votre machine
   > - Vous pouvez également modifier le chemin de `DATABASE_FILE` si vous souhaitez stocker la base de données dans un autre emplacement
   
   > **Obtention de la clé API Jina.AI** : 
   > - Accédez directement à [https://jina.ai/api-dashboard](https://jina.ai/api-dashboard)
   > - Vous pouvez obtenir une clé API gratuite en mode public sans nécessité de créer un compte
   > - **Important** : Ne prenez pas d'abonnement payant, le mode gratuit est amplement suffisant pour ce TP
   > - Copiez la clé API générée et collez-la dans votre fichier `.env`
   
4. Initialisez la base de données avec des produits de test :
   ```
   npm run init-db
   ```
5. Démarrez l'API :
   ```
   npm start
   ```

L'API sera disponible à l'adresse http://localhost:3000 (ou sur le port que vous avez spécifié dans le fichier `.env`).

## Endpoints de l'API

### Gestion des produits

- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit par son ID
- `POST /api/products` - Créer un nouveau produit
  ```json
  {
    "name": "Nom du produit",
    "description": "Description du produit",
    "price": 99.99,
    "category": "Catégorie"
  }
  ```
- `PUT /api/products/:id` - Mettre à jour un produit
  ```json
  {
    "name": "Nom du produit modifié",
    "description": "Description modifiée",
    "price": 89.99,
    "category": "Catégorie modifiée"
  }
  ```
- `DELETE /api/products/:id` - Supprimer un produit

### Enrichissement avec Jina.AI

- `POST /api/products/:id/enrich` - Enrichir la description d'un produit

## Développement de l'application Angular

Vous êtes libre d'organiser votre application Angular comme vous le souhaitez. Voici quelques exigences minimales :

### Fonctionnalités à implémenter

1. **Liste des produits**
   - Afficher tous les produits disponibles
   - Permettre le tri et/ou la recherche de produits
   - Afficher un aperçu des informations de chaque produit

2. **Détails d'un produit**
   - Afficher toutes les informations d'un produit
   - Permettre la navigation vers la page de modification
   - Offrir la possibilité d'enrichir la description avec Jina.AI
   - Afficher la description originale et enrichie pour comparaison

3. **Création/Modification de produit**
   - Formulaire de création d'un nouveau produit
   - Formulaire de modification d'un produit existant
   - Validation des champs obligatoires

4. **Suppression de produit**
   - Confirmation avant suppression
   - Retour à la liste après suppression

5. **Enrichissement de description**
   - Interface pour choisir les options d'enrichissement (ton, longueur)
   - Visualisation avant/après de la description
   - Possibilité de conserver ou rejeter la description enrichie

## Livraison

Votre projet doit être livré sous forme d'un dépôt Git (GitHub, GitLab, etc.) contenant :

1. Le code source de votre application Angular
2. Un fichier README.md avec :
   - Les instructions d'installation et d'exécution
   - Une brève documentation de l'application
   - Les choix techniques que vous avez faits
   - Les difficultés rencontrées et comment vous les avez surmontées

## Critères d'évaluation

- Fonctionnalités (toutes les fonctionnalités demandées sont-elles présentes ?)
- Qualité du code (structure, lisibilité, bonnes pratiques)
- Design et expérience utilisateur
- Gestion des erreurs et cas limites
- Documentation et instructions d'installation
- Originalité et fonctionnalités bonus