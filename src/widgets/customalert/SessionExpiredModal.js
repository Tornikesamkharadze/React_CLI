/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import {useAuth} from '../../authContext/AuthContexts';

const SessionExpiredModel = props => {
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
  return (
    <Modal visible={props.modalvisible} transparent={true}>
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: 'rgba(1,1,1,0.5)',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 40,
            alignSelf: 'center',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: 60,
              width: 120,
              resizeMode: 'contain',
            }}
            source={require('../../assets/images/gold_logo.png')}
          />
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: 'Asap-Medium',
              fontSize: 22 / PixelRatio.getFontScale(),
              color: '#FFAD00',
              marginTop: 15,
              marginBottom: 8,
              fontWeight: '700',
            }}>
            Your session expired
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              fontFamily: 'Asap-Medium',
              fontSize: 16 / PixelRatio.getFontScale(),
              color: '#40475F',
              fontWeight: '500',
            }}>
            Please login again
          </Text>
          <TouchableOpacity
            onPress={() => {
              storeData('');
            }}
            style={{
              alignSelf: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#FFAD00',
              borderRadius: 30,
              marginTop: 20,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'Asap-Medium',
                fontSize: 16 / PixelRatio.getFontScale(),
                color: 'white',
                fontWeight: '700',
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SessionExpiredModel;
