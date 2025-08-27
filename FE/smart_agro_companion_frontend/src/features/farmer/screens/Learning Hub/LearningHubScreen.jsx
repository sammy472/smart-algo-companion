import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";

const sampleVideos = [
    { 
        id: 1, 
        title: "Introduction to Precision Agriculture", 
        topic: "Precision Agriculture", 
        uri: require('@/src/features/farmer/assets/ai_agents.mp4') 
    },
    { 
        id: 2, 
        title: "AI in Crop Disease Detection", 
        topic: "AI in Agriculture", 
        uri: "https://www.example.com/video2.mp4" 
    },
    { 
        id: 3, 
        title: "IoT-Based Smart Irrigation", 
        topic: "IoT in Agriculture", 
        uri: "https://www.example.com/video3.mp4" 
    },
    { 
        id: 4, 
        title: "Drones in Agriculture", 
        topic: "AI in Agriculture", 
        uri: "https://www.example.com/video4.mp4" 
    },
    { 
        id: 5, 
        title: "Soil Health Monitoring", 
        topic: "Precision Agriculture", 
        uri: "https://www.example.com/video5.mp4" 
    },
    { 
        id: 6, 
        title: "Smart Greenhouses", 
        topic: "IoT in Agriculture", 
        uri: "https://www.example.com/video6.mp4" 
    },
    { 
        id: 7, 
        title: "Supply Chain & Agri-Tech", 
        topic: "AI in Agriculture", 
        uri: "https://www.example.com/video7.mp4" 
    },
];

const topics = ["All", "Precision Agriculture", "AI in Agriculture", "IoT in Agriculture"];

const VideoCard = ({ video }) => {
    const player = useVideoPlayer(video.uri);
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    return (
        <View style={styles.videoCard}>
            <VideoView
                player={player}
                style={styles.video}
                nativeControls = {true}
                resizeMode="cover"
                isLooping ={false}
                isMuted={false}

            />
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoTopic}>
                <Ionicons name="pricetag-outline" size={16} color="#4CAF50" /> {video.topic}
            </Text>
        </View>
    );
};

/*
videos should be fetched from a remote source or local storage
but for this example, we are using a static array.
useEffect can be used to fetch videos from an API or local storage.
useEffect(() => {
    // Fetch videos from an API or local storage
    // setSampleVideos(fetchedVideos);
}, []);
*/

const LearningHubScreen = () => {
    const [selectedTopic, setSelectedTopic] = useState("All");

    const filteredVideos =
        selectedTopic === "All"
            ? sampleVideos
            : sampleVideos.filter((video) => video.topic === selectedTopic);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Smart Algo Companion</Text>
                <Text style={styles.subtitle}>Explore AI & IoT Solutions in Agriculture</Text>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedTopic}
                        onValueChange={(itemValue) => setSelectedTopic(itemValue)}
                        style={styles.picker}
                    >
                        {topics.map((topic, index) => (
                            <Picker.Item key={index} label={topic} value={topic} />
                        ))}
                    </Picker>
                </View>

                <FlatList
                    data={filteredVideos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VideoCard video={item} />}
                    ListEmptyComponent={
                        <Text style={styles.noVideos}>No videos available for this topic.</Text>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: "#EDEDED",
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
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 15,
        padding: 5,
        backgroundColor: "#F9F9F9",
    },
    picker: {
        height: 50,
        color: "#333",
    },
    videoCard: {
        backgroundColor: "#F1F8E9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    video: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginTop: 8,
    },
    videoTopic: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
    },
    noVideos: {
        textAlign: "center",
        fontSize: 16,
        color: "#888",
        marginTop: 20,
    },
});

export default LearningHubScreen;
