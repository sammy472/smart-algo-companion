import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/src/hooks/useApp';
import api from '@/src/services/api';
import { uploadImageToSupabase, generateImagePath } from '@/src/services/supabase';

const AICropDetectionScreen = () => {
  const { user } = useApp();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Media library access is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleImageSelection = () => {
    Alert.alert('Select Image', 'Choose image source', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDetect = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Please login to use this feature');
      return;
    }

    setLoading(true);
    try {
      // Upload image to Supabase Storage first
      const imagePath = generateImagePath('crop-detections', `farmer-${user.id}`, 'jpg');
      const imageUrl = await uploadImageToSupabase(image, 'crop-detections', imagePath);

      // Send to backend for AI detection
      const response = await api.detectCropDisease(user.id, imageUrl);
      setResult(response.detection);
      Alert.alert('Detection Complete', response.recommendation);
    } catch (error) {
      console.error('Crop detection error:', error);
      Alert.alert('Error', error.message || 'Failed to detect crop disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Crop Detection</Text>
        <Text style={styles.subtitle}>Detect crop diseases and get recommendations</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Crop Image</Text>
          
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handleImageSelection}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageSelection}>
              <MaterialIcons name="add-photo-alternate" size={48} color="#392867" />
              <Text style={styles.uploadButtonText}>Select Image</Text>
              <Text style={styles.uploadHint}>Take a photo or choose from gallery</Text>
            </TouchableOpacity>
          )}

          {image && (
            <TouchableOpacity
              style={[styles.detectButton, loading && styles.detectButtonDisabled]}
              onPress={handleDetect}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.detectButtonText}>Detect Disease</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Detection Result</Text>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons
                  name={result.classification === 'healthy' ? 'checkmark-circle' : 'warning'}
                  size={32}
                  color={result.classification === 'healthy' ? '#4CAF50' : '#F44336'}
                />
                <Text style={styles.classificationText}>
                  {result.classification === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </Text>
              </View>

              {result.infectionType && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Infection Type:</Text>
                  <Text style={styles.infoValue}>{result.infectionType}</Text>
                </View>
              )}

              {result.confidence && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Confidence:</Text>
                  <Text style={styles.infoValue}>
                    {(parseFloat(result.confidence) * 100).toFixed(1)}%
                  </Text>
                </View>
              )}

              {result.pesticideRecommendation && (
                <View style={styles.recommendationBox}>
                  <Text style={styles.recommendationTitle}>Recommendation:</Text>
                  <Text style={styles.recommendationText}>
                    {result.pesticideRecommendation}
                  </Text>
                </View>
              )}

              <Text style={styles.dateText}>
                Detected on: {new Date(result.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips for Best Results</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Take clear, well-lit photos of crop leaves</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Focus on affected areas showing symptoms</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Ensure the leaf fills most of the frame</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Avoid shadows and blurry images</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#392867',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  uploadSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#392867',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#392867',
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  imageContainer: {
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#392867',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  changeImageText: {
    color: '#fff',
    fontWeight: '600',
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  detectButtonDisabled: {
    opacity: 0.6,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  classificationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  recommendationBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'right',
  },
  tipsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
});

export default AICropDetectionScreen;

