const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
    user: 'tu_usuario',
    password: 'tu_contrasena',
    server: 'Localhost', // por ejemplo, 'localhost'
    database: 'TIENDAONLINE',
};

app.get('/productos', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Productos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
