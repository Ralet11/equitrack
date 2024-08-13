import React from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setCurrentActivity } from '../redux/slices/activitySlice';
import { useDispatch } from 'react-redux';

const ModalSelector = ({ modalVisible, horses, selectedHorse, onSelectHorse, mode, onModeSelect, chukkers, setChukkers, onCloseModal, onPrepareForMeasurement, activityTypes = [] }) => {

    const dispatch = useDispatch();

    const handleStartPress = () => {
        const activityDetails = {
            activityType: mode,
            chukkerQuantity: chukkers,
            horse_id: selectedHorse ? selectedHorse.id : null,
        };

        console.log(activityDetails, "current details");

        dispatch(setCurrentActivity(activityDetails));

        onPrepareForMeasurement();

        onCloseModal();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onCloseModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onCloseModal}>
                        <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Select a Horse</Text>
                    <FlatList
                        data={horses}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelectHorse(item)}
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
                        {activityTypes.map((modeItem) => (
                            <TouchableOpacity
                                key={modeItem.id}
                                style={[
                                    styles.modeButton,
                                    mode === modeItem.id && styles.selectedModeButton
                                ]}
                                onPress={() => onModeSelect(modeItem.id)}
                            >
                                <Text style={styles.modeText}>{modeItem.name}</Text>
                            </TouchableOpacity>
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
                    <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
                        <Text style={styles.textStyle}>Start</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    modeButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    selectedModeButton: {
        backgroundColor: '#ff6347',
        borderColor: '#ff6347',
    },
    modeText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
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

export default ModalSelector;