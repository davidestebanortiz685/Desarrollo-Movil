import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener la ruta correcta

export default function Favoritas() {
  const [usuarioInfo, setUsuarioInfo] = useState(null); // Guardamos la información del usuario
  const [reseñas, setReseñas] = useState([]); // Guardamos las reseñas del usuario
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Obtener el correo del usuario autenticado y su información
  const fetchUsuario = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error obteniendo el usuario:', authError);
      setLoading(false);
      return;
    }

    // Obtener la información del usuario por correo
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', user.email)
      .single();

    if (usuarioError) {
      console.error('Error obteniendo información del usuario:', usuarioError);
      setLoading(false);
      return;
    }

    setUsuarioInfo(usuarioData);
    fetchReseñas(usuarioData.id_usuario); // Llamar a fetchReseñas con el ID del usuario
    setLoading(false);
  };

  // Obtener las reseñas del usuario
  const fetchReseñas = async (idUsuario) => {
    const { data: reseñasData, error: reseñasError } = await supabase
      .from('criticas')
      .select('comentario, puntuacion, fecha, series(titulo)') // Incluimos la relación con la tabla series
      .eq('id_usuario', idUsuario);

    if (reseñasError) {
      console.error('Error obteniendo las reseñas:', reseñasError);
    } else {
      setReseñas(reseñasData);
    }
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

          <Text style={styles.subTitle}>Reseñas del Usuario</Text>
          {reseñas.length > 0 ? (
            <FlatList
              data={reseñas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.reseñaContainer}>
                  <Text style={styles.reseñaTitle}>Serie: {item.series.titulo}</Text>
                  <Text style={styles.reseñaText}>Comentario: {item.comentario}</Text>
                  <Text style={styles.reseñaText}>Puntuación: {item.puntuacion}</Text>
                  <Text style={styles.reseñaText}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noReseñas}>El usuario no ha dejado ninguna reseña.</Text>
          )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
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
  reseñaContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  reseñaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reseñaText: {
    fontSize: 16,
    marginVertical: 2,
  },
  noReseñas: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
