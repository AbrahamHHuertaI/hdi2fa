import React, {useEffect, useState, useRef} from 'react';
import moment from 'moment-timezone';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Clipboard,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getAccountById, deleteAccount} from '../database/db';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {TOTP } from 'totp-generator'; // Importamos la librería totp-generator
import Toast from 'react-native-toast-message'; // Impor
import { RootStackParamList } from '../../App'; // Importamos los tipos
import { StackNavigationProp } from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native'; // Hook para actualizar al enfocar la pantalla
type AccountDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccountDetail'
>;

type AccountDetailScreenRouteProp = RouteProp<RootStackParamList, 'AccountDetail'>;
function AccountDetailScreen() {
  const navigation = useNavigation<AccountDetailScreenNavigationProp>();
  const route = useRoute<AccountDetailScreenRouteProp>();
  const {accountId} = route.params as {accountId: any};
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totpCode, setTotpCode] = useState('');
  const [expiresIn, setExpiresIn] = useState(30);
  const intervalRef = useRef<any>(null);
  const [isModalVisible, setModalVisible] = useState(false); // Estado del modal
  let accountData: any = null;
  useEffect(() => {
    fetchAccountDetails();
    startCountdown();

    return () => clearInterval(intervalRef.current); // Limpia el intervalo al desmontar el componente
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAccountDetails();
    }, [])
  );

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount(accountId);
      Toast.show({
        type: 'success',
        text1: 'Cuenta eliminada',
        text2: 'La cuenta ha sido eliminada correctamente.',
        position: 'bottom',
      });
      setModalVisible(false); // Cierra el modal tras eliminar la cuenta
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error eliminando la cuenta:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo eliminar la cuenta.',
        position: 'bottom',
      });
      setModalVisible(false); // Asegura cerrar el modal en caso de error
    }
  };

  const handleDeleteAccount = () => {
    setModalVisible(true); // Muestra el modal en lugar de la alerta
  };

  const fetchAccountDetails = async () => {
    try {
      const data: any = await getAccountById(accountId);
      console.log('Detalles de la cuenta:', data);
      setAccount(data);
      accountData = data;
      generateOtp(data.secret); // Generar el OTP inicial
    } catch (error) {
      console.error('Error obteniendo los detalles de la cuenta:', error);
      Alert.alert('Error', 'No se pudo cargar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const getMexicoTime = () => {
    const mexicoTime = moment().tz('America/Mexico_City');
    return mexicoTime.format('YYYY-MM-DD HH:mm:ss');
  };

  const getMexicoTimestamp = () => {
    // Obtenemos la hora actual en la zona horaria de México
    const mexicoTime = moment().add(30, 'seconds').tz('America/Mexico_City');
    return Math.floor(mexicoTime.valueOf() / 1000); // Devuelve el timestamp en segundos
  };

  const generateOtp = (secret: string) => {
    // timestamp obten el tiempoa ctual en hora America/Mexico_City
    let timestamp = getMexicoTimestamp();
    const { otp, expires } = TOTP.generate(secret, {
      digits: 6
    })
    const date = new Date(expires);
const humanReadableDate = date.toLocaleString(); // Converts to a human-readable format

console.log(humanReadableDate, otp, timestamp, expires);
    setTotpCode(otp);
  };

  const startCountdown = () => {
    intervalRef.current = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev === 1) {
            console.log('Regenerando OTP', accountData);
          generateOtp(accountData.secret); // Regenerar OTP cada 30 segundos
          return 30;
        }
        return prev - 1;
      });
    }, 1000); // Ejecutar cada segundo
  };

  const copyToClipboard = () => {
    Clipboard.setString(totpCode);
    //Alert.alert('Copiado', 'El código ha sido copiado al portapapeles.');
    Toast.show({
      type: 'success',
      text1: 'Copiado',
      text2: 'El código ha sido copiado al portapapeles.',
      position: 'bottom',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#65A518" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#293845" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
        <View style={styles.headerActions}>
        <TouchableOpacity
            onPress={() => navigation.navigate('EditAccount', {accountId: accountId})} 
          >
          <Icon name="pencil" size={24} color="#65A518" style={styles.headerIcon}   />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount}>
  <Icon name="trash" size={24} color="#65A518" style={styles.headerIcon} />
</TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountEmail}>{account.email}</Text>

        <Text style={styles.descriptionText}>Esta es tu contraseña de un solo uso:</Text>

        <Text style={styles.totpCode}>{totpCode}</Text>

        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyButtonText}>Copiar código</Text>
        </TouchableOpacity>

        <View style={styles.expirationContainer}>
        <View style={styles.circle}>
          <Text style={styles.expirationText}>Expira en</Text>
          <Text style={styles.expirationTime}>{expiresIn}</Text>
          <Text style={styles.expirationText}>segundos</Text>
        </View>
      </View>
      </View>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Confirma que deseas eliminar la cuenta</Text>
                <Text style={styles.accountNameModal}>{account?.name}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
                  <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#293845',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  accountName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#293845',
  },
  accountEmail: {
    fontSize: 16,
    color: '#293845',
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 18,
    color: '#293845',
    marginBottom: 8,
  },
  totpCode: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#293845',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#65A518',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  expirationContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  circle: {
    width: 200, // Tamaño más grande para el círculo
    height: 200, 
    borderRadius: 100, // Radio ajustado para mantener la forma circular
    borderWidth: 3, // Borde más grueso
    borderColor: '#65A518',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20, // Espaciado interno para los textos
  },
  expirationText: {
    fontSize: 18, // Tamaño de texto ajustado
    color: '#293845',
  },
  expirationTime: {
    fontSize: 40, // Tamaño más grande para los segundos
    fontWeight: 'bold',
    color: '#293845',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#293845',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    color: '#293845',
  },
  deleteButton: {
    backgroundColor: '#d3455b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountNameModal: {
    fontSize: 24,
    fontWeight: '600',
    color: '#293845',
  },
});



export default AccountDetailScreen;
