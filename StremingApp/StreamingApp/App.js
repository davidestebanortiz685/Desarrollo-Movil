import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Actores from './src/presentacion/screen/Actores';
import Directores from './src/presentacion/screen/Directores';
import Idiomas from './src/presentacion/screen/Idiomas';
import Plataformas from './src/presentacion/screen/Plataformas';
import Series from './src/presentacion/screen/Series';
import Home from './src/presentacion/screen/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Actores" component={Actores} />
        <Stack.Screen name="Directores" component={Directores} />
        <Stack.Screen name="Idiomas" component={Idiomas} />
        <Stack.Screen name="Plataformas" component={Plataformas} />
        <Stack.Screen name="Series" component={Series} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}