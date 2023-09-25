/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import AddComodities from '../otherscreens/AddComodities';
import {useAuth} from '../../../authContext/AuthContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useFocusEffect} from '@react-navigation/native';

export default function GoldScreen({navigation}) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState();

  const showCustomAlert = text => {
    setTimeout(() => {
      setCustomAlertText(text);
    }, 500);
    setTimeout(() => {
      setCustomAlertVisible(true);
    }, 1000);
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('token', value);
      signOut();
    } catch (e) {}
  };

  const signOut = () => {
    auth.signOut();
  };

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(userData));

    setAccessToken(token);
  };

  const logout = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.logout).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            storeData('');
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  //navigatin header ui
  navigation.setOptions({
    headerShadowVisible: false, // remove shadow on Android
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: 'white',
      height: Platform.OS === 'android' ? 80 : 120,
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
    headerTitle: () => (
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
            // lineHeight: 20,
            fontFamily: 'Asap-Medium',
          }}>
          Add Commodity
        </Text>
      </View>
    ),
    headerLeft: () => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 33,
            width: 33,
            marginLeft: 15,
            borderRadius: 33 / 1,
            borderWidth: 1,
            borderColor: '#4545E0',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('MyProfile');
          }}>
          <Image
            style={{
              alignSelf: 'center',
              height: 32,
              width: 32,
              //  marginLeft: 15,
              resizeMode: 'contain',
              borderRadius: 30 / 1,
              //  borderWidth: 1,
              //  borderColor: '#A5A5A5',
            }}
            source={{uri: userData?.profile_img}}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
          onPress={() => {
            navigation.navigate('Notification');
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/notification_ico.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            //  backgroundColor: '#5b5b5b',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Do you want to logout?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => logout()},
              ],
              {cancelable: false},
            );
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/logout_ico.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  });
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <AddComodities navigation={navigation} from={'ADD'} />
    </View>
  );
}
