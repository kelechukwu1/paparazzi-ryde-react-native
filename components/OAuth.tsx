import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

const OAuth = () => {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleGoogleSignIn = async () => {
        const result = await googleOAuth(startOAuthFlow);

        if (result.code === "session_exists" || result.code === "success") {
            router.replace("/(root)/(tabs)/home");
        }

        Alert.alert(result.success ? "Success" : "Error", result.message);
    };

    return (
        <View>
            <View className='flex flex-row items-center justify-center mt-4 gap-x-3'>
                <View className='flex-1 h-[1px] bg-general-100' />
                <Text className='text-lg'>Or</Text>
                <View className='flex-1 h-[1px] bg-general-100' />
            </View>

            <CustomButton
                className='mt-5 w-full shadow-none'
                title='Log in with Google'
                bgVariant='outline'
                textVariant='primary'
                IconLeft={() => (
                    <Image source={icons.google}
                        className='w-5 h-5 mx-2'
                        resizeMode='contain'
                    />
                )}
                onPress={handleGoogleSignIn}
            />
        </View>
    )
}

export default OAuth