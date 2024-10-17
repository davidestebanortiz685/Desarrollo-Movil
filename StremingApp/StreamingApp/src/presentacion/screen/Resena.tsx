import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener Supabase correctamente configurado

export default function Resena() {
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSeries();
  }, []);

  // Obtener la lista de series
  const fetchSeries = async () => {
    const { data: seriesData, error } = await supabase.from('series').select('*');
    if (error) {
      console.error('Error obteniendo las series:', error);
    } else {
      setSeries(seriesData);
    }
  };

  // Enviar la reseña a la base de datos
  const enviarResena = async () => {
    try {
      // Obtener el usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage('Error obteniendo el usuario autenticado.');
        return;
      }

      // Obtener el ID del usuario en la tabla 'usuarios'
      const { data: usuarioData, error: userFetchError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('email', user.email)
        .single();

      if (userFetchError) {
        setErrorMessage('Error obteniendo el ID del usuario.');
        return;
      }

      const userId = usuarioData.id_usuario;

      // Validar la puntuación
      const puntuacionInt = parseInt(puntuacion, 10);
      if (isNaN(puntuacionInt) || puntuacionInt < 1 || puntuacionInt > 10) {
        setErrorMessage('La puntuación debe ser un número entre 1 y 10.');
        return;
      }

      // Insertar la reseña en la base de datos
      const { error: insertError } = await supabase
        .from('criticas')
        .insert({
          id_usuario: userId,
          id_serie: selectedSerie.id_serie,
          comentario,
          puntuacion: puntuacionInt,
        });

      if (insertError) {
        setErrorMessage('Error al guardar la reseña.');
      } else {
        setSuccessMessage('Reseña guardada con éxito.');
        setComentario('');
        setPuntuacion('');
      }
    } catch (error) {
      setErrorMessage('Error al enviar la reseña: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dejar una Reseña</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      {/* Lista de series */}
      <FlatList
        data={series}
        keyExtractor={(item) => item.id_serie.toString()}
        renderItem={({ item }) => (
          <Button
            title={item.titulo}
            onPress={() => setSelectedSerie(item)}
          />
        )}
      />

      {selectedSerie && (
        <View style={styles.form}>
          <Text style={styles.subtitle}>Escribe tu reseña para {selectedSerie.titulo}:</Text>
          <TextInput
            style={styles.input}
            placeholder="Comentario"
            value={comentario}
            onChangeText={setComentario}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Puntuación (1-10)"
            value={puntuacion}
            onChangeText={setPuntuacion}
            keyboardType="numeric"
          />
          <Button title="Enviar Reseña" onPress={enviarResena} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  form: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    marginBottom: 10,
  },
});
