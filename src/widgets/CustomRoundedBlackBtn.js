/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, ImageBackground} from 'react-native';

const CustomRoundedBlackBtn = props => {
  return (
    <>
      {props.text !== 'ADD' ? (
        <TouchableOpacity
          onPress={() => {
            props.getClick();
          }}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'black',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontWeight: '500',
              // lineHeight: 20,
              fontFamily: 'Asap-Medium',
            }}>
            {props.text}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            props.getClick();
          }}>
          <ImageBackground
            style={{
              width: '100%',
              height: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            imageStyle={{
              borderRadius: 12,
              resizeMode: 'cover',
            }}
            source={require('../assets/images/add_btn_icon.jpg')}>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontWeight: '500',
                // lineHeight: 20,
                fontFamily: 'Asap-Medium',
              }}>
              {props.text}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomRoundedBlackBtn;
