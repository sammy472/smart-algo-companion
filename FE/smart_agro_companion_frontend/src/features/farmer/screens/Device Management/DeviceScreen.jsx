import React,{useState} from "react";
import { 
    View,
    ScrollView, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    Alert 
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams,Link } from 'expo-router';
import Paho from 'paho-mqtt';
import { SafeAreaProvider } from "react-native-safe-area-context";

const DeviceScreen = () => {
    const [message, setMessage] = useState(0);
    const { id } = useLocalSearchParams(); // id will be used in the future to fetch the specific device
    
    const devices = [
        { 
            id: 1, 
            name: "Soil Moisture Sensor", 
            status: "Active", 
            icon: "tint", 
            farmer: "John Doe", 
            farm: "Green Valley Farm", 
            location: "Accra, Ghana", 
            dateInstalled: "2026-02-10" 
        },
        { 
            id: 2, 
            name: "pH Sensor", 
            status: "Inactive", 
            icon: "flask", 
            farmer: "Jane Smith", 
            farm: "Sunshine Acres", 
            location: "Kumasi, Ghana", 
            dateInstalled: "2026-03-12" 
        },
        { 
            id: 3, 
            name: "Soil Temperature Sensor", 
            status: "Active", 
            icon: "thermometer-half", 
            farmer: "Kwame Boateng", 
            farm: "AgroTech Farm", 
            location: "Tamale, Ghana",
            dateInstalled: "2026-01-08" 
        },
        { 
            id: 4,
             name: "NPK Sensor", 
             status: "Inactive", 
             icon: "leaf", 
             farmer: "Aisha Mohammed", 
             farm: "Fertile Grounds", 
             location: "Takoradi, Ghana", 
             dateInstalled: "2026-04-20" 
        },
        { 
            id: 5, 
            name: "Light Sensor (LDR)", 
            status: "Active", 
            icon: "lightbulb-o", 
            farmer: "Kojo Mensah", 
            farm: "Evergreen Fields", 
            location: "Cape Coast, Ghana", 
            dateInstalled: "2026-05-18" 
        },
        { 
            id: 6, 
            name: "CO2 Sensor", 
            status: "Active", 
            icon: "cloud", 
            farmer: "Ama Opoku", 
            farm: "Green Pastures", 
            location: "Sunyani, Ghana", 
            dateInstalled: "2026-06-22" 
        },
    ];

    const device = devices.find((device) => device.id === parseInt(id));

    const handleDelete = () => {
        Alert.alert(`Deleting device ${device.id}`);
        // Add delete functionality
    };

    const handleViewAnalytics = () => {
        Alert.alert(`Viewing analytics for device ${device.id}`);
        // Add navigation to analytics screen
    };

    const handleEditDevice = () => {
        Alert.alert(`Editing device ${device.id}`);
        // Add navigation to edit device screen
    };

    const handleControlDevice = () => {
        Alert.alert(`Controlling device ${device.id}`);
        // Add device control functionality
    };

    /*
   useEffect(() => {
    // MQTT Configuration
    const client = new Paho.Client(
      "pf-co68wy8c3fz386csm6gr.cedalo.cloud/mqtt",
      443,
      "react-native-client-" + Math.random().toString(16).slice(2)
    );

    // Set callback handlers
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        Alert.alert("Connection lost:", responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (msg) => {
      setMessage(msg.payloadString);
    };

    // Connect the client
    client.connect({
        onSuccess: () => {
            console.log("Connected");
            client.subscribe("test/topic");
            const message = new Paho.Message("Hello from React Native!");
            message.destinationName = "test/topic";
            client.send(message);},
        userName: "Abena",
        password: "Newtonian472",
        useSSL: true, // Set to true if using wss (secure)
    });

    return () => {
      client.disconnect();
    };
  }, []);
  */

    return (
        <SafeAreaProvider>
            <ScrollView
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
            >
                <Text style={styles.title}>{device.name}</Text>
                <View style={styles.innerContainer}>
                    <View style={styles.infoRow}>
                        <Icon name="info-circle" size={26} color="white" />
                        <Text style={styles.infoText}>
                            STATUS:{" "}
                            <Text style={device.status === "Active" ? styles.active : styles.inactive}>
                                {device.status}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="user" size={26} color="white" />
                        <Text style={styles.infoText}>
                            FARMER: <Text style={{color:"white"}}>{device.farmer}</Text>
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="leaf" size={26} color="white" />
                        <Text style={styles.infoText}>
                            FARM: <Text style={{color:"white"}}>{device.farm}</Text>
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="map-marker" size={26} color="white" />
                        <Text style={styles.infoText}>
                             LOCATION: <Text style={{color:"white"}}>{device.location}</Text>
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="calendar" size={26} color="white" />
                        <Text style={styles.infoText}>
                            Installed: <Text style={{color:"white"}}>{device.dateInstalled}</Text>
                        </Text>
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
                            <Text style={styles.actionText}>Uinstall</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dataDisplay}>
                        <Text style={styles.sensorTitle}>Sensor Reading(s)</Text>
                        <Text style={styles.sensorText}>{message}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
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
        padding: 10,
        justifyContent: 'space-evenly',
        width: '97%',
        borderRadius: 2,
        backgroundColor: '#1D1041',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        height: '100%',
        color: '#fff',
    },
    dataDisplay: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        borderRadius: 4,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    title: {
        fontSize:24, 
        marginVertical:10,
        padding:10,
        textAlign:'center',
        fontWeight:'bold',
        color:'#1D1041',
        backgroundColor:'#EDEDED',
        borderRadius:10,
        width: '100%',
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        fontWeight: "500",
    },
    sensorTitle: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        padding: 10,
        textAlign: "center",
    },
    sensorText: {
        fontSize: 18,
        marginLeft: 10,
        color: "#333",
        fontWeight: "500",
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
        color: 'white',
        fontWeight: '500',
    }
});

export default DeviceScreen;
