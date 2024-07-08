import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    tabBar: {
      position: 'absolute',
      backgroundColor: '#2c2c2c',
      borderTopWidth: 0,
      elevation: 15,
      height: 60,
      margin: 10,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 0 : 0, // Ensures padding for iOS
    },
    tabBarDark: {
      position: 'absolute',
      backgroundColor: '#2c2c2c',
      borderTopWidth: 0,
      elevation: 35,
      height: 60,
      margin: 10,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Ensures padding for iOS
    },
    tabBarLabel: {
      fontSize: 12,
      marginBottom: Platform.OS === 'ios' ? 5 : 5, // Adjusts label position for iOS
      color: 'white',
    },
    tabBarLabelDark: {
      fontSize: 12,
      marginBottom: Platform.OS === 'ios' ? 5 : 5, // Adjusts label position for iOS
      color: 'white',
    },
    tabBarIcon: {
      marginTop: Platform.OS === 'ios' ? -10 : 5,
      color: "white" // Ensures icon position for iOS
    },
  });