import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';

import AddCommoditiComponent from './AddCommoditiComponent';
import WithdrawCommoditiComponent from './WithdrawCommoditiComponent';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddAndWithdrawCommodity = ({navigation, route}) => {
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
          {route.params.forAddCommodity == true
            ? 'Add Commodity'
            : 'Withdraw Commodity'}
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
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* <Loader isVisible={isLoading} /> */}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 10,
          }}>
          {route.params.forAddCommodity == true ? (
            <AddCommoditiComponent
              navigation={navigation}
              from={'CONVERSION'}
            />
          ) : (
            <WithdrawCommoditiComponent
              navigation={navigation}
              from={'CONVERSIONTOCASH'}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default AddAndWithdrawCommodity;
