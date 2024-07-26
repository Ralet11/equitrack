const Note = require('../models/noteModel');

const create = async (req, res) => {
    const { text, horse_id, title, date } = req.body;

    console.log(req.body)
    
    if (!text || !horse_id || !title || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    try {
        const newNote = await Note.create({
            title,
            text,
            horse_id,
            date
        });

        res.status(201).json({ message: "Note created successfully", newNote });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "An error occurred while creating the note" });
    }
};

const editNote = async (req, res) => {
    const { id, horse_id } = req.params;
    const { text, title, date } = req.body;

    if (!text || !title || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const note = await Note.findByPk(id);

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        note.title = title;
        note.text = text;
        note.date = date;
        await note.save();

        const notes = await Note.findAll({
            where: { horse_id }
        });

        res.status(200).json({ message: "Note updated successfully", notes });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "An error occurred while updating the note" });
    }
};

const deleteNote = async (req, res) => {
    const { id, horse_id } = req.params;

    try {
        const note = await Note.findByPk(id);

        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        await note.destroy();

        const notes = await Note.findAll({
            where: { horse_id }
        });

        res.status(200).json({ message: "Note deleted successfully", notes });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "An error occurred while deleting the note" });
    }
};

const getNotesByHorseId = async (req, res) => {
    const { horse_id } = req.params;

    try {
        const notes = await Note.findAll({
            where: { horse_id }
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "An error occurred while fetching the notes" });
    }
};

module.exports = {
    create,
    editNote,
    deleteNote,
    getNotesByHorseId
};
