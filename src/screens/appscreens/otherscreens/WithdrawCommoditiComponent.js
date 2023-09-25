/* eslint-disable react-native/no-inline-styles */
import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';

const WithdrawCommoditiComponent = ({navigation, from}) => {
  const [isConvertIntoCash, setIsConvertIntoCash] = useState(true);

  // const getClick = () => {
  //   //alert('Under Development');
  //   if (isConvertIntoCash) {
  //     navigation.navigate('AddCommoditiesScreen', {from: from});
  //   } else {
  //     navigation.navigate('AddCommoditiesScreen', {from: 'PHYSICAL_DELIVERY'});
  //   }
  // };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
      }}>
      <View>
        <View
          style={{
            flex: 1,
            marginHorizontal: 30,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'rgba(16, 16, 16, 1)',
                fontFamily: 'Asap-Bold',
                fontWeight: '700',
                marginTop: 20,
                textAlign: 'center',
              }}>
              Convert your commodities into cash!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#626262',
                fontFamily: 'Asap-Regular',
                fontWeight: '400',
                marginTop: 10,
                textAlign: 'center',
                marginHorizontal: 10,
                lineHeight: 20,
              }}>
              Convert the commodities you have in your vault for cash instantly
              to transfer into your bank.
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WithdrawCommodity', {from: from});
                // navigation.navigate('AddCommoditiesScreen', {from: from});
              }}
              style={{
                height: 165,
                width: 165,
                backgroundColor: '#EEEEEE',
                borderRadius: 10,
                marginVertical: 20,
                paddingVertical: 20,
              }}>
              <Image
                style={{
                  height: 70,
                  width: 95,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={require('../../../assets/images/ico_dollar.png')}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                Convert into cash and transfer to bank.
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'rgba(16, 16, 16, 1)',
                fontFamily: 'Asap-Bold',
                fontWeight: '700',
                marginTop: 20,
                textAlign: 'center',
              }}>
              Take physical delivery!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#626262',
                fontFamily: 'Asap-Regular',
                fontWeight: '400',
                marginTop: 10,
                textAlign: 'center',
                marginHorizontal: 10,
                lineHeight: 20,
              }}>
              You can have any commodities shipped to you so you can have the
              actual physical commodity.
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddCommoditiesScreen', {
                  from: 'PHYSICAL_DELIVERY',
                  backTo: 'vault',
                });
              }}
              style={{
                height: 165,
                width: 165,
                backgroundColor: '#EEEEEE',
                borderRadius: 10,
                marginVertical: 20,
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}>
              <Image
                style={{
                  height: 70,
                  width: 100,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={require('../../../assets/images/icon_delivery_box.png')}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  textAlign: 'center',
                  marginTop: 25,
                }}>
                Physical Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            marginVertical: 15,
          }}>
          <CustomRoundedBlackBtn text={'CONTINUE'} getClick={getClick} />
        </View> */}
      </View>
    </View>
  );
};
export default WithdrawCommoditiComponent;
