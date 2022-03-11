import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MyContext } from '../App';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

function DetailsScreen({ route, navigation }) {
    const { marker } = route.params;

    const [db, setDb] = useContext(MyContext)
    const [markerCur, setMarkerCur] = useState(marker)
    const [markerCurImages, setMarkerCurImages] = useState([])
    const [clickAdd, setClickAdd] = useState(true)

    useEffect(() => {
        db.transaction(tx => {
            let listImages = []
            tx.executeSql("select * from markerImages where markerId = ?", [markerCur.id], (_, { rows }) => {          
                rows._array.forEach(elem => {
                    listImages = [...listImages, elem.imageUri]
                });
                setMarkerCurImages(listImages)
            })
        })
        setDb(db)
    }, [clickAdd])

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (pickerResult.cancelled === true) {
            return;
        }

        db.transaction(tx => {      
            tx.executeSql(
              "INSERT INTO markerImages (markerId, imageUri) values (?, ?)", [markerCur.id, pickerResult.uri]
            );
        }, null, setClickAdd(!clickAdd))
    };

    let images = markerCurImages.map((image, index) => (
        <Image
            key={index}
            source={{ uri: image }}
            style={styles.thumbnail}
        />
    ))

    const styleScrollView = markerCurImages.length !== 0 ? styles.scrollView : styles.scrollViewNone;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
                <Text style={styles.buttonText}>Pick a photo</Text>
            </TouchableOpacity>
            <ScrollView>
                <LinearGradient
                    colors={['#020024', '#93f6e6', '#6ebbc4' ]}
                    style={styleScrollView}
                    >                
                    {markerCurImages.length !== 0
                        ? images
                        : null
                    }
                </LinearGradient>
            </ScrollView>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
                    <Text style={styles.buttonText}>Go to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                    <Text style={styles.buttonText}>Go back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: { 
        flexDirection: 'row',
    },
    logo: {
        width: 305,
        height: 159,
        marginBottom: 20,
    },
    instructions: {
        color: '#888',
        fontSize: 18,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    thumbnail: {
        width: 250,
        height: 250,
        marginVertical: 10,
        borderWidth: 2,
        borderRadius: 120,
        borderColor: "#e1ec52",
    },
    scrollView: {
        backgroundColor: '#f7f2d2',
        paddingHorizontal: 30,
        paddingVertical: 0,
        borderRadius: 20,
    },
    scrollViewNone: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 0,
    },
});

export default DetailsScreen;