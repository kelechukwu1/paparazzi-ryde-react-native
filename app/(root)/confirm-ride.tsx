import { View, FlatList } from 'react-native'
import React from 'react'
import RideLayout from '@/components/layouts/RideLayout'
import DriverCard from '@/components/DriverCard'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'
import { useDriverStore } from '@/store'

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore()
    const handleSelectedDriver = () => {
        if (!selectedDriver) return
        router.push('/(root)/book-ride')
    }
    return (
        <RideLayout title='Choose Driver' snapPoints={["65%", "85%"]}>
            <FlatList
                data={drivers}
                renderItem={({ item }) => <DriverCard selected={selectedDriver!} setSelected={() => setSelectedDriver(Number(item.id!))} item={item} />}
                ListFooterComponent={() => (
                    <View className='mx-5 mt-10'>
                        <CustomButton title='Select Ride' onPress={handleSelectedDriver} />
                    </View>
                )}
                nestedScrollEnabled={true}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </RideLayout>
    )
}

export default ConfirmRide