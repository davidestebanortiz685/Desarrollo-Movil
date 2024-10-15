import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Picker, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function SeriesCrud() {
  const [titulo, setTitulo] = useState('');
  const [año, setAño] = useState('');
  const [actorId, setActorId] = useState(null);
  const [idiomaId, setIdiomaId] = useState(null);
  const [directorId, setDirectorId] = useState(null);
  const [plataformaId, setPlataformaId] = useState(null);
  const [generoId, setGeneroId] = useState(null);
  const [editando, setEditando] = useState(false);
  const [serieSeleccionada, setSerieSeleccionada] = useState(null);
  const [actores, setActores] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetchData();
    fetchSeries();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: actorData }, { data: idiomaData }, { data: directorData }, { data: plataformaData }, { data: generoData }] = await Promise.all([
        supabase.from('actores').select('*'),
        supabase.from('idiomas').select('*'),
        supabase.from('directores').select('*'),
        supabase.from('plataformas').select('*'),
        supabase.from('generos').select('*')
      ]);

      setActores(actorData || []);
      setIdiomas(idiomaData || []);
      setDirectores(directorData || []);
      setPlataformas(plataformaData || []);
      setGeneros(generoData || []);
    } catch (error) {
      console.error('Error en fetchData:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los datos.');
    }
  };

  const fetchSeries = async () => {
    try {
      const { data, error } = await supabase.from('series').select('*, serie_genero(id_genero)');
      if (error) throw error;
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
      Alert.alert('Error', 'Hubo un problema al obtener las series.');
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !año || !actorId || !idiomaId || !directorId || !plataformaId || !generoId) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    try {
      if (editando) {
        // Editar serie
        const { error: updateError } = await supabase
          .from('series')
          .update({
            titulo,
            año,
            actor_id: actorId,
            idioma_id: idiomaId,
            director_id: directorId,
            plataforma_id: plataformaId,
          })
          .eq('id_serie', serieSeleccionada.id_serie);

        if (updateError) throw updateError;

        // Actualizar serie_genero
        const { error: generoError } = await supabase
          .from('serie_genero')
          .upsert({
            id_serie: serieSeleccionada.id_serie,
            id_genero: generoId,
          });

        if (generoError) throw generoError;

        Alert.alert('Éxito', 'La serie se ha actualizado correctamente.');
      } else {
        // Crear nueva serie
        const { data: newSeries, error: seriesError } = await supabase
          .from('series')
          .insert({
            titulo,
            año,
            actor_id: actorId,
            idioma_id: idiomaId,
            director_id: directorId,
            plataforma_id: plataformaId,
          })
          .select();

        if (seriesError) throw seriesError;

        const { error: generoError } = await supabase
          .from('serie_genero')
          .insert({
            id_serie: newSeries[0].id_serie,
            id_genero: generoId,
          });

        if (generoError) throw generoError;

        Alert.alert('Éxito', 'La serie se ha creado correctamente.');
      }

      // Reiniciar los campos y refrescar la lista
      limpiarFormulario();
      fetchSeries();
    } catch (error) {
      console.error('Error al crear/actualizar serie:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la serie.');
    }
  };

  const handleEditar = (serie) => {
    setEditando(true);
    setSerieSeleccionada(serie);
    setTitulo(serie.titulo);
    setAño(serie.año);
    setActorId(serie.actor_id);
    setIdiomaId(serie.idioma_id);
    setDirectorId(serie.director_id);
    setPlataformaId(serie.plataforma_id);
    setGeneroId(serie.serie_genero[0]?.id_genero || null);
  };

  const handleEliminar = async (id_serie) => {
    try {
      const { error } = await supabase.from('series').delete().eq('id_serie', id_serie);
      if (error) throw error;

      // También eliminar en serie_genero
      await supabase.from('serie_genero').delete().eq('id_serie', id_serie);

      Alert.alert('Éxito', 'La serie ha sido eliminada.');
      fetchSeries(); // Refrescar la lista
    } catch (error) {
      console.error('Error al eliminar la serie:', error);
      Alert.alert('Error', 'No se pudo eliminar la serie.');
    }
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setAño('');
    setActorId(null);
    setIdiomaId(null);
    setDirectorId(null);
    setPlataformaId(null);
    setGeneroId(null);
    setEditando(false);
    setSerieSeleccionada(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Año"
        value={año}
        onChangeText={setAño}
        style={styles.input}
      />

      {/* Selectores para actores, idiomas, directores, plataformas y géneros */}
      <Picker selectedValue={actorId} onValueChange={setActorId}>
        <Picker.Item label="Seleccione un actor" value={null} />
        {actores.map((actor) => (
          <Picker.Item key={actor.id_actor} label={`${actor.nombre} ${actor.apellido}`} value={actor.id_actor} />
        ))}
      </Picker>

      <Picker selectedValue={idiomaId} onValueChange={setIdiomaId}>
        <Picker.Item label="Seleccione un idioma" value={null} />
        {idiomas.map((idioma) => (
          <Picker.Item key={idioma.id_idioma} label={idioma.nombre} value={idioma.id_idioma} />
        ))}
      </Picker>

      <Picker selectedValue={directorId} onValueChange={setDirectorId}>
        <Picker.Item label="Seleccione un director" value={null} />
        {directores.map((director) => (
          <Picker.Item key={director.id_director} label={`${director.nombre} ${director.apellido}`} value={director.id_director} />
        ))}
      </Picker>

      <Picker selectedValue={plataformaId} onValueChange={setPlataformaId}>
        <Picker.Item label="Seleccione una plataforma" value={null} />
        {plataformas.map((plataforma) => (
          <Picker.Item key={plataforma.id_plataforma} label={plataforma.nombre} value={plataforma.id_plataforma} />
        ))}
      </Picker>

      <Picker selectedValue={generoId} onValueChange={setGeneroId}>
        <Picker.Item label="Seleccione un género" value={null} />
        {generos.map((genero) => (
          <Picker.Item key={genero.id_genero} label={genero.nombre} value={genero.id_genero} />
        ))}
      </Picker>

      <Button title={editando ? "Actualizar Serie" : "Crear Serie"} onPress={handleSubmit} />

      {/* Mostrar lista de series */}
      <FlatList
        data={series}
        keyExtractor={(item) => item.id_serie.toString()}
        renderItem={({ item }) => (
          <View style={styles.serieItem}>
            <Text>{item.titulo} ({item.año})</Text>
            <Button title="Editar" onPress={() => handleEditar(item)} />
            <Button title="Eliminar" onPress={() => handleEliminar(item.id_serie)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },
  serieItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});
