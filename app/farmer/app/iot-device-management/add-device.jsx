import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert 
} from "react-native";

const AddDevice = () => {
    const [deviceName, setDeviceName] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [farmLocation, setFarmLocation] = useState("");
    const [installationDate, setInstallationDate] = useState("");

    const handleAddDevice = () => {
        if (!deviceName || !deviceType || !farmLocation || !installationDate) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        console.log("Device Added:", {
            deviceName,
            deviceType,
            farmLocation,
            installationDate,
        });

        // Reset form after submission
        setDeviceName("");
        setDeviceType("");
        setFarmLocation("");
        setInstallationDate("");

        Alert.alert("Success", "Device added successfully!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Device</Text>

            <TextInput
                style={styles.input}
                placeholder="Device Name"
                value={deviceName}
                onChangeText={setDeviceName}
            />

            <TextInput
                style={styles.input}
                placeholder="Device Type (e.g., Sensor, Pump)"
                value={deviceType}
                onChangeText={setDeviceType}
            />

            <TextInput
                style={styles.input}
                placeholder="Farm Location"
                value={farmLocation}
                onChangeText={setFarmLocation}
            />

            <TextInput
                style={styles.input}
                placeholder="Installation Date (YYYY-MM-DD)"
                value={installationDate}
                onChangeText={setInstallationDate}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddDevice}>
                <Text style={styles.buttonText}>Add Device</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#1D1041",
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddDevice;
