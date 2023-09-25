import {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../../utils/Axiosinstance';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import Loader from '../../../widgets/customalert/Loader';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';

import {Dimensions} from 'react-native';
import {useHasSystemFeature} from 'react-native-device-info';
import ApiEndPoint from '../../../utils/ApiEndPoint';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Notification = ({navigation}) => {
  const [notificationList, setNotificationList] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setisSessionExpired] = useState(false);

  const DATA = [
    {
      id: '1',
      description:
        'Lorem Ipsum is simply dummy text of the fdfdg fgfg ff printing and typesetting industry.',
    },
    {
      id: '1',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      id: '2',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
      id: '3',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );

  // get Token from Async-Storage
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    getNotificationList(token);
  };

  // Get Notification List from api
  const getNotificationList = token => {
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.notification_list).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setNotificationList(data.data);
          } else {
          }
        },
      );
    } catch {}
  };

  /*
  ""data"": [
        {
            ""id"": 1,
            ""notification_type"": ""request_commodity"",
            ""action_user_name"": ""Pawan Sisodiya"",
            ""description"": ""Pawan Sisodiya sent request to you for 2gram Rhodium"",
            ""is_read"": 0,
            ""created_at"": ""2023-03-02T10:05:48.000Z"",
            ""reference_id"": 1,
            ""sender_profile_img"": ""http://goldapp.s3.us-east-1.amazonaws.com/development/avatars/hWKf74zDJ4.webp""
        }
    ]
  */

  const readNotification = id => {
    setIsLoading(true);
    try {
      Axiosinstance.post(ApiEndPoint.read_status, {
        notification_id: id,
      }).then(({ok, data, status, problem}) => {
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          marginTop: index === 0 ? 10 : 0,
          backgroundColor:
            item.is_read == 0 ? 'rgba(255, 247, 230, 1)' : 'white',
        }}>
        <TouchableOpacity
          onPress={() => {
            readNotification(item.id);
            if (item.notification_type == 'request_commodity') {
              navigation.navigate('Request');
            }
            if (item.notification_type == 'send_commodity') {
              navigation.navigate('Transactions');
            }
            if (item.notification_type == 'accept_commodity_request') {
              navigation.navigate('Transactions');
            }
            if (item.notification_type == 'cancel_commodity_request') {
              navigation.navigate('HomeScreen');
            }
          }}
          style={{
            flexDirection: 'row',
            //  width: '100%',
            marginVertical: 5,
            paddingVertical: 10,
            marginHorizontal: 5,
          }}
          activeOpacity={0.3}>
          <Image
            style={{
              height: 55,
              width: 55,
              marginRight: 10,
              borderRadius: 55 / 1,
              borderWidth: item.is_read == 0 ? 1 : 0,
              borderColor: '#FFAD00',
              resizeMode: 'contain',
              alignSelf: 'flex-start',
            }}
            source={{uri: item.sender_profile_img}}
            //  source={require('../../../assets/images/icon_inactive_Gold.png')}
          />

          <View
            style={{
              width: '85%',
              paddingRight: 10,
              //  paddingRight: 15,
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  fontFamily: 'Asap-Medium',
                  color: '#444444',
                }}>
                {item.description}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                //  paddingLeft: 5,
                marginTop: 0,
                //  alignItems: "center",
              }}>
              <Text
                style={{
                  color: '#828282',
                  fontFamily: 'Asap-Regular',
                  fontSize: 12,
                }}>
                {/* {moment
                  .utc(item.created_at)
                  .local()
                  .startOf('seconds')
                  .fromNow()} */}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {index !== notificationList.length - 1 ? (
          <View
            style={{
              height: 0.6,
              backgroundColor: '#D9D9D9',
            }}
          />
        ) : (
          <View />
        )}
      </View>
    );
  };

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
          Notification
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
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Loader isVisible={isLoading} />
      <SessionExpiredModel modalvisible={isSessionExpired} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      {notificationList?.length !== 0 ? (
        <View>
          <FlatList
            data={notificationList}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            bounces={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Asap-SemiBold',
              alignSelf: 'center',
              color: 'black',
            }}>
            No Notification Found!!!
          </Text>
        </View>
      )}
    </View>
  );
};
export default Notification;
