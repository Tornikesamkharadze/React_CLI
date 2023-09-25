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

const WithdrawCommodity = ({navigation, route}) => {
  //navigatin header ui
  navigation.setOptions({
    headerShadowVisible: true, // remove shadow on Android
    headerTitleAlign: 'center',

    headerStyle: {
      //   backgroundColor: 'white',
      height: Platform.OS === 'android' ? 80 : 120,
      alignItems: 'center',
      elevation: 5, // remove shadow on Android
      shadowOpacity: 5, // remove shadow on iOS
      borderBottomWidth: 5,
      shadowColor: 'rgba(255,255,255,0.1)',
      shadowColor: 'transparent',
    },
    headerTitle: () => (
      <View
        style={{
          height: 28,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
            alignItems: 'center',
            // lineHeight: 20,
            fontFamily: 'Asap-Medium',
          }}>
          Withdraw Commodity
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
            height: 28,
            width: 28,
            backgroundColor: '#333333',
            borderRadius: 15,
            justifyContent: 'center',
            // alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 14,
              width: 14,
              resizeMode: 'cover',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/icon_back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => null,
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
            navigation.navigate('AddCommoditiesScreen', {
              from: route.params.from,
              backTo: 'conversion',
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
              width: '50%',
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/ico_dollar.png')}
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
            Convert to cash
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('WithdrawCash', {
              from: true,
              backTo: 'conversion',
            });
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
            Transfer to bank
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default WithdrawCommodity;
