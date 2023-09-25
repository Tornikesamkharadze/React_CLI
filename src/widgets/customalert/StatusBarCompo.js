/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StatusBar} from 'react-native';

const StatusBarCompo = ({children, backgroundColor, barStyle}) => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      {children}
    </View>
  );
};

export default StatusBarCompo;
