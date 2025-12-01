import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/hooks/useApp';
import api from '@/src/services/api';
import { uploadMultipleImagesToSupabase, generateImagePath } from '@/src/services/supabase';

const AddProductScreen = () => {
  const { user } = useApp();
  const router = useRouter();
  
  //State variables to hold product details
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [productLocation, setProductLocation] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState('pick up at secured joint');
  const [status, setStatus] = useState('in stock');
  const [images, setImages] = useState([]); // Array for up to 3 images
  const [loading, setLoading] = useState(false);

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

  const resetForm = () => {
    setName('');
    setQuantity('');
    setPrice('');
    setProductLocation('');
    setDeliveryOptions('pick up at secured joint');
    setStatus('in stock');
    setImages([]);
  };

  //Picking images from the gallery (up to 3)
  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 images');
      return;
    }
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access media is required!');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    
    if (!result.canceled) {
      const newImages = result.assets.slice(0, 3 - images.length).map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  //Taking a photo using the camera
  const takePhoto = async () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 images');
      return;
    }
    
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

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

  const handleAddProduct = async () => {
    if (!name || !quantity || !price || !productLocation) {
      Alert.alert('Missing Fields', 'Please complete all required fields.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Missing Image', 'Please add at least one product image.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Please login to add products');
      return;
    }

    setLoading(true);
    try {
      // Upload images to Supabase Storage first
      const imageUrls = await uploadMultipleImagesToSupabase(
        images,
        'products',
        'products',
        `product-${user.id}`
      );

      // Create product with Supabase image URLs
      await api.createProduct({
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        productLocation,
        deliveryOptions,
        status,
        avatar: imageUrls, // Array of Supabase image URLs
        farmerId: user.id,
      });

      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Add product error:', error);
      Alert.alert('Error', error.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        Add New Product
      </Text>
      {renderInputWithIcon('food-apple', 'Product Name', name, setName)}
      {renderInputWithIcon('weight-kilogram', 'Quantity (kg)', quantity, setQuantity, 'numeric')}
      {renderInputWithIcon('currency-usd', 'Price per kilo (GHS)', price, setPrice, 'numeric')}
      {renderInputWithIcon('map-marker', 'Product Location', productLocation, setProductLocation)}

      <Text style={[styles.label, { marginBottom: 6 }]}>Delivery Type</Text>
      <View style={[styles.pickerWrapper]}>
        <Icon name="truck-delivery" size={22} color="#1D1041" style={{ marginRight: 8 }} />
        <Picker
          selectedValue={deliveryOptions}
          onValueChange={(value) => setDeliveryOptions(value)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : styles.pickerIOS}
        >
          <Picker.Item label="Pick up at secured joint" value="pick up at secured joint" />
          <Picker.Item label="Dispatch delivery" value="dispatch delivery" />
        </Picker>
      </View>

      <Text style={[styles.label, { marginBottom: 6 }]}>Status</Text>
      <View style={[styles.pickerWrapper]}>
        <Icon name="check-circle" size={22} color="#1D1041" style={{ marginRight: 8 }} />
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
          style={Platform.OS === 'android' ? styles.pickerAndroid : styles.pickerIOS}
        >
          <Picker.Item label="In Stock" value="in stock" />
          <Picker.Item label="Out of Stock" value="out of stock" />
        </Picker>
      </View>

      <Text style={[styles.label, { marginBottom: 6 }]}>Product Images (Max 3)</Text>
      <TouchableOpacity style={styles.buttonCamera} onPress={pickAvatar}>
        <Icon name="image" size={24} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>
          {images.length > 0 ? `Add More (${images.length}/3)` : 'Tap to choose or take photos'}
        </Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAddProduct}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Icon name="plus-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Add Product</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;

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
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: '30%',
    aspectRatio: 1,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
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
