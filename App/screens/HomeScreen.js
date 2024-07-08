import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearHorses, clearHorsesForUpdate } from '../redux/slices/horseSlice';

const HomeScreen = () => {

  const horses = useSelector((state) => state.horses.horses);
  const horseToUpdate = useSelector((state) => state.horses.horsesForUpdate);
  const update = useSelector((state) => state.horses.update)
  const dispatch = useDispatch()

  /*useEffect(() => {
    console.log("limpiando caballos")
    dispatch(clearHorses())
  },[])*/

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  text: {
    fontSize: 24,
    fontFamily: 'Delius-Regular',
  },
});

export default HomeScreen;