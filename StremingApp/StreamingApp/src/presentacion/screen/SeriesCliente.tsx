import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import SeriesList from './SeriesList';
import Favoritas from './Favoritas';  
import Resena from './Resena';  

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

export default function SeriesCliente() {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.navContainer}>
          <View style={styles.button}>
            <Button title="Ver Series" onPress={() => setSelectedSection('list')} />
          </View>
          <View style={styles.button}>
            <Button title="Series Favoritas" onPress={() => setSelectedSection('favoritas')} />
          </View>
          <View style={styles.button}>
            <Button title="Reseña" onPress={() => setSelectedSection('resena')} />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {selectedSection === null && (
            <Text style={styles.promptText}>Selecciona una opción para continuar</Text>
          )}
          {selectedSection === 'list' && <SeriesList />}
          {selectedSection === 'favoritas' && <Favoritas />}
          {selectedSection === 'resena' && <Resena />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04, // Ajusta el padding según el ancho de la pantalla
    backgroundColor: '#f5f5f5', // Fondo suave para mejorar la legibilidad
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Centra el contenido cuando hay menos secciones
  },
  navContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: height * 0.03, // Espacio entre los botones y el contenido
  },
  button: {
    marginVertical: height * 0.01, // Espacio vertical entre botones
  },
  contentContainer: {
    flex: 1,
    paddingTop: height * 0.02, // Espacio superior para el contenido
  },
  promptText: {
    textAlign: 'center',
    fontSize: width * 0.045, // Ajusta el tamaño del texto según el ancho de la pantalla
    color: 'gray',
  },
});
