import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getAccounts} from '../database/db'; // Función para obtener cuentas
import {useFocusEffect} from '@react-navigation/native'; // Hook para actualizar al enfocar la pantalla

function HomeScreen({navigation}: any) {
  const [accounts, setAccounts] = useState<any[]>([]);

  const fetchAccounts = async () => {
    await getAccounts((data: any) => {
      console.log('Cuentas:', data);
      setAccounts(data); // Actualizar el estado con las cuentas
    });
  };

  // Usamos useFocusEffect para ejecutar fetchAccounts cada vez que volvemos al Home
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Códigos de autenticación</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('QRCodeScanner')}
        >
          <Icon name="add" size={24} color="#65A518" />
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      {accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../../assets/empty-state.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>Agrega aquí un nuevo código de autenticación</Text>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}: any) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('AccountDetail', {accountId: item.id})}
          >
            <View style={styles.accountItem}>
              <Icon name="person-circle" size={30} color="#65A518" style={styles.accountIcon} />
              <View style={styles.accountTextContainer}>
                <Text style={styles.accountName}>{item.name}</Text>
                <Text style={styles.accountEmail}>{item.email}</Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#65A518" style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#293845',
  },
  addButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  accountIcon: {
    marginRight: 16,
  },
  accountTextContainer: {
    flex: 1, // Ocupa el espacio restante
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#293845'
  },
  accountEmail: {
    fontSize: 14,
    color: '#293845',
  },
  arrowIcon: {
    marginLeft: 12, // Separación entre el texto y la flecha
  },
});



export default HomeScreen;
