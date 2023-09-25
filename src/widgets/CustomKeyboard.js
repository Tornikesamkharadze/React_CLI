/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Dimensions, Text, TouchableOpacity, FlatList} from 'react-native';
import CustomRoundedBlackBtn from './CustomRoundedBlackBtn';

const CustomKeyboard = props => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: 220,
          width: '100%',
          backgroundColor: '#FFFCF5',
        }}>
        <FlatList
          bounces={false}
          data={[
            {value: '1'},
            {value: '2'},
            {value: '3'},
            {value: '4'},
            {value: '5'},
            {value: '6'},
            {value: '7'},
            {value: '8'},
            {value: '9'},
            {value: '.'},
            {value: '0'},
            {value: '<'},
          ]}
          contentContainerStyle={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexGrow: 1,
          }}
          numColumns={3}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  props.getKeyBoardClick(item);
                }}
                style={{
                  width: Dimensions.get('screen').width * 0.333,
                  height: 55,
                  backgroundColor: '#FFFCF5',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#202020',
                    fontFamily: 'Asap-Medium',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View
        style={{
          width: Dimensions.get('screen').width,
          backgroundColor: '#FFFCF5',
          paddingHorizontal: 15,
          paddingBottom: 15,
        }}>
        <CustomRoundedBlackBtn
          text={props.label}
          getClick={() => {
            props.getDoneClick();
          }}
        />
      </View>
    </View>
  );
};

export default CustomKeyboard;
