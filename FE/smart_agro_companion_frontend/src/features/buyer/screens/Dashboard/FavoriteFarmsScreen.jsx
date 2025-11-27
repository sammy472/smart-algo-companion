import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialFarms = [
  { id: 1, name: 'Green Valley Farms', location: 'Marrakech', image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'SunFresh Organics', location: 'Agadir', image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Farm to Table', location: 'Casablanca', image: 'https://via.placeholder.com/100' },
];

const FavoriteFarmsScreen = () => {
  const [farms, setFarms] = useState(initialFarms);

  const handleRemove = (id) => {
    Alert.alert('Remove Farm', 'Remove this farm from favorites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setFarms(farms.filter(farm => farm.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Favorite Farms</Text>
      {farms.length === 0 ? (
        <Text style={styles.empty}>No favorite farms yet.</Text>
      ) : (
        farms.map(farm => (
          <View key={farm.id} style={styles.card}>
            <Image source={{ uri: farm.image }} style={styles.farmImage} />
            <View style={styles.info}>
              <Text style={styles.farmName}>{farm.name}</Text>
              <View style={styles.locationRow}>
                <Entypo name="location-pin" size={16} color="#555" />
                <Text style={styles.locationText}>{farm.location}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.removeIcon} 
              onPress={() => handleRemove(farm.id)}
            >
              <MaterialIcons name="favorite" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  farmImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  farmName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    color: '#555',
    fontSize: 14,
  },
  removeIcon: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 50,
    fontSize: 16,
  },
});

export default FavoriteFarmsScreen;
