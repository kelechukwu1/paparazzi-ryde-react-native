import { View, Image } from 'react-native'
import React from 'react'
import { GoogleInputProps } from '@/types/type'
import { icons } from '@/constants'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

const googlePlacesApikey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

const GoogleTextInput = ({ icon, initialLocation, containerStyle, textInputBackgroundColor, handlePress }: GoogleInputProps) => {
    return (
        <View className={`flex flex-row gap-3 items-center justify-center relative z-50 rounded-full ${containerStyle} mb-5`}>
            <GooglePlacesAutocomplete
                fetchDetails={true}
                debounce={200}
                placeholder='Where do you want to go?'
                styles={{
                    textInputContainer: {
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        marginHorizontal: 20,
                        position: 'relative',
                        shadowColor: '#d4d4d4'
                    },
                    textInput: {
                        backgroundColor: textInputBackgroundColor || 'white',
                        fontSize: 16,
                        fontWeight: 600,
                        marginTop: 5,
                        width: '100%',
                        borderRadius: 200,
                    },
                    listView: {
                        backgroundColor: textInputBackgroundColor || 'white',
                        position: 'relative',
                        top: 0,
                        width: '100%',
                        borderRadius: 10,
                        shadowColor: '#d4d4d4',
                        zIndex: 99
                    }
                }}
                onPress={(data, details = null) => {
                    handlePress({
                        latitude: details?.geometry?.location.lat as number,
                        longitude: details?.geometry?.location.lng as number,
                        address: data?.description
                    })
                }}
                query={{
                    key: googlePlacesApikey,
                    language: 'en'
                }}
                renderLeftButton={() => (
                    <View className='justify-center items-center w-6 h-6'>
                        <Image source={icon ? icon : icons.search} className='w-6 h-6' resizeMode='contain' />
                    </View>
                )}
                textInputProps={{
                    placeholder: initialLocation ?? 'Where do you want to go?',
                    placeholderTextColor: 'gray'
                }}
            />
        </View>
    )
}

export default GoogleTextInput