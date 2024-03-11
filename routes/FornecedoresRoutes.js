const express = require('express');
const router = express.Router();

const FornecedoresController = require('../controllers/FornecedoresController');

router.get('/', FornecedoresController.getData);
router.get('/:id', FornecedoresController.getDataById);
router.post('/', FornecedoresController.createFornecedor);
router.put('/:id', FornecedoresController.updateFornecedor);
router.put('/ativar-desativar/:id', FornecedoresController.ativarInativarFornecedor);


module.exports = router;