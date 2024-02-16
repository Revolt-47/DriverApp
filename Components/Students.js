import React, { useState, useEffect } from "react";
import { View, FlatList, Modal, ActivityIndicator } from "react-native";
import {
  Button,
  Text,
  ListItem,
  Checkbox,
  Title,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentsScreen = () => {
  const theme = useTheme(); // Access the theme

  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const driverToken = await AsyncStorage.getItem("driverToken");
        const driverId = await AsyncStorage.getItem("driverId");

        const response = await fetch(
          "http://172.17.44.214:3000/driver/getSchools",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: driverToken,
              driverId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSchools(data);
          // Select the first school by default
          if (data.length > 0) {
            setSelectedSchool(data[0]);
            fetchStudents(data[0]._id);
          }
        } else {
          console.error("Failed to fetch schools:", response.status);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  const fetchStudents = async (schoolId) => {
    try {
      const driverToken = await AsyncStorage.getItem("driverToken");
      const driverId = await AsyncStorage.getItem("driverId");

      const response = await fetch(
        "http://172.17.44.214:3000/driver/getStudents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: driverToken,
            driverId,
            schoolId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch students:", response.status);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
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
      setSelectedStudents((prevSelected) =>
        prevSelected.filter((id) => id !== studentId)
      );
    } else {
      // Add the student to the selected students array
      setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button
        onPress={() => setModalVisible(true)}
        style={{ margin: 8, backgroundColor: theme["color-primary-default"] }}
      >
        {selectedSchool ? selectedSchool.branchName : "Select School"}
      </Button>

      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ListItem
            title={item.student.name}
            description={`Class: ${item.student.class}, Roll Number: ${item.student.rollNumber}, Section: ${item.student.section}`}
            accessoryRight={() => (
              <Checkbox
                checked={selectedStudents.includes(item._id)}
                onChange={() => handleCheckboxToggle(item._id)}
              />
            )}
          />
        )}
      />

      <Button
        onPress={() => {} /* Handle calling students */}
        style={{ margin: 8, backgroundColor: theme["color-primary-default"] }}
      >
        Call Students
      </Button>

      {/* School Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <FlatList
          data={schools}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ListItem
              title={item.branchName}
              onPress={() => {
                handleSchoolSelection(item);
              }}
            />
          )}
        />
      </Modal>
    </View>
  );
};

export default StudentsScreen;
