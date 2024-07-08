import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { API_URL, BUCKET_URL } from "@env";
import axios from 'react-native-axios';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpinnerLoader from './SpinnerLoader';
import Toast, { BaseToast } from 'react-native-toast-message';
import TitleText from './TitleText';
import { Picker } from '@react-native-picker/picker';

const AccidentModal = ({ modalVisible, setModalVisible }) => {

    const [isLoadingForm, setIsLoadingForm] = useState(false);
    //const [modalImageVisible, setModalImageVisible] = useState(false);

    const initialState = {
        type: null,
    };

    const [accident, setAccident] = useState(initialState);

    const [fieldErrors, setFieldErrors] = useState({
        type: false,
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
    }

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Algo salio mal',
            text2: 'Debes completar todos los campos'
        });
    };

    const modalClose = () => {
        setModalVisible(false);
        setFieldErrors({})
    };

    const handleChange = (field, value) => {
        setAccident((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        setFieldErrors((prevErrors) => ({
            ...prevErrors,
            [field]: false,
        }));
    };

    const validateFields = () => {
        const errors = {};

        if (!accident.type) {
            errors.type = 'Tipo es requerido';
        }

        setFieldErrors(errors)


        return errors;
    };

    const handleSubmit = async () => {

        const errors = validateFields();

        if (Object.keys(errors).length === 0) {
            setIsLoadingForm(true);

            /* const formData = new FormData();
             formData.append('name', pet.name);
             formData.append('last_name', pet.last_name);
             formData.append('type_pet_id', pet.type_pet_id);
             formData.append('breed_id', pet.breed_id);
             formData.append('birthdate', pet.birthdate.toISOString());
             formData.append('color', pet.color);
             formData.append('weight', pet.weight);
 
             if (pet.image_profile) {
                 const uriParts = pet.image_profile.split('.');
                 const fileType = uriParts[uriParts.length - 1];
 
                 formData.append('image_profile', {
                     uri: pet.image_profile,
                     name: `photo.${fileType}`,
                     type: `image/${fileType}`,
                 });
             }
 
             const header = {
                 headers: {
                     'Authorization': `Bearer ${user.token}`,
                     "content-type": "multipart/form-data",
                 }
             };
 
             try {
                 const response = await axios.post(`${API_URL}/pets/add`, formData, header);
 
                 if (response.data.status === "ok") {
                     setIsLoadingForm(false);
                     //setPet(initialPetState);
                     setPetSubmit(!petSubmit);
                     setModalVisible(!modalVisible);
                 }
             } catch (error) {
                 setIsLoadingForm(false)
                 console.error('Error al agregar el pet', error);
             }*/
        } else {
            showToast()
        }
    }

    useEffect(() => {
        switch (accident.type) {
            case 'lost':
                //aca haria que muestre otros input y cambie el fieldErros por los campos correspondientes
            break;
        }
    }, [accident.type]);

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
                                <TitleText style={{ fontSize: 26, color: "#808080" }}>Publicación</TitleText>
                            </View>
                            <View className="flex items-center mx-4 space-y-4 w-full">
                                <View className={`bg-black/5 rounded-2xl w-full ${fieldErrors.type ? "border border-orange-500" : ""
                                    }`}>
                                    <Picker
                                        onValueChange={(value, index) =>
                                            handleChange("type", value)
                                        }
                                        selectedValue={accident.type ? accident.type.toString() : ""}
                                    >
                                        <Picker.Item style={{ fontSize: 14 }} label='Tipo *' value='' />
                                        <Picker.Item style={{ fontSize: 14 }} label='Perdi mi mascota' value='lost' />
                                        <Picker.Item style={{ fontSize: 14 }} label='Encontre una mascota' value='found' />
                                        <Picker.Item style={{ fontSize: 14 }} label='Mascota para adoptar' value='adoption' />
                                    </Picker>
                                </View>
                                <View className="w-full">
                                    {!isLoadingForm ? (
                                        <TouchableOpacity onPress={handleSubmit} className="w-full bg-current2 p-3 rounded-2xl mb-3">
                                            <Text className="text-xl font-bold text-white text-center">
                                                Registrar mascota
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <SpinnerLoader />
                                    )}

                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
    }
});

export default AccidentModal