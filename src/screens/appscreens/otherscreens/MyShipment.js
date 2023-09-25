/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../../utils/Axiosinstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import moment from 'moment';

const MyShipment = ({navigation, route}) => {
  const [list, setList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    getMyShipments(token);
  };

  //notification redirection code starts here
  useEffect(() => {
    if (route?.params?.notificationData) {
      navigation.navigate('ShippingDetails', {
        rate_id: route?.params?.notificationData.rate_id,
      });
    }
  }, []);
  //notification redirection code ends here
  const getMyShipments = token => {
    //   setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.myshipment_list).then(
        ({ok, status, data, problem}) => {
          // setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setList(data.data);
            console.log(JSON.stringify(data.data));
          } else {
            alert(data.message);
          }
        },
      );
    } catch (e) {
      //  setIsLoading(false);
    }
  };

  //navigatin header ui
  navigation.setOptions({
    headerShadowVisible: true, // remove shadow on Android
    headerTitleAlign: 'center',

    headerStyle: {
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
            fontFamily: 'Asap-Medium',
          }}>
          My Shipments
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

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            marginVertical: 10,
            shadowOpacity: 0.1,
            elevation: 0.5,
            backgroundColor: '#F4F4F4',
            paddingVertical: 7,
          }}
          onPress={() => {
            navigation.navigate('ShippingDetails', {
              rate_id: item.rate_id,
            });
          }}>
          <View>
            <Image
              style={{
                height: 40,
                width: 40,
                borderRadius: 60 / 1,
                borderWidth: 0.4,
                borderColor: 'black',
                alignSelf: 'center',
                resizeMode: 'center',
              }}
              source={{uri: item.commodity_image}}
            />
            <Text
              numberOfLines={1}
              style={{
                maxWidth: 100,
                color: '#ffc700',
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
                marginLeft: 2,
                marginTop: 2,
              }}>
              {item.quantity} {item.quantity_unit}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              marginLeft: 10,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
                color: '#101010',
                lineHeight: 20,
              }}>
              {item.shipment_type == 9 ? 'Ship to admin' : 'Ship to me'}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
                color: '#626262',
                lineHeight: 20,
                marginVertical: 2,
              }}>
              {item.status_text}
            </Text>
            {item.shipment_type == 9 ? (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'Asap-Regular',
                  color: '#101010',
                  lineHeight: 20,
                }}>
                ${item.total_amount}
              </Text>
            ) : null}
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Asap-Medium',
              color: '#101010',
              lineHeight: 20,
              marginTop: 3,
            }}>
            {moment(item.created_at).format('MMM DD, YYYY')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <View>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
export default MyShipment;
