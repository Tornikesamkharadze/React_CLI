/* eslint-disable react-native/no-inline-styles */
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../../authContext/AuthContexts';
import Axiosinstance from '../../../utils/Axiosinstance';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddCommoditiComponent from './AddCommoditiComponent';
import WithdrawCommoditiComponent from './WithdrawCommoditiComponent';
import ApiEndPoint from '../../../utils/ApiEndPoint';

import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Conversions = ({navigation, route}) => {
  const [addCommodityVisible, setAddCommodityVisible] = useState(true);
  const [userData, setUserData] = useState();
  const [OFFSET, setOffset] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        const userData = await AsyncStorage.getItem('userData');
        setUserData(JSON.parse(userData));
      };
      getUserData();
    }, []),
  );

  //navigatin header ui
  navigation.setOptions({
    headerShadowVisible: true, // remove shadow on Android
    headerTitleAlign: 'center',

    headerStyle: {
      //   backgroundColor: 'white',
      height: Platform.OS === 'android' ? 80 : 120,
      alignItems: 'center',
      elevation: 5, // remove shadow on Android
      shadowOpacity: 5, // remove shadow on iOS
      borderBottomWidth: 5,
      shadowColor: 'rgba(255,255,255,0.1)',
      shadowColor: 'transparent',
    },
    headerTitle: () => (
      <View
        style={{
          height: 28,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
            alignItems: 'center',
            // lineHeight: 20,
            fontFamily: 'Asap-Medium',
          }}>
          Conversions
        </Text>
      </View>
    ),
    headerLeft: () => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            height: 28,
            width: 28,
            backgroundColor: '#333333',
            borderRadius: 15,
            justifyContent: 'center',
            // alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 14,
              width: 14,
              resizeMode: 'cover',
              alignSelf: 'center',
            }}
            source={require('../../../assets/images/icon_back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => null,
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={{
          alignSelf: 'center',
          height: 50,
          width: '90%',
          borderWidth: 1,
          borderColor: '#D3D3D3',
          borderRadius: 10,
          flexDirection: 'row',
          backgroundColor: 'white',
          marginTop: 15,
        }}>
        <View
          style={{
            height: 50,
            width: '49%',
            borderLeftRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setAddCommodityVisible(true);
              setOffset(0);
            }}
            style={{
              height: '88%',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontFamily: 'Asap-SemiBold',
                fontWeight: '600',
                color: addCommodityVisible ? '#ffc700' : '#000000',
              }}>
              Add Commodity
            </Text>
          </TouchableOpacity>
          {addCommodityVisible ? (
            <LinearGradient
              style={{
                //  backgroundColor: '#FFAD00',
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
              colors={['#AE8625', '#F7EA8A', '#D2AC47', '#EDC967']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}></LinearGradient>
          ) : (
            <View
              style={{
                backgroundColor: 'white',
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
            />
          )}
        </View>
        <View
          style={{
            height: 20,
            backgroundColor: '#D3D3D3',
            width: 2,
            marginHorizontal: 3,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            height: 50,
            width: '49%',
            borderLeftRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setOffset(0);
              setAddCommodityVisible(false);
            }}
            style={{
              height: '88%',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontFamily: 'Asap-SemiBold',
                fontWeight: '600',
                color: addCommodityVisible ? '#000000' : '#ffc700',
              }}>
              Withdraw Commodity
            </Text>
          </TouchableOpacity>
          {addCommodityVisible ? (
            <View
              style={{
                backgroundColor: 'white',
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
            />
          ) : (
            <LinearGradient
              style={{
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
              colors={['#AE8625', '#F7EA8A', '#D2AC47', '#EDC967']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}></LinearGradient>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {addCommodityVisible ? (
          <AddCommoditiComponent navigation={navigation} from={'CONVERSION'} />
        ) : (
          <WithdrawCommoditiComponent
            navigation={navigation}
            from={'CONVERSIONTOCASH'}
          />
        )}
      </ScrollView>
    </View>
  );
};
export default Conversions;
