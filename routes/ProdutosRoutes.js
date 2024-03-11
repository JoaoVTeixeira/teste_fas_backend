const express = require('express');
const router = express.Router();

const ProdutosController = require('../controllers/ProdutosController');

router.get('/', ProdutosController.getData);
router.get('/:id', ProdutosController.getDataById);
router.post('/', ProdutosController.createProduto);
router.put('/:id', ProdutosController.updateProduto);
router.put('/ativar-desativar/:id', ProdutosController.ativarInativarProduto);


module.exports = router;