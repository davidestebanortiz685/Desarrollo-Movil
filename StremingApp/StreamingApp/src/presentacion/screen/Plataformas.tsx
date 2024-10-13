import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function PlataformasScreen() {
  const [plataformas, setPlataformas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [editingPlatform, setEditingPlatform] = useState(null); // Plataforma en edición

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

  // Añadir una plataforma
  const addPlataforma = async () => {
    const { data, error } = await supabase.from('plataformas').insert([{ nombre }]);
    if (error) {
      console.error('Error adding plataforma:', error);
    } else {
      //setPlataformas([...plataformas, ...data]);  // Añadir a la lista local
      fetchPlataformas();
      clearForm();
    }
  };

  // Limpiar el formulario
  const clearForm = () => {
    setNombre('');
    setEditingPlatform(null); // Salir del modo de edición
  };

  // Eliminar una plataforma
  const deletePlataforma = async (id) => {
    const { error } = await supabase.from('plataformas').delete().eq('id_plataforma', id);
    if (error) {
      console.error('Error deleting plataforma:', error);
    } else {
      setPlataformas(plataformas.filter((plataforma) => plataforma.id_plataforma !== id));
    }
  };

  // Cargar una plataforma para editar
  const loadPlataformaForEditing = (plataforma) => {
    setNombre(plataforma.nombre);
    setEditingPlatform(plataforma);  // Almacenar la plataforma en edición
  };

  // Guardar cambios (editar plataforma)
  const savePlataforma = async () => {
    if (editingPlatform) {
      const { error } = await supabase
        .from('plataformas')
        .update({ nombre })
        .eq('id_plataforma', editingPlatform.id_plataforma);

      if (error) {
        console.error('Error updating plataforma:', error);
      } else {
        fetchPlataformas();  // Refrescar la lista de plataformas
        clearForm(); // Limpiar el formulario y salir del modo edición
      }
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

            <View style={styles.buttonRow}>
            <Button title="Eliminar" onPress={() => deletePlataforma(item.id_plataforma)} color="#E57373"/>
            <Button title="Editar" onPress={() => loadPlataformaForEditing(item)} color="#64B5F6"/>
            </View>
          </View>
        )}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la Plataforma"
          value={nombre}
          onChangeText={setNombre}
        />

        {/* Mostrar botón de "Añadir Plataforma" o "Guardar Cambios" */}
        <Button 
          title={editingPlatform ? "Guardar Cambios" : "Añadir Plataforma"} 
          onPress={editingPlatform ? savePlataforma : addPlataforma}
          color="#4CAF50" 
        />
      </View>
    </View>
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
    textAlign: 'center',
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
