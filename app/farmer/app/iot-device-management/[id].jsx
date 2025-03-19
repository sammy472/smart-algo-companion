import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams,Link } from 'expo-router';

const DeviceProfile = () => {
    const { id } = useLocalSearchParams(); // id will be used in the future to fetch the specific device
    const devices = [
        { id: 1, name: "Soil Moisture Sensor", status: "Active", icon: "tint", farmer: "John Doe", farm: "Green Valley Farm", location: "Accra, Ghana", dateInstalled: "2026-02-10" },
        { id: 2, name: "pH Sensor", status: "Inactive", icon: "flask", farmer: "Jane Smith", farm: "Sunshine Acres", location: "Kumasi, Ghana", dateInstalled: "2026-03-12" },
        { id: 3, name: "Soil Temperature Sensor", status: "Active", icon: "thermometer-half", farmer: "Kwame Boateng", farm: "AgroTech Farm", location: "Tamale, Ghana", dateInstalled: "2026-01-08" },
        { id: 4, name: "NPK Sensor", status: "Inactive", icon: "leaf", farmer: "Aisha Mohammed", farm: "Fertile Grounds", location: "Takoradi, Ghana", dateInstalled: "2026-04-20" },
        { id: 5, name: "Light Sensor (LDR)", status: "Active", icon: "lightbulb-o", farmer: "Kojo Mensah", farm: "Evergreen Fields", location: "Cape Coast, Ghana", dateInstalled: "2026-05-18" },
        { id: 6, name: "CO2 Sensor", status: "Active", icon: "cloud", farmer: "Ama Opoku", farm: "Green Pastures", location: "Sunyani, Ghana", dateInstalled: "2026-06-22" },
        { id: 7, name: "Temperature and Humidity Sensor", status: "Inactive", icon: "thermometer-full", farmer: "Yaw Osei", farm: "Harvest Haven", location: "Ho, Ghana", dateInstalled: "2026-07-10" },
        { id: 8, name: "Rain Gauge", status: "Active", icon: "cloud-rain", farmer: "Fatima Ali", farm: "Rainforest Farms", location: "Bolgatanga, Ghana", dateInstalled: "2026-08-30" },
        { id: 9, name: "Water Level Sensor", status: "Inactive", icon: "tint", farmer: "Michael Addo", farm: "HydroFarm", location: "Sekondi, Ghana", dateInstalled: "2026-09-05" },
        { id: 10, name: "Infrared Camera Sensor", status: "Active", icon: "eye", farmer: "Sarah Adu", farm: "ThermoVision Agro", location: "Dambai, Ghana", dateInstalled: "2026-10-15" },
        { id: 11, name: "Camera Module", status: "Inactive", icon: "camera", farmer: "Kwesi Owusu", farm: "FarmCam", location: "Koforidua, Ghana", dateInstalled: "2026-11-25" },
        { id: 12, name: "Motion Detector (PIR Sensor)", status: "Active", icon: "street-view", farmer: "Nana Yaw", farm: "MotionFarm", location: "Wa, Ghana", dateInstalled: "2026-12-30" },
        { id: 13, name: "Gas Sensors (e.g., Ammonia, Methane)", status: "Active", icon: "fire", farmer: "Akosua Mensah", farm: "GasGuard Farms", location: "Techiman, Ghana", dateInstalled: "2027-01-05" },
        { id: 14, name: "Barometric Pressure Sensor", status: "Inactive", icon: "dashboard", farmer: "Kwabena Darko", farm: "BaroFarm", location: "Nkawkaw, Ghana", dateInstalled: "2027-02-10" },
    ];

    const device = devices.find((device) => device.id === parseInt(id));

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
