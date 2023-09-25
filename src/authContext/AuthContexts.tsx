import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../utils/Axiosinstance';
import {AuthData, authService} from '../service/authService';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>();

  //the AuthContext start with loading equals true
  //and stay like this, until the data be load from Async Storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorage function.
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      //loading finished
      DeviceInfo.getUniqueId().then(deviceId => {
        Axiosinstance.setHeader('device-id', deviceId);
        checkApplicationPermission(deviceId);
      });
    }
  }
  const checkApplicationPermission = async deviceId => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            Axiosinstance.setHeader('device-token', fcmToken);
            setLoading(false);
          }
        })
        .catch(error => {
          console.log(error);
          Axiosinstance.setHeader('device-token', deviceId);
          setLoading(false);
        });
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
      messaging()
        .getToken()

        .then(fcmToken => {
          if (fcmToken) {
            alert(fcmToken);
            Axiosinstance.setHeader('device-token', fcmToken);
            setLoading(false);
          }
        })
        .catch(error => {
          Axiosinstance.setHeader('device-token', deviceId);
          setLoading(false);
        });
    } else {
      console.log('User has notification permissions disabled');
      Axiosinstance.setHeader('device-token', deviceId);
    }
  };

  const signIn = async () => {
    //call the service passing credential (email and password).
    //In a real App this data will be provided by the user from some InputText components.
    const _authData = await authService.signIn(
      'lucasgarcez@email.com',
      '123456',
    );

    //Set the data in the context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(_authData);

    //Persist the data in the Async Storage
    //to be recovered in the next user session.
    AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(undefined);

    //Remove the data from Async Storage
    //to NOT be recoverede in next session.
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};
