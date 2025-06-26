import { Stack } from "expo-router";

const Layout = () => {  
    return (
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
    );
}

export default Layout;