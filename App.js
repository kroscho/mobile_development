import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import HomeScreen from './pages/Home';
import DetailsScreen from './pages/Details';
import * as SQLite from 'expo-sqlite';

export const MyContext = React.createContext()
const dbb = SQLite.openDatabase("testDb12.db");

const initialMarkerCoords = {
  0: {
    id: 1,
    name: "Marker1",
    latitude: 58.0072,
    longitude: 56.2346,
    images: [],
  },
}

const Stack = createNativeStackNavigator()

export default function App() {
  const [db, setDb] = useState(dbb)

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL)'
      );
      tx.executeSql(
          'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT)'
      );
      tx.executeSql(
          'CREATE TABLE IF NOT EXISTS markerImages (id INTEGER PRIMARY KEY AUTOINCREMENT, markerId INT, imageUri TEXT)'
      );
      for (var i in initialMarkerCoords) {
        tx.executeSql("select * from markers where name = ?", [initialMarkerCoords[i].name], (_, { rows }) =>  {
          if (rows.length === 0) {
            tx.executeSql(
              "INSERT INTO markers (name, latitude, longitude) values (?, ?, ?)", [initialMarkerCoords[i].name, initialMarkerCoords[i].latitude, initialMarkerCoords[i].longitude]
            );
          }
        });
      }
    })
    setDb(db)
  }, [])
  
  return (
    <MyContext.Provider value={[db, setDb]}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
  );
}