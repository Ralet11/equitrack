const sequelize = require('../sequelize');
const Horse = require('../models/horseModel');
const UserHorse = require('../models/userHorseModel');
//const ImagesHorse = require('../models/imagePetModel');
const Note = require('../models/noteModel')

exports.getAllByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userHorses = await UserHorse.findAll({
      where: { user_id: userId },
    });

    const horseIds = userHorses.map((userHorse) => userHorse.horse_id);

    const allHorses = await Horse.findAll({
      where: { id: horseIds },
      include: [{
        model: Note,
        as: 'Notes',
        order: [['date', 'DESC']]
      }],
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
  try {
    const { name, type_horse_id, breed_id, image_profile, birthdate, color, weight } = req.body;
    const userId = req.user.id;

    // Validar campos requeridos
    if (!name || !breed_id || !birthdate || !color || !weight) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Crear un nuevo caballo
    const newHorse = await Horse.create({
      name,
      type_horse_id,
      breed_id,
      image_profile,
      birth: birthdate,
      fur: color,
      weight
    });

    // Asociar el caballo con el usuario
    await UserHorse.create({
      user_id: userId,
      horse_id: newHorse.id
    });

    const userHorses = await UserHorse.findAll({
      where: { user_id: userId },
    });

    const horseIds = userHorses.map((userHorse) => userHorse.horse_id);

    const allHorses = await Horse.findAll({
      where: { id: horseIds },
      include: [{
        model: Note,
        as: 'Notes',
        order: [['date', 'DESC']]
      }],
      order: [['createdAt', 'DESC']]
    });


    res.status(201).json({
      status: 'ok',
      horses: allHorses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.syncHorses = async (req, res) => {

  console.log("en back sync")
  const userId = req.user.id;
  const { horsesForUpdate } = req.body;

  try {
    for (let horseData of horsesForUpdate) {
      const { id, updated, deleted, ...horseInfo } = horseData;

      if (deleted) {
        // Eliminar caballo
        const horse = await Horse.findOne({ where: { id } });
        if (horse) {
          await horse.destroy();
        }
      } else if (updated) {
        // Editar caballo
        const horse = await Horse.findOne({ where: { id } });
        if (horse) {
          await horse.update(horseInfo);
        } else {
          //agregar en una funcion para crear caballo
          const newHorse = await Horse.create(horseInfo);
          await UserHorse.create({
            user_id: userId,
            horse_id: newHorse.id,
          });
        }
        //ver si tiene notas para agregar o actualizar
        //si tiene notas -> llamar al controlador de nota
        
      } else {
        // Crear nuevo caballo
        const newHorse = await Horse.create(horseInfo);
        await UserHorse.create({
          user_id: userId,
          horse_id: newHorse.id,
        });
      }
    }

    // Obtener todos los caballos actualizados
    const userHorses = await UserHorse.findAll({
      where: { user_id: userId },
    });

    const horseIds = userHorses.map((userHorse) => userHorse.horse_id);

    const allHorses = await Horse.findAll({
      where: { id: horseIds },
      include: [{
        model: Note,
        as: 'Notes',
        order: [['date', 'DESC']]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'ok',
      horses: allHorses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};