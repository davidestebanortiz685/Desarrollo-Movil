import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { supabase } from '../../../lib/supabse';

export default function SeriesList() {
  const [series, setSeries] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState('');
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    fetchGeneros();
  }, []);

  const fetchGeneros = async () => {
    const { data, error } = await supabase.from('generos').select('*');
    if (error) console.error('Error fetching generos:', error);
    else setGeneros(data);
  };

  const fetchSeries = async () => {
    const { data, error } = await supabase.from('series').select('*');
    if (error) console.error('Error fetching series:', error);
    else setSeries(data);
  };

  const filterByGenero = async (generoId) => {
    if (generoId === 'all') {
      fetchSeries(); // Si se selecciona "Todas las series", carga todas las series
    } else if (generoId) {
      const { data, error } = await supabase
        .from('series')
        .select('*, serie_genero!inner(id_genero)')
        .eq('serie_genero.id_genero', generoId);
      if (error) console.error('Error filtering series:', error);
      else setSeries(data);
    } else {
      setSeries([]); // Limpiar la lista si no se selecciona ninguna opción
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedGenero}
        onValueChange={(itemValue) => {
          setSelectedGenero(itemValue);
          filterByGenero(itemValue);
        }}
      >
        <Picker.Item label="Seleccione un género" value="" />
        <Picker.Item label="Todas las series" value="all" />
        {generos.map((genero) => (
          <Picker.Item key={genero.id_genero} label={genero.nombre} value={genero.id_genero} />
        ))}
      </Picker>

      {selectedGenero ? (
        <FlatList
          data={series}
          keyExtractor={(item) => item.id_serie.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.titulo}</Text>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>Seleccione un género para ver las series</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  noDataText: { textAlign: 'center', marginVertical: 20, color: 'gray' },
});
