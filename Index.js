// Importar el módulo 'express' para crear un servidor web
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const tokenService = require('./tokenService');

// Importar el módulo 'body-parser' para parsear los cuerpos de las solicitudes HTTP
const bodyParser = require('body-parser');

// Crear una instancia de la aplicación Express
const app = express();

// Utilizar el middleware 'body-parser' para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

//Genera Clave Secreta
const secretKey = 'cl@veRetoTecnicoNiv2';

//funciones para generar y verificar tokens JWT
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Expira en 1 hora
  };
  
  const verifyToken = (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  };
  

// Definir la tabla de precios por material
const preciosPorMaterial = {
  '001': 1500.00,
  '002': 1000.00,
  '003': 800.00,
  '004': 500.00,
  '005': 300.00,
  '006': 200.00,
  '007': 100.00,
};

// Definir la función que se ejecutará en Google Cloud Functions
exports.calcularPrestamo = async (req, res) => {
    const secretKey = tokenService.generateKey();
    const token = tokenService.generateToken({ userId: 'usuario123' }, secretKey);
   
    try {
        // Verificar la existencia del token en el encabezado de la solicitud
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ error: 'Token no proporcionado' });
        }
    
        // Verificar el token y extraer la información del usuario
        const userData = verifyToken(token);
        if (!userData) {
          return res.status(401).json({ error: 'Token inválido' });
        }
  
    
    // Extraer el ID del material y el peso en gramos de la solicitud
    const { idMaterial, pesoGramos } = req.body;

    // Verificar si el material existe en la tabla de precios
    if (!(idMaterial in preciosPorMaterial)) {
      return res.status(400).json({ error: 'Material no válido' });
    }

    // Calcular el precio por gramo y el monto del préstamo
    const precioGramo = preciosPorMaterial[idMaterial];
    const montoPrestamo = (pesoGramos * precioGramo) * 0.8;

    // Enviar la respuesta con el monto del préstamo calculado
    res.status(200).json({ montoPrestamo });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error interno del servidor');
  }
};
