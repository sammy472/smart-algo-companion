import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchTextInput = ({ placeholder, onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
        if (onSearch) {
            onSearch(text);
        }
    };

    return (
        <View style={styles.container}>
            <Ionicons name="ios-search" size={20} color="gray" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder || 'Search...'}
                value={searchText}
                onChangeText={handleSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

