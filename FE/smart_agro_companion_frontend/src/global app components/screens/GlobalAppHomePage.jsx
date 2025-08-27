import React, { useState } from "react";
import { 
  View, 
  Pressable, 
  StyleSheet, 
  Text, 
  Appearance 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";

const GlobalAppHome = () => { 
  const colorScheme = Appearance.getColorScheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState("buyer");
  const insets = useSafeAreaInsets();

  const onPress = (role) => {
    setSelected(role);
    navigation.navigate(`${role}`);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Text style={styles.title}>Select Your Role</Text>
      <View style={styles.buttonWrapper}>

        <Pressable 
          onPress={() => onPress("farmer")} 
          style={({ pressed }) => [
            styles.card,
            selected === "farmer" && styles.selected,
            pressed && { opacity: 0.8 }
          ]}
        >
          <LinearGradient
            colors={selected === "farmer" ? ["#FFA726", "#FB8C00"] : ["#FFF", "#FFF"]}
            style={styles.gradient}
          >
            <MaterialCommunityIcons 
              name="tractor" 
              size={48} 
              color={selected === "farmer" ? "#fff" : "#FFA726"} 
            />
            <Text style={[styles.cardText, selected === "farmer" && { color: "#fff" }]}>Farmer</Text>
          </LinearGradient>
        </Pressable>

        <Pressable 
          onPress={() => onPress("buyer")} 
          style={({ pressed }) => [
            styles.card,
            selected === "buyer" && styles.selected,
            pressed && { opacity: 0.8 }
          ]}
        >
          <LinearGradient
            colors={selected === "buyer" ? ["#42A5F5", "#1E88E5"] : ["#FFF", "#FFF"]}
            style={styles.gradient}
          >
            <MaterialCommunityIcons 
              name="shopping" 
              size={48} 
              color={selected === "buyer" ? "#fff" : "#42A5F5"} 
            />
            <Text style={[styles.cardText, selected === "buyer" && { color: "#fff" }]}>Buyer</Text>
          </LinearGradient>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f8",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    color: "#333",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    borderRadius: 20,
  },
  cardText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  selected: {
    transform: [{ scale: 1.05 }],
  },
});

export default GlobalAppHome;
