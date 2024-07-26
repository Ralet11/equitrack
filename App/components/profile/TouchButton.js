import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TitleText from '../TitleText';

const TouchButton = ({ children = "Texto", colorPrimary = "#bfbfbf", colorSecundary = "#979797", icon = "user", route = "Profile", modal = false }) => {
    const navigation = useNavigation();

    const handleAction = () => {
        if (!modal)
            navigation.navigate(route);
    }

    return (
        <TouchableOpacity style={styles.touchable} onPress={handleAction}>
            <View style={styles.innerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: colorPrimary }]}>
                    <FontAwesome name={icon} color={colorSecundary} size={26} />
                </View>
                <TitleText>{children}</TitleText>
            </View>
            <Entypo name="chevron-right" size={30} color="gray" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginBottom: 20, // mb-5
        flexDirection: 'row', // flex-row
        alignItems: 'center', // items-center
        justifyContent: 'space-between', // justify-between
    },
    innerContainer: {
        flexDirection: 'row', // flex-row
        alignItems: 'center', // items-center
    },
    iconContainer: {
        marginRight: 20, // mr-5
        paddingLeft: 16, // pl-4
        paddingRight: 16, // pr-4
        paddingTop: 12, // pt-3
        paddingBottom: 12, // pb-3
        borderRadius: 5, // rounded
    },
});

export default TouchButton;