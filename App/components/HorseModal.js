import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import { API_URL } from "@env";
import axios from 'react-native-axios';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import SpinnerLoader from './SpinnerLoader';
import Toast, { BaseToast } from 'react-native-toast-message';
import TitleText from './TitleText';
import ImagePickerModal from './ImagePickerModal';
import { checkInternetConnection } from '../helpers/syncHelper';
import { clearHorses, clearHorsesForUpdate, editHorseById, setHorses, setHorsesForUpdate, setUpdate } from '../redux/slices/horseSlice';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const AnimatedTextInput = ({ label, value = '', onChangeText, error, placeholder }) => {
    const isFocused = useSharedValue(false);

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            top: withTiming(isFocused.value || value ? -14 : 10),
            fontSize: withTiming(isFocused.value || value ? 12 : 16),
            color: withTiming(isFocused.value || value ? 'gray' : 'gray'),
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            paddingHorizontal: 5,
            borderWidth: 1,
            borderColor: '#ccc',
        };
    });

    const handleFocus = () => {
        isFocused.value = true;
    };

    const handleBlur = () => {
        if (!value) {
            isFocused.value = false;
        }
    };

    return (
        <View style={[styles.inputContainer, error ? styles.errorBorder : null]}>
            <Animated.Text style={[styles.label, animatedLabelStyle]}>{label}</Animated.Text>
            <TextInput
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={[styles.textInput, { backgroundColor: error ? '#fff5f5' : '#f0f0f0' }]}
            />
        </View>
    );
};

const HorseModal = ({ modalVisible, setModalVisible, horseSubmit, setHorseSubmit, editHorse = null }) => {
    const user = useSelector((state) => state.user);
    const breeds = useSelector((state) => state.breeds.breeds);
    const horsesForUpdate = useSelector((state) => state.horses.horsesForUpdate)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [modalImageVisible, setModalImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const dispatch = useDispatch();
    const token = user.token;

    console.log(horsesForUpdate, "caballo para update")

    const initialHorseState = {
        name: '',
        type_horse_id: null,
        breed_id: null,
        image_profile: null,
        birthdate: '',
        fur: '',
        weight: null
    };

    const [horse, setHorse] = useState(initialHorseState);

    const [fieldErrors, setFieldErrors] = useState({
        name: false,
        type_horse_id: false,
        breed_id: false,
        birthdate: false,
        fur: false,

    });

    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ backgroundColor: '#ff584f', borderLeftColor: 'pink', borderLeftWidth: 5, padding: 10 }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400'
                }}
                text2Style={{
                    fontSize: 12,
                    fontWeight: '300',
                    color: 'black'
                }}
            />
        ),
    };

    console.log(horse)

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Algo salió mal',
            text2: 'Debes completar todos los campos'
        });
    };

    const modalClose = () => {
        setModalVisible(false);
        setFieldErrors({});
        setHorse(initialHorseState);
        setSelectedImage(null);
    };

    const handleChange = (field, value) => {
        setHorse((prevHorseData) => ({
            ...prevHorseData,
            [field]: value,
        }));

        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [field]: false,
        }));
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // Convertir la fecha a string ISO antes de guardarla en el estado
        handleChange("birthdate", moment(date).toISOString());
        hideDatePicker();
    };

    const validateFields = () => {
        const errors = {};

        if (!horse.name) {
            errors.name = 'Nombre es requerido';
        }
        if (!horse.breed_id) {
            errors.breed_id = 'Raza es requerido';
        }
        if (!horse.birthdate) {
            errors.birthdate = 'Fecha de nacimiento es requerida';
        }
        if (!horse.fur) {
            errors.fur = 'Color es requerido';
        }

        setFieldErrors(errors);

        return errors;
    };

    const sendEditHorse = async (updatedDetails) => {


        const editedHorse = {
            ...updatedDetails,
        };

        const editedHorseForUp = {
            ...updatedDetails,
            updated: true
            }

        dispatch(editHorseById({ id: updatedDetails.id, updatedHorse: editedHorse }));
        dispatch(setHorsesForUpdate(editedHorseForUp));
        dispatch(setUpdate(true));
        setIsLoadingForm(false);
        setModalVisible(!modalVisible);

    };


    const createHorse = async (newHorse) => {
        ;


        const horseToCreate = {
            ...newHorse,
            birthdate: moment(newHorse.birthdate).toISOString()
        };

        dispatch(setHorses(horseToCreate));
        dispatch(setHorsesForUpdate(horseToCreate));
        dispatch(setUpdate(true));
        setIsLoadingForm(false);
        setModalVisible(!modalVisible);

    };

    const handleSubmit = async () => {
        const errors = validateFields();
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            setIsLoadingForm(true);
            // Asegurarse de que la fecha se convierte a string antes de enviar los datos
            const horseToSubmit = { ...horse, birthdate: moment(horse.birthdate).toISOString() };
            if (editHorse) {
                await sendEditHorse(horseToSubmit);
            } else {
                await createHorse(horseToSubmit);
            }
        } else {
            showToast();
        }
    };

    useEffect(() => {
        if (selectedImage)
            handleChange('image_profile', selectedImage);
    }, [selectedImage]);

    useEffect(() => {
        setHorse(editHorse ? editHorse : initialHorseState);
        if (editHorse && editHorse.image_profile) {
            setSelectedImage(editHorse.image_profile);
        }
    }, [editHorse]);

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => modalClose()}>
                                <Ionicons name="close-circle-outline" color="#808080" size={32} />
                            </Pressable>

                            <View style={styles.titleContainer}>
                                <TitleText style={styles.titleText}>{editHorse !== null ? 'Editar ' : 'Agregar '} Caballo</TitleText>
                            </View>
                            <View style={styles.formContainer}>
                                <AnimatedTextInput
                                    label="Nombre"
                                    value={horse.name}
                                    onChangeText={(text) => handleChange("name", text)}
                                    error={fieldErrors.name}
                                    placeholder="Nombre"
                                />
                                <View style={styles.imageRow}>
                                    {selectedImage && (
                                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                    )}
                                    <TouchableOpacity style={styles.imagePickerButton} onPress={() => setModalImageVisible(true)}>
                                        <Text style={styles.imagePickerButtonText}>
                                            {selectedImage ? "Cambiar Imagen" : "Agregar Imagen"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.labelPicker}>Tipo de raza</Text>
                                <View style={[styles.pickerContainer, fieldErrors.breed_id ? styles.errorBorder : null]}>
                                    <Picker
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => {
                                            const selectedBreed = breeds.find(breed => breed.id === parseInt(itemValue));
                                            handleChange("breed_id", selectedBreed ? selectedBreed.id : null);
                                        }}
                                        selectedValue={horse.breed_id ? horse.breed_id.toString() : ""}
                                    >
                                        <Picker.Item style={styles.pickerItem} label='Seleccionar' value='' />
                                        {breeds.map((item) => (
                                            <Picker.Item style={styles.pickerItem} key={item.id} label={item.name} value={item.id.toString()} />
                                        ))}
                                    </Picker>
                                </View>
                                <AnimatedTextInput
                                    label="Color"
                                    value={horse.fur}
                                    onChangeText={(text) => handleChange("fur", text)}
                                    error={fieldErrors.fur}
                                    placeholder="Color"
                                />

                                <Text style={styles.labelPicker}>Fecha de nacimiento</Text>
                                <View style={[styles.datePickerContainer, fieldErrors.birthdate ? styles.errorBorder : null]}>
                                    <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                                        <Text style={styles.datePickerText}>{horse.birthdate ? moment(horse.birthdate).format('DD/MM/YYYY') : "Ingresar"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />

                                <View style={styles.submitButtonContainer}>
                                    {!isLoadingForm ? (
                                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                                            <Text style={styles.submitButtonText}>
                                                {editHorse ? "Editar caballo" : "Registrar caballo"}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <SpinnerLoader />
                                    )}
                                </View>

                                {isConnected !== null && (
                                    <Text style={styles.connectionText}>
                                        Conexión: {isConnected ? 'true' : 'false'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </Modal>

            <ImagePickerModal modalVisible={modalImageVisible} setModalVisible={setModalImageVisible} setSelectedImage={setSelectedImage} />
        </View>
    );
};

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    picker: {},
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        maxHeight: height * 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    titleContainer: {
        marginBottom: 10,
    },
    titleText: {
        fontSize: 20,
        color: "#808080",
    },
    formContainer: {
        width: '100%',
    },
    labelPicker: {
        fontSize: 14,
        color: 'gray',
        marginTop: 10,
        marginBottom: 5,
    },
    pickerContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
    },
    pickerItem: {
        fontSize: 14,
    },
    inputContainer: {
        marginVertical: 8,
        width: '100%',
        position: 'relative',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    textInput: {
        height: 36,
        fontSize: 14,
        padding: 10,
        color: 'black',
        borderRadius: 10,
    },
    datePickerContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    datePicker: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
    },
    datePickerText: {
        color: 'gray',
    },
    submitButtonContainer: {
        width: '100%',
        marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#FF6F61',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: 'red',
    },
    connectionText: {
        textAlign: 'center',
        marginTop: 10,
    },
    label: {
        position: 'absolute',
        left: 10,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 5,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    imagePickerButton: {
        backgroundColor: '#FF6F61',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
    },
    imagePickerButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
});

export default HorseModal;
