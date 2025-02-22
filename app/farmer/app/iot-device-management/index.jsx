import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Switch,
    TouchableOpacity,
    FlatList
} from "react-native";
import { Stack,Link } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';

// List of IoT Devices
const devices = [
  { id: '1', name: "Water Level Sensor", icon: "tint", status: "Active" },
  { id: '2', name: "Smart Thermostat", icon: "thermometer-half", status: "Inactive" },
  { id: '3', name: "Motion Sensor", icon: "eye", status: "Active" },
  { id: '4', name: "Smart Light", icon: "lightbulb-o", status: "Inactive" },
  { id: '5', name: "Door Lock", icon: "lock", status: "Active" },
  { id: '6', name: "Air Quality Sensor", icon: "cloud", status: "Active" },
];

const DeviceCard = ({ name, icon, status, id }) => {
  const [isEnabled, setIsEnabled] = useState(status === "Active");

  return (
    <View style={styles.card}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={styles.iconPlaceholder}>
            <Icon name={icon} size={26} color="black" />
        </View>
        <Text style={styles.title}>{name}</Text>
      </View>

      {/* Status Section */}
      <Text style={styles.status}>
        Status: <Text style={isEnabled ? styles.active : styles.inactive}>{isEnabled ? "Active" : "Inactive"}</Text>
      </Text>

      {/* Buttons Section */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.analyticsButton}>
          <Text style={styles.analyticsText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="trash" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        <Link href={`farmer/app/iot-device-management/${id}`}>
            <Text style={styles.moreText}>More &gt;&gt;&gt;</Text>
        </Link>
        <Switch
          value={isEnabled}
          onValueChange={(value) => setIsEnabled(value)}
        />
      </View>
    </View>
  );
};

const HomePage = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{headerShown:false}}/>
            <View style={{
                position:'absolute',
                backgroundColor:'#1D1041',
                zIndex:50,
                bottom:0,
                right:'40%',
                padding:15,
                margin:10,
                borderRadius:10
            }}>
                <Link href={'/farmer/app/iot-device-management/add-device'}>
                    <Icon name='plus' size={26} color={'white'}/>
                </Link>
            </View>
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <DeviceCard name={item.name} icon={item.icon} status={item.status} id={item.id}/>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    card: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 15,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      iconPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      status: {
        fontSize: 14,
        marginBottom: 10,
      },
      active: {
        color: 'green',
        fontWeight: 'bold',
      },
      inactive: {
        color: 'red',
        fontWeight: 'bold',
      },
      controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      analyticsButton: {
        backgroundColor: '#ddd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      },
      analyticsText: {
        fontWeight: 'bold',
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      moreText: {
        fontSize: 14,
        fontWeight: 'bold',
      },
});

export default HomePage;

