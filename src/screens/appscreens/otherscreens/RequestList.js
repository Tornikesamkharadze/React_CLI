/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';

import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import Axiosinstance from '../../../utils/Axiosinstance';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import Loader from '../../../widgets/customalert/Loader';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import moment from 'moment';
import {NotificationDataContext} from '../../../navigation/StackSwitcher';
import messaging from '@react-native-firebase/messaging';

const Request = ({route}) => {
  const notification = useContext(NotificationDataContext);

  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [requestListData, setRequestListData] = useState([]);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [isSessionExpired, setisSessionExpired] = useState(false);

  const showCustomAlert = text => {
    setTimeout(() => {
      setCustomAlertText(text);
    }, 500);
    setTimeout(() => {
      setCustomAlertVisible(true);
    }, 1000);
  };
  const hideCustomAlert = () => {
    setCustomAlertVisible(false);
  };

  navigation.setOptions({
    headerShadowVisible: false, // remove shadow on Android
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: 'white',
      height: Platform.OS === 'android' ? 80 : 120,
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
    headerTitle: () => (
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: '600',
            // lineHeight: 20,
            fontFamily: 'Asap-Medium',
          }}>
          Request
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
            height: 30,
            width: 30,
            backgroundColor: '#333333',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 15,
              width: 15,
              resizeMode: 'cover',
            }}
            source={require('../../../assets/images/icon_back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => null,
  });
  useFocusEffect(
    useCallback(() => {
      if (notification) {
        notification.changeNotificationData();
      }
      getToken();
      setIsLoading(false);
    }, []),
  );
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.notification_type === 'request_commodity') {
        getToken();
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');

    setAccessToken(token);
    getRequestList(token);
  };
  //Api calls
  const getRequestList = async token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.requestList).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            console.log(JSON.stringify(data.data));
            setRequestListData(data.data);
          } else {
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  const requestAction = async (id, action) => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('request_id', id);
      formdata.append('action', action);
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.requestAction, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            getRequestList(accessToken);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  const apiCallForAdminFeeCalculation = async (
    weightUnit,
    currencyUnit,
    conversionType,
    value,
    commodityType,
    request_id,
  ) => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('weight_unit', weightUnit);
      formdata.append('currency_unit', currencyUnit);
      formdata.append('conversion_type', conversionType);
      formdata.append('value', value);
      formdata.append('commodity_type', commodityType);

      console.log(JSON.stringify(formdata));
      Axiosinstance.setHeader('access-token', accessToken);

      Axiosinstance.post(ApiEndPoint.calculation, formdata).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setisSessionExpired(true);
            setIsLoading(false);
          } else if (ok) {
            setIsLoading(false);
            navigation.navigate('CheckPin', {
              from: 'RequestAction',
              requestId: request_id,
              action: 1,
              adminFee: data.data.admin_commission,
              formattedAdminCommission: data.data.formatted_admin_commission,
            });
          } else {
            showCustomAlert(data.message);
            setIsLoading(false);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: 'white',
        // paddingHorizontal: 15,
      }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <SafeAreaView style={{backgroundColor: 'white'}} />
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <Loader isVisible={false} />
      {requestListData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={requestListData}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginHorizontal: 15,
                  marginVertical: 10,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  padding: 12,
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 15,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontWeight: '800',
                      fontFamily: 'Asap-Medium',
                      lineHeight: 20,
                    }}>
                    {item.requester_name}{' '}
                  </Text>
                  {item.message.split(item.requester_name + ' ')}
                </Text>
                <Text
                  style={{
                    color: '#828282',
                    fontSize: 12,
                    fontWeight: '400',
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                    marginBottom: 8,
                  }}>
                  {/* {item.requested_at} */}
                  {moment
                    .utc(item.requested_at)
                    .local()
                    .startOf('seconds')
                    .fromNow()}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      apiCallForAdminFeeCalculation(
                        item.weight_unit,
                        item.currency_unit,
                        item.conversion_type,
                        item.value,
                        item.commodity_type,
                        item.request_id,
                      );
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: '#11B736',
                      borderRadius: 4,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontWeight: '500',
                        fontFamily: 'Asap-Medium',
                      }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Alert',
                        'Do you want to decline this request?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'Ok',
                            onPress: () => requestAction(item.request_id, 2),
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 0.5,
                      borderColor: '#A5A5A5',
                      borderRadius: 4,
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        color: '#A5A5A5',
                        fontSize: 10,
                        fontWeight: '500',
                        fontFamily: 'Asap-Medium',
                      }}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          extraData={extraData}
        />
      ) : (
        <Text
          style={{
            color: '#303030',
            fontSize: 20,
            fontWeight: '600',
            fontFamily: 'Asap-Medium',
            alignSelf: 'center',
            marginTop: 30,
          }}>
          No Request Found
        </Text>
      )}
    </View>
  );
};

export default Request;
