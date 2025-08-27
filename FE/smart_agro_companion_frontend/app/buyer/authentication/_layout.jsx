import { Stack } from "expo-router";

const AuthLayout = () => {  
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: true, headerTitleAlign: "center" }}
        >
        </Stack>
    );
}

export default AuthLayout;