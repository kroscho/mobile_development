import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Button, Text, View, Dimensions } from 'react-native';

var counter = 1;
const MyContext = React.createContext()
const initialMarkerCoords = {
  0: {
    latitude: 57.74725,
    longitude: 56.4354,
  },
  1: {
    latitude: 57.76725,
    longitude: 56.4354,
  },
}

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
      longitude: coords.longitude
    }
    counter++;
    setMarkerCoords({...markerCoords, [counter]:marker})
  }

  const markerPress = (e) => {
    navigation.navigate('Details', { itemId:1, otherParam:2 })
  }

  const [markerCoords, setMarkerCoords] = useContext(MyContext)

  let markers = Object.values(markerCoords).map((marker, index) => (
    <Marker key={index} coordinate={marker} title='Marker' onPress={markerPress} />
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


function DetailsScreen({ route, navigation }) {
  const { itemId, otherParam } = route.params;
  const [markerCoords, setMarkerCoords] = useContext(MyContext);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator()

export default function App() {
  const [state, setState] = useState(initialMarkerCoords);
  return (
    <MyContext.Provider value={[state, setState]}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
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