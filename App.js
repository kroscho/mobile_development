import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import HomeScreen from './pages/Home';
import DetailsScreen from './pages/Details';
import * as SQLite from 'expo-sqlite';

export const MyContext = React.createContext()
const dbb = SQLite.openDatabase("testDb6.db");

const initialMarkerCoords = {
  0: {
    name: "mark1",
    latitude: 57.74725,
    longitude: 56.4354,
    images: [],
  }
}

const Stack = createNativeStackNavigator()

export default function App() {
  const [state, setState] = useState(initialMarkerCoords);
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
          'CREATE TABLE IF NOT EXISTS markerImages (id INTEGER PRIMARY KEY AUTOINCREMENT, markerId INT, imageId INT)'
      );
      for (var i in initialMarkerCoords) {
        console.log("name: ", initialMarkerCoords[i].name, initialMarkerCoords[i].latitude, initialMarkerCoords[i].longitude)
        tx.executeSql("select * from markers where name = ?", [initialMarkerCoords[i].name], (_, { rows }) =>  {
          console.log("rows: ", rows.length, initialMarkerCoords[i].name )
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