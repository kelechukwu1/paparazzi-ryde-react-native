import { View, Text, Image } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { icons } from '@/constants'

const OAuth = () => {
    const handleGoogleSignin = async () => {
        console.log('login with google')
    }
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
                onPress={handleGoogleSignin}
            />
        </View>
    )
}

export default OAuth