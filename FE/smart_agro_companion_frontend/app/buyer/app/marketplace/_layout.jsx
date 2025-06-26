import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Layout = () => {  
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#1D1041",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShown: true,
                }
            }
            />
        </>
    );
}

export default Layout;