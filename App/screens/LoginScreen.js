import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { loginUser } from '../api/loginApi';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

const LoginScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);
    const currentColors = isDarkTheme ? colors.dark : colors.light;

    const { t } = useTranslation();

    const [loginUserState, setLoginUserState] = useState({
        email: "",
        password: ""
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (field, value) => {
        setLoginUserState((prevUserData) => ({
            ...prevUserData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await loginUser(loginUserState.email, loginUserState.password, dispatch);

            if (response) {
                navigation.navigate('Main');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.bg }]}>
            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <Animated.Text entering={FadeInUp.duration(1000).springify()} style={[styles.titleText, { color: currentColors.txtPrimary }]}>
                        {t('Sign In')}
                    </Animated.Text>
                    <Text style={[styles.subtitleText, { color: currentColors.txtSecondary }]}>{t('Welcome')}</Text>
                </View>

                <View style={[styles.inputContainer, { backgroundColor: currentColors.bgContainer }]}>
                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Email')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput }]}>
                        <TextInput
                            onChangeText={(text) => handleChange("email", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={loginUserState.email}
                        />
                    </Animated.View>

                    <Text style={[styles.label, { color: currentColors.txtSecondary }]}>{t('Password')}</Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={[styles.inputWrapper, { backgroundColor: currentColors.bgInput, marginBottom: 0 }]}>
                        <TextInput
                            secureTextEntry={!passwordVisible}
                            onChangeText={(text) => handleChange("password", text)}
                            style={[styles.input, { color: currentColors.txtPrimary }]}
                            value={loginUserState.password}
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
                </View>

                <View style={{ flex: 1 }} />

                <View style={styles.buttonContainer}>

                    <Text style={[styles.noAccountText, { color: currentColors.txtSecondary }]}>

                    </Text>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: currentColors.primary }]}>
                            <Text style={styles.buttonText}>
                                {t('Sign In')}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.button}>
                            <Text style={[styles.buttonText, { color: currentColors.primary }]}>
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
        padding: 20,
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
        marginBottom: 16,
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
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    noAccountText: {
        textAlign: 'right',
        marginBottom: 10,
    }
});

export default LoginScreen;