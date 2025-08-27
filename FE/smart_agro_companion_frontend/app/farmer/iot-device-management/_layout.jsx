import { Stack } from "expo-router";

const Layout = () => {  
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                    headerShown:true,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title:'Device Profile Home',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title:'Device Profile',
                }}
            />
            <Stack.Screen
                name="add-device"
                options={{
                    title:'Add New Device',
                }}
            />
            <Stack.Screen
                name="control-device"
                options={{
                    title:'Device Controller',
                }}
            />
        </Stack>
    );
}
export default Layout;