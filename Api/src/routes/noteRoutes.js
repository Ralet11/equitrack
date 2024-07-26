const express = require('express');
const { create, editNote, deleteNote, getNotesByHorseId } = require('../controllers/noteController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const router = express.Router();

router.post('/add', jwtMiddleware, create);
router.put('/:horse_id/:id', jwtMiddleware, editNote);
router.delete('/:horse_id/:id', jwtMiddleware, deleteNote);
router.get('/horse/:horse_id', jwtMiddleware, getNotesByHorseId);

module.exports = router;
