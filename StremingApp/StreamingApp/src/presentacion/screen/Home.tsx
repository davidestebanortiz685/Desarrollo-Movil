import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Actores"
          color="#f194ff"
          onPress={() => navigation.navigate('Actores')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Directores"
          color="#4CAF50"
          onPress={() => navigation.navigate('Directores')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Plataformas"
          color="#2196F3"
          onPress={() => navigation.navigate('Plataformas')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Idiomas"
          color="#FF5722"
          onPress={() => navigation.navigate('Idiomas')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Series"
          color="#FD1515"
          onPress={() => navigation.navigate('Series')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});
