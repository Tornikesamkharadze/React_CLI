import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

import {Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const AddBankAccount = ({navigation, route}) => {
  // navigatin header ui
  navigation.setOptions({
    headerStyle: {
      height: Platform.OS === 'android' ? 0 : 0,
    },
  });

  const _onNavigationStateChange = webViewState => {
    if (
      webViewState.url == 'https://api.goldtheapp.com/v1/success' ||
      webViewState.url == 'https://api.goldtheapp.com/v1/closed'
    ) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={{
          marginTop: 50,
          marginBottom: 20,
        }}>
        <TouchableOpacity
          style={{
            height: 28,
            width: 28,
            backgroundColor: '#333333',
            borderRadius: 15,
            justifyContent: 'center',
            marginLeft: 15,
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
      <View
        style={{
          flex: 1,
          height: windowHeight,
          width: windowWidth,
        }}>
        <WebView
          source={{uri: route.params.url}}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
        />
      </View>
      <View />
    </View>
  );
};
export default AddBankAccount;
