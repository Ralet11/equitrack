import NetInfo from '@react-native-community/netinfo'; // Importar NetInfo
import { syncHorses } from '../api/horseApi';

// Define la función periódica
const myPeriodicFunction = async (horsesRef, userRef, dispatch) => {
  try {
    // Verifica si hay conexión a Internet
    const netInfo = await NetInfo.fetch();
    console.log('Conexión a Internet:', netInfo.isConnected);

    if (netInfo.isConnected) {
      console.log('Hay conexión a Internet');

      if (horsesRef.current.update) {
        console.log('Datos de caballos para sincronizar encontrados');
        await syncHorses(horsesRef.current.horsesForUpdate, userRef.current, dispatch); 
      } else {
        console.log('No hay datos de caballos para sincronizar');
      }
    } else {
      console.log('No hay conexión a Internet');
    }
  } catch (error) {
    console.error('Error en la función periódica:', error);
  }
};


export const registerBackgroundFetch = (intervalMs, horsesRef, userRef, dispatch) => {
  if (typeof intervalMs !== 'number' || intervalMs <= 0) {
    console.error('Intervalo inválido para registerBackgroundFetch');
    return;
  }


  const intervalId = setInterval(() => {
    myPeriodicFunction(horsesRef, userRef, dispatch);
  }, intervalMs);

  // Devuelve una función para limpiar el intervalo
  return () => clearInterval(intervalId);
};
