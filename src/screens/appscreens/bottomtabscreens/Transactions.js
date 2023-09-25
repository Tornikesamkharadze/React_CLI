/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import React from 'react';
import {useAuth} from '../../../authContext/AuthContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../widgets/customalert/Loader';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import Axiosinstance from '../../../utils/Axiosinstance';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import moment from 'moment';
import {LinearTextGradient} from 'react-native-text-gradient';
import GradientText from '../../../widgets/GradienText';

export default function Transactions({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState();

  const [modalVisibleTypeThree, setModalVisibleTypeThree] = useState(false);
  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [clickedItemData, setClickedItemData] = useState({});

  const [list, setList] = useState([]);
  const [itemId, setItemId] = useState();

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');

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
  const auth = useAuth();
  const storeData = async value => {
    try {
      await AsyncStorage.setItem('token', value);
      signOut();
    } catch (e) {}
  };

  const signOut = () => {
    auth.signOut();
  };

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(userData));

    setAccessToken(token);

    transactionList(token);
  };

  // api call
  const transactionList = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.transactionList).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            console.log(JSON.stringify(data.data));
            setList(data.data);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  const logout = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.logout).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            storeData('');
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  /*
  item.transaction_type == 2 ? (
                  //  { item.title.split('.')}
                //  const x = newAmount.split('.');
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'Asap-Medium',
                      color: '#101010',
                      lineHeight: 22,
                    }}>
                    {item.title.replace(item.receiver_name, '').trim()}
                    <Text
                      numberOfLines={1}
                      style={{
                        maxWidth: 100,
                        color: '#FF8F00',
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                      }}>
                      {' ' + item.receiver_name}
                    </Text>
                  </Text>
                ) :
  
  */

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
            alignItems: 'center',
            marginVertical: 15,
          }}
          onPress={() => {
            setItemId(item.id);
            setClickedItemData(item);
            setModalVisibleTypeThree(true);
            console.log(JSON.stringify(item));
          }}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 60 / 1,
              borderWidth: 1,
              borderColor: 'black',
              alignSelf: 'center',
              resizeMode: 'center',
            }}
            source={{uri: item.transaction_icon}}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={4}
                style={{
                  lineHeight: 20,
                  fontSize: 15,
                  fontWeight: '600',
                  fontFamily: 'Asap-Medium',
                  color: '#FF8F00',
                }}>
                {item.transaction_type == 2 ? (
                  <>
                    <Text
                      //  numberOfLines={3}
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                        color: '#101010',
                        lineHeight: 20,
                      }}>
                      {item.title.split(item.receiver_name)[0]}
                      <Text
                        //  numberOfLines={2}
                        style={{
                          maxWidth: 100,
                          color: '#ffc700',
                          fontSize: 15,
                          fontWeight: '600',
                          fontFamily: 'Asap-Medium',
                        }}>
                        {item.receiver_name}
                        {/* <View style={{flexDirection: 'row'}}> */}
                        {/* <GradientText
                          numberOfLines={1}
                          style={{
                            maxWidth: 100,
                            //  color: '#FF8F00',
                            fontSize: 15,
                            // fontWeight: '600',
                            fontFamily: 'Asap-Medium',
                          }}>
                          {item.receiver_name}
                        </GradientText> */}
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '600',
                            fontFamily: 'Asap-Medium',
                            color: '#101010',
                            lineHeight: 20,
                          }}>
                          {item.title.split(item.receiver_name)[1]}
                        </Text>
                        {/* </View> */}
                      </Text>
                    </Text>
                    {/* <Text
                      numberOfLines={1}
                      style={{
                        maxWidth: 100,
                        color: '#FF8F00',
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                      }}>
                      {' ' + item.receiver_name}
                    </Text> */}
                  </>
                ) : item.transaction_type == 3 ? (
                  //  { item.title.split('.')}
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'Asap-Medium',
                      color: '#101010',
                      lineHeight: 20,
                    }}>
                    {item.title.replace(item.sender_name, '').trim()}
                    {/* <GradientText
                      numberOfLines={1}
                      style={{
                        //  maxWidth: 100,
                        //  color: '#FF8F00',
                        fontSize: 15,
                        // fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                      }}>
                      {' ' + item.sender_name}
                    </GradientText> */}
                    <Text
                      numberOfLines={1}
                      style={{
                        maxWidth: 100,
                        color: '#ffc700',
                        fontSize: 15,
                        fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                      }}>
                      {' ' + item.sender_name}
                    </Text>
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      fontFamily: 'Asap-Medium',
                      color: '#101010',
                      lineHeight: 20,
                    }}>
                    {item.title}{' '}
                  </Text>
                )}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 1,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 11,
                  lineHeight: 11,
                  fontWeight: '500',
                  fontFamily: 'Asap-Medium',
                }}>
                {moment(item.transaction_date).format('MMM DD, YYYY')}
              </Text>
            </View>
          </View>

          {item.transaction_type === 1 ? (
            // <GradientText
            //   numberOfLines={1}
            //   style={{
            //     fontSize: 15,
            //     fontWeight: '600',
            //     fontFamily: 'Asap-Medium',
            //     alignSelf: 'flex-end',
            //   }}>
            //   {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
            //   {item.cash_with_fee ? item.cash_with_fee : item.commodity_amount}
            // </GradientText>
            <Text
              numberOfLines={1}
              style={{
                color: '#ffc700',
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
              {item.cash_with_fee ? item.cash_with_fee : item.commodity_amount}
            </Text>
          ) : item.transaction_type === 5 || item.transaction_type === 6 ? (
            // <GradientText
            //   numberOfLines={1}
            //   style={{
            //     fontSize: 15,
            //     fontWeight: '600',
            //     fontFamily: 'Asap-Medium',
            //     alignSelf: 'flex-end',
            //   }}>
            //   {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
            //   {item.cash_with_fee ? item.cash_with_fee : item.commodity_amount}
            // </GradientText>

            <Text
              numberOfLines={1}
              style={{
                color: '#ffc700',
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
              {item.cash_with_fee ? item.cash_with_fee : item.commodity_amount}
            </Text>
          ) : item.transaction_type === 7 ? (
            <GradientText
              numberOfLines={1}
              style={{
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
                alignSelf: 'flex-end',
              }}>
              {item.cash_unit === 'EUR' ? '€' : '$'}
              {item.cash ? item.cash : item.commodity_amount}
            </GradientText>
          ) : (
            // <GradientText
            //   numberOfLines={1}
            //   style={{
            //     fontSize: 15,
            //     fontWeight: '600',
            //     fontFamily: 'Asap-Medium',
            //     alignSelf: 'flex-end',
            //   }}>
            //   {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
            //   {item.commodity_amount ? item.commodity_amount : '0'}
            // </GradientText>
            <Text
              numberOfLines={1}
              style={{
                color: '#ffc700',
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              {item.commodity_amount_unit === 'EUR' ? '€' : '$'}
              {item.commodity_amount ? item.commodity_amount : '0'}
            </Text>
          )}
        </TouchableOpacity>

        {/* {index !== data.length - 1 ? (
          <View
            style={{
              height: 0.5,
              backgroundColor: '#D9D9D9',
              width: '100%',
            }}
          />
        ) : (
          <View />
        )} */}
      </View>
    );
  };

  //navigatin header ui
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
          Transactions
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
            height: 33,
            width: 33,
            marginLeft: 15,
            borderRadius: 33 / 1,
            borderWidth: 1,
            borderColor: '#4545E0',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('MyProfile');
          }}>
          <Image
            style={{
              alignSelf: 'center',
              height: 32,
              width: 32,
              //  marginLeft: 15,
              resizeMode: 'contain',
              borderRadius: 30 / 1,
              //  borderWidth: 1,
              //  borderColor: '#A5A5A5',
            }}
            source={{uri: userData?.profile_img}}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => (
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
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
          onPress={() => {
            navigation.navigate('Notification');
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/notification_ico.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            //  backgroundColor: '#5b5b5b',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Do you want to logout?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => logout()},
              ],
              {cancelable: false},
            );
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/logout_ico.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}>
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <StatusBar
        backgroundColor={'#FFFFFF'}
        animated={true}
        barStyle="dark-content"
      />
      <SafeAreaView />

      <Modal
        visible={modalVisibleTypeThree}
        transparent={true}
        statusBarTranslucent
        animationType={'fade'}>
        <View
          style={{
            flex: 1,
            backgroundColor:
              Platform.OS === 'android'
                ? 'rgba(00, 00, 00, 0.2)'
                : 'rgba(00, 00, 00, 0.6)',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              marginHorizontal: 18,
              paddingBottom: 10,
              marginTop: Platform.OS === 'android' ? 50 : 35,
            }}>
            <View
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 15,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#000000',
                  fontFamily: 'Asap-SemiBold',
                }}>
                Transaction Details
              </Text>
              <TouchableOpacity
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 15,
                }}
                onPress={() => {
                  //  alert(itemId)
                  setModalVisibleTypeThree(!modalVisibleTypeThree);
                }}>
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/icon_close.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 0.6,
                backgroundColor: '#E1E1E1',
                marginBottom: 5,
              }}
            />
            <View
              style={{
                marginVertical: 15,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  fontFamily: 'Asap-Regular',
                  color: '#626262',
                }}>
                {clickedItemData.transaction_type === 1 ||
                clickedItemData.transaction_type === 2 ||
                clickedItemData.transaction_type === 3
                  ? 'Total Amount'
                  : 'Total Amount'}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 25,
                  fontFamily: 'Asap-SemiBold',
                  color: '#101010',
                  marginTop: 5,
                }}>
                {clickedItemData.transaction_type === 6
                  ? clickedItemData.cash_unit === 'EUR'
                    ? '€' + clickedItemData.cash_with_fee
                    : '$' + clickedItemData.cash_with_fee
                  : clickedItemData.transaction_type === 3 ||
                    clickedItemData.transaction_type === 8 ||
                    clickedItemData.transaction_type === 9
                  ? clickedItemData.commodity_amount_unit === 'EUR'
                    ? '€' + clickedItemData.commodity_amount
                    : '$' + clickedItemData.commodity_amount
                  : clickedItemData.transaction_type === 5
                  ? clickedItemData.cash_unit === 'EUR'
                    ? '€' + clickedItemData.cash_with_fee
                    : '$' + clickedItemData.cash_with_fee
                  : clickedItemData.transaction_type === 2
                  ? clickedItemData.commodity_amount_unit === 'EUR'
                    ? '€' + clickedItemData.commodity_amount
                    : '$' + clickedItemData.commodity_amount
                  : clickedItemData.transaction_type === 1
                  ? clickedItemData.commodity_amount_unit === 'EUR'
                    ? clickedItemData.cash_with_fee
                      ? '€' + clickedItemData.cash_with_fee
                      : '€' + clickedItemData.commodity_amount
                    : clickedItemData.cash_with_fee
                    ? '$' + clickedItemData.cash_with_fee
                    : '$' + clickedItemData.commodity_amount
                  : clickedItemData.cash_unit === 'EUR'
                  ? '€' + clickedItemData.cash
                  : '$' + clickedItemData.cash}
              </Text>
              {clickedItemData.payment_gateway_fee ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 16,
                        fontFamily: 'Asap-Regular',
                        color: '#626262',
                      }}>
                      Processing Fee
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontFamily: 'Asap-SemiBold',
                        color: '#101010',
                        marginTop: 5,
                      }}>
                      {clickedItemData.commodity_amount_unit === 'EUR'
                        ? '€' + clickedItemData.payment_gateway_fee
                        : '$' + clickedItemData.payment_gateway_fee}
                    </Text>
                  </View>
                </>
              ) : null}
              {clickedItemData?.admin_brokerage ? (
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 16,
                      fontFamily: 'Asap-Regular',
                      color: '#626262',
                    }}>
                    Admin Fee
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 18,
                      fontFamily: 'Asap-SemiBold',
                      color: '#101010',
                      marginTop: 5,
                    }}>
                    {clickedItemData.commodity_amount_unit === 'EUR'
                      ? '€' + clickedItemData.admin_brokerage
                      : '$' + clickedItemData.admin_brokerage}
                  </Text>
                  {clickedItemData.transaction_type === 2 ? (
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 10,
                        fontFamily: 'Asap-Regular',
                        color: '#626262',
                      }}>
                      {'(Deducted from vault)'}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              {clickedItemData.payment_gateway_fee ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 16,
                        fontFamily: 'Asap-Regular',
                        color: '#626262',
                      }}>
                      Amount
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 18,
                        fontFamily: 'Asap-SemiBold',
                        color: '#101010',
                        marginTop: 5,
                      }}>
                      {clickedItemData.cash_unit === 'EUR' ||
                      clickedItemData.commodity_amount_unit === 'EUR'
                        ? clickedItemData.commodity_amount
                          ? '€' + clickedItemData.commodity_amount
                          : '€' + clickedItemData.cash
                        : clickedItemData.commodity_amount
                        ? '$' + clickedItemData.commodity_amount
                        : '$' + clickedItemData.cash}
                    </Text>
                  </View>
                </>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginVertical: 15,
                marginHorizontal: 10,
                borderRadius: 7,
                borderWidth: 1,
                borderColor: '#F6F6F6',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#626262',
                    fontFamily: 'Asap-Regular',
                    fontSize: 12,
                  }}>
                  Date & Time
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    alignSelf: 'center',
                    color: '#202020',
                    fontFamily: 'Asap-SemiBold',
                    fontSize: 13,
                  }}>
                  {moment(clickedItemData.transaction_date).format(
                    'DD/MM/YYYY, hh:mm a',
                  )}
                </Text>
              </View>
              <View
                style={{height: '100%', width: 1, backgroundColor: '#F6F6F6'}}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#626262',
                    fontFamily: 'Asap-Regular',
                    fontSize: 12,
                  }}>
                  {clickedItemData.transaction_type === 1 ||
                  clickedItemData.transaction_type === 2 ||
                  clickedItemData.transaction_type === 3 ||
                  clickedItemData.transaction_type === 8 ||
                  clickedItemData.transaction_type === 9
                    ? 'Unit'
                    : clickedItemData.transaction_type === 7
                    ? 'Convert to Cash'
                    : 'Payment Method'}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    alignSelf: 'center',
                    color: '#202020',
                    fontFamily: 'Asap-SemiBold',
                    fontSize: 13,
                  }}>
                  {clickedItemData.transaction_type === 1 ||
                  clickedItemData.transaction_type === 2 ||
                  clickedItemData.transaction_type === 3 ||
                  clickedItemData.transaction_type === 8 ||
                  clickedItemData.transaction_type === 9
                    ? clickedItemData.quantity +
                      ' ' +
                      clickedItemData.quantity_unit
                    : clickedItemData.transaction_type === 7
                    ? clickedItemData.cash_unit === 'EUR'
                      ? '€' + clickedItemData.cash
                      : '$' + clickedItemData.cash
                    : clickedItemData.transaction_type === 6
                    ? 'Bank Transfer'
                    : clickedItemData.transaction_type === 5
                    ? 'Credit Card'
                    : '-'}
                </Text>
              </View>
            </View>

            {clickedItemData.transaction_type === 1 ||
            clickedItemData.transaction_type === 2 ||
            clickedItemData.transaction_type === 3 ||
            clickedItemData.transaction_type === 8 ||
            clickedItemData.transaction_type === 9 ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 15,
                  paddingVertical: 10,
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  marginHorizontal: 10,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: '#F6F6F6',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#626262',
                    fontFamily: 'Asap-Regular',
                    fontSize: 13,
                  }}>
                  Commodity Type
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    alignSelf: 'center',
                    color: '#202020',
                    fontFamily: 'Asap-SemiBold',
                    fontSize: 16,
                  }}>
                  {clickedItemData.commodity_name.charAt(0).toUpperCase() +
                    clickedItemData.commodity_name.slice(1)}
                </Text>
              </View>
            ) : null}
            {clickedItemData.transaction_type === 3 ||
            clickedItemData.transaction_type === 2 ? (
              <View
                style={{
                  marginBottom: 15,
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#626262',
                    fontFamily: 'Asap-Regular',
                    fontSize: 12,
                  }}>
                  {clickedItemData.transaction_type === 2
                    ? 'Receiver Info'
                    : 'Receive From'}
                </Text>
                <Image
                  style={{
                    marginTop: 10,
                    height: 57,
                    width: 57,
                    borderRadius: 57 / 1,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                  }}
                  source={{
                    uri:
                      clickedItemData.transaction_type === 2
                        ? clickedItemData.receiver_profile_img
                        : clickedItemData.sender_profile_img,
                  }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    alignSelf: 'center',
                    color: '#000000',
                    fontFamily: 'Asap-Regular',
                    fontSize: 14,
                  }}>
                  {clickedItemData.transaction_type === 2
                    ? clickedItemData.receiver_name
                    : clickedItemData.sender_name}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    alignSelf: 'center',
                    color: '#626262',
                    fontFamily: 'Asap-Regular',
                    fontSize: 12,
                  }}>
                  {clickedItemData.transaction_type === 2
                    ? clickedItemData.receiver_email
                    : clickedItemData.sender_email}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      {list.length !== 0 ? (
        <View>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            bounces={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              alignSelf: 'center',
              width: '90%',
              height: '35%',
              resizeMode: 'contain',
              // backgroundColor: 'red',
            }}
            source={require('../../../assets/images/no_transaction_icon.png')}
          />
          <Text
            style={{
              marginTop: 15,
              fontSize: 18,
              fontFamily: 'Asap-Medium',
              color: 'black',
              alignSelf: 'center',
            }}>
            No Transactions Yet!
          </Text>
        </View>
      )}
      <Loader isVisible={isLoading} />
    </View>
  );
}
