import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener la ruta correcta

export default function Favoritas() {
  const [usuarioInfo, setUsuarioInfo] = useState(null); // Guardamos la información del usuario
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Obtener el correo del usuario autenticado y su información
  const fetchUsuario = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser ();
  
    if (authError || !user) {
      console.error('Error obteniendo el usuario:', authError);
      setLoading(false);
      return;
    }
  
    // Obtener la información del usuario por correo
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios') // Asegúrate de que esta tabla existe y tiene la información que necesitas
      .select('*') // O selecciona los campos específicos que necesitas
      .eq('email', user.email) // Cambia 'email' por el nombre correcto de la columna
      .single(); // Esperamos un solo resultado

    if (usuarioError) {
      console.error('Error obteniendo información del usuario:', usuarioError);
    } else {
      setUsuarioInfo(usuarioData);
    }
    
    setLoading(false); // Cambiamos el estado de carga
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : usuarioInfo ? (
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Información del Usuario</Text>
          <View>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.info}>{usuarioInfo.nombre}</Text>
          </View>
          <View>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.info}>{usuarioInfo.email}</Text>
          </View>
          <View>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.info}>{usuarioInfo.fecha_registro}</Text>
          </View>
          <View>
            <Text style={styles.label}>Contraseña:</Text>
            <Text style={styles.info}>{usuarioInfo.contraseña}</Text> {/* Asegúrate de que esto sea seguro */}
          </View>
        </View>
      ) : (
        <Text style={styles.error}>No se pudo cargar la información del usuario.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});