/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, {useContext} from 'react';
import {useAuth} from '../../../authContext/AuthContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../widgets/customalert/Loader';
import {useState} from 'react';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import Axiosinstance from '../../../utils/Axiosinstance';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {NotificationDataContext} from '../../../navigation/StackSwitcher';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({navigation}) => {
  const notification = useContext(NotificationDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState();
  const [isComVisible, setIsComVisible] = useState(false);
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

  const [commodityRatesState, setCommodityRatesState] = useState({
    commodity_rates: [],
  });

  //navigation header ui
  navigation.setOptions({
    headerStyle: {
      height: 0,
    },
  });
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

  useEffect(() => {
    if (notification?.notificationData) {
      //recieved commodity
      if (
        notification?.notificationData?.notification_type === 'send_commodity'
      ) {
        setTimeout(() => {
          navigation.navigate('VaultScreen');
        }, 1000);
      }
      //request get commodity
      else if (
        notification?.notificationData?.notification_type ===
        'request_commodity'
      ) {
        setTimeout(() => {
          // navigation.navigate('Request');
          navigation.navigate('MyProfile', {
            toScreen: 'request',
          });
        }, 1000);
      }
      //request accepted
      else if (
        notification?.notificationData?.notification_type ===
        'accept_commodity_request'
      ) {
        setTimeout(() => {
          navigation.navigate('VaultScreen');
        }, 1000);
      }
      //request cancelled
      else if (
        notification?.notificationData?.notification_type ===
        'cancel_commodity_request'
      ) {
      }
      //commodity shipping
      else if (
        notification?.notificationData?.notification_type ===
        'shipment_estimated'
      ) {
        setTimeout(() => {
          //navigation.navigate('MyShipment');
          navigation.navigate('MyProfile', {
            toScreen: 'myShipment',
            notificationData: notification?.notificationData,
          });
        }, 1000);
      }
    }
  }, [notification]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    setTimeout(() => {
      setUserData(JSON.parse(userData));
    }, 2000);
    console.log(JSON.parse(userData));
    setAccessToken(token);
    commodityRates(token);
  };

  const [comId, setComId] = useState();
  const [comType, setComType] = useState('');
  const [comImg, setComImg] = useState();
  const [comPrice, setComPrice] = useState();
  const [comChange, setComChange] = useState();
  const [comChangePercent, setComChangePercent] = useState();
  const [comChangeColor, setComChangeColor] = useState();

  const comoRender = ({item, index}) => {
    return (
      <View
        style={{
          marginHorizontal: 15,
        }}>
        <TouchableOpacity
          activeOpacity={index === 0 ? 1 : 0.6}
          onPress={() => {
            if (index !== 0) {
              setComId(item.id);
              setComType(item.name);
              setComImg(item.commodity_img);
              setComPrice(item.rate_per_ounce);
              setComChange(item.change_amount);
              setComChangePercent(item.change_percent);
              setComChangeColor(item.amount_up_down_ind);
              setIsComVisible(true);
            }
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: 12,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: item.commodity_img}}
                style={{height: 25, width: 35, resizeMode: 'contain'}}
              />
              <Text
                style={{
                  color: item.name === 'Commodity' ? 'white' : '#202020',
                  fontFamily: 'Asap-Medium',
                  fontSize: item.name === 'Commodity' ? 16 : 18,
                  fontWeight: item.name === 'Commodity' ? '600' : '600',
                  marginLeft: item.name === 'Commodity' ? -20 : 14,
                }}>
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  width: '100%',
                  color:
                    item.rate_per_ounce === 'Price/Ounce' ? 'white' : '#828282',
                  fontFamily: 'Asap-Medium',
                  fontSize: item.rate_per_ounce === 'Price/Ounce' ? 16 : 15,
                  fontWeight:
                    item.rate_per_ounce === 'Price/Ounce' ? '600' : '400',
                  textAlign: 'center',
                }}>
                {item.rate_per_ounce === 'Price/Ounce'
                  ? 'Price/Ounce'
                  : `$${item.rate_per_ounce}`}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color:
                    item.amount_up_down_ind == 2
                      ? '#EE4D38'
                      : item.amount_up_down_ind == 1
                      ? '#12B736'
                      : item.change_amount === 'Change'
                      ? 'white'
                      : '#828282',
                  fontFamily: 'Asap-Medium',
                  fontSize: item.change_amount === 'Change' ? 16 : 12,
                  fontWeight: item.change_amount === 'Change' ? '600' : '500',
                }}>
                {item.change_amount}{' '}
                {item.change_amount === 'Change(%)'
                  ? ''
                  : `(${item.change_percent}%)`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  //api calls
  const commodityRates = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.commodityRates).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            const item = {
              id: 7,
              commodity_type: '',
              name: 'Commodity',
              icon_image: '',
              rate_per_ounce: 'Price/Ounce',
              rate_per_grain: '',
              rate_per_gram: '',
              change_amount: 'Change',
              change_percent: '',
              change_calculated_from: 'oz',
              amount_up_down_ind: '',
              updated_at: '2023-03-23T09:03:57.000Z',
              last_updated_at: '2023-02-28T12:21:46.000Z',
              commodity_img: '',
            };
            data.data.commodity_rates.splice(0, 0, item);
            setCommodityRatesState(data.data);
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Loader isVisible={isLoading} />
      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <SessionExpiredModel modalvisible={isSessionExpired} />
      <StatusBar
        backgroundColor="transparent"
        animated={false}
        barStyle="dark-content"
        fitsSystemWindows={true}
        translucent={true}
      />
      {/* QR modal */}
      <Modal visible={isComVisible} transparent={true} statusBarTranslucent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 15,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <SafeAreaView />
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 5,
              paddingTop: 5,
              borderRadius: 8,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{height: 15, width: 25}} />
              <TouchableOpacity
                style={{padding: 5, marginRight: 10}}
                onPress={() => {
                  setIsComVisible(false);
                }}>
                <Image
                  source={require('../../../assets/images/icon_close.png')}
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'center',
                marginTop: 0,
              }}>
              <Text
                style={{
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  fontSize: 21,
                  fontWeight: '600',
                }}>
                {comType}
              </Text>
              <Image
                style={{
                  marginVertical: 15,
                  height: 90,
                  width: '25%',
                  resizeMode: 'contain',
                }}
                source={{uri: comImg}}
              />
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    marginRight: 20,
                  }}>
                  <Text
                    style={{
                      color: '#828282',
                      fontFamily: 'Asap-Medium',
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                    Price/Ounce
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#828282',
                      fontFamily: 'Asap-Medium',
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 3,
                    }}>
                    ${comPrice}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 20,
                  }}>
                  <Text
                    style={{
                      color: '#828282',
                      fontFamily: 'Asap-Medium',
                      fontSize: 14,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                    Change(%)
                  </Text>
                  <Text
                    style={{
                      color:
                        comChangeColor == 2
                          ? '#EE4D38'
                          : comChangeColor == 1
                          ? '#12B736'
                          : '#828282',
                      fontFamily: 'Asap-Medium',
                      fontSize: 15,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginTop: 3,
                    }}>
                    {comChange} ({comChangePercent}%)
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 20,
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setIsComVisible(false);
                    navigation.navigate('AddCommoditiesScreen', {
                      commodityId: comId,
                      commodityName: comType,
                      commodityIcon: comImg,
                    });
                  }}>
                  <Image
                    style={{
                      height: 50,
                      width: 80,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/icon_add.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsComVisible(false);
                    navigation.navigate('SendCommoditiesScreen', {
                      commodityId: comId,
                      commodityName: comType,
                      commodityIcon: comImg,
                    });
                  }}>
                  <Image
                    style={{
                      height: 50,
                      width: 80,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/icon_send.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsComVisible(false);
                    navigation.navigate('RequestCommoditiesScreen', {
                      commodityId: comId,
                      commodityName: comType,
                      commodityIcon: comImg,
                    });
                  }}>
                  <Image
                    style={{
                      height: 50,
                      width: 80,
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/icon_request.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {commodityRatesState?.commodity_rates.length !== 0 ? (
        <ImageBackground
          source={require('../../../assets/images/home_back_img.jpeg')}
          style={{
            height: Platform.OS === 'android' ? 150 : 170,
            width: '100%',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 60 : 50,
            }}>
            <View
              style={{
                width: '33%',
              }}>
              <View
                style={{
                  alignSelf: 'flex-start',
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
                      resizeMode: 'contain',
                      borderRadius: 30 / 1,
                    }}
                    source={{uri: userData?.profile_img}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: '33%',
              }}>
              <View>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: 22,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Main
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '33%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
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
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View />
      )}
      <View
        style={{
          marginTop: -48,
        }}>
        {commodityRatesState?.commodity_rates.length !== 0 ? (
          <View>
            <View
              style={{
                marginTop: 0,
              }}>
              <FlatList
                style={{
                  height: windowHeight * 0.4,
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={commodityRatesState?.commodity_rates}
                renderItem={comoRender}
              />
            </View>
            <View
              style={{
                width: windowWidth,
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 15,
                marginTop: windowHeight * 0.01,
                marginBottom: 10,
              }}>
              <View
                style={{
                  flex: 1,
                  width: windowWidth * 0.5,
                }}>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: '92%',
                  }}
                  onPress={() => {
                    navigation.navigate('AddCommoditiesScreen');
                  }}>
                  <Image
                    source={require('../../../assets/images/icon_addbtn.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginVertical: 10, height: 50, width: '92%'}}
                  onPress={() => {
                    navigation.navigate('SendCommoditiesScreen');
                  }}>
                  <Image
                    source={require('../../../assets/images/icon_sendbtn.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: '92%',
                  }}
                  onPress={() => {
                    navigation.navigate('RequestCommoditiesScreen');
                  }}>
                  <Image
                    source={require('../../../assets/images/icon_requestbtn.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: windowWidth * 0.5,
                  width: windowWidth * 0.5,
                  alignItems: 'flex-end',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  style={{
                    height: '80%',
                    width: '80%',
                    justifyContent: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#4545E0',
                  }}
                  activeOpacity={0.9}
                  onPress={() => {
                    navigation.navigate('QRScannerScreen', {
                      qrcode: userData?.user_qr_code_filename,
                    });
                  }}>
                  <Image
                    source={require('../../../assets/images/qr_icon.png')}
                    style={{
                      height: '85%',
                      width: '85%',
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};
export default HomeScreen;
