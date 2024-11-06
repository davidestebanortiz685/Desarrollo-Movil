import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../../lib/supabse';

export default function SeriesListCliente() {
  const [series, setSeries] = useState([]);
  const [selectedGenero, setSelectedGenero] = useState('');
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    fetchGeneros();
    fetchSeries();
  }, []);

  const fetchGeneros = async () => {
    const { data, error } = await supabase.from('generos').select('*');
    if (error) console.error('Error fetching generos:', error);
    else setGeneros(data);
  };

  const fetchSeries = async () => {
    const { data, error } = await supabase
      .from('series')
      .select('*, actores(nombre, apellido), directores(nombre, apellido), plataformas(nombre), criticas(id_critica,comentario, puntuacion)');
    if (error) console.error('Error fetching series:', error);
    else setSeries(data);
  };

  const filterByGenero = async (generoId) => {
    if (generoId === 'all') {
      fetchSeries(); // Si se selecciona "Todas las series", carga todas las series
    } else if (generoId) {
      const { data, error } = await supabase
        .from('series')
        .select(`
          *,
          criticas(
            id_critica,
            comentario,
            puntuacion
          ),
          serie_genero!inner(id_genero),
          actores(nombre, apellido),
          directores(nombre, apellido),
          plataformas(nombre)
        `)
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
            <View style={styles.infoContainer}>
              <View style={styles.item}>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text>Año: {item.año}</Text>
                <Text>Actor: {item.actores?.nombre} {item.actores?.apellido}</Text>
                <Text>Director: {item.directores?.nombre} {item.directores?.apellido}</Text>
                <Text>Plataforma: {item.plataformas?.nombre}</Text>
                {item.criticas.length > 0 ? (
                  <View>
                    <Text style={styles.subtitle}>Críticas:</Text>
                    {item.criticas.map((critica) => (
                      <View key={critica.id_critica} style={styles.critica}>
                        <Text>Comentario: {critica.comentario}</Text>
                        <Text>Puntuación: {critica.puntuacion}/10</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noCriticas}>No hay críticas disponibles.</Text>
                )}
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>Seleccione un género para ver las series</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
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
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      marginTop: 10,
      fontWeight: '600',
    },
    critica: {
      marginVertical: 5,
    },
    noCriticas: {
      color: 'gray',
      marginTop: 5,
    },
    noDataText: {
      textAlign: 'center',
      marginVertical: 20,
      color: 'gray',
    },
  });
