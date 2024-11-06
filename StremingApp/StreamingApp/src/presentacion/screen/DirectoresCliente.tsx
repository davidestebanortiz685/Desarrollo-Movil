import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function DirectoresScreen() {
  const [directores, setDirectores] = useState([]);

  useEffect(() => {
    fetchDirectores();
  }, []);

  // Obtener los directores
  const fetchDirectores = async () => {
    const { data, error } = await supabase.from('directores').select('*');
    if (error) {
      console.error('Error fetching directores:', error);
    } else {
      setDirectores(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directores Disponibles</Text>

      <FlatList
        data={directores}
        keyExtractor={(item) => item.id_director.toString()}
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
