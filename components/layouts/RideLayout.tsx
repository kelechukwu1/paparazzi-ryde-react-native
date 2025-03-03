import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useRef } from 'react'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { router } from 'expo-router'
import { icons } from '@/constants'
import Map from '../Map'
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

const RideLayout = ({ title, children, snapPoints }: { title?: string, children: React.ReactNode, snapPoints?: string[] }) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    return (
        <GestureHandlerRootView>
            <View className='bg-white flex-1'>
                <View className='flex flex-col h-screen bg-blue-500'>
                    <View className='flex flex-row absolute z-10 top-16 items-center px-5 justify-center'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className='size-10 bg-white rounded-full items-center justify-center'>
                                <Image source={icons.backArrow} resizeMode='contain' className='size-6' />
                            </View>
                        </TouchableOpacity>
                        <Text className='text-xl font-JakartaSemiBold ml-5'>
                            {title || "Go back"}
                        </Text>
                    </View>
                    <Map />
                </View>
                <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints || ["40%", "50%"]} index={0}>
                    <BottomSheetView style={{ flex: 1, padding: 20 }}>
                        {children}
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}

export default RideLayout