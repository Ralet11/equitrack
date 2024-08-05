import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  tabBar: {
    margin: 12,
    borderRadius: 12,
    height: 65
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: Platform.OS === 'ios' ? 5 : 5, // Adjusts label position for iOS
    color: 'red',
  },
  tabBarIcon: {
    marginTop: Platform.OS === 'ios' ? -10 : 5,
    color: "white",
  },
});

export default styles;