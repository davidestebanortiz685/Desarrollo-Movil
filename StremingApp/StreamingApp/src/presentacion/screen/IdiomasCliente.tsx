import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function IdiomasClienteScreen() {
  const [idiomas, setIdiomas] = useState([]);

  useEffect(() => {
    fetchIdiomas();
  }, []);

  // Obtener los idiomas
  const fetchIdiomas = async () => {
    const { data, error } = await supabase.from('idiomas').select('*');
    if (error) {
      console.error('Error fetching idiomas:', error);
    } else {
      setIdiomas(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Idiomas Disponibles</Text>

      <FlatList
        data={idiomas}
        keyExtractor={(item) => item.id_idioma.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nombre}</Text>
            <Text style={styles.itemDetail}>Código ISO: {item.iso_code}</Text>
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
  },
});
