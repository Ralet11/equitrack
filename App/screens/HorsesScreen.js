import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setHorses, setHorsesForUpdate, setUpdate, deleteHorseById, editHorseById } from '../redux/slices/horseSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HorseModal from '../components/HorseModal';
import { checkInternetConnection } from '../helpers/syncHelper';
import { getHorsesByUser, deleteHorse, toggleFavorite } from '../api/horseApi';
import styles from '../styles/HorsesScreenStyles';

const HorsesScreen = () => {
  const horses = useSelector((state) => state.horses.horses);
  const horseToUpdate = useSelector((state) => state.horses.horsesForUpdate);
  const dispatch = useDispatch();
  const [favoriteHorses, setFavoriteHorses] = useState([]);
  const [editHorseModalVisible, setEditHorseModalVisible] = useState(false);
  const [horseToEdit, setHorseToEdit] = useState(null);
  const [auxDelete, setAuxDelete] = useState(false);

  console.log(horses);

  const handleDeleteHorse = async (horse) => {
    console.log("delete");
    const connexion = await checkInternetConnection();
    console.log(connexion);
    if (connexion) {
      try {
        const response = await deleteHorse(horse.id);
        dispatch(setHorses(response));
      } catch (error) {
        console.error('Error deleting horse:', error);
      }
    } else {
      console.log("delete sin conexionr");
      const deletedHorse = {
        ...horse,
        delete: true,
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

  const renderHorseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
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
          </View>
        </View>
        <Text style={styles.cardSubtitle}>{item.breed}</Text>
        <Text style={styles.cardDetail}>Height: {item.height}</Text>
        <Text style={styles.cardDetail}>Weight: {item.weight}</Text>
        <View style={styles.cardFooter}>
          <Icon name="location-on" size={18} color="#666" />
          <Text style={styles.cardFooterText}>Location info</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mis caballos</Text>
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#CCC" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#CCC"
            />
          </View>
        </View>
      </View>
      <FlatList
        data={horses}
        renderItem={renderHorseCard}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButtonContainer} onPress={() => setEditHorseModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Caballo</Text>
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