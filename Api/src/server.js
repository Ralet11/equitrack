const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const horseRoutes = require('./routes/horseRoutes');
const breedRoutes = require('./routes/breedRoutes');
const activityRoutes = require('./routes/activityRoutes');
const activityTypeRoutes = require('./routes/activityTypeRoutes');
const noteRoutes = require('./routes/noteRoutes')
const sequelize = require('./sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());
app.use(morgan('dev'))

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/horses", horseRoutes);
app.use("/api/breeds", breedRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activityTypes", activityTypeRoutes);
app.use("/api/notes", noteRoutes);

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Manejo de promesas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo de promesa no manejado:', promise, 'razón:', reason);
});

sequelize.sync({ force: false }).then(() => {
    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });

}).catch((error) => {
    console.error('Error al sincronizar modelos con la base de datos:', error);
});

