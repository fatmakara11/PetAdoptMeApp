import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';
import OwnerInfo from '../components/PetDetails/OwnerInfo';
import PetInfo from '../components/PetDetails/PetInfo';
import PetSubInfo from '../components/PetDetails/PetSubInfo';

export default function PetDetails() {
    const router = useRouter();
    const pet = useLocalSearchParams();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // İki kullanıcı arasında sohbet başlatmak için kullanıldı
    const InitiateChat = async () => {
        try {
            setLoading(true);
            console.log("Sohbet başlatılıyor...");
            console.log("Kullanıcı:", user?.primaryEmailAddress?.emailAddress);
            console.log("Pet sahibi:", pet?.email);

            // Email bilgilerini kontrol et
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("Sohbet başlatmak için giriş yapmalısınız");
                setLoading(false);
                return;
            }

            // Email yoksa, petOwnerEmail oluştur
            const petOwnerEmail = pet?.email ||
                (pet?.userName ? `${pet.userName.toLowerCase().replace(/\s+/g, '')}@petadopt.com` : 'pet@petadopt.com');

            console.log("Kullanılan pet sahibi email:", petOwnerEmail);

            // Benzersiz sohbet ID'si oluştur - iki mail adresini birleştirerek
            const chatId = user.primaryEmailAddress.emailAddress + '_' + petOwnerEmail;

            // Oluşturulacak users dizisi
            const userIds = [
                user.primaryEmailAddress.emailAddress,
                petOwnerEmail
            ];

            // Firebase'de mevcut sohbeti kontrol et
            const chatQuery = query(
                collection(db, 'Chat'),
                where('userIds', 'array-contains-any', userIds)
            );
            const querySnapshot = await getDocs(chatQuery);

            // Mevcut sohbet varsa, ona yönlendir
            if (!querySnapshot.empty) {
                console.log("Mevcut sohbet bulundu");
                querySnapshot.forEach((doc) => {
                    console.log("Chat ID:", doc.id);
                    router.push({
                        pathname: '/chat',
                        params: { id: doc.id }
                    });
                });
                setLoading(false);
                return;
            }

            // Yeni sohbet oluştur            
            console.log("Yeni sohbet oluşturuluyor...");

            await setDoc(doc(db, 'Chat', chatId), {
                id: chatId,
                // Firebase görseline uygun userIds dizisi
                userIds: userIds,
                // Firebase görseline uygun users nesnesi
                users: [
                    {
                        email: user.primaryEmailAddress.emailAddress,
                        imageUrl: user?.imageUrl || '',
                        name: user?.fullName || 'Kullanıcı',
                        role: 'adopter'
                    },
                    {
                        email: petOwnerEmail,
                        imageUrl: pet?.userImage || '',
                        name: pet?.userName || `${pet?.name || 'Pet'} Sahibi`,
                        petId: pet?.id || '',
                        petName: pet?.name || '',
                        role: 'owner'
                    }
                ],
                userIds: [user?.primaryEmailAddress?.emailAddress, petOwnerEmail],
                petDetails: {
                    id: pet?.id || '',
                    name: pet?.name || '',
                    image: pet?.image || '',
                    breed: pet?.breed || ''
                },
                createdAt: new Date(),
                lastMessage: null,
                lastMessageTime: new Date()
            });

            // Yeni sohbete yönlendir
            console.log("Sohbet sayfasına yönlendiriliyor");
            router.push({
                pathname: '/chat',
                params: { id: chatId }
            });
        } catch (error) {
            console.error("Sohbet başlatma hatası:", error);
            alert("Sohbet başlatılırken bir hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

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

                {/* Owner details */}
                <OwnerInfo pet={pet} />

                {/* Extra space at bottom for scrolling past the fixed button */}
                <View style={{ height: 100 }}></View>
            </ScrollView>

            {/* Custom back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            {/* Adopt me button - fixed at bottom */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={InitiateChat}
                    disabled={loading}
                    style={styles.adoptButton}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.adoptButtonText}>Adopt Me</Text>
                    )}
                </TouchableOpacity>
            </View>
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
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.PRIMARY,
    },
    adoptButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    adoptButtonText: {
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.WHITE,
    }
});






