// File: buyer/app/authentication/login.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    Alert.alert('Login Attempted', `Email: ${userInfo.email}\nPassword: ${userInfo.password}`);
  };

  const handleGoogleLogin = () => Alert.alert('Google Login', 'Google login triggered');
  const handleFacebookLogin = () => Alert.alert('Facebook Login', 'Facebook login triggered');
  const handleInstagramLogin = () => Alert.alert('Instagram Login', 'Instagram login triggered');
  const handleTiktokLogin = () => Alert.alert('TikTok Login', 'TikTok login triggered');

  return (
    <>
      <StatusBar style='light'/>
      <ScrollView
        contentContainerStyle={style.keyboardView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={style.header}>
          <Text style={style.headerTitle}>Welcome Back</Text>
          <Text style={style.headerSubText}>Login to continue</Text>
        </View>

        {/* Login Form */}
        <View style={style.detailsContainer}>
          <Text>Email</Text>
          <View style={style.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="gray" />
            <TextInput
              placeholder="you@example.com"
              style={style.textInput}
              keyboardType="email-address"
              onChange={e => handleUserInfoChange('email', e.nativeEvent.text)}
            />
          </View>

          <Text>Password</Text>
          <View style={style.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="gray" />
            <TextInput
              placeholder="••••••••"
              style={style.textInput}
              secureTextEntry
              onChange={e => handleUserInfoChange('password', e.nativeEvent.text)}
            />
          </View>

          <TouchableOpacity style={style.button} onPress={handleLogin}>
            <Text style={style.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Options */}
        <Text style={style.orText}>OR</Text>
        <View style={style.socialButtonsContainer}>
          <TouchableOpacity style={[style.socialButton, { backgroundColor: '#db4437' }]} onPress={handleGoogleLogin}>
            <AntDesign name="google" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[style.socialButton, { backgroundColor: '#1877f2' }]} onPress={handleFacebookLogin}>
            <FontAwesome name="facebook" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[style.socialButton, { backgroundColor: '#C13584' }]} onPress={handleInstagramLogin}>
            <Entypo name="instagram" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[style.socialButton, { backgroundColor: '#000' }]} onPress={handleTiktokLogin}>
            <Entypo name="video-camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3366cc',
  },
  headerSubText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#3366cc',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#999',
  },
  socialButtonsContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    padding: 12,
    height:80,
    width:80
  },
  socialButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
