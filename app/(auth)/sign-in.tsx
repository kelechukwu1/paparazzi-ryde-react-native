import { View, Text, ScrollView, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, useRouter } from 'expo-router'
import OAuth from '@/components/OAuth'
import { useSignIn } from '@clerk/clerk-expo'

const SignIn = () => {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/(root)/(tabs)/home')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, form.email, form.password])
    return (
        <ScrollView>
            <View className='flex-1 bg-white'>
                <View className='relative w-full h-[250px]'>
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className='text-2xl font-black font-JakartaSemiBold absolute bottom-5 left-5'>Welcome 👋</Text>
                </View>

                <View className='p-5'>
                    <InputField
                        autoCapitalize='none'
                        label={"Email"}
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({ ...form, email: value })}
                    />

                    <InputField
                        label={"Password"}
                        placeholder="Enter your password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />

                    <CustomButton title='Sign In' onPress={onSignInPress} className='mt-6' />

                    {/* OAuth here */}
                    <OAuth />

                    <Link href={'/(auth)/sign-up'} className='text-lg text-general-200 mt-10 text-center'>
                        <Text>Don't have an account? </Text>
                        <Text className='text-primary-500'>Sign Up</Text>
                    </Link>
                </View>
                {/* Verification modal here */}
            </View>
        </ScrollView>
    )
}

export default SignIn