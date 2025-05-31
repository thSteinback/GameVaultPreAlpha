const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'minha_sessao',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gamesRoutes = require('./routes/games');
const indexRoutes = require('./routes/index');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/games', gamesRoutes);

// Erro 404
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página não encontrada!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
