import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // Asegúrate de instalar este paquete

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    // Para iOS, normalmente no es necesario solicitar permiso manualmente aquí
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
};

const startMeasurement = async (callback) => {
  const hasPermission = await requestLocationPermission();
  if (hasPermission) {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("Location:", position);
        callback(); // Inicia la medición aquí
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  } else {
    console.log("Location permission not granted.");
  }
};

export default startMeasurement;