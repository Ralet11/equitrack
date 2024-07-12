const ActivityType = require('../models/activityTypeModel')

exports.getAll = async (req, res) => {
    try {
        const activities = await ActivityType.findAll()
        const response = {
            status: 'ok',
            activities: activities
          };
          res.status(201).json(response);
    } catch (error) {
        console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
    }
}