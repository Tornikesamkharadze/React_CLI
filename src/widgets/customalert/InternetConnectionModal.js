/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image, Modal} from 'react-native';

const InternetConnectionModel = props => {
  return (
    // <View style={{height: 400, width: 200, backgroundColor: 'green'}}></View>
    <Modal visible={!props.modalvisible} transparent={true}>
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
            // justifyContent: 'center',
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
              fontFamily: 'Asap-SemiBold',
              alignSelf: 'center',
              fontSize: 22,
              color: '#FFAD00',
              marginTop: 15,
              marginBottom: 8,
            }}>
            No Internet Connection
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              color: '#40475F',
              fontFamily: 'Asap-Medium',
            }}>
            Please check your internet connection
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default InternetConnectionModel;
