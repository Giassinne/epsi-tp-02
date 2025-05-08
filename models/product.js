const db = require('../database/db');

class Product {
  // Récupérer tous les produits
  static getAll(callback) {
    const sql = 'SELECT * FROM products';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  
  // Récupérer un produit par son ID
  static getById(id, callback) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  
  // Créer un nouveau produit
  static create(product, callback) {
    const sql = 'INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)';
    
    db.run(sql, [product.name, product.description, product.price, product.category], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      // this.lastID contient l'ID du produit créé
      callback(null, { id: this.lastID, ...product });
    });
  }
  
  // Mettre à jour un produit
  static update(id, product, callback) {
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?';
    
    db.run(sql, [product.name, product.description, product.price, product.category, id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      if (this.changes === 0) {
        return callback(new Error('Produit non trouvé'), null);
      }
      
      callback(null, { id: parseInt(id), ...product });
    });
  }
  
  // Supprimer un produit
  static delete(id, callback) {
    const sql = 'DELETE FROM products WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      if (this.changes === 0) {
        return callback(new Error('Produit non trouvé'), null);
      }
      
      callback(null, { message: 'Produit supprimé avec succès' });
    });
  }
}

module.exports = Product;
