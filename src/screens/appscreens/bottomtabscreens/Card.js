/* eslint-disable react-native/no-inline-styles */
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../../authContext/AuthContexts';
import Axiosinstance from '../../../utils/Axiosinstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiEndPoint from '../../../utils/ApiEndPoint';

import QRScannerComponent from '../otherscreens/QRScannerComponent';

const Card = ({navigation}) => {
  const [userData, setUserData] = useState();
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        const userData = await AsyncStorage.getItem('userData');
        setUserData(JSON.parse(userData));
      };
      getUserData();
    }, []),
  );
  const auth = useAuth();
  const storeData = async value => {
    try {
      await AsyncStorage.setItem('token', value);
      signOut();
    } catch (e) {}
  };

  const signOut = () => {
    auth.signOut();
  };

  const logout = async token => {
    try {
      const accessToken = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.logout).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            //setisSessionExpired(true);
          } else if (ok) {
            storeData('');
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      console.log(e);
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
          Account & Details
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

      <View
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('SavedCards', {
              fromCard: true,
            });
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: 'black',
            width: '50%',
            height: '25%',
            justifyContent: 'center',
            borderRadius: 12,
          }}>
          <Image
            style={{
              height: '50%',
              width: '37%',
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/credit_card_ico.png')}
          />
          <Text
            style={{
              marginTop: '8%',
              alignSelf: 'center',
              fontFamily: 'Asap-Medium',
              fontSize: 21,
              color: 'white',
              fontWeight: '600',
            }}>
            Saved Cards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('BankDetails');
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: 'black',
            width: '50%',
            height: '25%',
            justifyContent: 'center',
            borderRadius: 12,
            marginVertical: '10%',
          }}>
          <Image
            style={{
              height: '50%',
              width: '37%',
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/bank_ico.png')}
          />
          <Text
            style={{
              marginTop: '8%',
              alignSelf: 'center',
              fontFamily: 'Asap-Medium',
              fontSize: 21,
              color: 'white',
              fontWeight: '600',
            }}>
            Bank Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            alignSelf: 'center',
            backgroundColor: 'black',
            width: '50%',
            height: '25%',
            justifyContent: 'center',
            borderRadius: 12,
          }}>
          <Image
            style={{
              height: '50%',
              width: '37%',
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/gold_card_icon.png')}
          />
          <Text
            style={{
              marginTop: '8%',
              alignSelf: 'center',
              fontFamily: 'Asap-Medium',
              fontSize: 21,
              color: 'white',
              fontWeight: '600',
            }}>
            Gold app card
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Card;
