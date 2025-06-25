import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Back 👋</Text>
      <Text style={styles.subText}>Find fresh farm produce near you</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.card}>
              <Image
                source={{ uri: 'https://source.unsplash.com/400x400/?fruit' + item }}
                style={styles.image}
              />
              <Text style={styles.productName}>Organic Tomatoes</Text>
              <Text style={styles.price}>$3.50 / kg</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Farms</Text>
        <View style={styles.farmCard}>
          <Text style={styles.farmName}>Green Valley Farm</Text>
          <Text style={styles.farmDetails}>Accra, Ghana</Text>
        </View>
        <View style={styles.farmCard}>
          <Text style={styles.farmName}>Sunrise Harvest</Text>
          <Text style={styles.farmDetails}>Kumasi, Ghana</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    padding: 16,
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#392867',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: 140,
  },
  image: {
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    width: '100%',
  },
  productName: {
    fontWeight: '500',
    fontSize: 14,
  },
  price: {
    fontSize: 13,
    color: '#392867',
    marginTop: 4,
  },
  farmCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
  },
  farmDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
