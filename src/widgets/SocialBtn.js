/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Image} from 'react-native';

const SocialBtn = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.getClick(props.socialType);
      }}
      style={{
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#F3F3F3',
        borderRadius: 12,

        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={props.icon}
        style={{height: 25, width: 25, resizeMode: 'contain'}}
      />
    </TouchableOpacity>
  );
};

export default SocialBtn;
