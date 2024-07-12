import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { signUp } from '../api/signUpApi';

const SignUpScreen = () => {

    const { t } = useTranslation();
    const navigation = useNavigation();
    
    const [userData, setUserData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState('');

    const handleChange = (field, value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [field]: value,
        }));
    }

    const isFormComplete = () => {
        return userData.name !== "" && userData.lastName !== "" && userData.email !== "" && userData.password !== "" && userData.confirmPassword !== "";
    }

    const passwordsMatch = () => {
        return userData.password === userData.confirmPassword;
    }

    const handleSubmit = async () => {
        if (!passwordsMatch()) {
            setError(t('passwordsDoNotMatch'));
            return;
        }
        setError('');
        
        try {
            const response = await signUp(userData, navigation);
            
            if (response) {
                Alert.alert("Te has registrado exitosamente");
                // Vaciar los campos del formulario
                setUserData({
                    name: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                navigation.push("Login");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      
        setError('');
    }, [userData])

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image style={styles.backgroundImage} source={require("../assets/images/background.png")} />

            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} style={styles.titleText}>
                        {t('register')}
                    </Animated.Text>
                </View>

                <View style={styles.inputContainer}>
                    <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder={t('name')}
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("name", text)}
                            value={userData.name}
                            style={styles.input}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder={t('lastName')}
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("lastName", text)}
                            value={userData.lastName}
                            style={styles.input}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder={t('email')}
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("email", text)}
                            value={userData.email}
                            style={styles.input}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={styles.inputWrapper}>
                        <TextInput
                            placeholder={t('password')}
                            placeholderTextColor={"gray"}
                            secureTextEntry
                            onChangeText={(text) => handleChange("password", text)}
                            value={userData.password}
                            style={styles.input}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={[styles.inputWrapper, styles.lastInputWrapper]}>
                        <TextInput
                            placeholder={t('confirmPassword')}
                            placeholderTextColor={"gray"}
                            secureTextEntry
                            onChangeText={(text) => handleChange("confirmPassword", text)}
                            value={userData.confirmPassword}
                            style={styles.input}
                        />
                    </Animated.View>

                    {error ? (
                        <Animated.View entering={FadeInDown.delay(700).duration(1000).springify()} style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </Animated.View>
                    ) : null}

                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.registerButton, !isFormComplete() && styles.disabledButton]}
                            disabled={!isFormComplete()}
                        >
                            <Text style={styles.registerButtonText}>
                                {t('register')}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} style={styles.loginRedirectContainer}>
                        <Text>{t('doYouAlreadyHaveAnAccount')}</Text>
                        <TouchableOpacity onPress={() => navigation.push("Login")}>
                            <Text style={styles.loginRedirectText}> {t('getInto')}</Text>
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
        marginTop: -240,
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
        fontSize: 24,
        marginTop: -150,
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
    lastInputWrapper: {
        marginBottom: 12,
    },
    input: {
        color: 'black',
    },
    errorContainer: {
        width: '100%',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
    },
    registerButton: {
        backgroundColor: '#38bdf8',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    disabledButton: {
        opacity: 0.5,
    },
    registerButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    loginRedirectContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginRedirectText: {
        color: '#0284c7',
    },
});

export default SignUpScreen;