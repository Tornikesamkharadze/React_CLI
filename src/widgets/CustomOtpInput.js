/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Dimensions, Platform} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';

const CustomOtpInput = props => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <OTPTextView
        autoFocus={false}
        inputCount={4}
        secureTextEntry={true}
        containerStyle={{
          width: '100%',
        }}
        textInputStyle={{
          color: 'black',
          backgroundColor: '#F4F4F4',
          fontFamily: 'Asap-Bold',
          fontSize: 25,
          aspectRatio: 3 / 2,
          width: windowWidth * 0.19,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 1,
        }}
        borderBottomWidth={0}
        cursorColor={'#FFAD00'}
        selectionColor={'#FFAD00'}
        textAlign={'center'}
        keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'number-pad'}
        returnKeyType="done"
        handleTextChange={val => {
          //setVarifyOtp(val.replace(/[^0-9]/g, ''));
          props.getOTP(val);
        }}
      />
    </View>
  );
};

export default CustomOtpInput;
