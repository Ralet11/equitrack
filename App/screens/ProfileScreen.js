import React, { useState, useEffect } from 'react';
import { API_URL, BUCKET_URL } from "@env";
import { View, Image, TouchableOpacity } from 'react-native';
import axios from 'react-native-axios';
import { useDispatch, useSelector } from 'react-redux';
import { setuser } from '../redux/slices/userSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePickerModal from '../components/ImagePickerModal';
import TouchButton from '../components/profile/TouchButton';

const ProfileScreen = () => {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const imageUri = user.image_profile ?
            { uri: BUCKET_URL + 'profiles/users/' + user.image_profile } : require("../assets/images/pet_default.jpg");

    useEffect(() => {
        handleSubmit(selectedImage);
    }, [selectedImage]);

    const handleSubmit = async (image) => {

        if (selectedImage) {
            const formData = new FormData();

            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('image', {
                uri: image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });

            const header = {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    "content-type": "multipart/form-data",
                }
            };

            try {
                const response = await axios.post(`${API_URL}/users/image-profile`, formData, header);
                if (response.data.status === "ok") {
                    dispatch(setuser({
                        image_profile: response.data.user.image_profile,
                    }));
                }
            } catch (error) {
                console.error('Error al agregar profile user', error);
            }
        }
    }

    return (
        <View className="flex-1 bg-bg">
            <Image
                source={require("../assets/images/bg-patitas.png")}
                className="absolute w-full h-full"
                style={{
                    resizeMode: 'repeat',
                }}
            />
            <View className="absolute items-center w-full mt-16 ">
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        className="rounded-full w-[200] h-[200]"
                        style={{ borderColor: "#fff", borderWidth: 6 }}
                        source={imageUri}
                    />
                    <MaterialIcons
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'white',
                            borderRadius: 30,
                            padding: 10
                        }} name="add-a-photo" size={30} color="gray" />
                </TouchableOpacity>
            </View>

            <View className="mt-80 flex-1 bg-white w-full rounded-t-3xl">
                <View className="m-10">
                    <TouchButton colorPrimary='#329bcc' colorSecundary='#1d536d' icon='user' route="ProfileEdit">Editar perfil</TouchButton>
                    <TouchButton colorPrimary='#ca54d1' colorSecundary='#944199' icon='paw' route='Pets'>Mis mascotas</TouchButton>
                    <TouchButton>Mis publicaciones</TouchButton>
                    <TouchButton>Configuraciones</TouchButton>
                    <TouchButton>Ayuda</TouchButton>
                </View>
            </View>

            <ImagePickerModal modalVisible={modalVisible} setModalVisible={setModalVisible} setSelectedImage={setSelectedImage} ></ImagePickerModal>
        </View>
    );
}

export default ProfileScreen;
