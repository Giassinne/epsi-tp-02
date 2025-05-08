const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Configuration pour Jina.AI
const jinaClient = {
  apiKey: process.env.JINA_API_KEY,
  baseURL: 'https://api.jina.ai/v1',

  generateText: async function(prompt, options = {}) {
    try {
      const { model = 'jina-chat-v1' } = options;
      
      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/chat/completions`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: model,
          messages: [
            { role: 'system', content: 'Vous êtes un expert en marketing de produits.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        }
      });
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur Jina.AI:', error.response ? error.response.data : error.message);
      throw new Error('Erreur lors de la génération de texte avec Jina.AI');
    }
  },

  setApiKey: function(apiKey) {
    this.apiKey = apiKey;
    return this;
  }
};

module.exports = jinaClient;