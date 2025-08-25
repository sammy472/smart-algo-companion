import React,{
    useState,
    useCallback
} from "react";
import { 
    View,
    Pressable,
    Platform,
    StyleSheet,
    Text,
    Appearance 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView,useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { useApp } from "./context/app-context";


const App = () => { 
    const colorScheme = Appearance.getColorScheme();
    const navigation = useNavigation();
    const [selected, setSelected] = useState('buyer');
    const insets = useSafeAreaInsets();
    const onPress = (name) => {
        setSelected(name);
        navigation.navigate(name);
    };


    return (
        <>
            <Stack screenOptions={{headerShown: false}}/>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <View style={[styles.container,{paddingBottom:insets.bottom}]}>
                <View style={styles.wrapper}>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, selected === "farmer" && styles.selected]}
                            onPress={() => onPress("farmer/app")}
                        >
                            <MaterialIcons name="agriculture" size={24} color="#1D1041" />
                            <Text style={styles.text}>Farmer</Text>
                        </Pressable>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, selected === "buyer" && styles.selected]}
                            onPress={() => onPress("buyer/app")}
                        >
                            <MaterialIcons name="sell" size={24} color="#1D1041" />
                            <Text style={styles.text}>Buyer</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#392867",
        padding: 10,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        height: "40%",
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 'auto',
        marginHorizontal: 'auto',
        width: "100%",
        height: "100%",
    },
    selected: {
        backgroundColor: "#F1E2E2",
    },
    text: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "80%",
        height: "40%",
        opacity: 0.8,
        backdropFilter: "blur(10px)",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(240, 233, 233, 0.5)",
        backgroundColor: "#1D1041",
    },
});