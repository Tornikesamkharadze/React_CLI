/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';

const CustomSucAlert = props => {
  return (
    <Modal
      visible={props.isVisible}
      transparent={true}
      statusBarTranslucent
      animationType={'fade'}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: 60,
              width: '90%',
              backgroundColor: 'white',
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
            source={require('../../assets/images/icon_success_banner.png')}
          />
          <Image
            style={{
              height: 55,
              width: 55,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              position: 'absolute',
              zIndex: 99,
              top: 30,
            }}
            source={require('../../assets/images/icon_green_tick.png')}
          />
          <View
            style={{
              backgroundColor: 'white',
              width: '90%',
              paddingTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}>
            <Text
              style={{
                color: '#101010',
                fontSize: 22,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              {props.alertText}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.hideAlert();
              }}
              style={{
                backgroundColor: 'black',
                paddingHorizontal: 60,
                paddingVertical: 13,
                borderRadius: 8,
                marginBottom: 20,
                marginTop: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Asap-Medium',
                  fontWeight: '500',
                  fontSize: 15,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomSucAlert;
