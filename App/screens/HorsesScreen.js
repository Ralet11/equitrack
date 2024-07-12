import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
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


  useEffect(() => {
    if (horses.length === 0) {
      const initialHorses = [
        {
          id: 1,
          name: 'Thunder',
          type_horse_id: 1,
          breed_id: 1,
          image_profile: 'https://concepto.de/wp-content/uploads/2021/07/caballos-e1626738224231.jpg',
          birthdate: '2015-05-01',
          color: 'Bay',
          weight: 500,
          favorite: false,
        },
        {
          id: 2,
          name: 'Blaze',
          type_horse_id: 2,
          breed_id: 2,
          image_profile: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz-xd-q_9Fb8uozs5vtQ8aftWBwcEymV4XWA&s',
          birthdate: '2016-08-15',
          color: 'Chestnut',
          weight: 450,
          favorite: false,
        },
        {
          id: 3,
          name: 'Shadow',
          type_horse_id: 3,
          breed_id: 3,
          image_profile: 'https://www.petdarling.com/wp-content/uploads/2021/01/caballo-pura-raza-espanola-768x576.jpg',
          birthdate: '2014-03-22',
          color: 'Black',
          weight: 520,
          favorite: false,
        },
        {
          id: 4,
          name: 'Star',
          type_horse_id: 4,
          breed_id: 4,
          image_profile: 'https://cdn.pixabay.com/photo/2014/11/30/14/11/horse-551191_960_720.jpg',
          birthdate: '2017-11-30',
          color: 'White',
          weight: 480,
          favorite: false,
        },
        {
          id: 5,
          name: 'Storm',
          type_horse_id: 5,
          breed_id: 5,
          image_profile: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Caballo_cuarto_de_milla_sorrel.JPG',
          birthdate: '2018-07-19',
          color: 'Sorrel',
          weight: 470,
          favorite: false,
        },
      ];
      initialHorses.forEach((horse) => {
        dispatch(setHorses(horse));
      });
    }
  }, [horses, dispatch]);


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
          <Text style={styles.headerTitle}>Palenque</Text>
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
      {horses.length > 0 ? (
        <FlatList
          data={horses}
          renderItem={renderHorseCard}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay caballos disponibles</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButtonContainer} onPress={openAddModal}>
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