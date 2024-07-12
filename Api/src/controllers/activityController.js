const sequelize = require('../sequelize');
const ActivityType = require('../models/activityTypeModel')
const Activity = require('../models/activityModel');
const Measurement = require('../models/measurementModel');


exports.create = async (req, res) => {
    const { type_activity_id, chukker_quantity, measurements } = req.body; // Asume que la solicitud incluye estos campos

    try {
        // Crear el partido (Activity)
        const newActivity = await Activity.create({
            type_activity_id,
            chukker_quantity,
        });

        const activityId = newActivity.id; // Obtener el id del partido creado

        // Crear las measurements asociadas al partido
        const measurementsToCreate = measurements.map((measurement) => ({
            activity_id: activityId,
            chucker_number: measurement.chucker_number,
            time: measurement.time,
            latitude: measurement.latitude,
            longitude: measurement.longitude,
            altitude: measurement.altitude,
            speed: measurement.speed,
            distance: measurement.distance,
            acceleration: measurement.acceleration,
            duration: measurement.duration,
        }));

        await Measurement.bulkCreate(measurementsToCreate); // Crear todas las measurements en una sola operación



        res.status(201).json({
            message: 'Partido y measurements creados exitosamente',
            Activity: {...newActivity, measurements: measurementsToCreate}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear partido y measurements', error });
    }
};