import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRCodeScannerScreen from './src/screens/QRCodeScannerScreen';
import Toast from 'react-native-toast-message'; // Importamos Toast
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import EditAccountScreen from './src/screens/EditAccountScreen';


export type RootStackParamList = {
  Home: undefined;
  AccountDetail: { accountId: any };
  EditAccount: { accountId: any };
  QRCodeScanner: undefined;
  Splash: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#65A518" />
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} options={{headerShown: false}} />
        <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{headerShown: false}} />
        <Stack.Screen name="EditAccount" component={EditAccountScreen} options={{headerShown: false}} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;
