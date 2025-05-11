import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import AdoptButton from '../components/PetDetails/AdoptButton';
import OwnerInfo from '../components/PetDetails/OwnerInfo';
import PetInfo from '../components/PetDetails/PetInfo';
import PetSubInfo from '../components/PetDetails/PetSubInfo';

export default function PetDetails() {
    const router = useRouter();
    const pet = useLocalSearchParams();




    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <ScrollView style={styles.scrollView}>
                {/* Pet Info */}
                <PetInfo pet={pet} />

                {/* Pet Sub Info*/}
                <PetSubInfo pet={pet} />

                {/* Owner details*/}
                <OwnerInfo pet={pet} />

                {/* Adopt me button*/}
                <AdoptButton />

            </ScrollView>

            {/* Custom back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
});