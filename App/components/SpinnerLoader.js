import React from 'react';
import { View, ActivityIndicator } from 'react-native';


const Loader = () => {
  return (
    <View className="flex-1 justify-center rounded-full items-center bg-current2 p-5">
      <ActivityIndicator className="mb-4 mt-4" size="large" color="#ffff" />
    </View>
  );
};

export default Loader;