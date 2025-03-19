import { Stack } from "expo-router";

const Layout = () => {  
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
        >
        </Stack>
    );
}

export default Layout;