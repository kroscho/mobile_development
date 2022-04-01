import React, { useContext, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MyContext } from '../App';
import * as Location from 'expo-location';
import {getDistance} from 'geolib';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications'

let notificationId = null;
let dismissed = true;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
  handleSuccess: (notId) => {
    notificationId = notId;
  }
})

var counter = 1;
const targetPoint = {"latitude": 58.0072, "longitude": 56.2346,}

function HomeScreen({ navigation }) {
    const startRegion = {
      latitude: 58.0100,
      longitude: 56.2266,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  
    const addMarker = (e) => {
      const coords = e.nativeEvent.coordinate;
      counter++;
      let marker = {
        id: counter,
        latitude: coords.latitude,
        longitude: coords.longitude,
        images: [],
      }
      setMarkerCoords({...markerCoords, [counter]:marker})
    }
  
    const [markerCoords, setMarkerCoords] = useContext(MyContext)
    const [notificationPermission, setNotificationPermission] = useState(PermissionStatus.UNDETERMINED);
  
    let markers = Object.values(markerCoords).map((marker, index) => (
        <Marker key={index} coordinate={marker} title={'Marker' + index} onPress={() => navigation.navigate('Details', { itemId:1, otherParam:2, marker:marker })} />
    ))

    const getClosestMarker = (curCoords) => {
      const closestMarker = Object.values(markerCoords).reduce(
        (closest, current) => {
          const coordsMarker = {"latitude": current.latitude, "longitude": current.longitude}
          const distance = getDistance(curCoords, coordsMarker);
          if (distance < closest.distance) {
            return { distance, marker: current };
          }
          return closest;
        },
        { distance: Infinity },
      );
      
      return closestMarker;
    }

    const scheduleNotification = (markerId) => {
      const schedulingOptions = {
        content: {
          title: 'Вы рядом',
          body: 'Вы находитесь рядом с маркером ' + markerId,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: "blue"
        },
        trigger: null,
      };
      Notifications.scheduleNotificationAsync(schedulingOptions);
    }

    const handleNotification = (notification) => {
      const {title} = notification.request.content;
    }

    const requestNotificationPermission = async () => {
      const {status} = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status);
      return status;
    }

    useEffect(() => {
      requestNotificationPermission();
    }, []);

    useEffect(() => {
      if (notificationPermission !== PermissionStatus.GRANTED) return;
      const listener = Notifications.addNotificationResponseReceivedListener(handleNotification);
      return () => listener.remove();
     }, [notificationPermission]);

    const [userLocation, setUserLocation] = useState(null)
    
    useEffect(() => {
      (async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        if (status == 'granted') {
          foregroundSubscrition = Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 10,
            },
            location => {
              setUserLocation(location)
              const { distance, marker } = getClosestMarker(location.coords);
              if (distance < 100) {
                console.log(markerCoords)
                console.log(distance, marker.id)
                if (dismissed) {
                  dismissed = false
                  scheduleNotification(marker.id)
                }
               } else {
                  if (!dismissed) {
                    Notifications.dismissNotificationAsync(notificationId)
                    dismissed = true
                  }
                }
            }
          )
        }
      })();
    },[]);

    return (
      <View style={styles.container}>
        <MapView 
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={startRegion}
          onPress={addMarker}
        >
          {userLocation && (<MapView.Marker pinColor={'green'} coordinate={userLocation.coords}/>)}
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