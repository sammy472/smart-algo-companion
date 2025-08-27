import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';


const AddProduct = () => {
  //State variables to hold product details
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [products, setProducts] = useState([]);

  //Camera and Image Picker permissions hooks
  /*
  const [status, requestPermission,getPermission] = ImagePicker.useCameraPermissions({
    request:false,
    get: false,
  });
  const [galleryStatus, requestGalleryPermission,getGalleryPermission] = ImagePicker.useMediaLibraryPermissions({
    request:false,
    get: false,
  });

  console.log('Camera Permission Status:', status);
  console.log('Gallery Permission Status:', galleryStatus);
  */

  const categories = ['Vegetables', 'Grains', 'Cereals', 'Fruits', 'Poultry', 'Meat'];

  const resetForm = () => {
    setName('');
    setQuantity('');
    setCategory('');
    setPrice('');
    setImage('');
  };

  //Picking an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access media is required!');
      return;
    }else{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images','livePhotos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  //Taking a photo using the camera
  //This function will request permission to use the camera and then launch the camera interface
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }else{
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images','livePhotos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  }

  const pickAvatar = async () => {
    Alert.alert(
      'Choose Avatar',
      'Select image source',
      [
        {
          text: 'Camera',
          onPress: takePhoto,
        },
        {
          text: 'Gallery',
          onPress: pickImage,
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleAddProduct = () => {
    if (!name || !quantity || !category || !price || !image) {
      Alert.alert('Missing Fields', 'Please complete all fields before submitting.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      quantity: parseFloat(quantity),
      category,
      price: parseFloat(price),
      image,
    };

    setProducts([newProduct, ...products]);
    Alert.alert('Success', 'Product added successfully.');
    resetForm();
  };

  const renderInputWithIcon = (iconName, placeholder, value, setValue, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Icon name={iconName} size={22} color="#1D1041" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        placeholderTextColor="#888"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        Add New Product
      </Text>
      {renderInputWithIcon('food-apple', 'Product Name', name, setName)}
      {renderInputWithIcon('weight-kilogram', 'Quantity (kg)', quantity, setQuantity, 'numeric')}
      {renderInputWithIcon('currency-usd', 'Price per kilo ($)', price, setPrice, 'numeric')}

      <Text style={[styles.label, { marginBottom: 6 }]}>
        Category
      </Text>
      <View style={[styles.pickerWrapper]}>
        <Icon name="format-list-bulleted" size={22} color="#1D1041" style={{ marginRight: 8 }} />
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : styles.pickerIOS}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.buttonCamera} onPress={pickAvatar}>
        <Icon name="image" size={24} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>
          Tap to choose or take a photo
        </Text>
      </TouchableOpacity>

      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Icon name="plus-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Product List</Text>
      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text>Quantity: {product.quantity}kg</Text>
            <Text>Category: {product.category}</Text>
            <Text>Price: ${product.price}/kg</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    flexGrow: 1,
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
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#EDEDED",

  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  pickerAndroid: {
    height: 50,
    width: '100%',
  },
  pickerIOS: {
    height: 200,
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1D1041',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonCamera: {
    flexDirection: 'row',
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    height:120
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
