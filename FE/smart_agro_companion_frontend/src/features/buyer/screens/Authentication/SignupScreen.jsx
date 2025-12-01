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
  ActivityIndicator,
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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import api from '@/src/services/api';
import { uploadImageToSupabase, generateImagePath } from '@/src/services/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    city: '',
    telephone: '',
    address: '',
    country: 'Ghana',
    status: 'buyer',
    password: '',
    confirmPassword: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const pickAvatar = async () => {
    Alert.alert('Choose Avatar', 'Select image source', [
      {
        text: 'Camera',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) return Alert.alert('Permission required', 'Camera access is needed.');
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1, aspect: [1, 1] });
          if (!result.canceled) setAvatar(result.assets[0].uri);
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) return Alert.alert('Permission required', 'Media library access is needed.');
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1, aspect: [1, 1] });
          if (!result.canceled) setAvatar(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSignup = async () => {
    // Validation
    if (!form.firstName || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.email !== form.confirmEmail) {
      Alert.alert('Error', 'Emails do not match');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Upload avatar to Supabase if provided
      let avatarUrl = null;
      if (avatar) {
        const avatarPath = generateImagePath('avatars', `buyer-${form.email}`, 'jpg');
        avatarUrl = await uploadImageToSupabase(avatar, 'avatars', avatarPath);
      }

      const signupData = {
        name: form.firstName,
        email: form.email,
        password: form.password,
        phone: form.telephone,
        address: form.address,
        location: form.city,
        city: form.city,
        country: form.country,
        role: form.status,
        avatar: avatarUrl,
      };

      const response = await api.signup(signupData);
      
      if (response.redirectToLogin) {
        Alert.alert(
          'Success',
          `${form.status.charAt(0).toUpperCase() + form.status.slice(1)} registered successfully! Please login.`,
          [
            {
              text: 'OK',
              onPress: () => router.push('/buyer/authentication/login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, icon, key, placeholder, secure = false, keyboard = 'default') => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secure}
          keyboardType={keyboard}
          onChangeText={text => handleChange(key, text)}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView>
      <StatusBar style="light"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.card}>
          {renderField('Full Name', <FontAwesome5 name="user" size={18} color="#666" />, 'firstName', 'John Doe')}
          {renderField('Email Address', <Ionicons name="mail-outline" size={20} color="#666" />, 'email', 'you@example.com', false, 'email-address')}
          {renderField('Confirm Email', <Ionicons name="mail" size={20} color="#666" />, 'confirmEmail', 'you@example.com', false, 'email-address')}
          {renderField('Address', <Entypo name="location-pin" size={20} color="#666" />, 'address', 'Street Address')}
          {renderField('City', <Entypo name="location-pin" size={20} color="#666" />, 'city', 'City')}
          {renderField('Country', <Entypo name="location-pin" size={20} color="#666" />, 'country', 'Country')}
          {renderField('Telephone', <Feather name="phone" size={18} color="#666" />, 'telephone', '+233...', false, 'phone-pad')}

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <MaterialIcons name="person-pin" size={20} color="#666" />
            <Picker
              selectedValue={form.status}
              onValueChange={value => handleChange('status', value)}
              style={styles.picker}
            >
              <Picker.Item label="Buyer" value="buyer" />
              <Picker.Item label="Farmer" value="farmer" />
            </Picker>
          </View>

          <Text style={styles.label}>Avatar (Optional)</Text>
          <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar}>
            {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> :
              <Text style={{ color: '#333', fontWeight: 'bold' }}>Tap to choose or take a photo</Text>}
          </TouchableOpacity>

          {renderField('Password', <Ionicons name="lock-closed-outline" size={20} color="#666" />, 'password', '••••••••', true)}
          {renderField('Confirm Password', <Ionicons name="lock-closed" size={20} color="#666" />, 'confirmPassword', '••••••••', true)}

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleSignup}
            disabled={loading}
          >
            <LinearGradient
              colors={['#2E7D32', '#60AD5E']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F6F8FA',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  avatarPicker: {
    height: 120,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#E0F2F1',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  registerButton: {
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
