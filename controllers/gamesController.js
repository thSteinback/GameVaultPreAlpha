const pool = require('../config/db');

exports.home = async (req, res) => {
    try {
        const [jogos] = await pool.query(
            `SELECT j.*, 
            COALESCE(AVG(a.AVL_NOTA),0) AS media 
            FROM jogos j 
            LEFT JOIN avaliacoes a ON j.JOG_COD = a.JOG_COD 
            WHERE j.JOG_ATIVO = 1 
            GROUP BY j.JOG_COD 
            ORDER BY media DESC LIMIT 10`
        );
        res.render('index', { jogos, usuario: req.session.usuario });
    } catch (error) {
        res.render('error', { message: 'Erro ao carregar página inicial.' });
    }
};

exports.listarJogos = async (req, res) => {
    try {
        const { genero, ano, nota, busca } = req.query;
        let query = `
            SELECT j.*, COALESCE(AVG(a.AVL_NOTA),0) AS media 
            FROM jogos j
            LEFT JOIN avaliacoes a ON j.JOG_COD = a.JOG_COD
            LEFT JOIN jogoscategorias jc ON j.JOG_COD = jc.JOG_COD
            LEFT JOIN categorias c ON jc.CAT_COD = c.CAT_COD
            WHERE j.JOG_ATIVO = 1
        `;
        const params = [];
        if (genero) {
            query += ' AND c.CAT_NOME = ?';
            params.push(genero);
        }
        if (ano) {
            query += ' AND YEAR(j.JOG_DATA_CADASTRO) = ?';
            params.push(ano);
        }
        if (busca) {
            query += ' AND j.JOG_NOME LIKE ?';
            params.push('%' + busca + '%');
        }
        query += ' GROUP BY j.JOG_COD';
        if (nota) {
            query += ' HAVING media >= ?';
            params.push(Number(nota));
        }
        query += ' ORDER BY j.JOG_NOME ASC';

        const [jogos] = await pool.query(query, params);

        // Pega todos os gêneros para filtro
        const [categorias] = await pool.query('SELECT CAT_NOME FROM categorias');

        res.render('jogos', {
            jogos,
            categorias: categorias.map(c => c.CAT_NOME),
            usuario: req.session.usuario
        });
    } catch (error) {
        res.render('error', { message: 'Erro ao listar jogos.' });
    }
};

exports.listarFavoritos = async (req, res) => {
    try {
        const [jogos] = await pool.query(
            `SELECT j.*
            FROM favoritos f
            JOIN jogos j ON f.JOG_COD = j.JOG_COD
            WHERE f.USU_COD = ?`,
            [req.session.usuario.id]
        );
        res.render('favoritos', { jogos, usuario: req.session.usuario });
    } catch (error) {
        res.render('error', { message: 'Erro ao carregar favoritos.' });
    }
};

exports.toggleFavorito = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.usuario.id;
    try {
        // Checa se já está favoritado
        const [rows] = await pool.query(
            'SELECT * FROM favoritos WHERE USU_COD = ? AND JOG_COD = ?', [userId, id]
        );
        if (rows.length) {
            // Remove dos favoritos
            await pool.query(
                'DELETE FROM favoritos WHERE USU_COD = ? AND JOG_COD = ?', [userId, id]
            );
        } else {
            // Adiciona aos favoritos
            await pool.query(
                'INSERT INTO favoritos (USU_COD, JOG_COD) VALUES (?, ?)', [userId, id]
            );
        }
        res.redirect('/games/favoritos');
    } catch (error) {
        res.render('error', { message: 'Erro ao favoritar jogo.' });
    }
};
