import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProgressStats = ({ mode, time, progress, steps, distance, chukkerCount, chukkers, isCollectingData, hasData, onToggleDataCollection, onFinalize, onClearProgress }) => (
  <View>
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
        <TouchableOpacity style={styles.playButton} onPress={onToggleDataCollection}>
          <Icon name="pause" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.playButton} onPress={onToggleDataCollection}>
          <Icon name="play" size={24} color="#000" />
        </TouchableOpacity>
      )}
      {hasData && (
        <>
          <TouchableOpacity style={styles.finalizeButton} onPress={onFinalize}>
            <Text style={styles.finalizeButtonText}>Finalizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClearProgress}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  finalizeButton: {
    backgroundColor: '#ff6347',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  finalizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export default ProgressStats;