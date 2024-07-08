import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { API_URL, BUCKET_URL } from "@env";
import axios from 'react-native-axios';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import SpinnerLoader from './SpinnerLoader';
import Toast, { BaseToast } from 'react-native-toast-message';
import ImagePickerModal from './ImagePickerModal';
import TitleText from './TitleText';
import { checkInternetConnection } from '../helpers/syncHelper';
import { useNavigation } from '@react-navigation/native';
import { clearHorses, clearHorsesForUpdate, editHorseById, setHorses, setHorsesForUpdate, setUpdate } from '../redux/slices/horseSlice';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const AnimatedTextInput = ({ label, placeholder, value = '', onChangeText, error }) => {
    const isFocused = useSharedValue(false);

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            top: isFocused.value || value ? -20 : 10,
            fontSize: isFocused.value || value ? 14 : 16,
            color: isFocused.value || value ? 'gray' : 'gray',
            backgroundColor: 'transparent',
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
                placeholder={isFocused.value ? '' : placeholder}
                onChangeText={onChangeText}
                style={[styles.textInput, { backgroundColor: error ? '#fff5f5' : '#f0f0f0' }]}
            />
        </View>
    );
};

const HorseModal = ({ modalVisible, setModalVisible, horseSubmit, setHorseSubmit, editHorse = null }) => {
    const user = useSelector((state) => state.user);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [modalImageVisible, setModalImageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const dispatch = useDispatch();
    const token = user.token
    const navigation = useNavigation();
    
    const initialHorseState = {
        name: '',
        type_horse_id: null,
        breed_id: null,
        image_profile: null,
        birthdate: '',
        color: '',
        weight: null
    };

    const [horse, setHorse] = useState(initialHorseState);

    const [fieldErrors, setFieldErrors] = useState({
        name: false,
        last_name: false,
        type_horse_id: false,
        breed_id: false,
        birthdate: false,
        color: false,
        weight: false,
    });

    const [allTypes, setAllTypes] = useState([]);
    const [allBreeds, setAllBreeds] = useState([]);

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

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Algo salio mal',
            text2: 'Debes completar todos los campos'
        });
    };

    const modalClose = () => {
        setModalVisible(false);
        setFieldErrors({});
    };

    const handleChange = (field, value) => {
        setHorse((prevUserData) => ({
            ...prevUserData,
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
        handleChange("birthdate", date);
        hideDatePicker();
    };

    const validateFields = () => {
        const errors = {};

        if (!horse.name) {
            errors.name = 'Nombre es requerido';
        }
        if (!horse.type_horse_id) {
            errors.type_horse_id = 'Tipo es requerido';
        }
      /*   if (!horse.breed_id) {
            errors.breed_id = 'Raza es requerida';
        } */
        if (!horse.birthdate) {
            errors.birthdate = 'Fecha de nacimiento es requerida';
        }
        if (!horse.color) {
            errors.color = 'Color es requerido';
        }
        if (!horse.weight) {
            errors.weight = 'Peso es requerido';
        }

        setFieldErrors(errors);

        return errors;
    };

    const sendEditHorse = async (updatedDetails) => {
        const connexion = await checkInternetConnection();
    
        const editedHorse = {
            ...updatedDetails,
        };
    
        dispatch(editHorseById({ id: updatedDetails.id, updatedHorse: editedHorse }));
        dispatch(setHorsesForUpdate(editedHorse));
        dispatch(setUpdate(true));
    
        if (connexion) {
            try {
                const response = await axios.put(`${API_URL}/api/horses/${updatedDetails.id}`, editedHorse, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                dispatch(setHorses(response.data));
                setHorseSubmit(!horseSubmit);
                setModalVisible(!modalVisible);
             
            } catch (error) {
                console.error('Error editing horse:', error);
            } finally {
                setIsLoadingForm(false);
            }
        } else {
            setIsLoadingForm(false);
            setModalVisible(!modalVisible)
        }
    };
    

    const createHorse = async (newHorse) => {
        const connexion = await checkInternetConnection();
        dispatch(setHorses(newHorse));
        dispatch(setHorsesForUpdate(newHorse));
        dispatch(setUpdate(true));

        if (connexion) {
            try {
                const response = await axios.post(`${API_URL}/api/horses`, newHorse, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                dispatch(setHorses(response.data));
                setHorseSubmit(!horseSubmit);
                setModalVisible(!modalVisible);
            } catch (error) {
                console.error('Error creating horse:', error);
            } finally {
                setIsLoadingForm(false);
                setModalVisible(!modalVisible)
            }
        } else {
            setIsLoadingForm(false);
            setModalVisible(!modalVisible)
        }
    };

    const handleSubmit = async () => {
        const errors =/*  validateFields() */ false
        if (Object.keys(errors).length === 0) {
            setIsLoadingForm(true);
            if (editHorse) {
                await sendEditHorse(horse);
            } else {
                await createHorse(horse);
            }
        } else {
            showToast();
        }
    };

    const fetchAllBreeds = async (type_horse_id) => {
        try {
            const data = {
                type_horse: type_horse_id,
            }

            const response = await axios.get(`${API_URL}/breeds/get`, {
                params: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.data.status === "ok") {
                setAllBreeds(response.data.breeds);
            }
        } catch (error) {
            console.error('Error al obtener las razas', error);
        }
    };

    useEffect(() => {
        if (horse.type_horse_id) {
            fetchAllBreeds(horse.type_horse_id);
        } else {
            setAllBreeds([]);
        }
    }, [horse.type_horse_id]);

    useEffect(() => {
        if (selectedImage)
            handleChange('image_profile', selectedImage);
    }, [selectedImage]);

    useEffect(() => {
        setHorse(editHorse ? editHorse : initialHorseState);
    }, [editHorse]);

    useEffect(() => {
        const fetchAllTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/types_horse/get`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.data.status === "ok") {
                    setAllTypes(response.data.types);
                }
            } catch (error) {
                console.error('Error al obtener los horses', error);
            }
        };
        fetchAllTypes();
    }, []);

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
                    <View className="m-4 flex-1" style={styles.centeredView}>
                        <View className="w-full h-full bg-white" style={styles.modalView}>

                            <Pressable
                                className="absolute right-0 m-4 z-10 "
                                onPress={() => modalClose()}>
                                <Ionicons name="close-circle-outline" color="#808080" size={48} />
                            </Pressable>

                            <View style={{ marginTop: -10 }} className="flex w-full mb-6">
                                <TitleText style={{ fontSize: 26, color: "#808080" }}>{editHorse !== null ? 'Editar ' : 'Agregar '} Caballo</TitleText>
                            </View>
                            <View className="flex items-center mx-4 space-y-4 w-full">
                                <View className="rounded-2xl w-full items-center">
                                </View>
                                <View className="flex flex-row">
                                    <View className="flex-1 mr-2">
                                        <AnimatedTextInput
                                            label="Nombre"
                                            placeholder="Nombre"
                                            value={horse.name}
                                            onChangeText={(text) => handleChange("name", text)}
                                            error={fieldErrors.name}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.labelPicker}>Tipo de raza</Text>
                                <View className={`bg-black/5 p-3 rounded-2xl w-full ${fieldErrors.breed_id ? "border border-orange-500" : ""}`}>
                                    
                                    <Picker
                                   
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) =>
                                            handleChange("breed_id", itemValue)
                                        }
                                        selectedValue={horse.breed_id ? horse.breed_id.toString() : ""}
                                    >
                                        <Picker.Item className="text-gray-500"  style={{ fontSize: 14 }} label='Seleccionar' value='' />
                                        {allBreeds.map((item) => (
                                            <Picker.Item className="text-gray-500" style={{ fontSize: 14 }} key={item.key} label={item.value} value={item.key} />
                                        ))}
                                    </Picker>
                                </View>
                                <View className="flex flex-row">
                                    <View className="flex-1 mr-2">
                                        <AnimatedTextInput
                                            label="Color"
                                            placeholder="Color"
                                            value={horse.color}
                                            onChangeText={(text) => handleChange("color", text)}
                                            error={fieldErrors.color}
                                        />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <AnimatedTextInput
                                            label="Peso"
                                            placeholder="Peso"
                                            value={horse.weight ? horse.weight.toString() : ""}
                                            onChangeText={(text) => handleChange("weight", text)}
                                            keyboardType='numeric'
                                            error={fieldErrors.weight}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.labelPicker}>Fecha de nacimiento</Text>
                                <View className={`bg-black/5 p-3 rounded-2xl w-full ${fieldErrors.birthdate ? "border border-orange-500" : ""}`}>
                                    <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                                        <Text className="text-gray-500">{horse.birthdate ? moment(horse.birthdate).format('DD/MM/YYYY') : "Ingresar"}</Text>
                                    </TouchableOpacity>
                                </View>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />

                                <View className="w-full">
                                    {!isLoadingForm ? (
                                        <TouchableOpacity onPress={handleSubmit} className="w-full bg-current2 p-3 rounded-2xl mb-3">
                                            <Text className="text-xl font-bold text-white text-center">
                                                {editHorse ? "Editar caballo" : "Registrar caballo"}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <SpinnerLoader />
                                    )}

                                    {isConnected !== null && (
                                        <Text style={{ textAlign: 'center', marginTop: 10 }}>
                                            Conexión: {isConnected ? 'true' : 'false'}
                                        </Text>
                                    )}

                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </Modal>

            <ImagePickerModal modalVisible={modalImageVisible} setModalVisible={setModalImageVisible} setSelectedImage={setSelectedImage} ></ImagePickerModal>
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {},
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 1,
        paddingHorizontal: 5,
        backgroundColor: 'transparent',
        color: 'gray',
        fontSize: 16,
    },
    labelPicker: {
        fontSize: 16,
        color: 'gray',
    },
    inputContainer: {
        marginVertical: 12,
        width: '100%',
        position: 'relative',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 5,
    },
    textInput: {
        height: 40,
        fontSize: 16,
        padding: 10,
        color: 'black',
        borderRadius: 10,
    },
    datePicker: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: 'red',
    },
});

export default HorseModal;