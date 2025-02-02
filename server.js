const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por Railway o 3000 como predeterminado

// Habilitar CORS para permitir conexiones desde tu página web
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Sirve archivos estáticos desde la carpeta raíz del proyecto

const CLAVE_ADMIN = "Luciana15";  // Cambia esta contraseña si lo deseas
const DATA_FILE = "confirmaciones.json";

// Cargar confirmaciones desde el archivo
function cargarConfirmaciones() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
}

// Guardar confirmaciones en el archivo
function guardarConfirmaciones(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Ruta para guardar la confirmación de asistencia
app.post('/confirmar', (req, res) => {
    const { nombre, asistencia, lugaresConfirmados } = req.body;

    if (!nombre || asistencia === undefined || lugaresConfirmados === undefined) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    let confirmaciones = cargarConfirmaciones();
    confirmaciones.push({ nombre, asistencia, lugaresConfirmados });
    guardarConfirmaciones(confirmaciones);

    res.json({ mensaje: "Confirmación guardada correctamente" });
});

// Ruta para obtener la lista de confirmaciones (solo con contraseña)
app.post('/ver-confirmaciones', (req, res) => {
    const { clave } = req.body;

    if (clave !== CLAVE_ADMIN) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json(cargarConfirmaciones());
});

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Cambia 'index.html' por el nombre de tu archivo HTML principal
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

