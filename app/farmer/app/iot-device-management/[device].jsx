import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams,Link } from 'expo-router';

const DeviceProfile = () => {
    const { id } = useLocalSearchParams(); // id will be used in the future to fetch the specific device
    const device = {
        id: 1,
        name: "Water Level Sensor",
        status: "Active",
        icon: "tint",
        farmer: "John Doe",
        farm: "Green Valley Farm",
        location: "Accra, Ghana",
        dateInstalled: "2026-02-10",
    };

    const handleDelete = () => {
        console.log(`Deleting device ${device.id}`);
        // Add delete functionality
    };

    const handleViewAnalytics = () => {
        console.log(`Viewing analytics for device ${device.id}`);
        // Add navigation to analytics screen
    };

    const handleEditDevice = () => {
        console.log(`Editing device ${device.id}`);
        // Add navigation to edit device screen
    };

    const handleControlDevice = () => {
        console.log(`Controlling device ${device.id}`);
        // Add device control functionality
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{device.name}</Text>
            <View style={styles.innerContainer}>
                <View style={styles.infoRow}>
                    <Icon name="info-circle" size={26} color="black" />
                    <Text style={styles.infoText}>
                        Status:{" "}
                        <Text style={device.status === "Active" ? styles.active : styles.inactive}>
                            {device.status}
                        </Text>
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="user" size={26} color="black" />
                    <Text style={styles.infoText}> Farmer: {device.farmer}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="leaf" size={26} color="black" />
                    <Text style={styles.infoText}> Farm: {device.farm}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="map-marker" size={26} color="black" />
                    <Text style={styles.infoText}> Location: {device.location}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Icon name="calendar" size={26} color="black" />
                    <Text style={styles.infoText}> Installed: {device.dateInstalled}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleViewAnalytics}>
                        <Icon name="bar-chart" size={22} color="#007bff" />
                        <Text style={styles.actionText}>Analytics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleEditDevice}>
                        <Icon name="pencil" size={22} color="#28a745" />
                        <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <Link href={'/farmer/app/iot-device-management/control-device'}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleControlDevice}>
                            <Icon name="cogs" size={22} color="#ff9800" />
                            <Text style={styles.actionText}>Control</Text>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                        <Icon name="trash" size={22} color="#dc3545" />
                        <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-evenly',
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'left',
        width: '90%',
        paddingHorizontal: 20
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    active: {
        color: "green",
        fontWeight: "bold",
    },
    inactive: {
        color: "red",
        fontWeight: "bold",
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        marginTop: 5,
        fontSize: 14,
    }
});

export default DeviceProfile;
