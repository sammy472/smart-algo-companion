// File: buyer/app/authentication/signup.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  Entypo,
  Feather,
} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    city: '',
    telephone: '',
    status: 'buyer',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [avatar, setAvatar] = useState(null);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const pickAvatar = async () => {
    Alert.alert(
      'Choose Avatar',
      'Select image source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permission required', 'Camera access is needed to take a photo.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
              aspect: [1, 1],
            });

            if (!result.canceled) {
              setAvatar(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permission required', 'Access to media library is needed.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              quality: 1,
              aspect: [1, 1],
            });

            if (!result.canceled) {
              setAvatar(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const renderField = (label, icon, fieldKey, placeholder, secure = false, keyboard = 'default') => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secure}
          keyboardType={keyboard}
          onChangeText={text => handleChange(fieldKey, text)}
        />
      </View>
    </>
  );

  return (
    <>
      <StatusBar style="light"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.card}>
          {renderField('First Name', <FontAwesome5 name="user" size={18} color="gray" />, 'firstName', 'Samuel')}
          {renderField('Family Name', <FontAwesome5 name="user-tie" size={18} color="gray" />, 'lastName', 'Boateng')}
          {renderField('Email Address', <Ionicons name="mail-outline" size={20} color="gray" />, 'email', 'you@example.com', false, 'email-address')}
          {renderField('Confirm Email', <Ionicons name="mail" size={20} color="gray" />, 'confirmEmail', 'you@example.com', false, 'email-address')}
          {renderField('City / Location', <Entypo name="location-pin" size={20} color="gray" />, 'city', 'Marrakech')}
          {renderField('Telephone', <Feather name="phone" size={18} color="gray" />, 'telephone', '+212...', false, 'phone-pad')}

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <MaterialIcons name="person-pin" size={20} color="gray" />
            <Picker
              selectedValue={form.status}
              onValueChange={value => handleChange('status', value)}
              style={styles.picker}
            >
              <Picker.Item label="Buyer" value="buyer" />
              <Picker.Item label="Farmer" value="farmer" />
            </Picker>
          </View>

          {renderField('Gender', <Ionicons name="transgender-outline" size={20} color="gray" />, 'gender', 'Male / Female / Other')}
          
          <Text style={styles.label}>Avatar</Text>
          <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Text style={{ color: 'black',fontWeight:'bold' }}>Tap to choose or take a photo</Text>
            )}
          </TouchableOpacity>

          {renderField('Password', <Ionicons name="lock-closed-outline" size={20} color="gray" />, 'password', '••••••••', true)}
          {renderField('Confirm Password', <Ionicons name="lock-closed" size={20} color="gray" />, 'confirmPassword', '••••••••', true)}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  avatarPicker: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor:'wheat',
    color:'white',
    fontWeight:'bold'
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
