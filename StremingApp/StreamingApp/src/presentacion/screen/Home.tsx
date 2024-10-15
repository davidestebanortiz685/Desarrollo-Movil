import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importamos los íconos
import { supabase } from '../../../lib/supabse'; // Asegúrate de que la ruta sea correcta

export default function HomeScreen({ navigation }) {
  // Función para cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error cerrando sesión:', error);
    } else {
      navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Home</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Actores')}>
          <Text style={styles.buttonText}>Actores</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Directores')}>
          <Text style={styles.buttonText}>Directores</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Plataformas')}>
          <Text style={styles.buttonText}>Plataformas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Idiomas')}>
          <Text style={styles.buttonText}>Idiomas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Series')}>
          <Text style={styles.buttonText}>Series</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Perfil con ícono en la esquina superior derecha */}
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Botón de Cerrar sesión con ícono en la esquina superior izquierda */}
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
