import React, { useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Alert 
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaProvider } from "react-native-safe-area-context";


const DeviceControlScreen = () => {
    const [deviceStatus, setDeviceStatus] = useState("ON");
    const [settingLevel, setSettingLevel] = useState(50); // Example setting level

    const toggleDevice = () => {
        setDeviceStatus(deviceStatus === "ON" ? "OFF" : "ON");
        Alert.alert("Device Status", `Device turned ${deviceStatus === "ON" ? "OFF" : "ON"}`);
    };

    const increaseSetting = () => {
        if (settingLevel < 100) {
            setSettingLevel(settingLevel + 10);
        } else {
            Alert.alert("Max Level Reached", "You cannot increase the setting further.");
        }
    };

    const decreaseSetting = () => {
        if (settingLevel > 0) {
            setSettingLevel(settingLevel - 10);
        } else {
            Alert.alert("Min Level Reached", "You cannot decrease the setting further.");
        }
    };

    const restartDevice = () => {
        Alert.alert("Restarting", "Device is restarting...");
    };

    const resetDevice = () => {
        Alert.alert("Reset", "Device settings have been reset to default.");
        setDeviceStatus("ON");
        setSettingLevel(50);
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Control Device</Text>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Status: </Text>
                    <Text style={deviceStatus === "ON" ? styles.statusOn : styles.statusOff}>
                        {deviceStatus}
                    </Text>
                </View>

                <View style={styles.controlRow}>
                    <Icon name="power-off" size={30} color={deviceStatus === "ON" ? "green" : "red"} />
                    <TouchableOpacity style={styles.button} onPress={toggleDevice}>
                        <Text style={styles.buttonText}>{deviceStatus === "ON" ? "Turn OFF" : "Turn ON"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Setting Level: {settingLevel}%</Text>
                    <View style={styles.settingButtons}>
                        <TouchableOpacity style={styles.smallButton} onPress={increaseSetting}>
                            <Icon name="plus" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallButton} onPress={decreaseSetting}>
                            <Icon name="minus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={restartDevice}>
                        <Icon name="refresh" size={20} color="white" />
                        <Text style={styles.buttonText}> Restart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={resetDevice}>
                        <Icon name="undo" size={20} color="white" />
                        <Text style={styles.buttonText}> Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaProvider>
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
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    statusText: {
        fontSize: 18,
    },
    statusOn: {
        color: "green",
        fontWeight: "bold",
        fontSize: 18,
    },
    statusOff: {
        color: "red",
        fontWeight: "bold",
        fontSize: 18,
    },
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginLeft: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 5,
    },
    settingContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    settingText: {
        fontSize: 18,
        marginBottom: 10,
    },
    settingButtons: {
        flexDirection: "row",
    },
    smallButton: {
        backgroundColor: "#007bff",
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    secondaryButton: {
        backgroundColor: "#28a745",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default DeviceControlScreen;
