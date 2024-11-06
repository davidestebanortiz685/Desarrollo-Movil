import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function DirectoresScreen() {
  const [directores, setDirectores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingDirector, setEditingDirector] = useState(null); // Director en edición

  useEffect(() => {
    fetchDirectores();
  }, []);

  // Obtener los directores
  const fetchDirectores = async () => {
    const { data, error } = await supabase
    .from('directores')
    .select('*');
    if (error) {
      console.error('Error fetching directores:', error);
    } else {
      setDirectores(data);
    }
  };

  // Añadir un director
  const addDirector = async () => {
    const { data, error } = await supabase.from('directores').insert([{ nombre, apellido, nacionalidad, fecha }]);
    if (error) {
      console.error('Error adding director:', error);
    } else {
      //setDirectores([...directores, ...data]);  // Añadir a la lista local
      fetchDirectores();
      clearForm();
    }
  };

  const clearForm = () => {
    setNombre('');
    setApellido('');
    setNacionalidad('');
    setFecha('');
    setEditingDirector(null); 
  };

  // Eliminar un director
  const deleteDirector = async (id) => {
    const { error } = await supabase.from('directores').delete().eq('id_director', id);
    if (error) {
      console.error('Error deleting director:', error);
    } else {
      setDirectores(directores.filter((director) => director.id_director !== id));
    }
  };

  //  editar
  const loadDirectorForEditing = (director) => {
    setNombre(director.nombre);
    setApellido(director.apellido);
    setNacionalidad(director.nacionalidad);
    setFecha(director.fecha);
    setEditingDirector(director);  
  };

  const saveDirector = async () => {
    if (editingDirector) {
      const { error } = await supabase
        .from('directores')
        .update({ nombre, apellido, nacionalidad, fecha })
        .eq('id_director', editingDirector.id_director);

      if (error) {
        console.error('Error updating director:', error);
      } else {
        fetchDirectores();  // Refrescar la lista 
        clearForm(); 
      }
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

            <View style={styles.buttonRow}>
            <Button title="Eliminar" onPress={() => deleteDirector(item.id_director)} color="#E57373" />
            <Button title="Editar" onPress={() => loadDirectorForEditing(item)}  color="#64B5F6"/>           
              
            </View>

          </View>
        )}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Nacionalidad"
          value={nacionalidad}
          onChangeText={setNacionalidad}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
          value={fecha}
          onChangeText={setFecha}
        />

        {/* Mostrar botón de "Añadir Director" o "Guardar Cambios" */}
        <Button 
          title={editingDirector ? "Guardar Cambios" : "Añadir Director"} 
          onPress={editingDirector ? saveDirector : addDirector} 
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
