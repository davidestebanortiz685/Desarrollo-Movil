import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error obteniendo el usuario:', userError);
      setError("Hubo un error al obtener el usuario.");
      return;
    }

    if (user) {
      console.log('User ID:', user.id); // Verifica el ID del usuario

      const { data, error: userDataError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', user.id) // Asegúrate que el ID sea correcto
        .single(); // Obtener solo un usuario

      if (userDataError) {
        console.error('Error obteniendo datos del usuario:', userDataError);
        setError("Hubo un error al obtener los datos del usuario.");
      } else if (!data) {
        console.error("No se encontró el usuario en la base de datos."); // Log adicional
        setError("No se encontró el usuario.");
      } else {
        setUsuario(data);
      }
    } else {
      setError("Usuario no autenticado.");
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      {usuario ? (
        <>
          <Text>Nombre: {usuario.nombre}</Text>
          <Text>Email: {usuario.email}</Text>
          {/* Muestra otros datos del usuario aquí */}
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  error: { color: 'red' },
});
