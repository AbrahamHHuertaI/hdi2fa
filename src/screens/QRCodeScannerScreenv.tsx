import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import { useCodeScanner } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';

function QRCodeScannerScreen({ navigation }: any) {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (isScanning && codes.length > 0) {
        setIsScanning(false);
        const qrContent = codes[0].value;
        Alert.alert('Código escaneado', qrContent || 'Código vacío', [
          {
            text: 'OK',
            onPress: () => {
              setIsScanning(true);
              navigation.goBack();
            },
          },
        ]);
      }
    },
  });

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setCameraPermission(permission);
  };

  if (cameraPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#006e3b" />
        <Text style={styles.permissionText}>Verificando permisos de cámara...</Text>
      </View>
    );
  }

  if (cameraPermission !== 'granted') {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Permiso de cámara denegado.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No se encontró cámara disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      {/* Header sobre la cámara */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear código QR</Text>
        <TouchableOpacity onPress={() => {}}>
          <Icon name="checkmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Overlay alrededor del área transparente */}
      <View style={styles.overlayContainer}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.transparentArea}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {/* Texto debajo del cuadro */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          El proveedor de cuenta mostrará un código QR
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
  },
  overlayMiddle: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  transparentArea: {
    width: 248, // Área ligeramente más pequeña para que el borde sobresalga
    height: 248,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'green',
    borderRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: 'green',
    borderRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: 'green',
    borderRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: 'green',
    borderRadius: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'green',
  },
  permissionText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: '50%',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#006e3b',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default QRCodeScannerScreen;
