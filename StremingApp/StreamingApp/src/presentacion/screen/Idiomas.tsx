import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function IdiomasScreen() {
  const [idiomas, setIdiomas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [isoCode, setIsoCode] = useState('');
  const [editingIdioma, setEditingIdioma] = useState(null); // Idioma en edición

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

  // Añadir un idioma
  const addIdioma = async () => {
    const { data, error } = await supabase.from('idiomas').insert([{ nombre, iso_code: isoCode }]);
    if (error) {
      console.error('Error adding idioma:', error);
    } else {
   //   setIdiomas([...idiomas, ...data]);  // Añadir a la lista local
      fetchIdiomas();
      clearForm();
    }
  };

  // Limpiar el formulario
  const clearForm = () => {
    setNombre('');
    setIsoCode('');
    setEditingIdioma(null); // Salir del modo de edición
  };

  // Eliminar un idioma
  const deleteIdioma = async (id) => {
    const { error } = await supabase.from('idiomas').delete().eq('id_idioma', id);
    if (error) {
      console.error('Error deleting idioma:', error);
    } else {
      setIdiomas(idiomas.filter((idioma) => idioma.id_idioma !== id));
    }
  };

  // Cargar un idioma para editar
  const loadIdiomaForEditing = (idioma) => {
    setNombre(idioma.nombre);
    setIsoCode(idioma.iso_code);
    setEditingIdioma(idioma);  // Almacenar el idioma en edición
  };

  // Guardar cambios (editar idioma)
  const saveIdioma = async () => {
    if (editingIdioma) {
      const { error } = await supabase
        .from('idiomas')
        .update({ nombre, iso_code: isoCode })
        .eq('id_idioma', editingIdioma.id_idioma);

      if (error) {
        console.error('Error updating idioma:', error);
      } else {
        fetchIdiomas();  // Refrescar la lista de idiomas
        clearForm(); // Limpiar el formulario y salir del modo edición
      }
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

            <View style={styles.buttonRow}>
            <Button title="Eliminar" onPress={() => deleteIdioma(item.id_idioma)} color="#E57373" />
            <Button title="Editar" onPress={() => loadIdiomaForEditing(item)} color="#64B5F6"/>           
              
            </View>
          </View>
        )}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Idioma"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Código ISO"
          value={isoCode}
          onChangeText={setIsoCode}
        />

        {/* Mostrar botón de "Añadir Idioma" o "Guardar Cambios" */}
        <Button 
          title={editingIdioma ? "Guardar Cambios" : "Añadir Idioma"} 
          onPress={editingIdioma ? saveIdioma : addIdioma} 
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
  itemDetail: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,},

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
