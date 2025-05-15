import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from '@firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';

export default function AddNewPet() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [gender, setGender] = useState();
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState();



    const handleInputChange = (fieldName, FieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: FieldValue
        }));
    };

    useEffect(() => {
        GetCategories();
    }, []);

    // categorylist için database kullanıldı
    const GetCategories = async () => {
        try {
            setCategoryList([]);
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = [];
            snapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    const onSubmit = () => {
        console.log(formData);
    }
    //resim galerisini kullanmak için 
    const imagePicker = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Pet</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 18 }}>
                    Add New Pet For Adoption
                </Text>

                <Pressable onPress={imagePicker}>
                    {!image ? <Image
                        source={require('../../assets/images/placeholder.png')}
                        style={{
                            width: 110,
                            height: 110,
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: Colors.GRAY,
                            marginTop: 20
                        }}
                    /> :
                        <Image source={{ uri: image }}
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 15

                            }} />}
                </Pressable>



                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('name', value)} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Category *</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setSelectedCategory(itemValue);
                            handleInputChange('category', itemValue)
                        }}
                    >
                        {categoryList.map((category, index) => (
                            <Picker.Item key={index} label={category.name} value={category.name} />
                        ))}


                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('breed', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('age', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender *</Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setGender(itemValue);
                            handleInputChange('sex', itemValue)
                        }}
                    >
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('weight', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input}
                        onChangeText={(value) => handleInputChange('address', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput style={[styles.input, { height: 100 }]}
                        numberOfLines={5}
                        multiline={true}
                        onChangeText={(value) => handleInputChange('about', value)} />
                </View>

                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 30
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'outfit-medium',
        marginLeft: 10,
    },
    inputContainer: {
        marginVertical: 5
    },
    input: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit'
    },
    label: {
        marginVertical: 5,
        fontFamily: 'outfit'
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 7,
        marginVertical: 10,
        marginBottom: 50
    }
});
