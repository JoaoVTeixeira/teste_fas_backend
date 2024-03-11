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
        port: PORT
    });

    try {

        const [rows] = await connection.execute(`
        SELECT
        f.id,
        f.ativo,
        f.contato,
        f.atividade,
        f.tipo,
        f.observacao,
        f.Data,
        f.txmodify,
        f.dados_bancarios_id,
        f.pessoa_juridica_id,
        f.pessoa_fisica_id,
        db.agencia,
        db.banco,
        db.conta,
        IF(f.tipo = 'fisica', pf.cpf, NULL) AS cpf,
        IF(f.tipo = 'fisica', pf.email, NULL) AS email_pf,
        IF(f.tipo = 'fisica', pf.pis, NULL) AS pis,
        IF(f.tipo = 'fisica', pf.telefone, NULL) AS telefone_pf,
        IF(f.tipo = 'fisica', pf.data_nascimento, NULL) AS data_nascimento,
        IF(f.tipo = 'fisica', pf.nome_fantasia, NULL) AS nome_fantasia_pf,
        IF(f.tipo = 'fisica', pf.endereco_id, NULL) AS endereco_id_pf,
        IF(f.tipo = 'juridica', pj.cnpj, NULL) AS cnpj,
        IF(f.tipo = 'juridica', pj.inscricao_estadual, NULL) AS inscricao_estadual,
        IF(f.tipo = 'juridica', pj.nome_fantasia, NULL) AS nome_fantasia_pj,
        IF(f.tipo = 'juridica', pj.razao_social, NULL) AS razao_social,
        IF(f.tipo = 'juridica', pj.telefone, NULL) AS telefone_pj,
        IF(f.tipo = 'juridica', pj.endereco_id, NULL) AS endereco_id_pj,
        IF(f.tipo = 'juridica', pj.email, NULL) AS email_pj,
        e.cep,
        e.endereco,
        e.cidade_id,
        e.estado_id,
        e.bairro
    
    FROM
        fornecedores f
    LEFT JOIN
        dados_bancarios db ON f.dados_bancarios_id = db.id
    LEFT JOIN
        pessoa_fisica pf ON f.tipo = 'fisica' AND f.pessoa_fisica_id = pf.id
    LEFT JOIN
        pessoa_juridica pj ON f.tipo = 'juridica' AND f.pessoa_juridica_id = pj.id
    LEFT JOIN
        endereco e ON COALESCE(pf.endereco_id, pj.endereco_id) = e.id;
    
    
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

        const [rows] = await connection.execute(`
        SELECT
        f.id,
        f.ativo,
        f.contato,
        f.atividade,
        f.tipo,
        f.observacao,
        f.Data,
        f.txmodify,
        f.dados_bancarios_id,
        f.pessoa_juridica_id,
        f.pessoa_fisica_id,
        db.agencia,
        db.banco,
        db.conta,
        IF(f.tipo = 'fisica', pf.cpf, NULL) AS cpf,
        IF(f.tipo = 'fisica', pf.email, NULL) AS email_pf,
        IF(f.tipo = 'fisica', pf.pis, NULL) AS pis,
        IF(f.tipo = 'fisica', pf.telefone, NULL) AS telefone_pf,
        IF(f.tipo = 'fisica', pf.data_nascimento, NULL) AS data_nascimento,
        IF(f.tipo = 'fisica', pf.nome_fantasia, NULL) AS nome_fantasia_pf,
        IF(f.tipo = 'fisica', pf.endereco_id, NULL) AS endereco_id_pf,
        IF(f.tipo = 'juridica', pj.cnpj, NULL) AS cnpj,
        IF(f.tipo = 'juridica', pj.inscricao_estadual, NULL) AS inscricao_estadual,
        IF(f.tipo = 'juridica', pj.nome_fantasia, NULL) AS nome_fantasia_pj,
        IF(f.tipo = 'juridica', pj.razao_social, NULL) AS razao_social,
        IF(f.tipo = 'juridica', pj.telefone, NULL) AS telefone_pj,
        IF(f.tipo = 'juridica', pj.endereco_id, NULL) AS endereco_id_pj,
        IF(f.tipo = 'juridica', pj.email, NULL) AS email_pj,
        e.cep,
        e.endereco,
        e.cidade_id,
        e.estado_id,
        e.bairro
    
    FROM
        fornecedores f
    LEFT JOIN
        dados_bancarios db ON f.dados_bancarios_id = db.id
    LEFT JOIN
        pessoa_fisica pf ON f.tipo = 'fisica' AND f.pessoa_fisica_id = pf.id
    LEFT JOIN
        pessoa_juridica pj ON f.tipo = 'juridica' AND f.pessoa_juridica_id = pj.id
    LEFT JOIN
        endereco e ON COALESCE(pf.endereco_id, pj.endereco_id) = e.id
    
            WHERE
                f.id = ?;
    
    
        `, [id]);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}


async function createFornecedorInDatabase(newFornecedor) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {

        await connection.beginTransaction();


        const [enderecoResult] = await connection.execute(
            'INSERT INTO endereco (cep, endereco, cidade_id, estado_id, bairro) VALUES (?, ?, ?, ?, ?)',
            [newFornecedor.endereco.cep, newFornecedor.endereco.endereco, newFornecedor.endereco.cidade_id, newFornecedor.endereco.estado_id, newFornecedor.endereco.bairro]
        );

        const enderecoId = enderecoResult.insertId;


        let pessoaId = null;
        if (newFornecedor.tipo === 'juridica') {
            const [juridicaResult] = await connection.execute(
                'INSERT INTO pessoa_juridica (cnpj, email, inscricao_estadual, nome_fantasia, razao_social, telefone, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
                [newFornecedor.pessoa_juridica.cnpj, newFornecedor.pessoa_juridica.email, newFornecedor.pessoa_juridica.inscricao_estadual, newFornecedor.pessoa_juridica.nome_fantasia, newFornecedor.pessoa_juridica.razao_social, newFornecedor.pessoa_juridica.telefone, enderecoId]
            );

            pessoaId = juridicaResult.insertId;
        } else if (newFornecedor.tipo === 'fisica') {
            const [fisicaResult] = await connection.execute(
                'INSERT INTO pessoa_fisica (cpf, email, pis, telefone, data_nascimento, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
                [newFornecedor.pessoa_fisica.cpf, newFornecedor.pessoa_fisica.email, newFornecedor.pessoa_fisica.pis, newFornecedor.pessoa_fisica.telefone, newFornecedor.pessoa_fisica.data_nascimento, enderecoId]
            );

            pessoaId = fisicaResult.insertId;
        }


        const [agenciaResult] = await connection.execute(
            'INSERT INTO dados_bancarios (agencia, banco, conta) VALUES (?, ?, ?)',
            [newFornecedor.dados_bancarios.agencia, newFornecedor.dados_bancarios.banco, newFornecedor.dados_bancarios.conta]
        );

        const agenciaId = agenciaResult.insertId;


        const [fornecedorResult] = await connection.execute(
            'INSERT INTO fornecedores (ativo, contato, atividade, tipo, observacao, Data, txmodify, dados_bancarios_id, pessoa_juridica_id, pessoa_fisica_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newFornecedor.ativo, newFornecedor.contato, newFornecedor.atividade, newFornecedor.tipo, newFornecedor.observacao, newFornecedor.Data, newFornecedor.txmodify, agenciaId, pessoaId, pessoaId]
        );


        await connection.commit();


        const [createdFornecedor] = await connection.execute('SELECT * FROM fornecedores WHERE id = ?', [fornecedorResult.insertId]);

        return createdFornecedor[0];
    } catch (error) {
        await connection.rollback();

        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function updateFornecedorInDatabase(id, updatedFornecedor) {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT
    });

    try {

        await connection.beginTransaction();


        await connection.execute(
            'UPDATE endereco SET cep = ?, endereco = ?, cidade_id = ?, estado_id = ?, bairro = ? WHERE id = ?',
            [
                updatedFornecedor.endereco.cep,
                updatedFornecedor.endereco.endereco,
                updatedFornecedor.endereco.cidade_id,
                updatedFornecedor.endereco.estado_id,
                updatedFornecedor.endereco.bairro,
                id
            ]
        );


        if (updatedFornecedor.tipo === 'juridica') {
            await connection.execute(
                'UPDATE pessoa_juridica SET cnpj = ?, inscricao_estadual = ?, nome_fantasia = ?, razao_social = ?, telefone = ? WHERE id = ?',
                [
                    updatedFornecedor.pessoa_juridica.cnpj,
                    updatedFornecedor.pessoa_juridica.inscricao_estadual,
                    updatedFornecedor.pessoa_juridica.nome_fantasia,
                    updatedFornecedor.pessoa_juridica.razao_social,
                    updatedFornecedor.pessoa_juridica.telefone,
                    id
                ]
            );
        } else if (updatedFornecedor.tipo === 'fisica') {
            await connection.execute(
                'UPDATE pessoa_fisica SET cpf = ?, email = ?, pis = ?, telefone = ?, data_nascimento = ? WHERE id = ?',
                [
                    updatedFornecedor.pessoa_fisica.cpf,
                    updatedFornecedor.pessoa_fisica.email,
                    updatedFornecedor.pessoa_fisica.pis,
                    updatedFornecedor.pessoa_fisica.telefone,
                    updatedFornecedor.pessoa_fisica.data_nascimento,
                    id
                ]
            );
        }


        await connection.execute(
            'UPDATE dados_bancarios SET agencia = ?, banco = ?, conta = ? WHERE id = ?',
            [updatedFornecedor.dados_bancarios.agencia, updatedFornecedor.dados_bancarios.banco, updatedFornecedor.dados_bancarios.conta, id]
        );


        const [updateResult] = await connection.execute(
            'UPDATE fornecedores SET ativo = ?, contato = ?, atividade = ?, tipo = ?, observacao = ?, Data = ?, txmodify = ? WHERE id = ?',
            [
                updatedFornecedor.ativo,
                updatedFornecedor.contato,
                updatedFornecedor.atividade,
                updatedFornecedor.tipo,
                updatedFornecedor.observacao,
                updatedFornecedor.Data,
                updatedFornecedor.txmodify,
                id
            ]
        );


        await connection.commit();


        if (updateResult.affectedRows === 0) {
            return null;
        }


        const [updatedFornecedorResult] = await connection.execute('SELECT * FROM fornecedores WHERE id = ?', [id]);

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
            `UPDATE fornecedores
            SET ativo = CASE
                WHEN ativo = 1 THEN 0
                WHEN ativo = 0 THEN 1
                ELSE ativo  -- Handle other cases, if any
            END
            WHERE id = ?;`, [id]

        );


        await connection.commit();


        if (updateResult.affectedRows === 0) {
            return null;
        }


        const [updatedFornecedorResult] = await connection.execute('SELECT * FROM fornecedores WHERE id = ?', [id]);

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
    createFornecedorInDatabase,
    updateFornecedorInDatabase,
    updateActiveStateDatabase
};