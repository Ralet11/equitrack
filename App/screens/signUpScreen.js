import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { signUp } from '../api/signUpApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

const SignUpScreen = () => {

    const navigation = useNavigation();

    const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);
    const currentColors = isDarkTheme ? colors.dark : colors.light;

    const { t } = useTranslation();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [userData, setUserData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

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
            Alert.alert('Error', t('Passwords do not match'));
            return;
        }

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

    return (
        <View style={[styles.container, { backgroundColor: currentColors.bg }]}>
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: currentColors.bgContainer }]}
                onPress={() => navigation.navigate('Login')}
            >
                <Icon name="arrow-back" size={24} color={currentColors.txtPrimary} />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} style={[styles.titleText, { color: currentColors.txtPrimary }]}>
                        {t('Sign Up')}
                    </Animated.Text>
                </View>

                <View style={[styles.inputContainer, { backgroundColor: currentColors.bgContainer }]}>
                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Name')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            onChangeText={(text) => handleChange("name", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={userData.name}
                        />
                    </Animated.View>

                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Last Name')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            onChangeText={(text) => handleChange("lastName", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={userData.lastName}
                        />
                    </Animated.View>

                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Email')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            onChangeText={(text) => handleChange("email", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={userData.email}
                        />
                    </Animated.View>

                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Password')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            secureTextEntry={!passwordVisible}
                            onChangeText={(text) => handleChange("password", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={userData.password}
                        />
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                            <Icon
                                name={passwordVisible ? "visibility" : "visibility-off"}
                                size={24}
                                color={currentColors.txtSecondary}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Confirm Password')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            secureTextEntry={!confirmPasswordVisible}
                            onChangeText={(text) => handleChange("confirmPassword", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={userData.confirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.iconWrapper}
                            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                            <Icon
                                name={confirmPasswordVisible ? "visibility" : "visibility-off"}
                                size={24}
                                color={currentColors.txtSecondary}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={{ flex: 1 }} />

                <View style={styles.buttonContainer}>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, !isFormComplete() && styles.disabledButton, { backgroundColor: currentColors.primary }]}
                            disabled={!isFormComplete()}
                        >
                            <Text style={styles.buttonText}>
                                {t('Sign Up')}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    contentContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
    },
    titleContainer: {
        marginTop: 60
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
    },
    inputContainer: {
        marginTop: 36,
        padding: 20,
        borderRadius: 10,
    },
    label: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 5,
    },
    inputWrapper: {
        padding: 16,
        borderRadius: 10,
        marginBottom: 5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
    },
    iconWrapper: {
        marginLeft: 10,
    },
    buttonContainer: {
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 10,
        borderRadius: 10
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default SignUpScreen;