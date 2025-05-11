import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function PetInfo({ pet }) {
    return (
        <View>
            <Image
                source={{ uri: pet?.imageUrl || 'https://placehold.co/400x300/png' }}
                style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover'
                }}
            />
            <View style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View>
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 24
                    }}>{pet?.name || 'Pet Name'}</Text>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 16,
                        color: Colors.GRAY
                    }}>{pet?.address || 'No location'}</Text>
                </View>
                <Ionicons name="heart-outline" size={30} color="black" />
            </View>
        </View>
    )
}
