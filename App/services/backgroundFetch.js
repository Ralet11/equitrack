import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Alert } from 'react-native';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        // Aquí colocas el código que deseas ejecutar en segundo plano
        Alert.alert("Lo hace");

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Error realizando la tarea de background fetch:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export const registerBackgroundFetch = async () => {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 15 * 60, // Ejecutar cada 15 minutos
            stopOnTerminate: false, // Continuar ejecutándose incluso si la app se cierra
            startOnBoot: true, // Iniciar automáticamente después de reiniciar el dispositivo
        });
        console.log('Background fetch registrado correctamente');
    } catch (error) {
        console.error('Error registrando el background fetch:', error);
    }
};