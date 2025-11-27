import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';


const initialProducts = [
  {
    id: '1',
    name: 'Tomatoes',
    quantity: 100,
    price: 5,
    category: 'Vegetables',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
  },
  {
    id: '2',
    name: 'Carrots',
    quantity: 80,
    price: 4,
    category: 'Vegetables',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Carrots_at_a_farmers_market_in_the_Villages_Florida.png/640px-Carrots_at_a_farmers_market_in_the_Villages_Florida.png',
  },
  {
    id: '3',
    name: 'Mangoes',
    quantity: 50,
    price: 10,
    category: 'Fruits',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg',
  },
  {
    id: '4',
    name: 'Maize',
    quantity: 150,
    price: 3,
    category: 'Grains',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Maize_-Zea_mays_-_corn_05.jpg/640px-Maize_-Zea_mays_-_corn_05.jpg',
  },
];

const ProductListingScreen = () => {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });

      if (!result.canceled) {
          setAvatar(result.assets[0].uri);
      }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const saveChanges = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setModalVisible(false);
  };

  const filteredProducts = products.filter((p) =>
    filter === 'All' ? true : p.category === filter
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    return 0;
  });

  const fixedCategories = ['Vegetables', 'Grains', 'Cereals', 'Fruits', 'Poultry', 'Meat'];
  const categories = ['All', ...fixedCategories];

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>My Listed Products</Text>

      {/* Filters */}
      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              filter === cat && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(cat)}
          >
            <Text
              style={[
                styles.filterText,
                filter === cat && styles.activeFilterText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Buttons */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          onPress={() => setSortBy('name')}
          style={styles.sortButton}
        >
          <Feather name="arrow-up" size={16} />
          <Text style={styles.sortText}>Sort by Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortBy('price')}
          style={styles.sortButton}
        >
          <Feather name="dollar-sign" size={16} />
          <Text style={styles.sortText}>Sort by Price</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            )}
            <Text style={styles.detail}>
              <FontAwesome name="balance-scale" /> Quantity: {item.quantity} kg
            </Text>
            <Text style={styles.detail}>
              <FontAwesome name="money" /> Price: ${item.price}/kg
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <MaterialIcons name="delete" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      {editingProduct && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Product</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editingProduct.name}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={String(editingProduct.quantity)}
                onChangeText={(text) =>
                  setEditingProduct({
                    ...editingProduct,
                    quantity: parseInt(text),
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Price per kilo"
                keyboardType="numeric"
                value={String(editingProduct.price)}
                onChangeText={(text) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(text),
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Category"
                value={editingProduct.category}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, category: text })
                }
              />
              <TextInput
                
                style={styles.input}
                placeholder="Image URL"
                value={editingProduct.image}
                onChangeText={(text) =>
                  setEditingProduct({ ...editingProduct, image: text })
                }
              />
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
    </SafeAreaView>
  );
};

export default ProductListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
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
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#BBDEFB',
    padding: 6,
    borderRadius: 6,
  },
  sortText: {
    marginLeft: 4,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
  },
  category: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#757575',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
