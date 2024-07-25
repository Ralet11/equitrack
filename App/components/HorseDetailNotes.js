import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { addHorseNote, deleteHorseNotes, updateHorseNotes } from '../api/noteApi';
import styles from '../styles/HorseDetailsStyle';
import { checkInternetConnection } from '../helpers/syncHelper';
import { addNoteToHorse, setUpdate, setHorsesForUpdate, deleteHorseNote, updateHorseNote } from '../redux/slices/horseSlice';

const HorseDetailNotes = ({ selectedHorseId }) => {
  const horsesForUpdate = useSelector((state) => state.horses.horsesForUpdate);
  const deleteid = useSelector((state) => state.horses.deleteNotesId);
  const horses = useSelector(state => state.horses.horses);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNoteText, setNewNoteText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  console.log(deleteid);

  useEffect(() => {
    const selectedHorse = horses.find(horse => horse.id === selectedHorseId);
    const horseNotes = selectedHorse ? selectedHorse.Notes : [];
    setNotes(horseNotes);
  }, [horses, selectedHorseId]);

  const clearModalFields = () => {
    setNewNoteTitle('');
    setNewNoteDate(new Date().toISOString().split('T')[0]);
    setNewNoteText('');
  };

  const handleCloseModal = () => {
    clearModalFields();
    setModalVisible(false);
    setIsEditing(false);
  };

  const addNote = async () => {
    const note = {
      title: newNoteTitle,
      text: newNoteText,
      horse_id: selectedHorseId,
      date: newNoteDate,
    };

    const newNote = await addHorseNote(user, dispatch, note);

    if (newNote) {
      handleCloseModal();
      setNotes(prevNotes => [...prevNotes, newNote]);
    } else {
      console.error('Failed to add note');
    }
  };

  const addNoteOffline = (note) => {
    dispatch(addNoteToHorse({ horseId: selectedHorseId, note }));
    const selectedHorse = horses.find(horse => horse.id === selectedHorseId);
    if (selectedHorse) {
      dispatch(setHorsesForUpdate(selectedHorse));
      dispatch(setUpdate(true));
      setNotes(prevNotes => [...prevNotes, note]);
    }
  };

  const handleEditNote = (note) => {
    setIsEditing(true);
    setNewNoteTitle(note.title);
    setNewNoteDate(note.date);
    setNewNoteText(note.text);
    setSelectedNote(note);
    setModalVisible(true);
  };

  const updateNote = async () => {
    
    const updatedNote = {
      ...selectedNote,
      title: newNoteTitle,
      text: newNoteText,
      date: newNoteDate,
    };

    const connexion = await checkInternetConnection();
    if (connexion) {
      // Llamar al backend para actualizar la nota
      try {
        const horse_id = selectedHorseId;
        await updateHorseNotes(user, horse_id, updatedNote, setNotes);
        console.log('Note updated on backend');
      } catch (error) {
        console.error('Error updating note on backend:', error);
      }
    } else {
      dispatch(updateHorseNote({
        horseId: selectedHorseId,
        updatedNote,
      }));

      const selectedHorse = horses.find(horse => horse.id === selectedHorseId);
      if (selectedHorse) {
        dispatch(setHorsesForUpdate(selectedHorse));
        dispatch(setUpdate(true));
        setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note));
      }
    }

    handleCloseModal();
  };

  const handleDeleteNote = async (noteId) => {
    const connexion = await checkInternetConnection();
    if (connexion) {
      // Llamar al backend para eliminar la nota
      try {
        console.log("ingresando");
        const horse_id = selectedHorseId;
        await deleteHorseNotes(noteId, user, setNotes, horse_id);
        console.log('Note deleted on backend');
      } catch (error) {
        console.error('Error deleting note on backend:', error);
      }
    } else {
      dispatch(deleteHorseNote({
        horseId: selectedHorseId,
        noteId,
      }));
  
      const selectedHorse = horses.find(horse => horse.id === selectedHorseId);
      if (selectedHorse) {
        dispatch(setHorsesForUpdate(selectedHorse));
        dispatch(setUpdate(true));
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      }
    }
  };

  const openDetailModal = (note) => {
    setSelectedNote(note);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setSelectedNote(null);
    setDetailModalVisible(false);
  };

  const filteredNotes = notes ? notes.filter(note => {
    const noteDate = new Date(note.date).toLocaleDateString();
    const filterDate = selectedDate ? selectedDate.toLocaleDateString() : null;
    return (
      note.title.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filterDate || noteDate === filterDate)
    );
  }) : [];

  const handleSubmit = async () => {
    const connexion = await checkInternetConnection();
    const note = {
      title: newNoteTitle,
      text: newNoteText,
      horse_id: selectedHorseId,
      date: newNoteDate,
    };
    if (connexion) {
      try {
        if (isEditing) {
          await updateNote();
        } else {
          await addNote();
        }
      } catch (error) {
        console.error('Error creating horse:', error);
      }
    } else {
      if (isEditing) {
        updateNote();
      } else {
        addNoteOffline(note);
      }
      handleCloseModal();
    }
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.dateFilterContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateFilterText}>
            {selectedDate ? `Date: ${selectedDate.toLocaleDateString()}` : 'Select date'}
          </Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity onPress={() => setSelectedDate(null)}>
            <Icon name="close" size={24} color="#888" style={styles.closeIcon} />
          </TouchableOpacity>
        )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEditNote(item)} style={styles.editButton}>
                  <Icon name="edit" size={24} color="#888" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.deleteButton}>
                  <Icon name="delete" size={24} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />
      {filteredNotes.length === 0 && (
        <Text style={styles.noNotesText}>No hay notas disponibles</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        onShow={() => setNewNoteDate(new Date().toISOString().split('T')[0])}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Icon name="close" size={24} color="#888" />
            </TouchableOpacity>
            <TextInput
              placeholder="Note Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Date"
                value={newNoteDate}
                style={styles.input}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(newNoteDate)}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setNewNoteDate(date.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
            <TextInput
              placeholder="Note Text"
              value={newNoteText}
              onChangeText={setNewNoteText}
              style={[styles.input, styles.textArea]}
              multiline={true}
            />
            <Button title={isEditing ? "Update Note" : "Add Note"} onPress={handleSubmit} />
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeDetailModal}
            >
              <Icon name="close" size={24} color="#888" />
            </TouchableOpacity>
            {selectedNote && (
              <>
                <Text style={styles.modalTitle}>{selectedNote.title}</Text>
                <Text style={styles.modalDate}>{selectedNote.date}</Text>
                <Text style={styles.modalText}>{selectedNote.text}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HorseDetailNotes;