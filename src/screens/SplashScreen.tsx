import React, {useEffect} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

function SplashScreen({navigation}: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Redirige a HomeScreen después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el timer al desmontar
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>AUTENTICADOR CORPORATIVO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Color de fondo similar al que muestras
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain', // Asegura que la imagen mantenga su aspecto
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#65A518', // Color verde para que coincida con la imagen
  },
});

export default SplashScreen;
