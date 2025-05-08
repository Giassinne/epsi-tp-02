const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const jinaClient = require('../service/jina');

// GET - Récupérer tous les produits
router.get('/', (req, res) => {
  Product.getAll((err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(products);
  });
});

// GET - Récupérer un produit par son ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  Product.getById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  });
});

// POST - Créer un nouveau produit
router.post('/', (req, res) => {
  const { name, description, price, category } = req.body;
  
  // Validation des données
  if (!name) {
    return res.status(400).json({ message: 'Le nom du produit est requis' });
  }
  
  const product = {
    name,
    description: description || '',
    price: parseFloat(price) || 0,
    category: category || 'uncategorized'
  };
  
  Product.create(product, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// PUT - Mettre à jour un produit
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, price, category } = req.body;
  
  // Validation des données
  if (!name) {
    return res.status(400).json({ message: 'Le nom du produit est requis' });
  }
  
  const product = {
    name,
    description: description || '',
    price: parseFloat(price) || 0,
    category: category || 'uncategorized'
  };
  
  Product.update(id, product, (err, result) => {
    if (err) {
      if (err.message === 'Produit non trouvé') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// DELETE - Supprimer un produit
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  Product.delete(id, (err, result) => {
    if (err) {
      if (err.message === 'Produit non trouvé') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

router.post('/:id/enrich', async (req, res) => {
    const id = req.params.id;
    const { model = 'jina-chat-v1', tone = 'professionnel', length = 'medium' } = req.body;
    
    // Récupérer le produit
    Product.getById(id, async (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      
      try {
        // Préparer le prompt en fonction des paramètres
        let toneDescription;
        switch(tone) {
          case 'enthousiaste':
            toneDescription = 'très enthousiaste et dynamique';
            break;
          case 'informatif':
            toneDescription = 'informatif et objectif';
            break;
          case 'persuasif':
            toneDescription = 'persuasif et convaincant';
            break;
          case 'luxe':
            toneDescription = 'luxueux et haut de gamme';
            break;
          default:
            toneDescription = 'professionnel et équilibré';
        }
        
        let lengthDescription;
        switch(length) {
          case 'short':
            lengthDescription = 'courte (2-3 phrases)';
            break;
          case 'long':
            lengthDescription = 'longue et détaillée (5-7 phrases)';
            break;
          default:
            lengthDescription = 'moyenne (3-5 phrases)';
        }
        
        // Appel à l'API Jina.AI pour enrichir la description
        const prompt = `Améliore cette description de produit pour la rendre plus attrayante pour les clients. 
          Utilise un ton ${toneDescription} et crée une description ${lengthDescription}.
          
          Nom du produit: ${product.name}
          Description actuelle: ${product.description || 'Aucune description disponible'}
          Catégorie: ${product.category || 'Non catégorisé'}
          Prix: ${product.price} €
          
          Mets en valeur les caractéristiques principales et les bénéfices pour l'utilisateur.`;
        
        const enrichedDescription = await jinaClient.generateText(prompt, { model });
        
        // Mettre à jour le produit avec la nouvelle description
        const updatedProduct = {
          ...product,
          description: enrichedDescription
        };
        
        Product.update(id, updatedProduct, (updateErr, result) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({
            ...result,
            original_description: product.description,
            enriched_description: enrichedDescription
          });
        });
        
      } catch (error) {
        console.error('Erreur lors de l\'enrichissement:', error);
        res.status(500).json({ 
          message: 'Erreur lors de l\'enrichissement de la description', 
          error: error.message 
        });
      }
    });
  });

module.exports = router;