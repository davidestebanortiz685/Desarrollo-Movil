import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function PlataformasScreen() {
  const [plataformas, setPlataformas] = useState([]);

  useEffect(() => {
    fetchPlataformas();
  }, []);

  // Obtener las plataformas
  const fetchPlataformas = async () => {
    const { data, error } = await supabase.from('plataformas').select('*');
    if (error) {
      console.error('Error fetching plataformas:', error);
    } else {
      setPlataformas(data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plataformas Disponibles</Text>

      <FlatList
        data={plataformas}
        keyExtractor={(item) => item.id_plataforma.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nombre}</Text>
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
});
