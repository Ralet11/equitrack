import React from 'react';
import Navigation from './navigation';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useFonts } from 'expo-font';
import { I18nextProvider } from 'react-i18next';
import i18n from './helpers/i18nHelper';

export default function App() {

  const [loaded] = useFonts({
    'Delius-Regular': require('./assets/fonts/Delius-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <Navigation />
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}