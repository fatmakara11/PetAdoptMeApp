import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function PetDetails() {
    const router = useRouter();
    const pet = useLocalSearchParams();

    // Fallback data if pet data is incomplete
    const defaultPet = {
        name: 'Pet Name',
        breed: 'Unknown Breed',
        age: '1',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        address: 'Unknown Location',
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Pet Image */}
            <Image
                source={{ uri: pet?.imageUrl || defaultPet.imageUrl }}
                style={styles.petImage}
            />

            {/* Custom back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            {/* Pet details */}
            <ScrollView style={styles.detailsContainer}>
                <View style={styles.header}>
                    <Text style={styles.name}>{pet?.name || defaultPet.name}</Text>
                    <Text style={styles.breed}>{pet?.breed || defaultPet.breed}, {pet?.age || defaultPet.age} Years</Text>
                    <Text style={styles.address}>{pet?.address || defaultPet.address}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    petImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
        marginTop: -20,
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        marginTop: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        color: Colors.BLACK,
        marginBottom: 5,
    },
    breed: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        color: Colors.GRAY,
        marginBottom: 5,
    },
    address: {
        fontSize: 14,
        fontFamily: 'outfit',
        color: Colors.GRAY,
    },
});