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
import { 
    MaterialIcons, 
    Entypo 
} from '@expo/vector-icons';

const initialFarms = [
  {
    id: 1,
    name: 'Green Valley Farms',
    location: 'Marrakech',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    name: 'SunFresh Organics',
    location: 'Agadir',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 3,
    name: 'Farm to Table',
    location: 'Casablanca',
    image: 'https://via.placeholder.com/100',
  },
];

const FavoriteFarms = () => {
  const [farms, setFarms] = useState(initialFarms);

  const handleRemove = (id) => {
    Alert.alert('Remove Farm', 'Remove this farm from favorites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setFarms(farms.filter((farm) => farm.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="favorite" size={22} color="#FF5252" />
        <Text style={styles.sectionTitle}>Favorite Farms</Text>
      </View>

      {farms.length === 0 ? (
        <Text style={styles.empty}>No favorite farms yet.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {farms.map((farm) => (
            <View key={farm.id} style={styles.card}>
              <Image source={{ uri: farm.image }} style={styles.farmImage} />
              <View style={styles.info}>
                <Text style={styles.farmName}>{farm.name}</Text>
                <View style={styles.locationRow}>
                  <Entypo name="location-pin" size={14} color="#888" />
                  <Text style={styles.locationText}>{farm.location}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleRemove(farm.id)}
              >
                <MaterialIcons name="close" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    width: 140,
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  farmImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  info: {
    alignItems: 'center',
  },
  farmName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  removeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 16,
  },
});

export default FavoriteFarms;
