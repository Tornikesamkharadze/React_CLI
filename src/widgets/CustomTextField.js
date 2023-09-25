/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TextInput} from 'react-native';

const CustomTextField = React.forwardRef((props, ref) => {
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 1,
        flexDirection: 'row',
      }}>
      <TextInput
        ref={ref}
        editable={props.isActive === 'yes' ? false : true}
        defaultValue={props.defaultValue ? props.defaultValue : ''}
        numberOfLines={1}
        keyboardType={props.keyboardType}
        secureTextEntry={
          props.placeholder === 'Password' ||
          props.placeholder === 'Enter current password'
            ? true
            : props.placeholder === 'Confirm password' ||
              props.placeholder === 'Enter new password'
            ? true
            : props.placeholder === 'Enter confirm password'
            ? true
            : false
        }
        maxLength={props.placeholder === 'Security number' ? 4 : 50}
        returnKeyType="done"
        cursorColor="#FFAD00"
        selectionColor={'#FFAD00'}
        style={{
          flex: 1,
          paddingHorizontal: 15,
          color: props.isActive === 'yes' ? '#626262' : '#202020',
          fontFamily: 'Asap-Medium',
          fontWeight: '400',
          fontSize: 15,
        }}
        placeholder={props.placeholder}
        placeholderTextColor="#626262"
        onChangeText={val => {
          props.getValue(val);
        }}
        onSubmitEditing={props.onSubmitEditing}
        blurOnSubmit={props.blurOnSubmit}
      />
    </View>
  );
});

export default CustomTextField;
