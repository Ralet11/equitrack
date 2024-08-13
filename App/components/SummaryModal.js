import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SummaryModal = ({ isVisible, onClose, collectedData, chukkers, currentChukker, onStartNextChukker, onFinalizeMatch }) => {

  // Organizar la data por chukker
  const chukkerData = Array.from({ length: chukkers }, (_, index) => {
    return {
      chukkerNumber: index + 1,
      data: collectedData.filter(data => data.chukker === index + 1)
    };
  });

  const renderChukkerCard = (chukker, index) => {
    if (chukker.data.length > 0) {
      const lastDataPoint = chukker.data[chukker.data.length - 1];
      return (
        <View key={index} style={styles.chukkerCard}>
          <View style={styles.chukkerHeader}>
            <Text style={styles.chukkerTitle}>Resumen {chukker.chukkerNumber}er TIEMPO</Text>
          </View>
          <View style={styles.chukkerBody}>
            <Text style={styles.chukkerStats}>Distancia: {lastDataPoint.distance.toFixed(2)} km</Text>
            <Text style={styles.chukkerStats}>Velocidad: {lastDataPoint.speed.toFixed(2)} km/h</Text>
            <Text style={styles.chukkerStats}>Aceleración: {lastDataPoint.acceleration.toFixed(2)} m/s²</Text>
          </View>
        </View>
      );
    } else if (index === currentChukker) {
      // Mostrar el botón para iniciar el siguiente chukker si es el chukker actual y no tiene datos
      return (
        <TouchableOpacity key={index} style={styles.chukkerCard} onPress={onStartNextChukker}>
          <View style={styles.chukkerBody}>
            <Icon name="play" size={50} color="#000" />
            <Text style={styles.playText}>Iniciar {chukker.chukkerNumber}er TIEMPO</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Mostrar una tarjeta vacía si no hay datos para chukkers anteriores
      return (
        <View key={index} style={[styles.chukkerCard, styles.emptyChukker]}>
          <Text style={styles.emptyText}>{chukker.chukkerNumber}er TIEMPO</Text>
        </View>
      );
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Resumen del Partido</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {chukkerData.map((chukker, index) => renderChukkerCard(chukker, index))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            {currentChukker + 1 >= chukkers ? (
              <TouchableOpacity style={styles.finalizeButton} onPress={onFinalizeMatch}>
                <Text style={styles.buttonText}>Finalizar Partido</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%', // Limita la altura del modal
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  chukkerCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  chukkerHeader: {
    marginBottom: 10,
  },
  chukkerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chukkerBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chukkerStats: {
    fontSize: 14,
    marginBottom: 5,
  },
  emptyChukker: {
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  playText: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  finalizeButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SummaryModal;