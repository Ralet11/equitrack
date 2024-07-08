import React from 'react';
import { View, Image, Text } from 'react-native';

const ProfileEditScreen = () => {

    return (
        <View className="flex-1 bg-bg">
            <Image
                source={require("../assets/images/bg-patitas.png")}
                className="absolute w-full h-full"
                style={{
                    resizeMode: 'repeat',
                }}
            />
            <View className="m-5 mb-10 flex-1">
                <Text>Edit profile</Text>
            </View>

        </View>
    );
}

export default ProfileEditScreen;
