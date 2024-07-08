import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import axios from 'react-native-axios';
import { API_URL } from "@env";

const SignUpScreen2 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params;

    const [horseData, setHorseData] = useState({
        name: "",
        birth: "",
        sex: "",
        fur: ""
    });

    const handleChange = (field, value) => {
        setHorseData((prevHorseData) => ({
            ...prevHorseData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const data = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                horse: horseData
            };

            const response = await axios.post(`${API_URL}/auth/register`, data);

            if (response.data.status === "ok") {
                Alert.alert("Usuario y caballo registrados exitosamente");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="Light" />
            <Image className="h-full w-full absolute mt-[-300]" source={require("../assets/images/background.png")} />

            <View className="h-full w-full flex justify-around pt-40 pb-10">

                <View className="flex items-center mx-4 space-y-4">
                    <Animated.Text entering={FadeInDown.duration(1000).springify()} className="my-[-15]" style={{ color: 'black', fontSize: 12 }}>Nombre del Caballo</Animated.Text>
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full">
                        <TextInput
                            placeholder='Ingrese el nombre del caballo'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("name", text)}
                        />
                    </Animated.View>

                    <Animated.Text entering={FadeInDown.delay(200).duration(1000).springify()} className="my-[-15]" style={{ color: 'black', fontSize: 12 }}>Fecha de Nacimiento</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full">
                        <TextInput
                            placeholder='Ingrese la fecha de nacimiento'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("birth", text)}
                        />
                    </Animated.View>

                    <Animated.Text entering={FadeInDown.delay(400).duration(1000).springify()} className="my-[-15]" style={{ color: 'black', fontSize: 12 }}>Sexo</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full mb-3">
                        <TextInput
                            placeholder='Ingrese el sexo del caballo'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("sex", text)}
                        />
                    </Animated.View>

                    <Animated.Text entering={FadeInDown.delay(600).duration(1000).springify()} className="my-[-15]" style={{ color: 'black', fontSize: 12 }}>Pelaje</Animated.Text>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full mb-3">
                        <TextInput
                            placeholder='Ingrese el pelaje del caballo'
                            placeholderTextColor={"gray"}
                            onChangeText={(text) => handleChange("fur", text)}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="w-full">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                        >
                            <Text className="text-xl font-bold text-white text-center">
                                Registrate
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} className="flex-row justify-center">
                        <Text>¿Ya tienes una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.push("Login")}>
                            <Text className="text-sky-600"> Ingresa</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

export default SignUpScreen2;