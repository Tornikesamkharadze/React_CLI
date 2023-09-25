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
import AddComodities from '../otherscreens/AddComodities';
import {useEffect} from 'react';

export default function RequestCommoditiesScreen({route, navigation}) {
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
          Request
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
      {route?.params?.commodityId ? (
        <AddComodities
          navigation={navigation}
          id={route?.params?.commodityId}
          name={route?.params?.commodityName}
          icon={route?.params?.commodityIcon}
          from={'REQUEST'}
          back={route?.params?.backTo}
        />
      ) : route?.params?.userId ? (
        <AddComodities
          navigation={navigation}
          usrId={route?.params?.userId}
          usrName={route?.params?.userName}
          usrImg={route?.params?.userImg}
          usrEmail={route?.params?.userEmail}
          from={'REQUESTQR'}
        />
      ) : (
        <AddComodities navigation={navigation} from={'REQUEST'} />
      )}
    </View>
  );
}
