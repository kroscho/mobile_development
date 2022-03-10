import React, { useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MyContext } from '../App';

var counter = 1;

function HomeScreen({ navigation }) {
    const startRegion = {
      latitude: 57.78825,
      longitude: 56.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  
    const addMarker = (e) => {
      const coords = e.nativeEvent.coordinate;
      let marker = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        images: [],
      }
      counter++;
      setMarkerCoords({...markerCoords, [counter]:marker})
    }
  
    const [markerCoords, setMarkerCoords] = useContext(MyContext)
  
    let markers = Object.values(markerCoords).map((marker, index) => (
        <Marker key={index} coordinate={marker} title='Marker' onPress={() => navigation.navigate('Details', { itemId:1, otherParam:2, marker:marker })} />
    ))
  
    return (
      <View style={styles.container}>
        <MapView 
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={startRegion}
          onPress={addMarker}
        >
         {markers}
        </MapView>
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
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });

export default HomeScreen;