import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { db } from '../../config/FirabaseConfig'
import Colors from '../../constants/Colors'
import UserItem from '../components/inbox/UserItem'

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        if (user) {
            GetUserList();
        }
    }, [user]);

    useEffect(() => {
        if (userList.length > 0) {
            const filtered = FilterUserList();
            console.log("Filtered users:", filtered);
            setFilteredList(filtered);
        }
    }, [userList]);

    //kullanıcı listesinin alınması mevcut kullanıcı e-postalarına bağlıdır
    const GetUserList = async () => {
        setLoading(true);
        setUserList([]);
        const q = query(collection(db, 'Chat'),
            where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);
        console.log("Query result count:", querySnapshot.size);
        querySnapshot.forEach((doc) => {
            console.log("Chat document:", doc.id, doc.data());
            setUserList(prev => [...prev, {
                id: doc.id,
                ...doc.data()
            }]);
        });
        setLoading(false);
    }

    //diğer kullanıcıların listesini filtrele
    const FilterUserList = () => {
        const list = [];
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

        userList.forEach((record) => {
            console.log("Processing record:", record.id, record.users);
            const otherUser = record.users?.filter((u) => u.email !== currentUserEmail);
            console.log("Other users found:", otherUser);
            if (otherUser && otherUser.length > 0) {
                const result = {
                    docId: record.id,
                    ...otherUser[0]
                }
                console.log("Adding user to list:", result);
                list.push(result);
            }
        });
        return list; // Return the filtered list
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Clean header design */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.sectionTitle}>Sohbetler</Text>
                    {filteredList.length > 0 && (
                        <View style={styles.countContainer}>
                            <Text style={styles.countText}>{filteredList.length}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Sohbetler yükleniyor...</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.listContainer}
                    data={filteredList}
                    refreshing={loading}
                    onRefresh={GetUserList}
                    keyExtractor={(item) => item.docId || Math.random().toString()}
                    renderItem={({ item }) => {
                        console.log("Rendering item:", item);
                        return <UserItem userInfo={item} />;
                    }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="chatbubble-ellipses-outline" size={60} color="#fff" />
                            </View>
                            <Text style={styles.emptyTitle}>Henüz sohbetiniz yok</Text>
                            <Text style={styles.emptyMessage}>
                                Pet sahipleriyle iletişime geçerek bir sohbet başlatabilirsiniz
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={filteredList.length === 0 ? { flex: 1, justifyContent: 'center' } : null}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    countContainer: {
        backgroundColor: Colors.PRIMARY,
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    countText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    }
});