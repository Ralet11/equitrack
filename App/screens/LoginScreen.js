import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../api/loginApi';
import React, { useState } from 'react';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [loginUserState, setLoginUserState] = useState({
        email: "",
        password: ""
    });

    const handleChange = (field, value) => {
        setLoginUserState((prevUserData) => ({
            ...prevUserData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await loginUser(loginUserState.email, loginUserState.password, dispatch);

            if(response) {
                navigation.navigate('Main');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image style={styles.backgroundImage} source={require("../assets/images/background.png")} />

            <View style={styles.lightContainer}>
                <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} style={styles.lightImage1} source={require("../assets/images/light.png")} />
                <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} style={styles.lightImage2} source={require("../assets/images/light.png")} />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                   <TouchableOpacity onPress={() => setLoginUserState({email: "ramiro.alet@gmail.com",
        password: "123"})}>
                   <Animated.Text entering={FadeInUp.duration(1000).springify()} style={styles.titleText}>
                        {t('login')}
                    </Animated.Text>
                   </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("email", text)}
                            style={styles.input}
                            value={loginUserState.email}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder='Contraseña'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("password", text)}
                            secureTextEntry
                            style={styles.input}
                            value={loginUserState.password}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={styles.signupContainer}>
                        <Text>No tenés una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                            <Text style={styles.signupText}> Registrate</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    lightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
    },
    lightImage1: {
        height: 225,
        width: 90,
    },
    lightImage2: {
        height: 160,
        width: 65,
    },
    contentContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'space-around',
        paddingTop: 40,
        paddingBottom: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 2,
        fontSize: 40,
    },
    inputContainer: {
        alignItems: 'center',
        marginHorizontal: 16,
        spaceBetween: 16,
    },
    inputWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 20,
        borderRadius: 20,
        width: '100%',
    },
    input: {
        color: 'black',
    },
    buttonContainer: {
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#38bdf8',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: '#0284c7',
    },
});

export default LoginScreen;