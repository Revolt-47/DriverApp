import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, ActivityIndicator } from 'react-native';
import {
  Checkbox,
  List,
  IconButton,
  Title,
  Surface,
  Button,
  Paragraph,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentsScreen = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const driverToken = await AsyncStorage.getItem('driverToken');
        const driverId = await AsyncStorage.getItem('driverId');

        const response = await fetch('http://172.17.44.214:3000/driver/getSchools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: driverToken,
            driverId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSchools(data);
          // Select the first school by default
          if (data.length > 0) {
            setSelectedSchool(data[0]);
            fetchStudents(data[0]._id);
          }
        } else {
          console.error('Failed to fetch schools:', response.status);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const fetchStudents = async (schoolId) => {
    try {
      const driverToken = await AsyncStorage.getItem('driverToken');
      const driverId = await AsyncStorage.getItem('driverId');

      const response = await fetch('http://172.17.44.214:3000/driver/getStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: driverToken,
          driverId,
          schoolId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students:', response.status);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSchoolSelection = (school) => {
    setSelectedSchool(school);
    fetchStudents(school._id);
    setModalVisible(false);
  };

  const handleCheckboxToggle = (studentId) => {
    const isSelected = selectedStudents.includes(studentId);
    if (isSelected) {
      // Remove the student from the selected students array
      setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== studentId));
    } else {
      // Add the student to the selected students array
      setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
    }
  };

  const handleCallStudents = async () => {
    try {
      setLoadingVehicles(true);

      const driverToken = await AsyncStorage.getItem('driverToken');
      const driverId = await AsyncStorage.getItem('driverId');

      const response = await fetch('http://172.17.44.214:3000/driver/getVehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: driverToken,
          driverId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
        setShowVehicleModal(true);
      } else {
        console.error('Failed to fetch vehicles:', response.status);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleVehicleSelection = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(false);

    // Add logic to handle calling students with the selected vehicle
    console.log('Calling students with vehicle:', vehicle);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="school"
        color="white"
        size={25}
        style={styles.selectedSchoolButton}
        onPress={handleOpenModal}
      >
        {selectedSchool ? (
          <Title style={styles.selectedSchoolDescription}>
            {selectedSchool.branchName}
          </Title>
        ) : (
          <Title style={styles.selectedSchoolDescription}>Select School</Title>
        )}
      </IconButton>

      <Title style={styles.title}>
        {selectedSchool ? selectedSchool.branchName : 'Select School'}
      </Title>

      <FlatList
        style={styles.flatList}
        data={students}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <Surface style={styles.surface}>
            <List.Item
              title={item.student.name}
              description={`Class: ${item.student.class}, Roll Number: ${item.student.rollNumber}, Section: ${item.student.section}`}
              left={(props) => (
                <Checkbox.Android
                  status={selectedStudents.includes(item._id) ? 'checked' : 'unchecked'}
                  color="black"
                  onPress={() => handleCheckboxToggle(item._id)}
                />
              )}
            />
          </Surface>
        )}
      />

      <Button
        mode="contained"
        dark
        style={styles.callStudentsButton}
        onPress={handleCallStudents}
      >
        Call Students
      </Button>

      {/* School Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>Select School</Title>
            <FlatList
              data={schools}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.branchName}
                  onPress={() => {
                    handleSchoolSelection(item);
                    handleCloseModal();
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleModal}
        animationType="slide"
        onRequestClose={() => setShowVehicleModal(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title style={styles.modalTitle}>Select Vehicle</Title>
            {loadingVehicles ? (
              <ActivityIndicator size="large" color={'black'} style={styles.loader} />
            ) : (
              <FlatList
                data={vehicles}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <List.Item
                    title={`Company: ${item.company}`}
                    description={`Model: ${item.modelName}, Reg Number: ${item.regNumber}`}
                    onPress={() => handleVehicleSelection(item)}
                  />
                )}
                ListEmptyComponent={
                  <Paragraph style={styles.emptyText}>
                    Please ask the school to add a vehicle.
                  </Paragraph>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  flatList: {
    marginVertical: 10,
    width: '100%',
  },
  surface: {
    padding: 8,
    margin: 8,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectedSchoolButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
  },
  selectedSchoolDescription: {
    fontSize: 12,
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  callStudentsButton: {
    marginVertical: 20,
    backgroundColor: 'black',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
  },
};

export default StudentsScreen;
