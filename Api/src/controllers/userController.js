const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.imagePorfileUpload = async (req, res) => {
  const userId = req.user.id;

  try {
    const image_profile = req.imageUrl || 'user_default.jpg';

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required for update' });
    }

    const updatedData = { image_profile };
    const [_, updatedUser] = await User.update(updatedData, {
      where: { id: userId },
      returning: true,
      plain: true,
    });

    if (updatedUser) {
      const user = await User.findByPk(userId)
      const response = {
        status: 'ok',
        user: user,
      };

      res.status(201).json(response);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};