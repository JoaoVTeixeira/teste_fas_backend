const ProdutosModel = require('../models/ProdutosModel');

async function getData(req, res) {
    try {

       const apiData = await ProdutosModel.getDataFromDatabase();
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function getDataById(req, res) {
    try {

    const id = req.params.id;
  
       const apiData = await ProdutosModel.getDataByIdFromDatabase(id);
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function createProduto(req, res) {
    try {
      const newProduto = req.body;
      const createdProduto = await ProdutosModel.createProdutoInDatabase(newProduto);
  
      res.status(201).json(createdProduto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
async function updateProduto(req, res) {
    try {
      const id = req.params.id;
      const updatedProduto = req.body;
  
   
      const result = await ProdutosModel.updateProdutoInDatabase(id, updatedProduto);
  
      if (!result) {
        return res.status(404).json({ error: 'Produto not found' });
      }
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async function ativarInativarProduto(req, res) {
    try {

    const id = req.params.id;
  
       const apiData = await ProdutosModel.updateActiveStateDatabase(id);
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {
    getData,
    getDataById,
    createProduto,
    updateProduto,
    ativarInativarProduto
  };