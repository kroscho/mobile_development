import React, { useContext, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MyContext } from '../App';
import MarkerService from '../services/MarkerService';

var counter = 1;
const markerService = new MarkerService()

function HomeScreen({ navigation }) {
  const [db, setDb] = useContext(MyContext)
  const [markerCoords, setMarkerCoords] = useState({});
  const [clickAdd, setClickAdd] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let listMarkers = {}
    db.transaction(tx => {
        tx.executeSql("select * from markers", [], (_, { rows }) => {
            rows._array.forEach((elem, index) => {
                let marker = {
                latitude: elem.latitude,
                longitude: elem.longitude,
                name: elem.name,
                id: elem.id
                }
                listMarkers = {...listMarkers, [index]:marker}
            });
            setMarkerCoords(listMarkers)
            //console.log("EFFECTMarkers: ", markerCoords)
            setDb(db)
        });
    })
  }, [clickAdd])

  const startRegion = {
      latitude: 57.78825,
      longitude: 56.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  
    const addMarker = (e) => {
      const coords = e.nativeEvent.coordinate;
  
      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO markers (name, latitude, longitude) values (?, ?, ?)", ["mark" + coords.latitude + coords.longitude, coords.latitude, coords.longitude]
        );
        //tx.executeSql("select * from markers", [], (_, { rows }) =>
        //    console.log("markers: ", JSON.stringify(rows.length))
       // );
      }, null, setClickAdd(!clickAdd))
    }
  
    //const [markerCoords, setMarkerCoords] = useContext(MyContext)

    let markers = Object.values(markerCoords).map((marker, index) => (
        <Marker key={index} coordinate={marker} title={marker.name} onPress={() => navigation.navigate('Details', { itemId:1, otherParam:2, marker:marker })} />
    ))
  
    return (
      <View style={styles.container}>
        <MapView 
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={startRegion}
          onPress={addMarker}
        >
         { isLoading 
          ? markers
          : null
         }
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