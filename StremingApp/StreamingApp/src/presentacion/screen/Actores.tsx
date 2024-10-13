import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../lib/supabse';

export default function ActoresScreen() {
  const [actores, setActores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingActor, setEditingActor] = useState(null);

  useEffect(() => {
    fetchActores();
  }, []);

  const fetchActores = async () => {
    const { data, error } = await supabase.from('actores').select('*');
    if (error) {
      console.error('Error fetching actores:', error);
    } else {
      setActores(data);
    }
  };

  const addActor = async () => {
    const { data, error } = await supabase.from('actores').insert([{ nombre, apellido, nacionalidad, fecha }]);
    if (error) {
      console.error('Error adding actor:', error);
    } else {
    //  setActores([...actores, ...data]);
      fetchActores();
      clearForm();
    }
  };

  const clearForm = () => {
    setNombre('');
    setApellido('');
    setNacionalidad('');
    setFecha('');
    setEditingActor(null);
  };

  const deleteActor = async (id) => {
    const { error } = await supabase.from('actores').delete().eq('id_actor', id);
    if (error) {
      console.error('Error deleting actor:', error);
    } else {
      setActores(actores.filter((actor) => actor.id_actor !== id));
    }
  };

  const loadActorForEditing = (actor) => {
    setNombre(actor.nombre);
    setApellido(actor.apellido);
    setNacionalidad(actor.nacionalidad);
    setFecha(actor.fecha);
    setEditingActor(actor);
  };

  const saveActor = async () => {
    if (editingActor) {
      const { error } = await supabase
        .from('actores')
        .update({ nombre, apellido, nacionalidad, fecha })
        .eq('id_actor', editingActor.id_actor);

      if (error) {
        console.error('Error updating actor:', error);
      } else {
        fetchActores();
        clearForm();
      }
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
            <View style={styles.buttonRow}>
              <Button title="Eliminar" onPress={() => deleteActor(item.id_actor)} color="#E57373" />
              <Button title="Editar" onPress={() => loadActorForEditing(item)} color="#64B5F6" />
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
        <Button 
          title={editingActor ? "Guardar Cambios" : "Añadir Actor"} 
          onPress={editingActor ? saveActor : addActor} 
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  form: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
