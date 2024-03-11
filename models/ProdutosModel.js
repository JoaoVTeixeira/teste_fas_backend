// Assume you're using a MySQL database with the mysql2 library
const mysql = require('mysql2/promise');
require('dotenv').config();


const DATABASE = process.env.DATABASE;
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.DBPORT


async function getDataFromDatabase() {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: 3307
    });

    try {

        const [rows] = await connection.execute(`
        SELECT * FROM produtos;
        `);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function getDataByIdFromDatabase(id) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {
        console.log(id)

        const [rows] = await connection.execute(`
        SELECT * FROM produtos WHERE ID = ?;
        `, [id]);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}


async function createProdutoInDatabase(newProduto) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {

        await connection.beginTransaction();


 
        const dataCriacao = newProduto.data_criacao !== undefined ? newProduto.data_criacao : null;

        const [produtosResult] = await connection.execute(
            'INSERT INTO produtos (Categoria, Descrição, Tipo, Categoriadespesa_id, Unidadecompra_id, Data_Criação, Inativo, Data_Pre_Cadastro, idusuario, Pre_Cadastro, Saneado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [newProduto.categoria, newProduto.descricao, newProduto.tipo, newProduto.categoria_despesa_id, newProduto.unidade_compra_id, dataCriacao, 0, newProduto.data_pre_cadastro, newProduto.id_usuario, newProduto.pre_cadastro, newProduto.saneado]
        );

        await connection.commit();


        const [createdProduto] = await connection.execute('SELECT * FROM produtos WHERE id = ?', [produtosResult.insertId]);

        return createdProduto[0];
    } catch (error) {
        await connection.rollback();

        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function updateProdutoInDatabase(id, updatedProduto) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {

        await connection.beginTransaction();

        
        const dataCriacao = updatedProduto.data_criacao !== undefined ? updatedProduto.data_criacao : null;
        
        
        const [updateResult] = await connection.execute(
            'UPDATE produtos SET Categoria = ?, Descrição = ?, Tipo = ?, Categoriadespesa_id = ?, Unidadecompra_id = ?, Data_Criação = ?,  Data_Pre_Cadastro = ?, idusuario = ?, Pre_Cadastro = ?, Saneado = ? WHERE ID = ?',
            [
              updatedProduto.categoria,
              updatedProduto.descricao,
              updatedProduto.tipo,
              updatedProduto.categoria_despesa_id,
              updatedProduto.unidade_compra_id,
              dataCriacao,
              updatedProduto.data_pre_cadastro,
              updatedProduto.id_usuario,
              updatedProduto.pre_cadastro,
              updatedProduto.saneado,
              id
            ]
          );

 
        await connection.commit();


        if (updateResult.affectedRows === 0) {
            return null;
        }


        const [updatedFornecedorResult] = await connection.execute('SELECT * FROM produtos WHERE ID = ?', [id]);

        return updatedFornecedorResult[0];
    } catch (error) {

        await connection.rollback();

        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function updateActiveStateDatabase(id) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {

        await connection.beginTransaction();


        const [updateResult] = await connection.execute(
            `UPDATE produtos
            SET Inativo = CASE
                WHEN Inativo = 1 THEN 0
                WHEN Inativo = 0 THEN 1
                ELSE Inativo  -- Handle other cases, if any
            END
            WHERE ID = ?;`, [id]

        );


        await connection.commit();


        if (updateResult.affectedRows === 0) {
            return null;
        }


        const [updatedFornecedorResult] = await connection.execute('SELECT * FROM produtos WHERE ID = ?', [id]);

        return updatedFornecedorResult[0];
    } catch (error) {

        await connection.rollback();

        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    getDataFromDatabase,
    getDataByIdFromDatabase,
    createProdutoInDatabase,
    updateProdutoInDatabase,
    updateActiveStateDatabase
};