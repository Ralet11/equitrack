const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Por favor, proporciona todos los campos requeridos.' });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de correo electrónico no válido.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario con la contraseña encriptada
    const newUser = await User.create({ name, lastName, email, password: hashedPassword });

    const response = {
      status: 'ok',
      data: newUser
    }

    // Enviar la respuesta
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (email == undefined || pass == undefined) {
      res.status(400).json({ message: 'Bad Request. Please fill all field.' });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      const response = {
        status: 'error',
        data: {
          message: 'Incorrect user or password',
        },
      };
      res.json(response);

    } else {
      const id = user.id;
      const token = jwt.sign({ id: id }, process.env.JWT_SECRET);

      //expires: new Date(Date.now() + process.env.JWT_EXPIRY_COOKIE * 24 * 60 * 60 * 1000),
      const cookiesOptions = {
        httpOnly: true,
      };

      res.cookie('jwt', token, cookiesOptions);

      const response = {
        status: 'ok',
        user: user,
        token: token,
      };
      res.json(response);
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

exports.validate = async (req, res) => {
  const userId = req.user.id;
  res.json({ message: 'Ruta protegida', userId });
}