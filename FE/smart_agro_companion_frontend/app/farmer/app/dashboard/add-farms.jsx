import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddFarm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddFarm = () => {
    if (!name || !location || !description) {
      Alert.alert('Incomplete', 'Please fill all fields.');
      return;
    }

    setSubmitting(true);

    // Simulated API call
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Success', 'Farm added successfully!');
      setName('');
      setLocation('');
      setDescription('');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add a New Farm</Text>
          <Text style={styles.subtitle}>Fill in details of the farm you want to add.</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farm Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Green Valley Farms"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farm Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Marrakech"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Farm Description / Products</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Fresh vegetables and organic fruits"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddFarm}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>  Adding Farm...</Text>
            </>
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.buttonText}>  Add Farm</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFarm;
