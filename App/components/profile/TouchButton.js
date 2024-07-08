import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TitleText from '../TitleText';

const TouchButton = ({ children = "Texto", colorPrimary = "#bfbfbf", colorSecundary = "#979797", icon = "user", route = "Profile", modal = false }) => {
    const navigation = useNavigation();


    const handleAction = () => {
        if (!modal)
            navigation.navigate(route);
    }

    return <TouchableOpacity
        className="mb-5 flex flex-row items-center justify-between"
        onPress={handleAction}
    >
        <View className="flex flex-row items-center">
            <View className={`mr-5 pl-4 pr-4 pt-3 pb-3 rounded`} style={{backgroundColor: colorPrimary }} >
                <FontAwesome name={`${icon}`} color={`${colorSecundary}`} size={26} />
            </View>
            <TitleText>{children}</TitleText>
        </View>
        <Entypo name="chevron-right" size={30} color="gray" />
    </TouchableOpacity>;
};

export default TouchButton;