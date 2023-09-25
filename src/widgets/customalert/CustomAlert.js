/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';

const CustomAlert = props => {
  useEffect(() => {
    console.log(JSON.stringify(props));
  }, []);
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
          paddingTop: Platform.OS === 'ios' ? 100 : 80,
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 17,
              borderRadius: 60,
              position: 'absolute',
              zIndex: 99,
              top: -50,
            }}>
            <Image
              style={{height: 60, width: 60}}
              source={require('../../assets/images/icon_alert_cross.png')}
            />
          </View>
          <View
            style={{
              backgroundColor: 'white',
              width: '90%',
              paddingTop: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}>
            <Text
              onPress={() => {
                props.hideAlert();
              }}
              style={{
                color: '#101010',
                fontSize: 22,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              Uh Oh!
            </Text>
            <Text
              style={{
                marginVertical: 20,
                marginHorizontal: 30,
                color: '#626262',
                fontSize: 14,
                fontWeight: '400',
                fontFamily: 'Asap-Medium',
                textAlign: 'center',
              }}>
              {props.alertText}
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.hideAlert();
              }}
              style={{
                width: '100%',
                height: 50,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                backgroundColor: '#F45353',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Asap-Medium',
                }}>
                OKAY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
