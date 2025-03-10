import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
    calculateDriverTimes,
    calculateRegion,
    generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const goMapsProApiKey = process.env.EXPO_PUBLIC_GOMAPS_PRO_API_KEY;

const Map = () => {
    const {
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();

    const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;

            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLatitude,
                userLongitude,
            });

            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude]);

    useEffect(() => {
        if (
            markers.length > 0 &&
            destinationLatitude !== undefined &&
            destinationLongitude !== undefined
        ) {
            calculateDriverTimes({
                markers,
                userLatitude,
                userLongitude,
                destinationLatitude,
                destinationLongitude,
            }).then((drivers) => {
                setDrivers(drivers as MarkerData[]);
            });
        }
    }, [markers, destinationLatitude, destinationLongitude]);

    const region = calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    });

    if (loading || (!userLatitude && !userLongitude))
        return (
            <View className="flex justify-center items-center w-full h-full">
                <ActivityIndicator size="small" color="#000" />
            </View>
        );

    if (error)
        return (
            <View className="flex justify-between items-center w-full">
                <Text>Error: {error}</Text>
            </View>
        );

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            initialRegion={region}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapType="standard"
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle="light"
        >
            <View className="w-full h-full">
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.title}
                        image={
                            selectedDriver === +marker.id ? icons.selectedMarker : icons.marker
                        }
                    />
                ))}

                {destinationLatitude && destinationLongitude && (
                    <>
                        <Marker
                            key="destination"
                            coordinate={{
                                latitude: destinationLatitude,
                                longitude: destinationLongitude,
                            }}
                            title="Destination"
                            image={icons.pin}
                        />
                        <MapViewDirections
                            origin={{
                                latitude: userLatitude!,
                                longitude: userLongitude!,
                            }}
                            destination={{
                                latitude: destinationLatitude,
                                longitude: destinationLongitude,
                            }}
                            apikey={goMapsProApiKey!}
                            strokeColor="#0286FF"
                            strokeWidth={2}
                        />
                    </>
                )}
            </View>
        </MapView>
    );
};

export default Map;