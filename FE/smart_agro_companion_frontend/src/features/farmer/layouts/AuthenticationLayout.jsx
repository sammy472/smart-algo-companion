import { Stack } from "expo-router";

const AuthenticationLayout = () => {  
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
        >
        </Stack>
    );
}

export default AuthenticationLayout;