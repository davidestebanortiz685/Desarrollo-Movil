import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { supabase } from '../../../lib/supabse'; 

export default function HomeScreen({ navigation }) {
  // Función para cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error cerrando sesión:', error);
    } else {
      navigation.navigate('Login'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ActoresCliente')}>
          <Text style={styles.buttonText}>Actores</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DirectoresCliente')}>
          <Text style={styles.buttonText}>Directores</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PlataformaCliente')}>
          <Text style={styles.buttonText}>Plataformas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('IdiomasCliente')}>
          <Text style={styles.buttonText}>Idiomas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SeriesCliente')}>
          <Text style={styles.buttonText}>Series</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pelis De Una API')}>
          <Text style={styles.buttonText}>Pelis de la Api</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FF5722',
    borderRadius: 50,
    padding: 10,
  },
});
