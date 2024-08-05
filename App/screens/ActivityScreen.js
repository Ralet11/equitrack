import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';
import PagerView from 'react-native-pager-view';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const tabs = ['Entrenamiento', 'Chukkers Entrenamiento', 'Chukkers Partidos'];

const ExampleData = [
    { id: 1, fecha: '2024-07-10', distancia: '5km', km: '2' },
    { id: 2, fecha: '2024-07-11', distancia: '10km', km: '4' },
    { id: 3, fecha: '2024-07-12', distancia: '15km', km: '6' },
];

const Card = ({ data, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(data)}>
        <Text style={styles.cardText}>Fecha: {data.fecha}</Text>
        <Text style={styles.cardText}>Distancia: {data.distancia}</Text>
        <Text style={styles.cardText}>KM: {data.km}</Text>
    </TouchableOpacity>
);

const TabContent = ({ tabName }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleCardPress = (data) => {
        setSelectedData(data);
        setModalVisible(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {ExampleData.map((data) => (
                <Card key={data.id} data={data} onPress={handleCardPress} />
            ))}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    {selectedData && (
                        <>
                            <Text style={styles.modalText}>Fecha: {selectedData.fecha}</Text>
                            <Text style={styles.modalText}>Distancia: {selectedData.distancia}</Text>
                            <Text style={styles.modalText}>KM: {selectedData.km}</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Cerrar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>
        </ScrollView>
    );
};

const ActivityScreen = () => {
    const viewPagerRef = useRef(null);
    const [activePage, setActivePage] = useState(0);

    const handlePageChange = (pageNumber) => {
        viewPagerRef.current.setPage(pageNumber);
        setActivePage(pageNumber);
    };

    return (
        <View style={styles.flexContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handlePageChange(0)} style={activePage === 0 ? styles.activeTab : styles.inactiveTab}>
                    <Text style={activePage === 0 ? styles.activeTabText : styles.inactiveTabText}>Entrenamiento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePageChange(1)} style={activePage === 1 ? styles.activeTab : styles.inactiveTab}>
                    <Text style={activePage === 1 ? styles.activeTabText : styles.inactiveTabText}>Chukkers Entrenamiento</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePageChange(2)} style={activePage === 2 ? styles.activeTab : styles.inactiveTab}>
                    <Text style={activePage === 2 ? styles.activeTabText : styles.inactiveTabText}>Chukkers Partidos</Text>
                </TouchableOpacity>
            </View>
            <PagerView style={styles.pagerView} ref={viewPagerRef} initialPage={0}>
                <View key="1">
                    <TabContent tabName="Entrenamiento" />
                </View>
                <View key="2">
                    <TabContent tabName="Chukkers Entrenamiento" />
                </View>
                <View key="3">
                    <TabContent tabName="Chukkers Partidos" />
                </View>
            </PagerView>
        </View>
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
        paddingBottom: 10,
    },
    inactiveTab: {
        paddingBottom: 10,
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    inactiveTabText: {
        color: '#000',
    },
    pagerView: {
        flex: 1,
        marginTop: 10,
    },
    container: {
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        elevation: 5,
    },
    cardText: {
        fontSize: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
});

export default ActivityScreen;