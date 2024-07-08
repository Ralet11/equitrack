import React from 'react';
import { View, Modal, StyleSheet, Pressable, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import TitleText from '../components/TitleText';

const ImagePickerModal = ({ modalVisible, setModalVisible, setSelectedImage }) => {

    const pickImage = async (source) => {
        let result;
        if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else if (source === 'library') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (result.canceled) {
            console.log('Selección de imagen cancelada');
        } else {
            setSelectedImage(result.assets[0].uri);
            modalClose();
        }
    };

    const modalClose = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View className="p-4 flex-1" style={styles.centeredView}>
                    <View className="w-full bg-white" style={styles.modalView}>

                        <Pressable
                            className="absolute right-0 m-4 z-10 "
                            onPress={() => modalClose()}>
                            <Ionicons name="close-circle-outline" color="#808080" size={48} />
                        </Pressable>

                        <View style={{ marginTop: -10 }} className="flex w-full mb-6">
                            <TitleText>Seleccione imagen</TitleText>
                        </View>
                        <View className="flex flex-row w-full">
                            <View className="flex-1">
                                <TouchableOpacity className="items-center">
                                    <IconMaterial name="photo-camera" color="#808080" size={48} onPress={() => pickImage('camera')} />
                                    <Text className="mt-1">Camara</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1">
                                <TouchableOpacity className="items-center">
                                    <IconMaterial name="photo-library" color="#808080" size={48} onPress={() => pickImage('library')} />
                                    <Text className="mt-1">Galeria</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
});

export default ImagePickerModal