import { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const SystemSettings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>System Settings</Text>
            <View style={styles.settingRow}>
                <Text>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
            <View style={styles.settingRow}>
                <Text>Enable Notifications</Text>
                <Switch value={notifications} onValueChange={setNotifications} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
});

export default SystemSettings;
