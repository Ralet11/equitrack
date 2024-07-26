import React, { useState, useEffect } from 'react';
import { API_URL, BUCKET_URL } from "@env";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import axios from 'react-native-axios';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePickerModal from '../components/ImagePickerModal';
import TouchButton from '../components/profile/TouchButton';
import { Picker } from '@react-native-picker/picker';
import { logout } from '../redux/rootReducer';
import { toggleTheme } from '../redux/slices/themeSlice';
import { setuser } from '../redux/slices/userSlice';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [language, setLanguage] = useState('');
    const [units, setUnits] = useState('');
    const navigations = useNavigation();

    const imageUri = user.image_profile ?
        { uri: `${BUCKET_URL}profiles/users/${user.image_profile}` } : require("../assets/images/pet_default.jpg");

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

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    }

    const handleLogout = () => {
        dispatch(logout());
        navigations.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/bg-patitas.png")}
                style={styles.backgroundImage}
            />
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profileImage}
                    source={imageUri}
                />
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>Profile Menu</Text>

                    <TouchButton colorPrimary='#329bcc' colorSecundary='#1d536d' icon='user' route="ProfileEdit">Editar perfil</TouchButton>

                    <View style={styles.pickerContainer}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={language}
                                onValueChange={(itemValue) => setLanguage(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="English" value="en" />
                                <Picker.Item label="Spanish" value="es" />
                                <Picker.Item label="French" value="fr" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.pickerContainer}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={units}
                                onValueChange={(itemValue) => setUnits(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Kilometers" value="km" />
                                <Picker.Item label="Miles" value="miles" />
                            </Picker>
                        </View>
                    </View>

                    <Button title="Toggle Theme" onPress={handleToggleTheme} />

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ImagePickerModal modalVisible={modalVisible} setModalVisible={setModalVisible} setSelectedImage={setSelectedImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    contentContainer: {
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        marginTop: 'auto',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    pickerContainer: {
        marginVertical: 10,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'repeat',
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 64,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 6,
    },
    addPhotoIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 10,
    },
    buttonsContainer: {
        marginTop: 320,
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    buttonsWrapper: {
        margin: 40,
    },
});

export default ProfileScreen;