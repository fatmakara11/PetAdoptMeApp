import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../../../constants/Colors'

export default function OwnerInfo({ pet }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.ownerContainer}>
                <Image
                    source={{ uri: pet?.user?.imageUrl || pet?.userImage || 'https://placehold.co/60x60/png' }}
                    style={styles.ownerImage}
                />

                <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>{pet?.user?.name || pet?.username || 'Pet Owner'}</Text>
                    <Text style={styles.ownerLabel}>Pet Owner</Text>
                </View>

                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={24} color={Colors.GRAY} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 15,
    },
    ownerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        gap: 20,
        borderColor: '#eee',
        justifyContent: 'space-between'
    },
    ownerImage: {
        width: 50,
        height: 50,
        borderRadius: 99
    },
    ownerInfo: {
        flex: 1,
    },
    ownerName: {
        fontFamily: 'outfit-medium',
        fontSize: 18
    },
    ownerLabel: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY
    },
    arrowContainer: {
        padding: 5
    }
});