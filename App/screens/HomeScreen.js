import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, TextInput, ScrollView, SafeAreaView, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import CircularProgress from 'react-native-circular-progress-indicator';
import { setCurrentActivity, setMeasurement, pushCurrentCtivity } from '../redux/slices/activitySlice';

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const horses = useSelector((state) => state.horses.horses);
  const activityTypes = useSelector((state) => state.activityTypes.activityTypes);
  const currentActivity = useSelector((state) => state.activities.currentActivity);

  const dispatch = useDispatch();

  console.log(horses)
  const [modalVisible, setModalVisible] = useState(true);
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
  const [activityTime, setActivityTime] = useState(0);
  const [collectedData, setCollectedData] = useState([]);
  const [isDataCollected, setIsDataCollected] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const intervalRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handleSelectHorse = (horse) => {
    setSelectedHorse(horse);
  };

  const handleToggleDataCollection = () => {
    console.log("Entrando a handleToggleDataCollection");

    if (!selectedHorse || mode === null) {
        setModalVisible(true);
        return;
    }

    if (isCollectingData) {
        console.log("Parando recolección de datos");
        clearInterval(intervalRef.current);
        setIsCollectingData(false);
    } else {
        if (isFinalized) {
            console.log("Reiniciando datos porque la colección previa finalizó");
            setIsFinalized(false);
            setChukkerCount((prevCount) => prevCount + 1);
            setTime(activityTime * 60); // Reset time for the new chukker
            setCollectedData([]);
            setIsDataCollected(false); // Clear the collected data display
        }

        const selectedActivity = activityTypes.find((activity) => activity.id === mode);
        if (!selectedActivity) {
            console.log("Actividad seleccionada no encontrada");
            return;
        }

        console.log("Actividad seleccionada:", selectedActivity);

        const initialTime = parseInt(selectedActivity.time) * 60;
        console.log("Tiempo inicial:", initialTime);

        if (mode === 1) {
            console.log("Modo es 1, iniciando timer ascendente");
            setTime(0); // Start at 00:00
            intervalRef.current = setInterval(() => {
                const newData = {
                    time: new Date().toISOString(), // Ensure time is serializable
                    latitude: Math.random() * 90,
                    longitude: Math.random() * 180,
                    speed: parseFloat((Math.random() * 10).toFixed(2)),
                    distance: parseFloat((Math.random() * 0.1).toFixed(1)),
                    acceleration: parseFloat((Math.random() * 0.5).toFixed(2)),
                    duration: 1,
                };

                setSteps((prev) => prev + Math.floor(Math.random() * 10));
                setDistance((prev) => prev + newData.distance);
                setTime((prev) => prev + 1); // Increment time for ascending timer
                setChartData((prev) => [...prev.slice(1), prev[prev.length - 1] + Math.floor(Math.random() * 10)]);
                setProgress((prev) => (prev + 100 / initialTime) % 100);
                setCollectedData((prev) => [...prev, newData]);
            }, 1000);
        } else if (mode === 0) {
            console.log("Modo es 0, iniciando timer sin chukkers");
            setTime(initialTime); // Start at initialTime for countdown
            intervalRef.current = setInterval(() => {
                const newData = {
                    time: new Date().toISOString(), // Ensure time is serializable
                    latitude: Math.random() * 90,
                    longitude: Math.random() * 180,
                    speed: parseFloat((Math.random() * 10).toFixed(2)),
                    distance: parseFloat((Math.random() * 0.1).toFixed(1)),
                    acceleration: parseFloat((Math.random() * 0.5).toFixed(2)),
                    duration: 1,
                };

                setSteps((prev) => prev + Math.floor(Math.random() * 10));
                setDistance((prev) => prev + newData.distance);
                setTime((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        setCollectedData((prev) => [...prev, newData]);
                        clearInterval(intervalRef.current);
                        setIsCollectingData(false);
                        setIsDataCollected(true);
                        saveMeasurementData(time, newData); // Save measurement data with total time
                        return initialTime;
                    }
                });
                setChartData((prev) => [...prev.slice(1), prev[prev.length - 1] + Math.floor(Math.random() * 10)]);
                setProgress((prev) => prev + 100 / initialTime);
                setCollectedData((prev) => [...prev, newData]);
            }, 1000);
        } else {
            console.log("Modo no es 0 ni 1, iniciando timer descendente con chukkers");
            setTime(initialTime); // Start at initialTime for countdown
            intervalRef.current = setInterval(() => {
                const newData = {
                    time: new Date().toISOString(), // Ensure time is serializable
                    latitude: Math.random() * 90,
                    longitude: Math.random() * 180,
                    speed: parseFloat((Math.random() * 10).toFixed(2)),
                    distance: parseFloat((Math.random() * 0.1).toFixed(1)),
                    acceleration: parseFloat((Math.random() * 0.5).toFixed(2)),
                    duration: 1,
                };

                setSteps((prev) => prev + Math.floor(Math.random() * 10));
                setDistance((prev) => prev + newData.distance);
                setTime((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        setCollectedData((prev) => [...prev, newData]);
                        saveMeasurementData(time, newData); // Save measurement data with total time
                        clearInterval(intervalRef.current);
                        setIsCollectingData(false);
                        setIsDataCollected(true);

                        if (chukkerCount + 1 >= chukkers) {
                            setIsFinalized(true);
                        }
                        return initialTime;
                    }
                });
                setChartData((prev) => [...prev.slice(1), prev[prev.length - 1] + Math.floor(Math.random() * 10)]);
                setProgress((prev) => prev + 100 / initialTime);
                setCollectedData((prev) => [...prev, newData]);
            }, 1000);
        }
        setIsCollectingData(true);
    }
  };

  const saveMeasurementData = (totalTime, data) => {
    const measurementData = {
      horse_id: selectedHorse.id,
      chucker_number: chukkerCount + 1,
      time: totalTime, // Total measured time in seconds
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      distance: data.distance,
      acceleration: data.acceleration,
      duration: data.duration,
    };
    dispatch(setMeasurement(measurementData));
  };

  const handleClearProgress = () => {
    dispatch(pushCurrentCtivity())
    setSteps(0);
    setDistance(0.0);
    setTime(0);
    setChartData([0, 0, 0, 0, 0]);
    setProgress(0);
    setSelectedHorse(null);
    setMode(null);
    setChukkers('');
    setChukkerCount(0);
    setActivityTime(0);
    setCollectedData([]);
    setIsDataCollected(false);
    setIsFinalized(false);
  };

  const handleSaveProgress = () => {
    clearInterval(intervalRef.current);
    setIsCollectingData(false);
    setIsDataCollected(true);
    setIsFinalized(true);
    if (collectedData.length > 0) {
      const latestData = collectedData[collectedData.length - 1];
      saveMeasurementData(time, latestData); // Save the latest measurement data with total time
    }
  };

  const handleStartMeasurement = () => {
    setModalVisible(false);
    dispatch(setCurrentActivity({
        type_activity_id: mode,
        chuckker_quantity: chukkers,
    }));
    handleToggleDataCollection();
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const hasData = steps > 0 || distance > 0.0 || time > 0 || progress > 0;

  const handleModeSelect = (activityId) => {
    setMode(activityId);
    const selectedActivity = activityTypes.find((activity) => activity.id === activityId);
    setActivityTime(parseInt(selectedActivity.time));
    setTime(parseInt(selectedActivity.time) * 60); // Set initial time for countdown
    if (activityId === 2 || activityId === 3) {
      setChukkers('');
    }
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderModes = () => {
    return activityTypes.map((activity) => ({
      id: activity.id,
      title: activity.name.split(' ')[0],
      subtitle: activity.name.split(' ')[1] || '',
      value: activity.name,
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const calculateMetrics = () => {
    const totalDistance = collectedData.reduce((acc, data) => acc + data.distance, 0);
    const averageSpeed = collectedData.reduce((acc, data) => acc + data.speed, 0) / collectedData.length;
    const maxSpeed = Math.max(...collectedData.map(data => data.speed));
    const totalDuration = collectedData.reduce((acc, data) => acc + data.duration, 0);
    const averageAcceleration = collectedData.reduce((acc, data) => acc + (data.acceleration || 0), 0) / collectedData.length;

    return {
      totalDistance: totalDistance.toFixed(2),
      averageSpeed: averageSpeed.toFixed(2),
      maxSpeed: maxSpeed.toFixed(2),
      totalDuration: formatTime(totalDuration),
      averageAcceleration: averageAcceleration.toFixed(2),
    };
  };

  const metrics = isDataCollected ? calculateMetrics() : null;

  const lineChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const renderLineChart = (data, label) => (
    <LineChart
      data={{
        labels: data.map((_, index) => (index + 1).toString()),
        datasets: [
          {
            data: data
          }
        ]
      }}
      width={screenWidth * 0.9}
      height={220}
      chartConfig={lineChartConfig}
      bezier
      style={styles.chartStyle}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.headerContainer}>
            <View style={styles.row}>
              <Text style={styles.selectedHorseText}>Selected Horse: {selectedHorse ? selectedHorse.name : 'None'}</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Icon name="exchange" size={24} color="tomato" style={styles.headerIcon} />
                </TouchableOpacity>
                {selectedHorse && (
                  <TouchableOpacity onPress={handleClearProgress}>
                    <Icon name="close" size={24} color="tomato" style={styles.headerIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.selectedModeText}>Mode: {mode ? activityTypes.find(a => a.id === mode).name : 'None'}</Text>
            </View>
          </View>

          <Text style={styles.header}>Estadisticas</Text>
          <Text style={styles.date}>15 April, 2020</Text>

          <View style={styles.progressContainer}>
            <CircularProgress
              value={mode === 1 ? (time % 100) : progress}
              radius={80}
              activeStrokeWidth={12}
              inActiveStrokeWidth={12}
              progressValueColor={'#000'}
              activeStrokeColor={'#000'}
              inActiveStrokeColor={'#e0e0e0'}
              duration={1000}
              valueSuffix=""
              showProgressValue={false}
            />
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(time)}</Text>
              {(mode === 2 || mode === 3) && (
                <Text style={styles.chukkerText}>{chukkerCount + 1}/{chukkers} chukkers</Text>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{steps}</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{distance.toFixed(1)}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(time)}</Text>
              <Text style={styles.statLabel}>time</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            {isCollectingData ? (
              <TouchableOpacity style={styles.playButton} onPress={handleToggleDataCollection}>
                <Icon name="pause" size={24} color="#000" />
              </TouchableOpacity>
            ) : (
              <>
                {!hasData && (
                  <TouchableOpacity style={styles.playButton} onPress={handleToggleDataCollection}>
                    <Icon name="play" size={24} color="#000" />
                  </TouchableOpacity>
                )}
                {hasData && !isCollectingData && (
                  <>
                    {isFinalized && chukkerCount + 1 >= chukkers ? (
                      <TouchableOpacity style={styles.terminateButton} onPress={handleClearProgress}>
                        <Text style={styles.buttonLabel}>Terminar Actividad</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity style={styles.finishButton} onPress={handleSaveProgress}>
                          <Icon name="check" size={24} color="#000" />
                          <Text style={styles.buttonLabel}>Finalizar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClearProgress}>
                          <Icon name="close" size={24} color="#000" />
                          <Text style={styles.buttonLabel}>Cancelar</Text>
                        </TouchableOpacity>
                        {chukkerCount + 1 < chukkers && (
                          <TouchableOpacity style={styles.playButton} onPress={handleToggleDataCollection}>
                            <Icon name="play" size={24} color="#000" />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </View>

          {isFinalized && metrics && (
            <View style={styles.collectedDataContainer}>
              <Text style={styles.header}>Datos Recolectados</Text>
              <View style={styles.chartContainer}>
                <Text style={styles.chartLabel}>Distancia por Intervalo</Text>
                {renderLineChart(collectedData.map(data => data.distance), "Distancia")}
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartLabel}>Velocidad por Intervalo</Text>
                {renderLineChart(collectedData.map(data => data.speed), "Velocidad")}
              </View>
              <View style={styles.chartContainer}>
                <Text style={styles.chartLabel}>Aceleración por Intervalo</Text>
                {renderLineChart(collectedData.map(data => data.acceleration), "Aceleración")}
              </View>
              <Text style={styles.dataText}>Total Distance: {metrics.totalDistance} km</Text>
              <Text style={styles.dataText}>Average Speed: {metrics.averageSpeed} m/s</Text>
              <Text style={styles.dataText}>Max Speed: {metrics.maxSpeed} m/s</Text>
              <Text style={styles.dataText}>Total Duration: {metrics.totalDuration}</Text>
              <Text style={styles.dataText}>Average Acceleration: {metrics.averageAcceleration} m/s²</Text>
            </View>
          )}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select a Horse</Text>
              <FlatList
                data={horses}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectHorse(item)}
                    style={[
                      styles.horseItem,
                      selectedHorse && selectedHorse.id === item.id && styles.selectedHorseItem,
                    ]}
                  >
                    <Text style={styles.horseItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
              <Text style={styles.modalTitle}>Select Mode</Text>
              <View style={styles.modeContainer}>
                {renderModes().map((modeItem) => (
                  <Animated.View
                    key={modeItem.id}
                    style={[styles.modeButtonContainer, { transform: [{ scale: animatedValue }] }]}
                  >
                    <TouchableOpacity
                      style={[styles.modeButton, mode === modeItem.id && styles.selectedModeButton]}
                      onPress={() => handleModeSelect(modeItem.id)}
                    >
                      <Text style={styles.modeText}>{modeItem.title}</Text>
                      {modeItem.subtitle ? <Text style={styles.modeSubText}>{modeItem.subtitle}</Text> : null}
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
              {(mode === 2 || mode === 3) && (
                <TextInput
                  style={styles.input}
                  onChangeText={setChukkers}
                  value={chukkers}
                  placeholder="Cantidad de Chukkers"
                  keyboardType="numeric"
                />
              )}
              <TouchableOpacity style={styles.startButton} onPress={handleStartMeasurement}>
                <Text style={styles.textStyle}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  headerContainer: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedHorseText: {
    fontSize: 16,
    color: '#FFF',
  },
  selectedModeText: {
    fontSize: 16,
    color: '#FFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  date: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
  },
  progressContainer: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  timerContainer: {
    position: 'absolute',
    top: '45%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  chukkerText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  finishButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  terminateButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#000',
    marginTop: 5,
    textAlign: 'center',
  },
  collectedDataContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    borderRadius: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 16,
  },
  dataText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#333',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  horseItem: {
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: 100,
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedHorseItem: {
    borderBottomColor: 'tomato',
    borderBottomWidth: 2,
  },
  horseItemText: {
    textAlign: 'center',
    color: '#333',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  modeButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedModeButton: {
    borderBottomColor: '#ff6347',
  },
  modeText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  modeSubText: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 10,
    width: '80%',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#ff6347',
    borderRadius: 20,
    padding: 15,
    elevation: 2,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;