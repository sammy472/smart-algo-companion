import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import * as Location from 'expo-location';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simulated farm "database" with location strings (no lat/lon)
const farmDB = [
  {
    id: 1,
    name: 'Green Valley Farms',
    description: 'Organic veggies & fruits.',
    location: 'Marrakech',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    name: 'Palm Roots Farm',
    description: 'Natural herbs & plants.',
    location: 'Safi',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 3,
    name: 'SunFresh Organics',
    description: 'Fresh produce daily.',
    location: 'Agadir',
    image: 'https://via.placeholder.com/100',
  },
];

// Utility to calculate distance between two GPS points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const deg2rad = deg => deg * (Math.PI / 180);
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))*Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const FarmExplorerScreen = () => {
  const [location, setLocation] = useState(null);
  const [nearbyFarms, setNearbyFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceFilter,setDistanceFilter] = useState(50); // Default 20 km

  const fetchNearbyFarms = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        setLoading(false);
        return;
      }

      let userLoc = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.High
    });
      setLocation(userLoc.coords);

      const enrichedFarms = await Promise.all(
        farmDB.map(async (farm) => {
          try {
            const geoResults = await Location.geocodeAsync(farm.location);
            if (geoResults.length === 0) return null;

            const { latitude, longitude } = geoResults[0];
            const distance = getDistanceFromLatLonInKm(
              userLoc.coords.latitude,
              userLoc.coords.longitude,
              latitude,
              longitude
            );

            return {
              ...farm,
              distance,
              latitude,
              longitude,
            };
          } catch (error) {
            Alert.alert(`Failed to geocode ${farm.location}`);
            return null;
          }
        })
      );

      const filtered = enrichedFarms
        .filter(farm => farm && farm.distance <= distanceFilter)
        .sort((a, b) => a.distance - b.distance);

      setNearbyFarms(filtered);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyFarms();
  }, []);

  //Additional handlers
  const handleContactFarmer = ()=>{
    //Logic to be added later
    Alert.alert('Contacting the farmer');
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="locate" size={22} color="#007AFF" />
        <Text style={styles.headerText}>Nearby Farms</Text>
      </View>
      <View>
        <Text style={styles.headerText}>Farms Within {distanceFilter} kilometers</Text>
        <TextInput
          placeholder='e.g 50'
          value={distanceFilter}
          keyboardType='numeric'
          onChangeText={setDistanceFilter}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loaderText}>Scanning nearby farms...</Text>
        </View>
      ) : (
        <>
          {nearbyFarms.length === 0 ? (
            <Text style={styles.emptyText}>No farms found nearby.</Text>
          ) : (
            <ScrollView>
              {nearbyFarms.map(farm => (
                <View key={farm.id} style={styles.card}>
                  <Image source={{ uri: farm.image }} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.name}>{farm.name}</Text>
                    <Text style={styles.desc}>{farm.description}</Text>
                    <View style={styles.locationRow}>
                      <Entypo name="location-pin" size={14} color="#666" />
                      <Text style={styles.locationText}>
                        {farm.location} • {farm.distance.toFixed(1)} km away
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.contactFarmer} onPress={handleContactFarmer}>
                    Contact Farm Owner
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.refreshBtn} onPress={fetchNearbyFarms}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshText}>Rescan</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loader: {
    alignItems: 'center',
    marginTop: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginVertical: 24,
  },
  card: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
  },
  desc: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 2,
  },
  refreshBtn: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  contactFarmer: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  refreshText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});

export default FarmExplorerScreen;
