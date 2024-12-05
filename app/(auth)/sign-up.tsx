import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons, images } from '@/constants'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import OAuth from '@/components/OAuth'
import { useSignUp } from '@clerk/clerk-expo'
import ReactNativeModal from 'react-native-modal'
import { fetchAPI } from '@/lib/fetch'

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: ""
    })
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {

            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setVerification({
                ...verification,
                state: 'pending'
            })
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].longMessage)
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            })

            if (completeSignUp.status === 'complete') {
                //TODO: create a database user
                await fetchAPI("/(api)/user", {
                    method: 'POST',
                    body: JSON.stringify({ name: form.name, email: form.email, clerkId: completeSignUp.createdUserId })
                })
                await setActive({ session: completeSignUp.createdSessionId })
                setVerification({ ...verification, state: 'success' })

                setTimeout(() => setShowSuccessModal(true), 1000); // Delay to ensure stability

                // router.replace('/')
            } else {
                setVerification({ ...verification, error: 'Verification failed', state: 'failed' })
            }
        } catch (err: any) {
            setVerification({ ...verification, error: err.errors[0].longMessage, state: 'failed' })
        }
    }

    return (
        <ScrollView>
            <View className='flex-1 bg-white'>
                <View className='relative w-full h-[250px]'>
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className='text-2xl font-black font-JakartaSemiBold absolute bottom-5 left-5'>Create Your Account</Text>
                </View>

                <View className='p-5'>
                    <InputField
                        label={"Name"}
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({ ...form, name: value })}
                    />

                    <InputField
                        label={"Email"}
                        autoCapitalize='none'
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

                    <CustomButton title='Sign up' onPress={onSignUpPress} className='mt-6' />

                    {/* OAuth here */}
                    <OAuth />

                    <Link href={'/(auth)/sign-in'} className='text-lg text-general-200 mt-10 text-center'>
                        <Text>Already have an account? </Text>
                        <Text className='text-primary-500'>Log In</Text>
                    </Link>
                </View>

                {/* Verification modal here */}
                <ReactNativeModal isVisible={verification.state === "pending"}>
                    <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>

                        <Text className='text-2xl font-JakartaExtraBold mb-2'>Verification</Text>
                        <Text className='mb-5 font-Jakarta text-center mt-2'>{`We've sent a verification code to ${form.email}`}</Text>
                        <InputField
                            value={verification.code}
                            icon={icons.lock}
                            keyboardType='numeric'
                            placeholder='12345'
                            label='code'
                            onChangeText={(code) => setVerification({ ...verification, code })}
                        />
                        {verification.error && <Text className='text-red-500 text-sm mt-1'>{verification.error}</Text>}

                        <CustomButton className='mt-5 bg-success-500' title='Verify email' onPress={onPressVerify} />
                    </View>
                </ReactNativeModal>
                {showSuccessModal && (
                    <ReactNativeModal
                        isVisible={true}
                        useNativeDriver={true} // Helps with performance
                    >
                        <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                            <Image source={images.check} className='h-[110px] w-[110px] mx-auto my-5' />
                            <Text className='text-3xl font-JakartaBold text-center'>Verified</Text>
                            <Text className='text-base text-gray-400 font-Jakarta text-center mt-2'>
                                You have successfully verified your account
                            </Text>
                            <CustomButton className='mt-5' title='Browse Home' onPress={() => router.replace('/(root)/(tabs)/home')} />
                        </View>
                    </ReactNativeModal>
                )}
            </View>
        </ScrollView>
    )
}

export default SignUp