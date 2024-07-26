import React from 'react';
import {  } from 'react-native';
import { useSelector } from 'react-redux';
import { View, Image, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

const CustomHeader = () => {
    const isDarkTheme = useSelector((state) => state.theme.isDarkTheme);
    const currentColors = isDarkTheme ? colors.dark : colors.light;

    return (
        <View style={[styles.header, { backgroundColor: currentColors.background }]}>
            <Image style={styles.image} source={require("../assets/images/logo.png")} />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        height: '80%',
        resizeMode: 'contain',
    },
    header: {
        justifyContent: 'center', // Centrar verticalmente
        alignItems: 'center', // Centrar horizontalmente
        height: 100,
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative',
    },
});


export default CustomHeader;