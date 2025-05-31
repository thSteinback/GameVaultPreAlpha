const pool = require('../config/db');

exports.showPerfil = async (req, res) => {
    try {
        const [usuario] = await pool.query(
            'SELECT * FROM usuarios WHERE USU_COD = ?', [req.session.usuario.id]
        );
        res.render('perfil', { usuario: usuario[0] });
    } catch (error) {
        res.render('error', { message: 'Erro ao carregar perfil.' });
    }
};

exports.updateAvatar = async (req, res) => {
    if (!req.file) return res.redirect('/user/perfil');
    try {
        await pool.query(
            'UPDATE usuarios SET USU_AVATAR = ? WHERE USU_COD = ?',
            [req.file.filename, req.session.usuario.id]
        );
        req.session.usuario.avatar = req.file.filename;
        res.redirect('/user/perfil');
    } catch (error) {
        res.render('error', { message: 'Erro ao atualizar avatar.' });
    }
};

exports.updateBanner = async (req, res) => {
    if (!req.file) return res.redirect('/user/perfil');
    try {
        await pool.query(
            'UPDATE usuarios SET USU_BANNER = ? WHERE USU_COD = ?',
            [req.file.filename, req.session.usuario.id]
        );
        req.session.usuario.banner = req.file.filename;
        res.redirect('/user/perfil');
    } catch (error) {
        res.render('error', { message: 'Erro ao atualizar banner.' });
    }
};

exports.showOutroPerfil = async (req, res) => {
    try {
        const [usuario] = await pool.query(
            'SELECT * FROM usuarios WHERE USU_COD = ?', [req.params.id]
        );
        if (!usuario.length) return res.render('error', { message: 'Usuário não encontrado.' });

        // Puxar contagem de curtidas, comentários, avaliações, se desejar
        // Exemplo:
        const [curtidas] = await pool.query(
            'SELECT COUNT(*) AS total FROM favoritos WHERE USU_COD = ?', [req.params.id]
        );
        const [comentarios] = await pool.query(
            'SELECT COUNT(*) AS total FROM comentarios WHERE USU_COD = ?', [req.params.id]
        );
        const [avaliacoes] = await pool.query(
            'SELECT COUNT(*) AS total FROM avaliacoes WHERE USU_COD = ?', [req.params.id]
        );

        res.render('perfil_usuario', {
            usuario: usuario[0],
            curtidas: curtidas[0].total,
            comentarios: comentarios[0].total,
            avaliacoes: avaliacoes[0].total
        });
    } catch (error) {
        res.render('error', { message: 'Erro ao carregar perfil do usuário.' });
    }
};
