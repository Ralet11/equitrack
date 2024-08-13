import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import ProgressStats from '../components/ProgressStats';
import ModalSelector from '../components/ModalSelector';
import SummaryModal from '../components/SummaryModal';
import * as Location from 'expo-location';
import { setCurrentActivity, setMeasurement, pushCurrentActivity } from '../redux/slices/activitySlice';
import { current } from '@reduxjs/toolkit';

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const horses = useSelector((state) => state.horses.horses);
  const activityTypes = useSelector((state) => state.activityTypes.activityTypes);
  const currentActivity = useSelector((state) => state.activities.currentActivity)
  const activities = useSelector((state) => state.activities.activities)

  console.log(currentActivity, "current1")

  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(true);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [isCollectingData, setIsCollectingData] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [time, setTime] = useState(0);
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState(null);
  const [chukkers, setChukkers] = useState('1');
  const [chukkerCount, setChukkerCount] = useState(0);
  const [collectedData, setCollectedData] = useState([]);
  const [isFinalized, setIsFinalized] = useState(false);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const MIN_DISTANCE_THRESHOLD = 0.01;
  const MIN_ACCELERATION_THRESHOLD = 0.05;

  console.log(chukkerCount)  
  console.log(collectedData,"colecteddatati")
  console.log(activities, "actividades final")

  const handleSelectHorse = (horse) => {
    setSelectedHorse(horse);
    console.log('Horse selected:', horse);
  };

  const handlePrepareForMeasurement = () => {
   
    setIsSummaryModalVisible(true);
  };

  const handleToggleDataCollection = async () => {
    if (!selectedHorse || mode === null) {
      setModalVisible(true);
      console.log('Horse or mode not selected, opening modal.');
      return;
    }
  
    if (isCollectingData) {
      console.log('Stopping data collection.');
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      setIsCollectingData(false);
    } else {
      if (isFinalized) {
        console.log('Finalized state detected, preparing for next chukker.');
        setIsFinalized(false);
        setChukkerCount((prevCount) => prevCount + 1);
        setTime(parseInt(activityTypes.find((activity) => activity.id === mode).time) * 60);
        setCollectedData([]);
      }
  
      const selectedActivity = activityTypes.find((activity) => activity.id === mode);
      if (!selectedActivity) {
        console.log('No activity selected.');
        return;
      }
  
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
  
      let lastPosition = null;
  
      const locationOptions = {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 2000,
        distanceInterval: 0.5,
      };
  
      if (mode === 1) {
        setTime(0);
      } else {
        setTime(parseInt(selectedActivity.time) * 60);
      }
  
      // Capturar la primera ubicación y asignar a lastPosition
      let initialLocation = await Location.getCurrentPositionAsync(locationOptions);
      lastPosition = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        speed: initialLocation.coords.speed || 0,
      };
      console.log('Initial location captured:', lastPosition);
  
      // Iniciar el temporizador
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = mode === 1 ? prevTime + 1 : prevTime > 0 ? prevTime - 1 : 0;
          console.log('Time updated:', newTime);
          return newTime;
        });
      }, 1000);
  
      // Iniciar la recolección de datos
      intervalRef.current = setInterval(async () => {
        let location = await Location.getCurrentPositionAsync(locationOptions);
        const newPosition = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed || 0,
        };
        let newDistance = getDistanceFromLatLonInKm(lastPosition, newPosition);
        if (newDistance < MIN_DISTANCE_THRESHOLD) {
          newDistance = 0;
        }
        const newAcceleration = (newPosition.speed - (lastPosition?.speed || 0)) / 1;
        const filteredAcceleration = Math.abs(newAcceleration) < MIN_ACCELERATION_THRESHOLD ? 0 : newAcceleration;
        const newData = {
          time: new Date().toISOString(),
          latitude: newPosition.latitude,
          longitude: newPosition.longitude,
          speed: newPosition.speed,
          distance: newDistance,
          acceleration: filteredAcceleration,
          duration: 2,
          chukker: chukkerCount + 1,
        };

        setSteps((prev) => prev + Math.floor(Math.random() * 10));
        setDistance((prev) => prev + newData.distance);
        setChartData((prev) => [...prev.slice(1), newData.distance]);
        setProgress((prev) => (prev + 100 / (parseInt(selectedActivity.time) * 60)) % 100);

        // Actualizamos collectedData correctamente
        setCollectedData(prevData => {
            const updatedData = [...prevData, newData];
            console.log('Updated collectedData:', updatedData); // Verifica la actualización
            return updatedData;
        });


        lastPosition = newPosition; // Actualizar la posición después de calcular la distancia
      }, 2000);
  
      setIsCollectingData(true);
      setModalVisible(false);
    }
  };

  const handleStartMeasurement = () => {
    setIsSummaryModalVisible(false);
    console.log('Starting measurement...');
    setTimeout(() => {
      handleToggleDataCollection(); 
    }, 100); 
  };

  const getDistanceFromLatLonInKm = (pos1, pos2) => {
    const R = 6371;
    const dLat = deg2rad(pos2.latitude - pos1.latitude);
    const dLon = deg2rad(pos2.longitude - pos1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(pos1.latitude)) * Math.cos(deg2rad(pos2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

 /*  const saveMeasurementData = () => {
    const currentChukkerData = collectedData.filter(data => data.chukker === chukkerCount + 1);

    if (currentChukkerData.length > 0) {
      const lastDataPoint = currentChukkerData[currentChukkerData.length - 1];
      const measurementData = {
        horse_id: selectedHorse.id,
        chucker_number: chukkerCount + 1,
        time: time,
        latitude: lastDataPoint.latitude,
        longitude: lastDataPoint.longitude,
        speed: lastDataPoint.speed,
        distance: lastDataPoint.distance,
        acceleration: lastDataPoint.acceleration,
        duration: lastDataPoint.duration,
      };
      dispatch(setMeasurement(measurementData));
      console.log('Measurement saved:', measurementData);
    }
  }; */

  const handleClearProgress = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    dispatch(pushCurrentActivity(collectedData));
    setSteps(0);
    setDistance(0.0);
    setTime(0);
    setChartData([0, 0, 0, 0, 0]);
    setProgress(0);
    setSelectedHorse(null);
    setMode(null);
    setChukkers('');
    setChukkerCount(0);
    setCollectedData([]);
    setIsFinalized(false);
    setIsSummaryModalVisible(false);
    console.log('Progress cleared.');
  };

  const handleSaveProgress = () => {
/*     saveMeasurementData(); */
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    setIsCollectingData(false);
  
    setChukkerCount((prevCount) => prevCount + 1);
    setIsSummaryModalVisible(true);
    console.log('Progress saved and finalized.');
  };

  const handleStartNextChukker = () => {
    setIsSummaryModalVisible(false);
    handleToggleDataCollection();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      console.log('Component unmounted, intervals cleared.');
    };
  }, []);

  const hasData = steps > 0 || distance > 0.0 || time > 0 || progress > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Header 
            selectedHorse={selectedHorse}
            mode={mode}
            activityTypes={activityTypes}
            onExchangePress={() => setModalVisible(true)}
            onClearProgress={handleClearProgress}
          />
          <ProgressStats 
            mode={mode}
            time={time}
            progress={progress}
            steps={steps}
            distance={distance}
            chukkerCount={chukkerCount}
            chukkers={chukkers}
            isCollectingData={isCollectingData}
            hasData={hasData}
            onToggleDataCollection={handleToggleDataCollection}
            onFinalize={handleSaveProgress}
            onClearProgress={handleClearProgress}
          />
        </ScrollView>

        <ModalSelector 
          modalVisible={modalVisible}
          horses={horses}
          selectedHorse={selectedHorse}
          onSelectHorse={handleSelectHorse}
          activityTypes={activityTypes}
          mode={mode}
          onModeSelect={setMode}
          chukkers={chukkers}
          setChukkers={setChukkers}
          onPrepareForMeasurement={handlePrepareForMeasurement} 
          onCloseModal={() => setModalVisible(false)}
        />

        <SummaryModal 
          isVisible={isSummaryModalVisible}
          onClose={() => setIsSummaryModalVisible(false)}
          collectedData={collectedData}
          chukkers={parseInt(chukkers, 10)}
          currentChukker={chukkerCount}
          onStartNextChukker={handleStartMeasurement} 
          onFinalizeMatch={handleClearProgress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {},
});

export default HomeScreen;