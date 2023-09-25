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
} from 'react-native';
import React from 'react';
import {useAuth} from '../../../authContext/AuthContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import {useState} from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import Loader from '../../../widgets/customalert/Loader';
import {TextInputMask} from 'react-native-masked-text';
import {useEffect, useRef} from 'react';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import GradientText from '../../../widgets/GradienText';

const SavedCards = ({navigation, route}) => {
  const [addCardModal, setAddCardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [vault, setVault] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [stripeCustomerId, setStripeCustomerId] = useState('');
  const [isSessionExpired, setisSessionExpired] = useState(false);

  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [maskedCardNumber, setMaskedCardNumber] = useState('');

  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('2');
  const [paymentMethodDetails, setPaymentMethodDetails] = useState();

  const [refresh, setRefresh] = useState(false);

  const [amount, setAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [processingFeeType, setProcessingFeeType] = useState('1');
  const [processingFee, setProcessingFee] = useState(0);
  const [amountbyApi, setAmountbyApi] = useState(0);

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [changeInProcessingFee, setChangeInProcessingFee] = useState(true);

  const [totalAmountFormatted, setTotalAmountFormatted] = useState(0);
  const [processingFeeFormatted, setProcessingFeeFormatted] = useState(0);
  const [amountByApiFormatted, setAmountbyApiFormatted] = useState(0);
  const [formattedAdminCommission, setFormattedAdminCommission] = useState(0);
  const [adminCommission, setAdminCommission] = useState(0);

  const [applePay, setApplePay] = useState(false);

  const amountInfo = useRef();

  const showCustomAlert = text => {
    setTimeout(() => {
      setCustomAlertText(text);
    }, 500);
    setTimeout(() => {
      setCustomAlertVisible(true);
    }, 1000);
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
          {route?.params?.isFromAddCammodity
            ? 'Payment'
            : route?.params?.isFromAddMoney
            ? 'Add Money'
            : route?.params?.isFromAddCammodityOnlyVault
            ? 'Payment'
            : 'Saved Cards'}
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

  const getClick = id => {
    if (route?.params?.isFromAddCammodityOnlyVault) {
      if (paymentMethod == undefined) {
        showCustomAlert('Please select vault.');
      } else if (route?.params?.amount >= paymentMethodDetails.amount) {
        showCustomAlert('Not sufficient amount in your vault.');
      } else {
        navigation.navigate('CheckPin', {
          amount: route?.params?.amount,
          currency: route?.params?.currency,
          quantity: route?.params?.quantity,
          quantityUnit: route?.params?.quantityUnit,
          commodityId: route?.params?.commodityId,
          paymentMethod: paymentMethod,
          paymentMethodDetails: paymentMethodDetails,
          stripeCustomerId: stripeCustomerId,
          payment_gateway_fee: processingFee,
          total_amount: totalAmount,
          total_amount_formatted: totalAmountFormatted,
          formattedAdminCommission: formattedAdminCommission,
          adminFee: adminCommission,
          from: 'Add',
          toBack: route?.params?.toBack,
        });
      }
    } else {
      if (paymentMethodDetails) {
        navigation.navigate('CheckPin', {
          amount: route?.params?.amount,
          currency: route?.params?.currency,
          quantity: route?.params?.quantity,
          quantityUnit: route?.params?.quantityUnit,
          commodityId: route?.params?.commodityId,
          paymentMethod: paymentMethod,
          paymentMethodDetails: paymentMethodDetails,
          stripeCustomerId: stripeCustomerId,
          payment_gateway_fee: processingFee,
          total_amount: totalAmount,
          total_amount_formatted: totalAmountFormatted,
          formattedAdminCommission: formattedAdminCommission,
          adminFee: adminCommission,
          from: 'Add',
          toBack: route?.params?.toBack,
        });
      } else {
        if (paymentMethod == 3) {
          navigation.navigate('CheckPin', {
            amount: route?.params?.amount,
            currency: route?.params?.currency,
            quantity: route?.params?.quantity,
            quantityUnit: route?.params?.quantityUnit,
            commodityId: route?.params?.commodityId,
            paymentMethod: paymentMethod,
            paymentMethodDetails: paymentMethodDetails,
            stripeCustomerId: stripeCustomerId,
            payment_gateway_fee: processingFee,
            total_amount: totalAmount,
            total_amount_formatted: totalAmountFormatted,
            formattedAdminCommission: formattedAdminCommission,
            adminFee: adminCommission,
            from: 'Add',
            toBack: route?.params?.toBack,
          });
          //payApple();
        } else {
          showCustomAlert('Please select any payment method');
        }
      }
    }
  };

  useEffect(() => {
    getToken();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (route?.params?.isFromAddCammodityOnlyVault) {
      setTimeout(() => {
        setAmount(route?.params?.amount);
        setTotalAmount(parseFloat(route?.params?.amount).toFixed(2));
        setProcessingFee(0);
        setProcessingFeeFormatted(0.0);
        setTotalAmountFormatted();
        getPaymentFee(route?.params?.amount);
      }, 500);
    } else {
      if (paymentMethod === 2) {
        setAmount(route?.params?.amount);
        setTotalAmount(route?.params?.amount);
        //setProcessingFee(0);
        //setProcessingFeeFormatted(0.0);
        getPaymentFee(route?.params?.amount ? route?.params?.amount : 0);
      } else {
        // setPaymentMethod('2');
        setAmount(route?.params?.amount ? route?.params?.amount : 0);
        getPaymentFee(route?.params?.amount ? route?.params?.amount : 0);
      }
    }
    return () => {
      setIsLoading(false);
    };
  }, [paymentMethod]);

  useEffect(() => {
    // if (processingFeeType == '1') {
    //   if (amount != 0) {
    //     setTotalAmount((parseFloat(amount) + processingFee).toFixed(2));
    //   } else {
    //     setTotalAmount(parseFloat(0).toFixed(2));
    //   }
    // } else {
    //   setTotalAmount(
    //     (
    //       parseFloat(amount) +
    //       (parseFloat(amount).toFixed(2) * processingFee) / 100
    //     ).toFixed(2),
    //   );
    // }
    if (!route?.params?.isFromAddCammodityOnlyVault) {
      try {
        getPaymentFee(amountInfo?.current?.getRawValue().toString());
      } catch (error) {}
    }

    return () => {
      setIsLoading(false);
    };
  }, [amount]);

  const getToken = async () => {
    setPaymentMethod();
    const token = await AsyncStorage.getItem('token');
    const stripeCustomerId = await AsyncStorage.getItem('stripeCustomerId');

    setAccessToken(token);
    setStripeCustomerId(stripeCustomerId);

    if (
      route?.params?.isFromAddCammodity ||
      route?.params?.isFromAddCammodityOnlyVault
    ) {
      getWalletAmount(token);
    }
    getCardList(token);
  };

  const validateCardField = () => {
    if (!cardHolderName.trim()) {
      alert('Please enter card holder name');
      return;
    }
    if (cardHolderName.trim().length < 2) {
      alert('Please enter minimum 2 character long card holder name.');
      return;
    }
    //card number
    if (!cardNumber.trim()) {
      alert('Please enter your card number.');
      return;
    }
    if (!/^\d+$/.test(cardNumber.trim())) {
      alert('Please check your card number.');
      return;
    }
    //card expiry month
    if (!expMonth.trim()) {
      alert('Please enter expiry month.');
      return;
    }
    if (!/^\d+$/.test(expMonth.trim())) {
      alert('Please check expiry month again.');
      return;
    }
    //card expiry year
    if (!expYear.trim()) {
      alert('Please enter expiry year.');
      return;
    }
    if (!/^\d+$/.test(expYear.trim())) {
      alert('Please check expiry year again.');
      return;
    }
    if (expYear.trim().length < 2) {
      alert('Please enter last two digits of expiry year.');
      return;
    }
    //card expiry year
    if (!cvv.trim()) {
      alert('Please enter CVV.');
      return;
    }
    if (!/^\d+$/.test(cvv.trim())) {
      alert('Please check CVV again.');
      return;
    }
    addCard();
  };

  //Api calls
  const getCardList = async token => {
    //setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.cardList).then(
        ({ok, status, data, problem}) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);

          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            if (route?.params?.isFromAddCammodityOnlyVault) {
              setPaymentMethod('2');
            } else {
              for (let index = 0; index < data.data.length; index++) {
                const element = data.data[index];
                if (element.is_default == '1') {
                  element.isSelected = true;
                  setPaymentMethodDetails(element);
                  for (let index = 0; index < vault.length; index++) {
                    const elementVault = vault[index];
                    elementVault.isSelected = false;
                  }
                }
              }
              setCardList(data.data);
              if (data.data.length > 0) {
                setPaymentMethod('1');
                //getWalletAmount(token);
              } else {
                setProcessingFee(0);
                setTotalAmount(route?.params?.amount);
              }
            }
          } else {
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
            alert(data.message);
          }
        },
      );
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  //getVaultAmount
  const getWalletAmount = token => {
    // setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('cash_unit', route?.params?.currency);
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.getWalletAmount, formdata).then(
        ({ok, status, data, problem}) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            if (route?.params?.isFromAddCammodityOnlyVault) {
              var vaultArray = [
                {
                  title: 'Vault Amount',
                  amount: data.data.total_cash,
                  formatted_amount: data.data.formatted_total_cash,
                  cashUnit: data.data.cash_unit,
                  isSelected: true,
                },
              ];
              setPaymentMethod(2);
              setVault(vaultArray);
              setProcessingFee(0);
              setTotalAmount(amount);
              setPaymentMethodDetails(vaultArray[0]);
            } else {
              var vaultArray = [
                {
                  title: 'Vault Amount',
                  amount: data.data.total_cash,
                  formatted_amount: data.data.formatted_total_cash,
                  cashUnit: data.data.cash_unit,
                },
              ];
              setVault(vaultArray);
            }
          } else {
            alert(data.message);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const addCard = () => {
    setAddCardModal(false);
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('card_holder_name', cardHolderName);
      formdata.append('number', parseInt(cardNumber));
      formdata.append('exp_month', parseInt(expMonth));
      formdata.append('exp_year', parseInt(expYear));
      formdata.append('cvc', parseInt(cvv));
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.addCard, formdata).then(
        ({ok, status, data, problem}) => {
          // setTimeout(() => {
          //   setIsLoading(false);
          // }, 500);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            alert(data.message);
            setAddCardModal(false);
            getCardList(accessToken);
            setCardHolderName('');
            setCardNumber('');
            setExpMonth('');
            setExpYear('');
            setCvv('');
          } else {
            alert(data.message);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        },
      );
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const deleteCard = async cardId => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('stripe_customer_id', stripeCustomerId);
      formdata.append('stripe_card_id', cardId);

      Axiosinstance.post(ApiEndPoint.deleteCard, formdata).then(
        ({ok, status, data, problem}) => {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            getCardList(accessToken);
          } else {
            alert(data.message);
          }
        },
      );
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const addAmountToVault = str => {
    if (!paymentMethodDetails) {
      showCustomAlert('Please select any payment method');
    } else if (
      totalAmount == '0' ||
      totalAmount == 0 ||
      totalAmount == '' ||
      amount == ''
    ) {
      showCustomAlert('Please enter amount.');
    } else if (totalAmount > 999999.99) {
      showCustomAlert('Total amount must be no more than $999,999.99');
    } else {
      navigation.navigate('CheckPin', {
        amount: amount.replace(',', ''),
        currency: 'USD',
        from: 'AddMoney',
        paymentMethod: paymentMethod,
        stripeCustomerId: stripeCustomerId,
        paymentMethodDetails: paymentMethodDetails,
        payment_gateway_fee: processingFee,
        total_amount: totalAmount,
        total_amount_formatted: totalAmountFormatted,
        toBack: route?.params?.toBack,
        adminFee: adminCommission,
      });
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

  const getPaymentFee = async amountForFee => {
    //     "1. total_cash: String
    //     -> Required
    // 2. cash_unit: String
    //     -> Required
    //     -> EUR/USD/CAD
    // 3. payment_type: Number
    //     -> 1: card, 2: vault
    //     ->  -> Required
    // 4. get_admin_fee: Number
    //     -> Optional
    //     -> if need  pass 1"

    try {
      let formdata = new FormData();

      formdata.append('total_cash', amountForFee),
        formdata.append(
          'cash_unit',
          route?.params?.isFromAddCammodity ? route?.params?.currency : 'USD',
        );

      formdata.append('payment_type', paymentMethod);

      if (!route?.params?.isFromAddMoney) {
        formdata.append('get_admin_fee', '1');
      }

      var token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.paymentFee, formdata).then(
        ({ok, status, data, problem}) => {
          if (ok) {
            setTotalAmount(data.data.cash_with_fee);
            setProcessingFee(data.data.fee);
            setAmountbyApi(data.data.total_cash);
            setTotalAmountFormatted(data.data.formatted_cash_with_fee);
            setProcessingFeeFormatted(data.data.formatted_fee);
            setAmountbyApiFormatted(data.data.formatted_total_cash);
            setFormattedAdminCommission(data.data.formatted_admin_commission);
            setAdminCommission(data.data.admin_commission);
          } else {
            //alert(data.message);
            setTotalAmount(parseFloat(0).toFixed(2));
            setProcessingFee(0);
          }
        },
      );
    } catch (e) {
      //alert(e);
      //  alert(JSON.stringify(amountInfo));
    }
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
      <SessionExpiredModel modalvisible={isSessionExpired} />
      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <Modal
        visible={addCardModal}
        transparent={true}
        statusBarTranslucent
        animationType={'fade'}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexGrow: 1,
            }}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingTop: 20,
                width: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <Loader isVisible={isLoading} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Add A New Card
                </Text>
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => {
                    setAddCardModal(false);
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../../assets/images/icon_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: '100%',
                  height: 1,
                  marginVertical: 20,
                }}
              />
              <View style={{paddingHorizontal: 15}}>
                <Text
                  style={{
                    color: '#202020',
                    fontSize: 16,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                    marginBottom: 10,
                  }}>
                  Card holder name
                </Text>

                <TextInput
                  value={cardHolderName}
                  placeholder="Enter card holder name"
                  maxLength={50}
                  cursorColor="#FFAD00"
                  selectionColor={'#FFAD00'}
                  keyboardType={'default'}
                  placeholderTextColor="#828282"
                  onChangeText={val => {
                    setCardHolderName(val);
                  }}
                  onSubmitEditing={() => {}}
                  blurOnSubmit={true}
                  returnKeyType="next"
                  style={{
                    borderWidth: 1,
                    borderColor: '#CBCBCB',
                    borderRadius: 3,
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: 'Asap',
                    paddingVertical: 15,
                    paddingHorizontal: 12,
                    color: '#202020',
                  }}
                />
                <Text
                  style={{
                    color: '#202020',
                    fontSize: 16,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                    marginBottom: 10,
                    marginTop: 20,
                  }}>
                  Card number
                </Text>
                <TextInputMask
                  value={cardNumber}
                  // value={maskedCardNumber}
                  placeholder="Enter card number"
                  maxLength={19}
                  cursorColor="#FFAD00"
                  selectionColor={'#FFAD00'}
                  keyboardType={'number-pad'}
                  placeholderTextColor="#828282"
                  style={{
                    borderWidth: 1,
                    borderColor: '#CBCBCB',
                    borderRadius: 3,
                    fontSize: 15,
                    fontWeight: '400',
                    fontFamily: 'Asap',
                    paddingVertical: 15,
                    paddingHorizontal: 12,
                    color: '#202020',
                  }}
                  blurOnSubmit={true}
                  returnKeyType="done"
                  type={'custom'}
                  options={{
                    mask: '9999 9999 9999 9999',
                  }}
                  onChangeText={val => {
                    setMaskedCardNumber(val);
                    setCardNumber(
                      val.replace(' ', '').replace(' ', '').replace(' ', ''),
                    );
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#202020',
                      fontSize: 16,
                      fontWeight: '500',
                      fontFamily: 'Asap-Medium',
                      marginBottom: 10,
                    }}>
                    Expire Date
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      value={expMonth}
                      placeholder="MM"
                      cursorColor="#FFAD00"
                      selectionColor={'#FFAD00'}
                      keyboardType={'number-pad'}
                      placeholderTextColor="#828282"
                      onChangeText={val => {
                        setExpMonth(val);
                      }}
                      onSubmitEditing={() => {}}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      maxLength={2}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#CBCBCB',
                        borderRadius: 3,
                        fontSize: 15,
                        fontWeight: '400',
                        fontFamily: 'Asap',
                        paddingVertical: 15,
                        paddingHorizontal: 12,
                        color: '#202020',
                      }}
                    />
                    <View style={{width: 15}} />
                    <TextInput
                      value={expYear}
                      placeholder="YY"
                      cursorColor="#FFAD00"
                      selectionColor={'#FFAD00'}
                      keyboardType={'number-pad'}
                      placeholderTextColor="#828282"
                      onChangeText={val => {
                        setExpYear(val);
                      }}
                      onSubmitEditing={() => {}}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      maxLength={2}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#CBCBCB',
                        borderRadius: 3,
                        fontSize: 15,
                        fontWeight: '400',
                        fontFamily: 'Asap',
                        paddingVertical: 15,
                        paddingHorizontal: 12,
                        color: '#202020',
                      }}
                    />
                  </View>
                </View>
                <View style={{width: 15}} />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: '#202020',
                      fontSize: 16,
                      fontWeight: '500',
                      fontFamily: 'Asap-Medium',
                      marginBottom: 10,
                    }}>
                    CVV
                  </Text>
                  <TextInput
                    value={cvv}
                    placeholder="123"
                    maxLength={4}
                    cursorColor="#FFAD00"
                    selectionColor={'#FFAD00'}
                    keyboardType={'number-pad'}
                    placeholderTextColor="#828282"
                    onChangeText={val => {
                      setCvv(val);
                    }}
                    onSubmitEditing={() => {}}
                    blurOnSubmit={true}
                    returnKeyType="done"
                    style={{
                      borderWidth: 1,
                      borderColor: '#CBCBCB',
                      borderRadius: 3,
                      fontSize: 15,
                      fontWeight: '400',
                      fontFamily: 'Asap',
                      paddingVertical: 15,
                      paddingHorizontal: 12,
                      color: '#202020',
                    }}
                  />
                </View>
              </View>
              <View
                style={{marginHorizontal: 15, marginTop: 20, marginBottom: 20}}>
                <CustomRoundedBlackBtn
                  text={'ADD CARD'}
                  getClick={() => {
                    validateCardField();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          paddingHorizontal: 15,
          paddingVertical: 30,
        }}>
        {route?.params?.isFromAddCammodity ||
        route?.params?.isFromAddCammodityOnlyVault ? (
          <View>
            <FlatList
              data={vault}
              extraData={refresh}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      //alert(JSON.stringify(item));
                      if (route?.params?.amount >= item.amount) {
                        showCustomAlert('Not sufficient amount in your vault.');
                        return;
                      }
                      setPaymentMethodDetails(item);
                      if (
                        item.isSelected == false ||
                        item.isSelected == undefined
                      ) {
                        item.isSelected = true;
                        setApplePay(false);
                      }
                      for (let index = 0; index < cardList.length; index++) {
                        const element = cardList[index];
                        if (element.isSelected == true) {
                          element.isSelected = false;
                        }
                      }
                      setPaymentMethod(2);
                      setRefresh(!refresh);

                      //setTotalAmount(amount);

                      //getPaymentFee(amount);
                    }}>
                    <View
                      style={{
                        marginBottom: 20,
                        flexDirection: 'row',
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 8,
                        borderWidth: 1,
                        //borderColor: '#FF8F00',
                        borderColor: '#ffc700',
                      }}>
                      <Image
                        style={{height: 50, width: 50, resizeMode: 'cover'}}
                        source={require('../../../assets/images/wallet.png')}
                      />
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingStart: 20,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 17,
                            fontWeight: '500',
                            fontFamily: 'Asap-Medium',
                            marginBottom: 5,
                          }}>
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            color: '#626262',
                            fontSize: 13,
                            fontWeight: '400',
                            // lineHeight: 20,
                            fontFamily: 'Asap-Medium',
                          }}>
                          {item?.formatted_amount
                            ? item.formatted_amount
                            : '0.00'}{' '}
                          {item.cashUnit}
                        </Text>
                      </View>

                      {route?.params?.isFromAddCammodity ||
                      route?.params?.isFromAddCammodityOnlyVault ? (
                        item.isSelected == true ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/active_check_box.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_radio_inactive.png')}
                          />
                        )
                      ) : (
                        <TouchableOpacity
                          style={{padding: 5}}
                          onPress={() => {
                            Alert.alert(
                              'Alert',
                              'Do you want to delete this card?',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'Ok',
                                  onPress: () =>
                                    deleteCard(item.stripe_card_id),
                                },
                              ],
                              {cancelable: false},
                            );
                          }}>
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_delete_red.png')}
                          />
                        </TouchableOpacity>
                      )}

                      {route?.params?.isFromAddMoney ? (
                        item.isSelected == true ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/active_check_box.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_radio_inactive.png')}
                          />
                        )
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {route?.params?.isFromAddCammodityOnlyVault ? null : (
              <>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 17,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                    alignSelf: 'center',
                    marginBottom: 23,
                  }}>
                  OR
                </Text>
              </>
            )}
          </View>
        ) : null}
        {Platform.OS === 'ios' ? (
          route?.params?.fromCard ||
          route?.params?.isFromAddCammodityOnlyVault ? null : (
            <View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setApplePay(true);
                  setPaymentMethodDetails({name: 'apple pay'});
                  setPaymentMethod(3);
                  for (let index = 0; index < cardList.length; index++) {
                    const element = cardList[index];
                    if (element.isSelected == true) {
                      element.isSelected = false;
                    }
                  }
                  for (let index = 0; index < vault.length; index++) {
                    const element = vault[index];
                    if (element.isSelected == true) {
                      element.isSelected = false;
                    }
                  }
                }}
                style={{
                  height: 55,
                  backgroundColor: applePay ? 'black' : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginBottom: 23,
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: applePay ? 'white' : 'black',
                    fontSize: 19,
                    fontFamily: 'Asap-SemiBold',
                    // alignSelf: 'center',
                  }}>
                  Pay with{' '}
                  <Image
                    style={{
                      height: 16,
                      width: 14,
                      resizeMode: 'contain',
                      //  alignSelf: 'center',
                    }}
                    source={
                      applePay
                        ? require('../../../assets/images/active_apple_ico.png')
                        : require('../../../assets/images/inactive_apple_ico.png')
                    }
                  />
                </Text>
                <Text
                  style={{
                    color: applePay ? 'white' : 'black',
                    fontSize: 19,
                    fontFamily: 'Asap-SemiBold',
                    //  alignSelf: 'center',
                  }}>
                  Pay
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  fontWeight: '500',
                  fontFamily: 'Asap-Medium',
                  alignSelf: 'center',
                  marginBottom: cardList.length > 0 ? 23 : -10,
                }}>
                OR
              </Text>
            </View>
          )
        ) : null}
        {route?.params?.isFromAddCammodityOnlyVault ? null : cardList.length ? (
          <>
            <FlatList
              data={cardList}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setPaymentMethodDetails(item);

                      for (let index = 0; index < vault.length; index++) {
                        const element = vault[index];
                        if (element.isSelected == true) {
                          element.isSelected = false;
                        }
                      }

                      for (let index = 0; index < cardList.length; index++) {
                        const element = cardList[index];
                        if (element.isSelected == true) {
                          element.isSelected = false;
                        }
                      }

                      if (
                        item.isSelected == false ||
                        item.isSelected == undefined
                      ) {
                        setApplePay(false);
                        item.isSelected = true;
                      } else {
                        item.isSelected = false;
                      }

                      setPaymentMethod(1);
                      setRefresh(!refresh);
                    }}>
                    <View
                      style={{
                        marginBottom: 20,
                        flexDirection: 'row',
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#ffc700',
                      }}>
                      <Image
                        style={{height: 50, width: 50, resizeMode: 'cover'}}
                        source={require('../../../assets/images/icon_credit_card.png')}
                      />

                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          paddingStart: 20,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 17,
                            fontWeight: '500',
                            fontFamily: 'Asap-Medium',
                            marginBottom: 5,
                          }}>
                          XXXX XXXX XXXX {item.card_last_4_digits}
                        </Text>
                        <Text
                          style={{
                            color: '#626262',
                            fontSize: 13,
                            fontWeight: '400',
                            // lineHeight: 20,
                            fontFamily: 'Asap-Medium',
                          }}>
                          {item.card_expiry_month}/{item.card_expiry_year}
                        </Text>
                      </View>

                      {route?.params?.isFromAddCammodity ? (
                        item.isSelected ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/active_check_box.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_radio_inactive.png')}
                          />
                        )
                      ) : route?.params?.isFromAddMoney ? (
                        item.isSelected ? (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/active_check_box.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_radio_inactive.png')}
                          />
                        )
                      ) : (
                        <TouchableOpacity
                          style={{padding: 5}}
                          onPress={() => {
                            Alert.alert(
                              'Alert',
                              'Do you want to delete this card?',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'Ok',
                                  onPress: () =>
                                    deleteCard(item.stripe_card_id),
                                },
                              ],
                              {cancelable: false},
                            );
                            //  deleteCard(item.stripe_card_id);
                          }}>
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'cover',
                            }}
                            source={require('../../../assets/images/icon_delete_red.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        ) : (
          <Text
            style={{
              color: 'black',
              fontSize: 17,
              fontWeight: '500',
              fontFamily: 'Asap-Medium',
              alignSelf: 'center',
              marginBottom: 10,
            }}></Text>
        )}
        {route?.params?.isFromAddCammodityOnlyVault ? null : (
          <TouchableOpacity
            onPress={() => {
              setAddCardModal(true);
              setMaskedCardNumber('');
            }}
            activeOpacity={0.5}
            style={{
              marginBottom: route?.params?.isFromAddMoney ? 0 : 20,
              flexDirection: 'row',
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E1E0E0',
            }}>
            {/* <View>
              <GradientText
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Medium',
                  alignSelf: 'center',
                  marginTop: 3,
                }}>
                Add New Card
              </GradientText>
            </View> */}
            <Text
              style={{
                color: '#ffc700',
                fontSize: 16,
                fontWeight: '400',
                // lineHeight: 20,
                fontFamily: 'Asap-Medium',
              }}>
              Add New Card
            </Text>
          </TouchableOpacity>
        )}

        {route?.params?.isFromAddCammodity ||
        route?.params?.isFromAddCammodityOnlyVault ? (
          <>
            {/* <View
              style={{
                padding: 20,

                borderColor: '#D3D3D3',
                backgroundColor: '#D4D4D450',
                borderRadius: 10,
                borderWidth: 1,
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: 'Asap-Regular',
                    fontSize: 16,
                    color: '#101010',
                  }}>
                  Total amount
                </Text>
                <Text
                  style={{
                    fontFamily: 'Asap-Regular',
                    fontSize: 16,
                    color: '#101010',
                  }}>
                  {route?.params?.currencySign}
                  {route?.params?.amount}
                </Text>
              </View>
            </View> */}

            <View style={{marginTop: 20, flexDirection: 'column'}}>
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
                    {amount == '' ? '0.00' : amountByApiFormatted}
                    {/* {amount == '' ? '0.00' : parseFloat(amount).toFixed(2)} */}
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
                    {processingFeeType === '1'
                      ? processingFeeFormatted
                      : processingFee + '%'}
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
                    Gold app fee
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Asap-Medium',
                      fontWeight: '400',
                      fontSize: 15,
                      color: '#333333',
                    }}>
                    {formattedAdminCommission}
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
                    {totalAmountFormatted}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{height: 50}} />
            <CustomRoundedBlackBtn text={'PROCESS'} getClick={getClick} />

            <View style={{height: 150}} />
          </>
        ) : route?.params?.isFromAddMoney ? (
          <>
            <View
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
                  value={amount}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  placeholderTextColor={'#828282'}
                  returnKeyType={'done'}
                  editable={true}
                  onChangeText={textTyped => {
                    setAmount(textTyped);
                  }}
                  maxLength={10}
                  style={{
                    color: 'black',
                    fontFamily: 'Asap-Medium',
                    fontSize: 15,
                    fontWeight: '400',
                    width: '90%',
                    height: '100%',
                  }}></TextInputMask>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/amount_addmoney.png')}
                />
              </View>
            </View>
            <View style={{flexDirection: 'column'}}>
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
                    {amount == '' ? '0.00' : amountByApiFormatted}
                    {/* {amountInfo?.current.getRawValue()} */}
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
                    {processingFeeType === '1'
                      ? amount == ''
                        ? '0.00'
                        : processingFeeFormatted
                      : processingFee + '%'}
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
                    {amount == '' ? '0.00' : totalAmountFormatted}
                  </Text>
                </View>
              </View>
              <View style={{height: 50, marginBottom: 25}} />
              <CustomRoundedBlackBtn
                text={'PROCESS'}
                getClick={addAmountToVault}
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <Loader isVisible={isLoading} />
    </View>
  );
};
export default SavedCards;
