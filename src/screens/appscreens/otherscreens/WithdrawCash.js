/* eslint-disable radix */
/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useAuth} from '../../../authContext/AuthContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import {useState, useRef} from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Loader from '../../../widgets/customalert/Loader';
import {TextInputMask} from 'react-native-masked-text';
import {useEffect} from 'react';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import CustomAlert from '../../../widgets/customalert/CustomAlert';

const WithdrawCash = ({navigation, route}) => {
  const [addBankModal, setAddBankModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isSessionExpired, setisSessionExpired] = useState(false);

  const [maskedCardNumber, setMaskedCardNumber] = useState('');

  const [amount, setAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [processingFeeType, setProcessingFeeType] = useState('1');
  const [processingFee, setProcessingFee] = useState(0);
  const [paypalId, setPayPalId] = useState('');
  const [token, setAccessToken] = useState('');

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');

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
          Withdraw Cash
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
      //setAmount(0);
      getToken();
    }, []),
  );

  // useEffect(() => {
  //   getPaymentFee();
  // }, [amount]);

  const amountInfo = useRef();
  useEffect(() => {
    if (route?.params?.from) {
      try {
        getPaymentFee(amountInfo?.current?.getRawValue().toString());
      } catch (error) {}
    }
    //  getPaymentFee(amountInfo?.current?.getRawValue().toString());
  }, [amount]);

  const [paymentData, setPaymentData] = useState();

  const [formattedAmount, setFormattedAmount] = useState(0);
  const getPaymentFee = async val => {
    try {
      let formdata = new FormData();
      formdata.append('total_cash', val);
      formdata.append('cash_unit', 'USD');
      formdata.append('payment_type', 1);
      var token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.paymentFee, formdata).then(
        ({ok, status, data, problem}) => {
          if (ok) {
            //  alert(JSON.stringify(data.data));
            setFormattedAmount(data.data.formatted_total_cash);
            setTotalAmount(data.data.formatted_cash_with_fee);
            setProcessingFee(data.data.formatted_fee);
            setPaymentData(data.data);
          } else {
            // alert(data.message);
            // setTotalAmount(parseFloat(0).toFixed(2));
            // setProcessingFee(0);
          }
        },
      );
    } catch (e) {
      alert(e);
    }
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setAccessToken(token);
    getAccountDetails(token);
  };
  const [isBankAdd, setIsBankAdd] = useState(false);
  //api calls
  const getAccountDetails = token => {
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.account_details).then(
        ({ok, status, data, problem}) => {
          //  alert(JSON.stringify(data));
          if (data.status_code == 200) {
            setIsBankAdd(true);
          } else {
            setIsBankAdd(false);
            // setIsTrue(true);
          }
        },
      );
    } catch (e) {
      alert(e);
    }
  };

  const getDecimalCount = str => {
    var decimaCount = 0;
    const decimal = ['.'];
    for (let char of str) {
      if (decimal.includes(char)) {
        decimaCount++;
      }
    }
    return decimaCount;
  };

  const withdrawAmoutFromVault = () => {
    if (
      totalAmount == '0' ||
      totalAmount == 0 ||
      totalAmount == '' ||
      amount == ''
    ) {
      showCustomAlert('Please enter amount.');
    } else if (!isBankAdd) {
      Alert.alert(
        'Alert',
        'You have not added any bank account yet!',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Add bank',
            onPress: () => navigation.navigate('BankDetails'),
          },
        ],
        {cancelable: false},
      );
    } else {
      setIsLoading(true);
      try {
        let formdata = new FormData();
        formdata.append('cash_unit', 'USD');
        Axiosinstance.setHeader('access-token', token);
        Axiosinstance.post(ApiEndPoint.getWalletAmount, formdata).then(
          ({ok, status, data, problem}) => {
            setIsLoading(false);
            if (status === 401) {
              setisSessionExpired(true);
            } else if (ok) {
              if (paymentData?.cash_with_fee <= data.data.total_cash) {
                console.log(amount + ' ' + totalAmount + ' ' + processingFee);

                navigation.navigate('CheckPin', {
                  amount: paymentData.cash_with_fee,
                  totalAmount: paymentData.total_cash,
                  processingFee: paymentData.fee,
                  currency: 'USD',
                  from: 'WithDrawCash',
                  payment_gateway_fee: paymentData.fee,
                  total_amount: paymentData.total_cash,
                  toBack: route?.params?.backTo,
                });
              } else {
                showCustomAlert('Insufficient cash.');
              }
            } else {
              alert(data.message);
            }
          },
        );
      } catch (e) {
        setIsLoading(false);
      }
    }
  };

  const showCustomAlert = text => {
    setCustomAlertVisible(true);
    setCustomAlertText(text);
  };

  const hideCustomAlert = () => {
    setCustomAlertVisible(false);
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
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      {/* <Modal
        visible={addBankModal}
        transparent={true}
        statusBarTranslucent
        animationType={'fade'}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              //  width: '100%',
              borderRadius: 10,
              marginHorizontal: 15,
              paddingHorizontal: 15,
              paddingVertical: 25,
            }}>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Asap-Regular',
                  color: 'black',
                }}>
                You have not added any bank account yet!
              </Text>
            </View>
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setAddBankModal(false);
                }}
                style={{
                  backgroundColor: '#C1C1C1',
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Asap-Medium',
                    color: 'black',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('BankDetails');
                  setAddBankModal(false);
                }}
                style={{
                  backgroundColor: '#C1C1C1',
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Asap-Medium',
                    color: 'black',
                  }}>
                  Add Bank
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          paddingHorizontal: 15,
          paddingVertical: 30,
        }}>
        <>
          <View
            style={{
              marginTop: 20,
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: 'Asap-Medium',
                fontSize: 17,
                fontWeight: '500',
                lineHeight: 20,
                color: '#202020',
              }}>
              Amount
            </Text>
            <View
              style={{
                paddingHorizontal: 10,
                marginTop: 10,
                borderRadius: 3,
                width: '100%',
                height: 45,
                borderColor: '#CBCBCB',
                flexDirection: 'row',
                borderWidth: 0.7,
              }}>
              <TextInputMask
                // value={cardNumber}
                value={amount}
                ref={amountInfo}
                type={'money'}
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  unit: '',
                  suffixUnit: '',
                }}
                defaultValue={amount}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor={'#828282'}
                returnKeyType={'done'}
                editable={true}
                maxLength={10}
                style={{
                  color: 'black',
                  fontFamily: 'Asap-Medium',
                  fontSize: 15,
                  fontWeight: '400',
                  width: '90%',
                  height: '100%',
                  // borderWidth: 1,
                  // borderColor: '#CBCBCB',
                  // borderRadius: 3,
                  // fontSize: 15,
                  // fontWeight: '400',
                  // fontFamily: 'Asap',
                  // paddingVertical: 15,
                  // paddingHorizontal: 12,
                  // color: '#202020',
                }}
                blurOnSubmit={true}
                onChangeText={val => {
                  setAmount(val);
                }}
              />
              {/* <TextInput
                defaultValue={amount}
                value={amount}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor={'#828282'}
                returnKeyType={'done'}
                inputMode={'numeric'}
                editable={true}
                onChangeText={textTyped => {
                  var text = textTyped.trim();
                  if (text == '') {
                    setAmount('');
                    console.log('if-->', text);
                  } else if (text == '.') {
                    setAmount('0.');
                    console.log(text);
                  } else if (getDecimalCount(textTyped) == 0) {
                    setAmount(textTyped.slice(0, 5));
                  } else if (getDecimalCount(textTyped) == 1) {
                    const tempArray = textTyped.split('.');
                    if (tempArray.length == 2) {
                      if (tempArray[1].length > 2) {
                        setAmount(
                          tempArray[0] + '.' + tempArray[1].slice(0, 2),
                        );
                      } else {
                        setAmount(textTyped);
                      }
                    } else {
                      setAmount(textTyped);
                    }
                  } else {
                    if (!isNaN(text)) {
                      setAmount(text);
                    } else {
                      console.log('else-->', text);
                    }
                  }
                }}
                maxLength={8}
                style={{
                  color: 'black',
                  fontFamily: 'Asap-Medium',
                  fontSize: 15,
                  fontWeight: '400',
                  width: '90%',
                  height: '100%',
                }}></TextInput> */}
              <Image
                style={{
                  alignSelf: 'center',
                  height: 30,

                  width: 30,
                }}
                source={require('../../../assets/images/amount_addmoney.png')}
              />
            </View>
          </View>

          {/* <View
            style={{
              marginVertical: 30,
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: 'Asap-Medium',
                fontSize: 17,
                fontWeight: '500',
                lineHeight: 20,
                color: '#202020',
              }}>
              Paypal ID
            </Text>
            <View
              style={{
                paddingHorizontal: 10,
                marginTop: 10,
                borderRadius: 3,
                width: '100%',
                height: 45,
                borderColor: '#CBCBCB',
                flexDirection: 'row',
                borderWidth: 0.7,
              }}>
              <TextInput
                placeholder="Enter paypal ID"
                placeholderTextColor={'#828282'}
                inputMode={'text'}
                editable={true}
                onChangeText={textTyped => {
                  setPayPalId(textTyped);
                }}
                style={{
                  color: 'black',
                  fontFamily: 'Asap-Medium',
                  fontSize: 15,
                  fontWeight: '400',
                  width: '90%',
                  height: '100%',
                }}></TextInput>
              <Image
                style={{
                  alignSelf: 'center',
                  height: 25,
                  marginStart: 5,
                  width: 25,
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/images/paypal.png')}
              />
            </View>
          </View> */}

          <View style={{marginTop: 25, flexDirection: 'column'}}>
            <Text
              style={{
                fontFamily: 'Asap-Medium',
                fontSize: 17,
                fontWeight: '700',
                lineHeight: 20,
                color: '#202020',
              }}>
              Payment Details
            </Text>
            <View
              style={{
                marginTop: 10,
                width: '100%',
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: '#DDDDDD',
                backgroundColor: '#FBFBFB',
                padding: 10,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#333333',
                  }}>
                  Amount
                </Text>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#333333',
                  }}>
                  {amount == 0 ? '0.00' : formattedAmount}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#333333',
                  }}>
                  Stripe fee
                </Text>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '400',
                    fontSize: 15,
                    color: '#333333',
                  }}>
                  {amount == 0 ? '0.00' : processingFee}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  width: '100%',
                  backgroundColor: '#DDDDDD',
                  height: 1,
                }}></View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '500',
                    fontSize: 16,
                    color: '#101010',
                  }}>
                  Total amount
                </Text>
                <Text
                  style={{
                    fontFamily: 'Asap-Medium',
                    fontWeight: '600',
                    fontSize: 16,
                    color: '#101010',
                  }}>
                  {amount == 0 ? '0.00' : totalAmount}
                </Text>
              </View>
            </View>
          </View>
        </>
      </ScrollView>
      <View
        style={{
          bottom: 0,
          width: '90%',
          marginBottom: 15,

          position: 'absolute',
        }}>
        <CustomRoundedBlackBtn
          text={'PROCESS'}
          getClick={withdrawAmoutFromVault}
        />
      </View>
    </View>
  );
};
export default WithdrawCash;
