import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function SeriesActions() {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [puntuaciones, setPuntuaciones] = useState({});

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    const { data, error } = await supabase.from('series').select('*');
    if (error) {
      console.error('Error fetching series:', error);
    } else {
      setSeries(data);
    }
  };

  const toggleFavorito = async (serieId) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error obteniendo el usuario:', authError);
      alert("Necesitas iniciar sesión");
      return;
    }

    // Obtener ID del usuario desde la tabla usuarios
    const { data: usuarioData, error: userFetchError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('email', user.email)
      .single(); // Cambiamos a single() para obtener un único registro

    if (userFetchError || !usuarioData) {
      console.error('Error obteniendo el ID del usuario:', userFetchError);
      alert("Hubo un error al obtener el ID del usuario. Asegúrate de que estás registrado.");
      return;
    }

    const userId = usuarioData.id_usuario; // Aquí tienes el ID como entero

    const isFavorito = selectedSeries.includes(serieId);

    let toggleError;
    if (isFavorito) {
      ({ error: toggleError } = await supabase.from('favoritos').delete().eq('user_id', userId).eq('serie_id', serieId));
      setSelectedSeries(selectedSeries.filter(id => id !== serieId));
    } else {
      ({ error: toggleError } = await supabase.from('favoritos').insert({ user_id: userId, serie_id: serieId }));  // Asegúrate que user.id sea UUID
      setSelectedSeries([...selectedSeries, serieId]);
    }

    if (toggleError) {
      console.error('Error actualizando favoritos:', toggleError);
      alert('Hubo un error al actualizar tus favoritos.');
    } else {
      alert('Favoritos actualizados correctamente.');
    }
  };

  const submitCritica = async (serieId) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error obteniendo el usuario:', authError);
      alert("Necesitas iniciar sesión");
      return;
    }

    // Obtener ID del usuario desde la tabla usuarios
    const { data: usuarioData, error: userFetchError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('email', user.email)
      .single();

    if (userFetchError || !usuarioData) {
      console.error('Error obteniendo el ID del usuario:', userFetchError);
      alert("Hubo un error al obtener el ID del usuario. Asegúrate de que estás registrado.");
      return;
    }

    const userId = usuarioData.id_usuario; // Aquí tienes el ID como entero

    const comentario = comentarios[serieId] || '';
    const puntuacion = puntuaciones[serieId] || '';

    if (!comentario || !puntuacion || puntuacion < 1 || puntuacion > 10) {
      alert("Por favor completa comentario y puntuación válida (1-10)");
      return;
    }

    const { error: insertError } = await supabase.from('criticas').insert({
      id_usuario: userId, // Usamos el ID del usuario obtenido
      id_serie: serieId,
      comentario,
      puntuacion: parseInt(puntuacion),
    });

    if (insertError) {
      console.error('Error insertando crítica:', insertError);
      alert(`Error al enviar crítica: ${insertError.message}`);
    } else {
      alert('Crítica enviada exitosamente');
      // Limpia los campos después de enviar
      setComentarios({ ...comentarios, [serieId]: '' });
      setPuntuaciones({ ...puntuaciones, [serieId]: '' });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={series}
        keyExtractor={(item) => item.id_serie.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.titulo}</Text>
            <Button
              title={selectedSeries.includes(item.id_serie) ? "Quitar de Favoritos" : "Agregar a Favoritos"}
              onPress={() => toggleFavorito(item.id_serie)}
            />
            <TextInput
              placeholder="Comentario"
              value={comentarios[item.id_serie] || ''}
              onChangeText={(text) => setComentarios({ ...comentarios, [item.id_serie]: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Puntuación (1-10)"
              value={puntuaciones[item.id_serie] || ''}
              onChangeText={(text) => setPuntuaciones({ ...puntuaciones, [item.id_serie]: text })}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Enviar Reseña" onPress={() => submitCritica(item.id_serie)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  item: { marginBottom: 10, padding: 10, backgroundColor: '#f9f9f9' },
  input: { marginVertical: 10, borderColor: 'gray', borderWidth: 1, padding: 8 },
});
