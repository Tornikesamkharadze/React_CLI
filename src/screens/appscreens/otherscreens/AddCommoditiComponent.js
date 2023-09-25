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

const AddCommoditiComponent = ({route, navigation, from}) => {
  const [isUseCash, setIsUseCash] = useState(true);

  // const getClick = () => {
  //   //alert(JSON.stringify(from));
  //   if (isUseCash) {
  //     navigation.navigate('AddCommoditiesScreen', {from: from});
  //   } else {
  //     navigation.navigate('AddCommoditiesScreen', {
  //       from: 'SHIP_COMMODITY_TO_GOLD_APP',
  //     });
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
              Fund your Account!
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
              You can purchase commodities for use in the app.
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddCommoditiesScreen', {
                  from: from,
                  backTo: 'vault',
                });
              }}
              style={{
                height: 165,
                width: 165,
                borderRadius: 10,
                marginVertical: 20,
                paddingVertical: 20,
                backgroundColor: '#EEEEEE',
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
                  alignSelf: 'center',
                  marginTop: 25,
                }}>
                Use Cash
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
              Ship your precious metals to us!
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
              You can physically send your commodities or precious metals for
              use right here in the gold app.
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddCommoditiesScreen', {
                  from: 'SHIP_COMMODITY_TO_GOLD_APP',
                  backTo: 'vault',
                });
              }}
              style={{
                height: 165,
                width: 165,
                borderRadius: 10,
                marginVertical: 20,
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: '#EEEEEE',
              }}>
              <Image
                style={{
                  height: 70,
                  width: 100,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={require('../../../assets/images/ship_icon.png')}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  textAlign: 'center',
                  marginTop: 25,
                }}>
                Ship Commodity To Gold App
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
export default AddCommoditiComponent;
