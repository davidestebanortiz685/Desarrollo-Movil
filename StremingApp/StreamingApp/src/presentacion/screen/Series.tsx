import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import SeriesCrud from './SeriesCrud';
import SeriesList from './SeriesList';
import Favoritas from './Favoritas';  
import Resena from './Resena';  

export default function Series() {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <Button title="CRUD de Series" onPress={() => setSelectedSection('crud')} />
        <Button title="Ver Series" onPress={() => setSelectedSection('list')} />
        <Button title="Series Favoritas" onPress={() => setSelectedSection('favoritas')} />
        <Button title="Reseña" onPress={() => setSelectedSection('resena')} />
      </View>

      <View style={styles.contentContainer}>
        {selectedSection === null && (
          <Text style={styles.promptText}>Selecciona una opción para continuar</Text>
        )}
        {selectedSection === 'crud' && <SeriesCrud />}
        {selectedSection === 'list' && <SeriesList />}
        {selectedSection === 'favoritas' && <Favoritas />}  
        {selectedSection === 'resena' && <Resena />}        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  promptText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
});
