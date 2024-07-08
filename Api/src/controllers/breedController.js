const sequelize = require('../sequelize');
const Breed = require('../models/breedModel');

exports.getAll = async (req, res) => {
  try {
    
    //const { type_pet } = req.query;

    /*const breeds = await Breed.findAll({
      where: {
        type_pet_id: type_pet,
      },
    });*/

    const breeds = await Breed.findAll();

    /*const formattedBreeds = breeds.map(breed => ({
      key: breed.id.toString(),
      value: breed.name
    }));*/

    const response = {
      status: 'ok',
      breeds: breeds
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};