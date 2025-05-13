import { useUser } from '@clerk/clerk-react';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Shared from '../../Shared/Shared';

export default function MarkFav({ pet }) {
    const { user } = useUser();
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFav();
        }
    }, [user]);

    const GetFav = async () => {
        const result = await Shared.GetFavList(user);
        setFavList(result?.favorites || []);
    };

    const AddToFav = async () => {
        if (!favList.includes(pet.id)) {
            const updatedFavs = [...favList, pet.id];
            await Shared.UpdateFav(user, updatedFavs);
            GetFav();
        }
    };

    return (
        <View>
            {favList.includes(pet.id) ? (
                <Pressable>
                    <Ionicons name="heart" size={30} color="red" />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav}>
                    <Ionicons name="heart-outline" size={30} color="black" />
                </Pressable>
            )}
        </View>
    );
}
