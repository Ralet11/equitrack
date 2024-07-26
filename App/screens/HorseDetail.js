import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HorseDetailsStyle';

import HorseDetailAverages from '../components/HorseDetailAverages';
import HoserDetailNotes from '../components/HorseDetailNotes';
import HorseDetailMeasurements from '../components/HorseDetailmeasurements';

const initialLayout = { width: Dimensions.get('window').width };

const HorseDetail = ({ route, navigation }) => {
  const { horse } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Averages' },
    { key: 'second', title: 'Notes' },
    { key: 'third', title: 'Measurements' },
  ]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Icon name="close" size={24} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image source={{ uri: horse.image_profile }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{horse.name}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Breed: </Text>{horse.breed}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Color: </Text>{horse.color}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Weight: </Text>{horse.weight} kg</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>Birthdate: </Text>{horse.birthdate}</Text>
        </View>
      </View>
      
    </View>
  );
};

export default HorseDetail;
