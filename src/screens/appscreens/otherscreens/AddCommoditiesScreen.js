/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import AddComodities from './AddComodities';
import {useState} from 'react';
import FlashMessage from 'react-native-flash-message';

export default function AddCommoditiesScreen({route, navigation}) {
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
          {route?.params?.from == 'CONVERSIONTOCASH'
            ? 'Withdraw Commodity'
            : route?.params?.from == 'SHIP_COMMODITY_TO_GOLD_APP'
            ? 'Ship Commodity'
            : route?.params?.from == 'PHYSICAL_DELIVERY'
            ? 'Physical Delivery'
            : 'Add Commodity'}
        </Text>
      </View>
    ),
    headerRight: () => null,
    headerLeft: () => (
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
            backgroundColor: '#333333',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 15,
              width: 15,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/icon_back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      {route?.params?.from == 'CONVERSION' ? (
        <AddComodities
          navigation={navigation}
          from={'CONVERSION'}
          back={route?.params?.backTo}
        />
      ) : route?.params?.from == 'CONVERSIONTOCASH' ? (
        <AddComodities
          navigation={navigation}
          from={'CONVERSIONTOCASH'}
          back={route?.params?.backTo}
        />
      ) : route?.params?.commodityId ? (
        <AddComodities
          navigation={navigation}
          id={route?.params?.commodityId}
          name={route?.params?.commodityName}
          icon={route?.params?.commodityIcon}
          from={'ADD'}
          back={route?.params?.backTo}
        />
      ) : route?.params?.from == 'SHIP_COMMODITY_TO_GOLD_APP' ? (
        <AddComodities
          navigation={navigation}
          from={'SHIP'}
          back={route?.params?.backTo}
        />
      ) : route?.params?.from == 'PHYSICAL_DELIVERY' ? (
        <AddComodities
          navigation={navigation}
          from={'PHYSICAL_DELIVERY'}
          back={route?.params?.backTo}
        />
      ) : (
        <AddComodities navigation={navigation} from={'ADD'} />
      )}
    </View>
  );
}
