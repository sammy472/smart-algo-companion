import { Stack } from "expo-router";

const LearningHubLayout = () => {  
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
                headerShown: false,
            }
            
        }
            
        />
    );
}

export default LearningHubLayout;