import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ selectedHorse, mode, activityTypes, onExchangePress, onClearProgress }) => (
  <View style={styles.headerContainer}>
    <View style={styles.row}>
      <Text style={styles.selectedHorseText}>Selected Horse: {selectedHorse ? selectedHorse.name : 'None'}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onExchangePress}>
          <Icon name="exchange" size={24} color="tomato" style={styles.headerIcon} />
        </TouchableOpacity>
        {selectedHorse && (
          <TouchableOpacity onPress={onClearProgress}>
            <Icon name="close" size={24} color="tomato" style={styles.headerIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <View style={styles.row}>
      <Text style={styles.selectedModeText}>Mode: {mode ? activityTypes.find(a => a.id === mode).name : 'None'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedHorseText: {
    fontSize: 16,
    color: '#FFF',
  },
  selectedModeText: {
    fontSize: 16,
    color: '#FFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 10,
  },
});

export default Header;