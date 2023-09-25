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
  Alert,
} from 'react-native';
import React from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BankDetails = ({navigation, route}) => {
  const [cardDetails, setCardDetails] = useState();
  const [bankDetail, setBankDetail] = useState();
  const [isTrue, setIsTrue] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    getAccountDetails(token);
  };

  //api calls
  const getAccountDetails = token => {
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.account_details).then(
        ({ok, status, data, problem}) => {
          //  alert(JSON.stringify(data));
          if (data.status_code == 200) {
            setIsTrue(false);
            if (data.data.external_accounts.object == 'card') {
              setCardDetails(data.data.external_accounts);
            } else {
              setBankDetail(data.data.external_accounts);
            }
          } else {
            setIsTrue(true);
          }
        },
      );
    } catch (e) {
      alert(e);
    }
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
          Bank Details
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

  const linkBankAccount = () => {
    try {
      // Axiosinstance.setHeader('Content-Type', 'multipart/form-data');
      Axiosinstance.get(ApiEndPoint.link_account).then(
        ({ok, status, data, problem}) => {
          if (ok) {
            navigation.navigate('AddBankAccount', {
              url: data.data.stripe_onboarding_url,
            });
            // alert(JSON.stringify(data.data.stripe_onboarding_url));
          }
        },
      );
    } catch (e) {}
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
      }}>
      {/* <Loader isVisible={isLoading} /> */}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View
        style={{
          flex: 1,
          marginTop: 15,
        }}>
        {cardDetails !== undefined ? (
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '600',
                alignSelf: 'center',
                // lineHeight: 20,
                fontFamily: 'Asap-Medium',
              }}>
              Debit Card
            </Text>

            {/* <View
              style={{
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Card holder name:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    width: '75%',
                    height: 35,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#E1E0E0',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontFamily: 'Asap-Regular',
                      color: 'black',
                    }}>
                    {cardDetails?.name}
                  </Text>
                </View>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/icon_visa.png')}
                />
              </View>
            </View> */}

            <View
              style={{
                marginTop: 18,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Expiry month/year:
              </Text>

              <View
                style={{
                  marginTop: 10,
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  {cardDetails?.exp_month}
                  {'/'}
                  {cardDetails?.exp_year}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 18,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Card last 4 digit:
              </Text>

              <View
                style={{
                  marginTop: 10,
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  XXXXXXXXXXXX{cardDetails?.last4}
                </Text>
              </View>
            </View>
          </View>
        ) : bankDetail !== undefined ? (
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: '600',
                alignSelf: 'center',
                // lineHeight: 20,
                fontFamily: 'Asap-Medium',
              }}>
              Bank Account
            </Text>
            {/* <View
              style={{
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Account holder name:
              </Text>
              <View
                style={{
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                  marginTop: 10,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  {bankDetail?.name}
                </Text>
              </View>
            </View> */}
            <View
              style={{
                marginTop: 18,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Bank name:
              </Text>

              <View
                style={{
                  marginTop: 10,
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  {bankDetail?.bank_name}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 18,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Account last 4 digit:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  XXXXXXXXXXXX{bankDetail?.last4}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 18,
              }}>
              <Text
                style={{
                  color: '#626262',
                  fontSize: 16,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Regular',
                }}>
                Routing number:
              </Text>
              <View
                style={{
                  marginTop: 10,
                  //  width: '70%',
                  height: 35,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#E1E0E0',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    fontFamily: 'Asap-Regular',
                    color: 'black',
                  }}>
                  {bankDetail?.routing_number}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={() => {
            linkBankAccount();
            // navigation.navigate('AddBankAccount');
            // alert('Under Development');
          }}
          activeOpacity={0.5}
          style={{
            marginTop: 20,
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E1E0E0',
          }}>
          <Text
            style={{
              color: '#ffc700',
              fontSize: 16,
              fontWeight: '400',
              // lineHeight: 20,
              fontFamily: 'Asap-Medium',
            }}>
            {isTrue ? 'Add Bank Account' : 'Update Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default BankDetails;
