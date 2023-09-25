/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';

const CustomAuthHeading = props => {
  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          color: '#101010',
          // lineHeight: 35,
          fontSize: 25,
          fontWeight: '700',
          fontFamily: 'Asap-Medium',
          textTransform: 'uppercase',
          marginHorizontal: 10,
        }}>
        {props.topHeading}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: '#82806C',
          // lineHeight: 20,
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'Asap-Medium',
          //   textTransform: 'uppercase',
          marginTop: 15,
          marginHorizontal: 30,
        }}>
        {props.bottomHeading}
      </Text>
    </View>
  );
};

export default CustomAuthHeading;
