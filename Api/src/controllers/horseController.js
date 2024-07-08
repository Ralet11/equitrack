const sequelize = require('../sequelize');
const Horse = require('../models/horseModel');
const UserHorse = require('../models/userHorseModel');
//const ImagesHorse = require('../models/imagePetModel');

exports.getAllByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userHorses = await UserHorse.findAll({
      where: { user_id: userId },
    });

    const horseIds = userHorses.map((userHorse) => userHorse.horse_id);

    const allHorses = await Horse.findAll({
      where: { id: horseIds },
      order: [['createdAt', 'DESC']]
    });

    const response = {
      status: 'ok',
      horses: allHorses
    }

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.create = async (req, res) => {
  /*const { name, last_name, type_pet_id, breed_id, birthdate, color, weight } = req.body;
  const userId = req.user.id;

  try {
    const imageUrl = req.imageUrl || 'pet_default.jpg';

    const pet = await sequelize.transaction(async (t) => {
      const createdPet = await Pet.create({
        name: name,
        last_name: last_name,
        type_pet_id: type_pet_id,
        breed_id: breed_id,
        birthdate: birthdate,
        color: color,
        weight: weight,
        image_profile: imageUrl
      }, { transaction: t });

      await UserPet.create({ user_id: userId, pet_id: createdPet.id }, { transaction: t });

      return createdPet;
    });

    const response = {
      status: 'ok',
      pet: pet,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la mascota' });
  }*/
};