import React,{ useEffect } from 'react';
import { View, Image } from 'react-native';

const LogoScreen = ({navigation}) => {
    useEffect(() => {

        const navigationTimer = setTimeout(() => {
          clearTimeout(navigationTimer);
          navigation.navigate('Login');
        }, 4000);
      }, [navigation]);
    
  return (
    <View className="bg-sky-500/[.71] flex justify-end items-center">
      <Image
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
          borderRadius: 20,
        }}
        className="rounded-full"
        source={{
          uri:
            'https://res.cloudinary.com/doqyrz0sg/image/upload/v1704747573/gifpatitasNew_ywwkoo.gif',
        }}
      />
    </View>
  );
};

export default LogoScreen;