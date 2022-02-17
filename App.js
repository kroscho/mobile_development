import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import HomeScreen from './pages/Home';
import DetailsScreen from './pages/Details';

export const MyContext = React.createContext()
const initialMarkerCoords = {
  0: {
    latitude: 57.74725,
    longitude: 56.4354,
    images: [],
  },
  1: {
    latitude: 57.76725,
    longitude: 56.4354,
    images: [],
  },
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