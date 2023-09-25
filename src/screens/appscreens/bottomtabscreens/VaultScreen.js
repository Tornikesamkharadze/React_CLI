/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useContext} from 'react';
import {Dimensions} from 'react-native';
import Loader from '../../../widgets/customalert/Loader';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useAuth} from '../../../authContext/AuthContexts';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';

import {LinearTextGradient} from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import GradientText from '../../../widgets/GradienText';
import {NotificationDataContext} from '../../../navigation/StackSwitcher';

export default function VaultScreen({navigation}) {
  const notification = useContext(NotificationDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userCash, setUserCash] = useState();
  const [userCommodity, setUserCommodity] = useState();
  const [userTotalAmount, setUserTotalAmount] = useState();
  const [userCommodityList, setUserCommodityList] = useState([]);
  //navigatin header u

  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState();

  const showCustomAlert = text => {
    setTimeout(() => {
      setCustomAlertText(text);
    }, 500);
    setTimeout(() => {
      setCustomAlertVisible(true);
    }, 1000);
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
  //navigatin header ui
  navigation.setOptions({
    // headerShadowVisible: false, // remove shadow on Android
    // headerTitleAlign: 'center',
    headerStyle: {
      // backgroundColor: 'white',
      height: 0,
      // elevation: 0, // remove shadow on Android
      // shadowOpacity: 0, // remove shadow on iOS
    },
    // headerTitle: () => (
    //   <View>
    //     <Text
    //       style={{
    //         color: 'black',
    //         fontSize: 22,
    //         fontWeight: '600',
    //         // lineHeight: 20,
    //         fontFamily: 'Asap-Medium',
    //       }}>
    //       Vault
    //     </Text>
    //   </View>
    // ),
    // headerLeft: () => (
    //   <View
    //     style={{
    //       flexDirection: 'row',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}>
    //     <TouchableOpacity
    //       style={{
    //         height: 33,
    //         width: 33,
    //         marginLeft: 15,
    //         borderRadius: 33 / 1,
    //         borderWidth: 1,
    //         borderColor: '#4545E0',
    //         backgroundColor: 'white',
    //         justifyContent: 'center',
    //       }}
    //       onPress={() => {
    //         navigation.navigate('MyProfile');
    //       }}>
    //       <Image
    //         style={{
    //           alignSelf: 'center',
    //           height: 32,
    //           width: 32,
    //           //  marginLeft: 15,
    //           resizeMode: 'contain',
    //           borderRadius: 30 / 1,
    //           //  borderWidth: 1,
    //           //  borderColor: '#A5A5A5',
    //         }}
    //         source={{uri: userData?.profile_img}}
    //       />
    //     </TouchableOpacity>
    //   </View>
    // ),
    // headerRight: () => (
    //   <View
    //     style={{
    //       flexDirection: 'row',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}>
    //     <TouchableOpacity
    //       style={{
    //         height: 30,
    //         width: 30,
    //         backgroundColor: '#5b5b5b',
    //         borderRadius: 15,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginRight: 10,
    //       }}
    //       onPress={() => {
    //         navigation.navigate('Notification');
    //       }}>
    //       <Image
    //         style={{
    //           height: 15,
    //           width: 15,
    //           resizeMode: 'contain',
    //         }}
    //         source={require('../../../assets/images/icon_alert.png')}
    //       />
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={{
    //         height: 30,
    //         width: 30,
    //         backgroundColor: 'white',
    //         borderRadius: 15,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginRight: 15,
    //       }}
    //       onPress={() => {
    //         Alert.alert(
    //           'Logout',
    //           'Do you want to logout?',
    //           [
    //             {
    //               text: 'Cancel',
    //               onPress: () => console.log('Cancel Pressed'),
    //               style: 'cancel',
    //             },
    //             {text: 'Ok', onPress: () => logout()},
    //           ],
    //           {cancelable: false},
    //         );
    //       }}>
    //       <Image
    //         style={{
    //           height: 30,
    //           width: 30,
    //           resizeMode: 'contain',
    //         }}
    //         source={require('../../../assets/images/lock_gray_ico.gif')}
    //       />
    //     </TouchableOpacity>
    //   </View>
    // ),
  });
  useFocusEffect(
    useCallback(() => {
      if (notification) {
        notification.changeNotificationData();
      }
      getToken();
    }, []),
  );
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(userData));
    setAccessToken(token);
    getVaultDetail(token);
  };
  const logout = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.logout).then(
        ({ok, status, data, problem}) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
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
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const getVaultDetail = token => {
    //setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.vault).then(
        ({ok, status, data, problem}) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setUserCash(data.data.user_cash);
            setUserCommodity(data.data.commodity_value);
            setUserTotalAmount(data.data.total_amount);
            setUserCommodityList(data.data.commodities);
          }
        },
      );
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor={'white'} /> */}
      <StatusBar
        backgroundColor="transparent"
        animated={false}
        barStyle="dark-content"
        fitsSystemWindows={true}
        translucent={true}
      />
      <Loader isVisible={isLoading} />
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View>
          <ImageBackground
            source={require('../../../assets/images/vault_bg_img.png')}
            imageStyle={{
              resizeMode: 'stretch',
            }}
            style={{
              height: windowHeight / 3.2,
              width: '100%',
              //   resizeMode: 'contain',
            }}>
            <View>
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
                          //  marginLeft: 15,
                          resizeMode: 'contain',
                          borderRadius: 30 / 1,
                          // borderWidth: 1,
                          // borderColor: '#A5A5A5',
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
                        // lineHeight: 20,
                        fontFamily: 'Asap-Medium',
                      }}>
                      Vault
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
                </View>
              </View>
              <View
                style={{
                  //  backgroundColor: 'black',
                  //  height: windowHeight / 5,
                  width: '100%',
                  height: '100%',
                  flexDirection: 'row',
                  // justifyContent: 'center',
                }}>
                <View
                  style={{
                    height: windowHeight / 11,
                    flexDirection: 'row',
                    marginTop: 20,
                    marginStart: 15,
                    //  backgroundColor: 'yellow',
                  }}>
                  <View
                    style={{
                      height: windowHeight / 11,
                      width: windowHeight / 10,
                    }}>
                    <Image
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                      source={require('../../../assets/images/open_locker_img.png')}
                    />
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',

                      height: windowHeight / 12,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginStart: 25,
                      //  backgroundColor: 'red',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'Asap-Regular',
                        fontWeight: '700',
                        letterSpacing: -0.165,
                        fontStyle: 'normal',
                      }}>
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontFamily: 'Asap-Regular',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        fontSize: 24,
                        lineHeight: 30,
                        // color: '#FFAD00',
                        color: '#ffc700',
                      }}>
                      {userTotalAmount}
                    </Text>
                    {/* <GradientText
                      style={{
                        fontFamily: 'Asap-Regular',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        fontSize: 24,
                      }}>
                      {userTotalAmount}
                    </GradientText> */}
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View
            style={{
              height: windowHeight / 9 + 20,
              justifyContent: 'center',
              marginTop: -(windowHeight / 9) / 2,
              flexDirection: 'row',
              width: '100%',
              //backgroundColor: 'pink',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                borderRadius: 10,
                elevation: 12,
                shadowOpacity: 0.5,
                width: windowWidth / 3.4,
                height: windowHeight / 9,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
              }}>
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  Cash
                </Text>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                    fontWeight: '700',
                    fontSize: 13,
                  }}>
                  {userCash}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate('SavedCards', {
                        isFromAddMoney: true,
                        toBack: 'vault',
                      });
                    }}>
                    <ImageBackground
                      style={{width: 30, height: 30, justifyContent: 'center'}}
                      imageStyle={{borderRadius: 5}}
                      source={require('../../../assets/images/gold_back_img.png')}>
                      <Image
                        style={{width: 20, height: 20, alignSelf: 'center'}}
                        source={require('../../../assets/images/wallet_new.png')}></Image>
                    </ImageBackground>
                  </TouchableOpacity>
                  {/* <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate('WithdrawCash');
                    }}>
                    <Image
                      style={{width: 30, height: 30, marginStart: 15}}
                      source={require('../../../assets/images/withdraw_wallet.png')}></Image>
                  </TouchableWithoutFeedback> */}
                </View>
              </View>
            </View>

            <View
              style={{
                marginStart: 15,
                shadowOpacity: 0.5,
                borderRadius: 10,
                elevation: 12,
                width: windowWidth / 3.4,
                height: windowHeight / 9,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
              }}>
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  Conversions
                </Text>
                <Text
                  style={{
                    alignSelf: 'center',

                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                    fontWeight: '700',
                    fontSize: 13,
                  }}>
                  {''}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 0,
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate('Conversions');
                    }}>
                    <Image
                      style={{width: 38, height: 38}}
                      source={require('../../../assets/images/icon_inactive_conversions.png')}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <View
              style={{
                marginStart: 15,
                shadowOpacity: 0.5,
                borderRadius: 10,
                elevation: 12,
                width: windowWidth / 3.4,
                height: windowHeight / 9,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
              }}>
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    alignSelf: 'center',
                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  Commodity Value
                </Text>
                <Text
                  style={{
                    alignSelf: 'center',

                    color: '#000000',
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                    fontWeight: '700',
                    fontSize: 13,
                  }}>
                  {userCommodity}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate('AddAndWithdrawCommodity', {
                        forAddCommodity: true,
                      });
                    }}>
                    <ImageBackground
                      style={{width: 30, height: 30, justifyContent: 'center'}}
                      imageStyle={{borderRadius: 5}}
                      source={require('../../../assets/images/gold_back_img.png')}>
                      <Image
                        style={{width: 20, height: 20, alignSelf: 'center'}}
                        source={require('../../../assets/images/wallet_new.png')}></Image>
                    </ImageBackground>
                  </TouchableOpacity>
                  {/* <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate('AddAndWithdrawCommodity', {
                        forAddCommodity: false,
                      });
                    }}>
                    <Image
                      style={{width: 30, height: 30, marginStart: 15}}
                      source={require('../../../assets/images/withdraw_wallet.png')}></Image>
                  </TouchableWithoutFeedback> */}
                </View>
              </View>
            </View>
          </View>

          <FlatList
            style={{alignContent: 'center'}}
            bounces={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={userCommodityList}
            ListFooterComponent={() => <View style={{height: 15}}></View>}
            numColumns={2}
            renderItem={({item, index}) => {
              var isOddIndex = false;
              if ((index | 1) > index) {
                isOddIndex = false;
              } else {
                isOddIndex = true;
              }
              return (
                <View
                  style={{
                    flex: 0.5,
                    marginStart: isOddIndex ? 10 : 20,
                    marginTop: 20,
                    marginEnd: isOddIndex ? 20 : 10,

                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    width: windowWidth / 2 - 40,
                    height:
                      Platform.OS == 'ios'
                        ? windowHeight / 3.5
                        : windowHeight / 3.5,
                    shadowOpacity: 0.3,
                    elevation: 5,
                    borderRadius: 20,
                    backgroundColor: '#F4F4F4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    //  backgroundColor: 'red',
                  }}>
                  <View
                    style={{
                      borderWidth: 0.5,
                      padding: 5,
                      borderColor: 'rgba(255, 173, 0, 0.5)',
                      borderRadius: (windowWidth / 2 - 100) / 2,
                      width: windowWidth / 2 - 100,
                      height: windowWidth / 2 - 100,
                    }}>
                    <Image
                      style={{
                        alignSelf: 'center',
                        width: windowWidth / 2 - 120,
                        height: windowWidth / 2 - 120,
                      }}
                      resizeMode={'contain'}
                      source={{uri: item.icon_image}}></Image>
                  </View>
                  <Text
                    style={{
                      color: '#202020',
                      fontFamily: 'Asap-Medium',
                      fontSize: 17,
                      marginTop: 8,
                      fontWeight: '800',
                      lineHeight: 20,
                    }}>
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 3,
                      //  backgroundColor: 'red',
                      width: '100%',
                      alignItems: 'center',
                      height: 40,
                      justifyContent: 'center',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'center',
                        color: '#ffc700',
                        fontFamily: 'Asap-Medium',
                        fontSize: 12,
                        fontWeight: '500',
                        lineHeight: 20,
                        width: '49%',
                      }}>
                      {item.total_quantity}
                    </Text>
                    {/* <View
                      style={{
                        width: '49%',
                        height: '100%',
                        justifyContent: 'center',
                      }}>
                      <GradientText
                        style={{
                          fontFamily: 'Asap-Medium',
                          fontSize: 12,
                          fontWeight: '500',
                          lineHeight: 20,
                          alignSelf: 'center',
                          height: '100%',
                          marginTop: 5,
                        }}>
                        {item.total_quantity}
                      </GradientText>
                    </View> */}
                    <View
                      style={{
                        justifyContent: 'center',
                        width: '2%',
                        height: '100%',
                        //  backgroundColor: 'yellow',
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          //  marginHorizontal: 5,
                          height: '50%',
                          width: 1,
                          backgroundColor: 'black',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '49%',
                        height: '100%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          textAlign: 'center',
                          color: '#626262',
                          fontFamily: 'Asap-Medium',
                          fontSize: 12,
                          fontWeight: '500',
                          lineHeight: 18,
                          lineHeight: 18,
                        }}>
                        Value {item.price}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      borderRadius: 15,
                      backgroundColor: '#FFAD00',
                      height: 25,
                      flexDirection: 'row',
                      width: windowWidth / 2 - 60,
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        //alert('Add ! Under Developement');
                        navigation.navigate('AddCommoditiesScreen', {
                          commodityId: item.id,
                          commodityName: item.name,
                          commodityIcon: item.icon_image,
                          backTo: 'vault',
                        });
                      }}>
                      <View
                        style={{
                          borderBottomLeftRadius: 15,
                          borderTopLeftRadius: 15,
                          height: 25,
                          width: (windowWidth / 2 - 60) / 3,
                        }}>
                        <ImageBackground
                          style={{
                            height: '100%',
                            width: '100%',

                            justifyContent: 'center',
                          }}
                          imageStyle={{
                            borderBottomLeftRadius: 15,
                            borderTopLeftRadius: 15,
                            resizeMode: 'cover',
                          }}
                          source={require('../../../assets/images/gold_back_img.png')}>
                          <Text
                            style={{
                              color: 'white',
                              alignSelf: 'center',
                              fontFamily: 'Asap-Medium',
                              fontSize: 9,
                              fontWeight: '600',
                            }}>
                            ADD
                          </Text>
                        </ImageBackground>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        navigation.navigate('SendCommoditiesScreen', {
                          commodityId: item.id,
                          commodityName: item.name,
                          commodityIcon: item.icon_image,
                          backTo: 'vault',
                        });
                      }}>
                      <View
                        style={{
                          backgroundColor: 'black',
                          height: 25,
                          width: (windowWidth / 2 - 60) / 3,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            alignSelf: 'center',
                            fontFamily: 'Asap-Medium',
                            fontSize: 9,
                            fontWeight: '600',
                          }}>
                          SEND
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        navigation.navigate('RequestCommoditiesScreen', {
                          commodityId: item.id,
                          commodityName: item.name,
                          commodityIcon: item.icon_image,
                          backTo: 'vault',
                        });
                      }}>
                      <View
                        style={{
                          borderBottomLeftRadius: 15,
                          borderTopLeftRadius: 15,
                          height: 25,
                          width: (windowWidth / 2 - 60) / 3,
                        }}>
                        <ImageBackground
                          style={{
                            height: '100%',
                            width: '100%',

                            justifyContent: 'center',
                          }}
                          imageStyle={{
                            borderBottomRightRadius: 15,
                            borderTopRightRadius: 15,
                            resizeMode: 'cover',
                          }}
                          source={require('../../../assets/images/gold_back_img.png')}>
                          <Text
                            style={{
                              color: 'white',
                              alignSelf: 'center',
                              fontFamily: 'Asap-Medium',
                              fontSize: 9,
                              fontWeight: '600',
                            }}>
                            REQUEST
                          </Text>
                        </ImageBackground>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
