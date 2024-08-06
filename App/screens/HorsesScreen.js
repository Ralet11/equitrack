import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setHorses, setHorsesForUpdate, setUpdate, deleteHorseById, editHorseById, clearHorsesForUpdate } from '../redux/slices/horseSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HorseModal from '../components/HorseModal';
import { checkInternetConnection } from '../helpers/syncHelper';
import { getHorsesByUser, deleteHorse, toggleFavorite } from '../api/horseApi';
import styles from '../styles/HorsesScreenStyles';

const HorsesScreen = ({ navigation }) => {
  const horses = useSelector((state) => state.horses.horses);
  const horseToUpdate = useSelector((state) => state.horses.horsesForUpdate);
  const dispatch = useDispatch();
  const [favoriteHorses, setFavoriteHorses] = useState([]);
  const [editHorseModalVisible, setEditHorseModalVisible] = useState(false);
  const [horseToEdit, setHorseToEdit] = useState(null);
  const [auxDelete, setAuxDelete] = useState(false);

  console.log(horses);

  const handleDeleteHorse = async (horse) => {
    const connexion = await checkInternetConnection();
    if (connexion) {
      try {
        const response = await deleteHorse(horse.id);
        dispatch(setHorses(response));
      } catch (error) {
        console.error('Error deleting horse:', error);
      }
    } else {
      const deletedHorse = {
        ...horse,
        deleted: true,
      };
      dispatch(deleteHorseById(horse.id));
      dispatch(setHorsesForUpdate(deletedHorse));
      dispatch(setUpdate(true));
      setAuxDelete(!auxDelete);
    }
  };

  const handleToggleFavorite = async (horse) => {
    const connexion = await checkInternetConnection();
    if (connexion) {
      try {
        const response = await toggleFavorite(horse.id, user.token);
        setFavoriteHorses(response.favoriteHorses);
        dispatch(setHorses(response));
        Alert.alert('Connection Status', 'Connection On');
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    } else {
      const editedHorse = {
        ...horse,
        favorite: !horse.favorite,
      };
      dispatch(editHorseById({ id: horse.id, updatedHorse: editedHorse }));
    }
  };

  const openEditModal = (horse) => {
    setHorseToEdit(horse);
    setEditHorseModalVisible(true);
  };

  const openAddModal = () => {
    setHorseToEdit(null);
    setEditHorseModalVisible(true);
  };

  const closeEditModal = () => {
    setHorseToEdit(null);
    setEditHorseModalVisible(false);
  };

  const navigateToDetail = (horse) => {
    navigation.navigate('HorseDetail', { horse });
  };

  const renderHorseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_profile }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardIcons}>
            <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
              <Icon name="favorite" size={24} color={item.favorite ? "#FF6F61" : "#888"} style={styles.cardIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <Icon name="edit" size={24} color="#888" style={styles.cardIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteHorse(item)}>
              <Icon name="delete" size={24} color="#888" style={styles.cardIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <Icon name="add" size={24} color="#888" style={styles.cardIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>{item.breed}</Text>
        <Text style={styles.cardDetail}>Color: {item.fur}</Text>
        <Text style={styles.cardDetail}>Peso: {item.weight} kg</Text>
      </View>
    </View>
  );

  const createHorse = async (newHorse) => {
    const connexion = await checkInternetConnection();
    if (connexion) {
      if (horseToUpdate.length > 0) {
        horseToUpdate.forEach(async (horse) => {
          try {
            await createHorseApi(horse); // Asume que tienes una función para crear caballos en la API
          } catch (error) {
            console.error('Error creating horse from updates:', error);
          }
        });
        dispatch(clearHorsesForUpdate());
      }

      try {
        const response = await createHorseApi(newHorse); // Asume que tienes una función para crear caballos en la API
        dispatch(setHorses(response));
      } catch (error) {
        console.error('Error creating horse:', error);
      }
    } else {
      dispatch(setHorsesForUpdate(newHorse));
      dispatch(setUpdate(true));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Palenque</Text>
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#CCC" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor="#CCC"
            />
          </View>
        </View>
      </View>
      {horses.length > 0 ? (
        <FlatList
          data={horses}
          renderItem={renderHorseCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay caballos disponibles</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButtonContainer} onPress={openAddModal}>
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
      <HorseModal
        modalVisible={editHorseModalVisible}
        setModalVisible={setEditHorseModalVisible}
        horseSubmit={editHorseModalVisible}
        setHorseSubmit={setEditHorseModalVisible}
        editHorse={horseToEdit}
      />
    </View>
  );
};

export default HorsesScreen;
