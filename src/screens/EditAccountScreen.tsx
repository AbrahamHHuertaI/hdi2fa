import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getAccountById, updateAccount} from '../database/db'; // Funciones de la base de datos
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
type EditAccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditAccount'
>;

type EditAccountScreenRouteProp = RouteProp<RootStackParamList, 'EditAccount'>;
function EditAccountScreen() {
    const navigation = useNavigation<EditAccountScreenNavigationProp>();    
  const route = useRoute<EditAccountScreenRouteProp>();
  const {accountId} = route.params as {accountId: any};
  const [accountName, setAccountName] = useState('');
  const [accountSecret, setAccountSecret] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      const data: any = await getAccountById(accountId);
      setAccountName(data.name); // Llenamos el input con el nombre actual
        setAccountSecret(data.secret); // Llenamos el input con el secreto actual
        setAccountEmail(data.email); // Llenamos el input con el email actual
    } catch (error) {
      console.error('Error obteniendo la cuenta:', error);
      Alert.alert('Error', 'No se pudo cargar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateAccount(accountId, accountEmail, accountSecret, accountName); // Actualiza solo el nombre
      //Alert.alert('Éxito', 'La cuenta ha sido actualizada.');
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'La cuenta ha sido actualizada.',
        position: 'bottom',
      });
      navigation.goBack(); // Regresa a la pantalla de detalles
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#293845" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar cuenta</Text>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.label}>Nombre de la cuenta</Text>
        <TextInput
          style={styles.input}
          value={accountName}
          onChangeText={setAccountName}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#293845',
  },
  content: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    color: '#293845',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#65A518',
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 24,
    color: '#7e8d9b',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#65A518',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditAccountScreen;
