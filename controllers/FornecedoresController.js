const FornecedoresModel = require('../models/FornecedoresModel');

async function getData(req, res) {
    try {

      console.log("wwww")
       const apiData = await FornecedoresModel.getDataFromDatabase();
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function getDataById(req, res) {
    try {

    const id = req.params.id;
  
       const apiData = await FornecedoresModel.getDataByIdFromDatabase(id);
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async function createFornecedor(req, res) {
    try {
      const newFornecedor = req.body;
      const createdFornecedor = await FornecedoresModel.createFornecedorInDatabase(newFornecedor);
  
      res.status(201).json(createdFornecedor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
async function updateFornecedor(req, res) {
    try {
      const id = req.params.id;
      const updatedFornecedor = req.body;
  
   
      const result = await FornecedoresModel.updateFornecedorInDatabase(id, updatedFornecedor);
  
      if (!result) {
        return res.status(404).json({ error: 'Fornecedor not found' });
      }
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async function ativarInativarFornecedor(req, res) {
    try {

    const id = req.params.id;
  
       const apiData = await FornecedoresModel.updateActiveStateDatabase(id);
  
       res.json(apiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {
    getData,
    getDataById,
    createFornecedor,
    updateFornecedor,
    ativarInativarFornecedor
  };