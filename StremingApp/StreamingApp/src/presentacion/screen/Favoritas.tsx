import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../../lib/supabse'; // Asegúrate de tener la ruta correcta

export default function Favoritas() {
  const [seriesDisponibles, setSeriesDisponibles] = useState([]);
  const [favoritas, setFavoritas] = useState([]);
  const [mostrarFavoritas, setMostrarFavoritas] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Guardamos el email del usuario
  useEffect(() => {
    fetchUsuario();
    fetchSeriesDisponibles();
  }, []);

  // Obtener el correo del usuario autenticado
// Obtener el correo del usuario autenticado
const fetchUsuario = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser ();
  
    if (authError || !user) {
      console.error('Error obteniendo el usuario:', authError);
      return;
    }
  
    // Guardamos el email del usuario
    setUserEmail(user.email);
    fetchFavoritas(user.email); // Llamamos a fetchFavoritas con el correo
  };
  // Obtener todas las series disponibles
  const fetchSeriesDisponibles = async () => {
    const { data: seriesData, error } = await supabase
      .from('series')
      .select('*'); // Cambia si necesitas campos específicos

    if (error) {
      console.error('Error obteniendo series disponibles:', error);
    } else {
      setSeriesDisponibles(seriesData);
    }
  };

  // Obtener las series favoritas del usuario por correo
  const fetchFavoritas = async (email) => {
    if (!email) return; // Esperamos a tener el correo del usuario

    const { data: favoritasData, error: favoritasError } = await supabase
        .from('favoritos')
        .select('id_serie, series (titulo, año)')
        .eq('user_email', email); // Cambia 'user_email' por el nombre correcto de la columna

    if (favoritasError) {
        console.error('Error obteniendo series favoritas:', favoritasError);
    } else {
        setFavoritas(favoritasData);
    }
};

  // Manejar la selección de series favoritas
  const agregarAFavoritos = async (serieId) => {
    if (!userEmail) {
        console.error('Error: el correo del usuario no está disponible');
        return;
    }

    // Añadir la serie a la tabla de favoritos
    const { error } = await supabase
        .from('favoritos')
        .insert([{ user_email: userEmail, id_serie: serieId }]); // Cambia 'user_email' por el nombre correcto de la columna

    if (error) {
        console.error('Error agregando a favoritos:', error);
    } else {
        fetchFavoritas(userEmail); // Refresca la lista de favoritas después de agregar
    }
};

  // Manejar la eliminación de series favoritas
  const eliminarDeFavoritos = async (serieId) => {
    if (!userEmail) {
        console.error('Error: el correo del usuario no está disponible');
        return;
    }

    // Eliminar la serie de la tabla de favoritos
    const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_email', userEmail) // Cambia 'user_email' por el nombre correcto de la columna
        .eq('id_serie', serieId);

    if (error) {
        console.error('Error eliminando de favoritos:', error);
    } else {
        fetchFavoritas(userEmail); // Refresca la lista de favoritas después de eliminar
    }
};

  return (
    <View style={styles.container}>
      <Button
        title={mostrarFavoritas ? "Ver todas las series" : "Ver series favoritas"}
        onPress={() => setMostrarFavoritas(!mostrarFavoritas)}
      />

      {mostrarFavoritas ? (
        <FlatList
    data={favoritas}
    keyExtractor={(item) => item.id_serie.toString()}
    renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => eliminarDeFavoritos(item.id_serie)}>
            <Text>{item.series.titulo} ({item.series.año})</Text>
            <Text style={styles.removeText}>Eliminar de favoritas</Text>
        </TouchableOpacity>
    )}
/>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Series Disponibles</Text>
          <FlatList
            data={seriesDisponibles}
            keyExtractor={(item) => item.id_serie.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => agregarAFavoritos(item.id_serie)}>
                <Text>{item.titulo} ({item.año})</Text>
                <Text style={styles.addText}>Agregar a favoritas</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addText: {
    color: 'green',
    marginTop: 5,
  },
  removeText: {
    color: 'red',
    marginTop: 5,
  },
});