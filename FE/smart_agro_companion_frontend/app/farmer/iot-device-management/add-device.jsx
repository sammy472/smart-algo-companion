import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [installationDate, setInstallationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddDevice = () => {
    if (!deviceName || !deviceType || !farmLocation || !installationDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("Device Added:", {
      deviceName,
      deviceType,
      farmLocation,
      installationDate: installationDate.toISOString().split("T")[0],
    });

    setDeviceName("");
    setDeviceType("");
    setFarmLocation("");
    setInstallationDate(new Date());

    Alert.alert("Success", "Device added successfully!");
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Device</Text>

        <View style={styles.inputGroup}>
          <Icon name="microchip" size={20} color="#1D1041" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Device Name"
            value={deviceName}
            onChangeText={setDeviceName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="cogs" size={20} color="#1D1041" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Device Type (e.g., Sensor, Pump)"
            value={deviceType}
            onChangeText={setDeviceType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Icon name="map-marker" size={20} color="#1D1041" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Farm Location"
            value={farmLocation}
            onChangeText={setFarmLocation}
          />
        </View>

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => setShowDatePicker(true)}
        >
          <MCIcon name="calendar" size={20} color="#1D1041" style={styles.icon} />
          <Text style={[styles.input, { paddingVertical: 10 }]}>
            {installationDate.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={installationDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setInstallationDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAddDevice}>
          <Text style={styles.buttonText}>Add Device</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#1D1041",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1D1041",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddDevice;
