import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Verifica que la ruta sea correcta

export default function Reseña({ serieId }) {
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState('');
  const [message, setMessage] = useState('');

  const registrarResena = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        setMessage('Debes estar autenticado para dejar una reseña.');
        return;
      }

      const { error } = await supabase
        .from('criticas')
        .insert([
          {
            id_usuario: user.id,
            id_serie: serieId,
            comentario: comentario,
            puntuacion: parseInt(puntuacion),
          },
        ]);

      if (error) throw error;

      setComentario('');
      setPuntuacion('');
      setMessage('Reseña registrada correctamente.');
    } catch (error) {
      setMessage('Error al registrar la reseña: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={comentario}
        onChangeText={setComentario}
      />
      <TextInput
        style={styles.input}
        placeholder="Puntuación (1-10)"
        value={puntuacion}
        keyboardType="numeric"
        onChangeText={setPuntuacion}
      />
      <Button title="Registrar Reseña" onPress={registrarResena} />
      {message && <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
