import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function ActoresClienteScreen() {
  const [actores, setActores] = useState([]);

  useEffect(() => {
    fetchActoresCliente();
  }, []);

  const fetchActoresCliente = async () => {
    const { data, error } = await supabase.from('actores').select('*');
    if (error) {
      console.error('Error fetching actores:', error);
    } else {
      setActores(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actores Disponibles</Text>

      <FlatList
        data={actores}
        keyExtractor={(item) => item.id_actor.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.itemDetail}>Nacionalidad: {item.nacionalidad}</Text>
            <Text style={styles.itemDetail}>Fecha de Nacimiento: {item.fecha}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});
