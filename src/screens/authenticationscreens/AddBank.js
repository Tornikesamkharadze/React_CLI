/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddBank = ({navigation, route}) => {
  // useFocusEffect(
  //   useCallback(() => {
  //     getToken();
  //   }, []),
  // );

  // const getToken = async () => {
  //   const token = await AsyncStorage.getItem('token');
  //   linkAccount(token);
  // };

  // const linkAccount = token => {
  //   try {
  //     Axiosinstance.setHeader('access-token', token);
  //     Axiosinstance.get(ApiEndPoint.link_account).then(
  //       ({ok, status, data, problem}) => {
  //         if (ok) {
  //           //  alert(data.data);
  //         } else {
  //           //  alert(data.message);
  //         }
  //       },
  //     );
  //   } catch (e) {
  //     alert(e);
  //   }
  // };

  const _onNavigationStateChange = webViewState => {
    if (
      webViewState.url == 'https://api.goldtheapp.com/v1/success' ||
      webViewState.url == 'https://api.goldtheapp.com/v1/closed'
    ) {
      navigation.navigate('SignIn');
    }
  };

  return (
    // <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            paddingTop: 10,
            //  alignSelf: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            height: 45,
            marginTop: Platform.OS == 'ios' ? 25 : 0,
          }}>
          <View style={{width: '33%'}} />
          <View
            style={{
              width: '33%',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 22,
                fontWeight: '600',
                alignSelf: 'center',
                // lineHeight: 20,
                fontFamily: 'Asap-Medium',
              }}>
              Add Bank
            </Text>
          </View>

          <View
            style={{
              width: '33%',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignIn');
              }}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: 'black',
                borderRadius: 12,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          height: windowHeight,
          width: windowWidth,
        }}>
        <WebView
          source={{uri: route.params.addBankUrl}}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
        />
      </View>
    </View>
    // </StatusBarCompo>
  );
};

export default AddBank;
