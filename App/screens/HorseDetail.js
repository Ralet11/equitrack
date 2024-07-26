import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
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

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <HorseDetailAverages horse={horse} />;
      case 'second':
        return <HoserDetailNotes notes={horse.Notes} selectedHorseId={horse.id} />;
      case 'third':
        return <HorseDetailMeasurements horse={horse} />;
      default:
        return null;
    }
  };

  console.log(horse);

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
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.label}
          />
        )}
      />
    </View>
  );
};

export default HorseDetail;
