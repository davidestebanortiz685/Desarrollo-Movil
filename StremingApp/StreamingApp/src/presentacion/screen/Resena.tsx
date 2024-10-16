import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';  // Asegúrate de tener la ruta correcta

export default function Favoritas() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Obtener datos del usuario autenticado
  const fetchUsuario = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error obteniendo el usuario:', error);
    } else {
      setUsuario(user);
    }
  };

  return (
    <View style={styles.container}>
      {usuario && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userText}>Usuario: {usuario.email}</Text>
          <Text style={styles.userText}>Nombre: {usuario.name}</Text>
          <Text style={styles.userText}>Fecha de Registro: {usuario.fecha_registro}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4', // Fondo suave
  },
  userInfoContainer: {
    backgroundColor: '#ffffff', // Fondo blanco para el cuadro de información
    borderRadius: 10,
    padding: 20,
    elevation: 3, // Sombra
    width: '100%', // Ajuste al ancho del contenedor
    maxWidth: 400, // Ancho máximo
  },
  userText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333333', // Color de texto oscuro
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});
