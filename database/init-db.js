const db = require('./db');

// Fonction pour initialiser la base de données avec des données de test
const initDatabase = () => {
  // Supprimer les données existantes
  db.run('DELETE FROM products', [], (err) => {
    if (err) {
      console.error('Erreur lors de la suppression des données:', err.message);
      return;
    }
    
    // Insérer des données de test
    const products = [
      {
        name: 'Smartphone XYZ',
        description: 'Un smartphone de dernière génération',
        price: 599.99,
        category: 'electronics'
      },
      {
        name: 'Laptop Pro',
        description: 'Ordinateur portable pour professionnels',
        price: 1299.99,
        category: 'electronics'
      },
      {
        name: 'Chaise de bureau',
        description: 'Chaise ergonomique pour bureau',
        price: 199.99,
        category: 'furniture'
      }
    ];
    
    const stmt = db.prepare('INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)');
    
    products.forEach(product => {
      stmt.run(product.name, product.description, product.price, product.category);
    });
    
    stmt.finalize();
    
    console.log('Base de données initialisée avec des données de test');
  });
};

// Exécuter l'initialisation
initDatabase();

// Fermer la connexion une fois terminée
setTimeout(() => {
  db.close();
  console.log('Connexion à la base de données fermée');
}, 1000);
