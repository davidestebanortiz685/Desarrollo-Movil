import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/presentacion/screen/Home';
import Actores from './src/presentacion/screen/Actores';
import Directores from './src/presentacion/screen/Directores';
import Idiomas from './src/presentacion/screen/Idiomas';
import Plataformas from './src/presentacion/screen/Plataformas';
import Series from './src/presentacion/screen/Series';
// Importa tus nuevas pantallas
import Login from './src/presentacion/screen/Login';
import SignUp from './src/presentacion/screen/SignUp';
import Profile from './src/presentacion/screen/Profile';  // Pantalla de perfil de usuario
import InicioScreen from './src/presentacion/screen/Inicio';
import buscar_peli from './src/presentacion/screen/buscar_peli';
import HomeCliente from './src/presentacion/screen/HomeCliente';
import ActoresCliente from './src/presentacion/screen/ActoresCliente';
import DirectoresCliente from './src/presentacion/screen/DirectoresCliente';
import IdiomasCliente from './src/presentacion/screen/IdiomasCliente';
import PlataformaCliente from './src/presentacion/screen/PlataformaCliente';
import SeriesCliente from './src/presentacion/screen/SeriesCliente';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioScreen">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Actores" component={Actores} />
        <Stack.Screen name="Directores" component={Directores} />
        <Stack.Screen name="Idiomas" component={Idiomas} />
        <Stack.Screen name="Plataformas" component={Plataformas} />
        <Stack.Screen name="Series" component={Series} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="InicioScreen" component={InicioScreen} />
        <Stack.Screen name="Pelis De Una API" component={buscar_peli} />
        <Stack.Screen name="HomeCliente" component={HomeCliente} />

        <Stack.Screen name="ActoresCliente" component={ActoresCliente} />
        <Stack.Screen name="DirectoresCliente" component={DirectoresCliente} />
        <Stack.Screen name="IdiomasCliente" component={IdiomasCliente} />
        <Stack.Screen name="PlataformaCliente" component={PlataformaCliente} />
        <Stack.Screen name="SeriesCliente" component={SeriesCliente} />

      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
