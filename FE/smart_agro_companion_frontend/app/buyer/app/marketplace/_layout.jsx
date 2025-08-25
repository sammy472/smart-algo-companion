import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Layout = () => {  
    return (
        <>
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#1D1041",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    headerShown: false,
                }
            }
            />
        </>
    );
}

export default Layout;