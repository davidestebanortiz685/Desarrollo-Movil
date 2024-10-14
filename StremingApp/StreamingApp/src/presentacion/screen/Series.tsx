import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../../lib/supabse';

export default function SeriesScreen() {
  const [series, setSeries] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [año, setAño] = useState('');
  const [actorId, setActorId] = useState('');
  const [idiomaId, setIdiomaId] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [plataformaId, setPlataformaId] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [editingSerie, setEditingSerie] = useState(null);
  const [actores, setActores] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    fetchSeries();
    fetchActores();
    fetchIdiomas();
    fetchDirectores();
    fetchPlataformas();
    fetchGeneros();
  }, []);

  const fetchSeries = async () => {
    const { data, error } = await supabase
      .from('series')
      .select(`*, actores(nombre), idiomas(nombre), directores(nombre), plataformas(nombre), generos(nombre)`);
    if (error) {
      console.error('Error fetching series:', error);
    } else {
      setSeries(data);
    }
  };

  const fetchActores = async () => {
    const { data, error } = await supabase.from('actores').select('id_actor, nombre');
    if (error) {
      console.error('Error fetching actores:', error);
    } else {
      setActores(data);
    }
  };

  const fetchIdiomas = async () => {
    const { data, error } = await supabase.from('idiomas').select('id_idioma, nombre');
    if (error) {
      console.error('Error fetching idiomas:', error);
    } else {
      setIdiomas(data);
    }
  };

  const fetchDirectores = async () => {
    const { data, error } = await supabase.from('directores').select('id_director, nombre');
    if (error) {
      console.error('Error fetching directores:', error);
    } else {
      setDirectores(data);
    }
  };

  const fetchPlataformas = async () => {
    const { data, error } = await supabase.from('plataformas').select('id_plataforma, nombre');
    if (error) {
      console.error('Error fetching plataformas:', error);
    } else {
      setPlataformas(data);
    }
  };

  const fetchGeneros = async () => {
    const { data, error } = await supabase.from('generos').select('id_genero, nombre');
    if (error) {
      console.error('Error fetching generos:', error);
    } else {
      setGeneros(data);
    }
  };

  const addSerie = async () => {
    const { data, error } = await supabase.from('series').insert([
      { titulo, año, actor_id: actorId, idioma_id: idiomaId, director_id: directorId, plataforma_id: plataformaId, genero_id: generoId }
    ]);
    if (error) {
      console.error('Error adding serie:', error);
    } else {
      fetchSeries();
      clearForm();
    }
  };

  const clearForm = () => {
    setTitulo('');
    setAño('');
    setActorId('');
    setIdiomaId('');
    setDirectorId('');
    setPlataformaId('');
    setGeneroId('');
    setEditingSerie(null);
  };

  const deleteSerie = async (id) => {
    const { error } = await supabase.from('series').delete().eq('id_serie', id);
    if (error) {
      console.error('Error deleting serie:', error);
    } else {
      setSeries(series.filter((serie) => serie.id_serie !== id));
    }
  };

  const loadSerieForEditing = (serie) => {
    setTitulo(serie.titulo);
    setAño(serie.año);
    setActorId(serie.actor_id.toString());
    setIdiomaId(serie.idioma_id.toString());
    setDirectorId(serie.director_id.toString());
    setPlataformaId(serie.plataforma_id.toString());
    setGeneroId(serie.genero_id.toString());
    setEditingSerie(serie);
  };

  const saveSerie = async () => {
    if (editingSerie) {
      const { error } = await supabase
        .from('series')
        .update({
          titulo,
          año,
          actor_id: actorId,
          idioma_id: idiomaId,
          director_id: directorId,
          plataforma_id: plataformaId,
          genero_id: generoId
        })
        .eq('id_serie', editingSerie.id_serie);

      if (error) {
        console.error('Error updating serie:', error);
      } else {
        fetchSeries();
        clearForm();
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Series Disponibles</Text>
      {series.map((item) => (
        <View key={item.id_serie} style={styles.item}>
          <Text style={styles.itemTitle}>{item.titulo}</Text>
          <Text style={styles.itemDetail}>Año: {item.año}</Text>
          <Text style={styles.itemDetail}>Actor: {item.actores ? item.actores.nombre : 'No asignado'}</Text>
          <Text style={styles.itemDetail}>Idioma: {item.idiomas ? item.idiomas.nombre : 'No asignado'}</Text>
          <Text style={styles.itemDetail}>Director: {item.directores ? item.directores.nombre : 'No asignado'}</Text>
          <Text style={styles.itemDetail}>Plataforma: {item.plataformas ? item.plataformas.nombre : 'No asignado'}</Text>
          <Text style={styles.itemDetail}>Género: {item.generos ? item.generos.nombre : 'No asignado'}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Eliminar" color="#FF6347" onPress={() => deleteSerie(item.id_serie)} />
            <Button title="Editar" color="#4682B4" onPress={() => loadSerieForEditing(item)} />
          </View>
        </View>
      ))}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Año (YYYY)"
          value={año}
          onChangeText={setAño}
        />
        <Picker
          selectedValue={actorId}
          onValueChange={(itemValue) => setActorId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione Actor" value="" />
          {actores.map((actor) => (
            <Picker.Item key={actor.id_actor} label={actor.nombre} value={actor.id_actor.toString()} />
          ))}
        </Picker>

        <Picker
          selectedValue={idiomaId}
          onValueChange={(itemValue) => setIdiomaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione Idioma" value="" />
          {idiomas.map((idioma) => (
            <Picker.Item key={idioma.id_idioma} label={idioma.nombre} value={idioma.id_idioma.toString()} />
          ))}
        </Picker>

        <Picker
          selectedValue={directorId}
          onValueChange={(itemValue) => setDirectorId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione Director" value="" />
          {directores.map((director) => (
            <Picker.Item key={director.id_director} label={director.nombre} value={director.id_director.toString()} />
          ))}
        </Picker>

        <Picker
          selectedValue={plataformaId}
          onValueChange={(itemValue) => setPlataformaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione Plataforma" value="" />
          {plataformas.map((plataforma) => (
            <Picker.Item key={plataforma.id_plataforma} label={plataforma.nombre} value={plataforma.id_plataforma.toString()} />
          ))}
        </Picker>

        <Picker
          selectedValue={generoId}
          onValueChange={(itemValue) => setGeneroId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione Género" value="" />
          {generos.map((genero) => (
            <Picker.Item key={genero.id_genero} label={genero.nombre} value={genero.id_genero.toString()} />
          ))}
        </Picker>

        <Button title={editingSerie ? "Actualizar Serie" : "Agregar Serie"} onPress={editingSerie ? saveSerie : addSerie} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});