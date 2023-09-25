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
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useState} from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useEffect} from 'react';
import CustomKeyboard from '../../../widgets/CustomKeyboard';
import CustomAuthHeading from '../../../widgets/CustomAuthHeading';
import CustomOtpInput from '../../../widgets/CustomOtpInput';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import Loader from '../../../widgets/customalert/Loader';
import AnimationModel from '../../../widgets/AnimationModel';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import {TextInputMask} from 'react-native-masked-text';
import {useApplePay} from '@stripe/stripe-react-native';

const CheckPin = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [convertionData, setConvertionData] = useState();
  const [otp, setOtp] = useState('');
  const [animatedModal, setAnimatedModal] = useState(false);
  const [label, setLabel] = useState('');
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [istrue, setIstrue] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIstrue(true);
    } else {
      setIstrue(false);
    }
  }, [isLoading]);

  const showCustomAlert = text => {
    //alert(text);
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

  // //navigatin header ui
  // navigation.setOptions({
  //   headerShadowVisible: false, // remove shadow on Android
  //   headerTitleAlign: 'center',
  //   headerStyle: {
  //     backgroundColor: 'white',
  //     height: Platform.OS === 'android' ? 80 : 120,
  //     elevation: 0, // remove shadow on Android
  //     shadowOpacity: 0, // remove shadow on iOS
  //   },
  //   headerTitle: () => null,
  //   headerLeft: () => (
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}>
  //       <TouchableOpacity
  //         style={{
  //           height: 30,
  //           width: 30,
  //           backgroundColor: '#333333',
  //           borderRadius: 15,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //         }}
  //         onPress={() => {
  //           navigation.goBack();
  //         }}>
  //         <Image
  //           style={{
  //             height: 15,
  //             width: 15,
  //             resizeMode: 'cover',
  //           }}
  //           source={require('../../../assets/images/icon_back.png')}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   ),
  //   headerRight: () => null,
  // });
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
          Check Pin
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

  useEffect(() => {
    getToken();
    return () => {
      setIsLoading(false);
    };
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setAccessToken(token);
  };
  const getOTP = number => {
    setOtp(number);
  };

  const getClick = () => {
    // alert(route?.params?.amount + ' ' + route?.params?.total_amount);
    // return;
    if (!otp.trim()) {
      showCustomAlert('Please enter pin');
      return;
    }
    if (!/^\d+$/.test(otp.trim())) {
      showCustomAlert('Incorrect pin');
      return;
    }
    if (otp.trim().length < 4) {
      showCustomAlert('Incorrect pin');
      return;
    }
    getComodities();
  };

  //Api calls
  const requestAction = async () => {
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('request_id', route?.params?.requestId);
      formdata.append('action', route?.params?.action);
      formdata.append('admin_brokerage', route?.params?.adminFee);

      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.requestAction, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            setLabel(data.message);
            setAnimatedModal(true);

            // Alert.alert(
            //   'Alert',
            //   data.message,
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => navigation.goBack(),
            //     },
            //   ],
            //   {cancelable: false},
            // );
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

  const getComodities = async () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('transaction_pin', otp);
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.verifyTransactionPin, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            // return;
            if (route?.params?.from == 'Send') {
              sendCommodity(); //done
            } else if (route?.params?.from == 'SENDQR') {
              sendCommodity(); //done
            } else if (route?.params?.from == 'Request') {
              requestCommodity(); //done
            } else if (route?.params?.from == 'REQUESTQR') {
              requestCommodity(); //done
            } else if (route?.params?.from == 'AddMoney') {
              createIntent(); //2506 // done
              //alert(JSON.stringify(route?.params));
            } else if (route?.params?.from == 'WithDrawCash') {
              withdrawCashFromVault(); //done
            } else if (route?.params?.from == 'CommodityToCash') {
              commodityToCash(); //done
            } else if (route?.params?.from == 'SHIP') {
              shipCommodityToGoldApp(); //done
            } else if (route?.params?.from == 'PHYSICAL_DELIVERY') {
              physicalDeliveryFromGoldApp(); //done
            } else if (route?.params?.from == 'RequestAction') {
              requestAction(); //done
            } else {
              if (
                route?.params?.paymentMethod == 1 ||
                route?.params?.paymentMethod == 3
              ) {
                createIntent();
              } else {
                addCommodity('');
              }
            }
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

  const createIntent = () => {
    try {
      let formdata = new FormData();
      formdata.append('total', route?.params?.total_amount);
      formdata.append('currency', route?.params?.currency);
      formdata.append('payment_method', route?.params?.paymentMethod);
      formdata.append('stripe_customer_id', route?.params?.stripeCustomerId);
      if (route?.params?.paymentMethod != 3) {
        formdata.append(
          'stripe_card_id',
          route.params.paymentMethodDetails.stripe_card_id,
        );
      }
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.createIntent, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            if (route?.params?.paymentMethod == 3) {
              setIsLoading(false);
              payApple(data.data.client_secret, data.data.intent_id);
            } else {
              confirmIntent(data.data.intent_id);
            }
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

  const confirmIntent = intent_id => {
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('intent_id', intent_id);
      formdata.append(
        'stripe_card_id',
        route?.params?.paymentMethodDetails.stripe_card_id,
      );

      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.confirmIntent, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            //alert(route?.params?.from);
            if (route?.params?.from == 'AddMoney') {
              //alert(route?.params?.from);

              addMoneyToVault(intent_id);
            } else {
              addCommodity(intent_id);
            }
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

  const addCommodity = intent_id => {
    try {
      let formdata = new FormData();

      formdata.append('commodity_id', route?.params?.commodityId);
      formdata.append('total_quantity', route?.params?.quantity);
      formdata.append('quantity_unit', route?.params?.quantityUnit);
      formdata.append(
        'commodity_current_rate_in_gram',
        route?.params?.commodityId,
      );
      formdata.append('commodity_amount', route?.params?.amount);
      formdata.append('commodity_amount_unit', route?.params?.currency);
      formdata.append('payment_method', route?.params?.paymentMethod);
      formdata.append('intent_id', intent_id);
      formdata.append(
        'payment_gateway_fee',
        route?.params?.payment_gateway_fee,
      );
      formdata.append('total_amount', route?.params?.total_amount);

      formdata.append('admin_brokerage', route?.params?.adminFee);

      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.addCommodity, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel('Great Work, your commodity successfully added.');
            setAnimatedModal(true);
            setIsLoading(false);
            // }, 1000);
          } else {
            setIstrue(false);
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const sendCommodity = () => {
    // alert(route.params. )
    // setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', route?.params?.commodityId);
      formdata.append('quantity', route?.params?.quantity);
      formdata.append('quantity_unit', route?.params?.quantityUnit);
      formdata.append('receiver_id', route?.params?.selectedUser.id);
      formdata.append('admin_brokerage', route?.params?.adminFee);
      formdata.append('brokerage_currency', route?.params?.currency);

      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.sendComodity, formdata).then(
        ({ok, status, data, problem}) => {
          // setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
            return;
          }
          if (ok) {
            // setTimeout(() => {
            setIsLoading(false);
            setAnimatedModal(true);
            setLabel('Great Work, you successfully transferred commodity.');
            // }, 1000);
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

  const requestCommodity = () => {
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('request_commodity_id', route?.params?.commodityId);
      formdata.append('request_commodity_quantity', route?.params?.quantity);
      formdata.append('quantity_unit', route?.params?.quantityUnit);
      formdata.append('request_to', route?.params?.selectedUser.id);
      formdata.append('admin_brokerage', route?.params?.adminFee);
      formdata.append('currency_unit', route?.params?.currency);
      console.log(formdata);

      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.requestCommodity, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
            return;
          }

          if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel('Your request successfully sent.');
            setAnimatedModal(true);
            // }, 1000);
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

  const addMoneyToVault = intent_id => {
    try {
      let formdata = new FormData();
      formdata.append('total_cash', parseFloat(route?.params?.amount));
      formdata.append('cash_unit', 'USD');
      formdata.append('payment_method', '1');
      formdata.append('intent_id', intent_id);
      formdata.append(
        'payment_gateway_fee',
        parseFloat(route?.params?.payment_gateway_fee),
      );
      formdata.append('total_amount', parseFloat(route?.params?.total_amount));
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.addMoneyIntoVault, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel(data.message);
            setAnimatedModal(true);
            // }, 1000);
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
  const withdrawCashFromVault = async () => {
    //  setIsLoading(true);
    try {
      // "1. total_cash: String
      //     -> Required
      // 2. cash_unit: String
      //     -> Required
      //     -> EUR/USD/CAD
      // 3. payment_gateway_fee: String
      //     -> Required
      // 4. total_amount: String
      //     -> Required
      // 5. reference_id: String
      //     -> Required"
      // 1. total_cash: String
      //     -> Required
      // 2. cash_unit: String
      //     -> Required
      //     -> EUR/USD/CAD
      // 3. payment_gateway_fee: String
      //     -> Required
      // 4. total_amount: String
      //     -> Required"
      let formdata = new FormData();
      formdata.append('total_cash', route?.params?.totalAmount);
      formdata.append('cash_unit', 'USD');
      formdata.append('payment_gateway_fee', route?.params?.processingFee);
      formdata.append('total_amount', route?.params?.amount);
      const token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.withdrawCash, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel(data.message);
            setAnimatedModal(true);
            // }, 1000);
          } else {
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  const commodityToCash = async () => {
    //     "1. commodity_id: Number
    //     -> Required
    // 2. total_quantity: String
    //     -> Required
    // 3. quantity_unit: Number
    //     -> Required
    //     -> gram, grain, oz"
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', route?.params?.commodity_id);
      formdata.append('total_quantity', route?.params?.total_quantity);
      formdata.append('quantity_unit', route?.params?.quantity_unit);

      const token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.convert_into_cash, formdata).then(
        ({ok, status, data, problem}) => {
          //   setIsLoading(false);
          if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel(data.message);
            setAnimatedModal(true);
            // }, 1000);
          } else {
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  const shipCommodityToGoldApp = async () => {
    //   "1. commodity_id: Number
    //     -> Required
    // 2. total_quantity: String
    //     -> Required
    // 3. quantity_unit: Number
    //     -> Required
    //     -> gram, grain, oz"
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', route?.params?.commodity_id);
      formdata.append('total_quantity', route?.params?.total_quantity);
      formdata.append('quantity_unit', route?.params?.quantity_unit);

      const token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.deliver_physical, formdata).then(
        ({ok, status, data, problem}) => {
          //   setIsLoading(false);
          if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel(data.message);
            setAnimatedModal(true);
            // }, 1000);
            // navigation.goBack();
            // navigation.goBack();
            // navigation.goBack();
          } else {
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  const physicalDeliveryFromGoldApp = async () => {
    //   "1. commodity_id: Number
    //     -> Required
    // 2. total_quantity: String
    //     -> Required
    // 3. quantity_unit: Number
    //     -> Required
    //     -> gram, grain, oz"
    //  setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', route?.params?.commodity_id);
      formdata.append('total_quantity', route?.params?.total_quantity);
      formdata.append('quantity_unit', route?.params?.quantity_unit);

      const token = await AsyncStorage.getItem('token');
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.receive_physical, formdata).then(
        ({ok, status, data, problem}) => {
          //  setIsLoading(false);
          if (ok) {
            setIsLoading(false);
            // setTimeout(() => {
            setLabel(data.message);
            setAnimatedModal(true);
            // }, 1000);
            // navigation.goBack();
            // navigation.goBack();
            // navigation.goBack();
          } else {
            setIsLoading(false);
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };
  //Apple Pay Start
  const {stripe, presentApplePay, confirmApplePayPayment, isApplePaySupported} =
    useApplePay();

  const payApple = async (client_secret, intent_id) => {
    if (route?.params?.from != 'AddMoney') {
      let dtr = route?.params?.payment_gateway_fee.toString();
      let dtr2 = route?.params?.total_amount.toString();
      let dtr1 = route?.params?.adminFee.toFixed(2).toString();
      let str = route?.params?.amount.toString();

      if (!isApplePaySupported) return;
      await presentApplePay({
        cartItems: [
          {
            label: 'Amount',
            amount: str,
            quantity: '0',
            paymentType: 'Immediate',
          },
          {
            label: 'Stripe fee',
            amount: dtr,
            quantity: '0',
            paymentType: 'Immediate',
          },
          {
            label: 'Gold app fee',
            amount: dtr1,
            quantity: '0',
            paymentType: 'Immediate',
          },
          {
            label: 'Gold',
            amount: dtr2,
            quantity: '0',
            paymentType: 'Immediate',
          },
        ],
        country: 'US',
        currency: 'USD',
      });
      confirmApplePayPaymentLocal(client_secret, intent_id);
    } else {
      let dtr = route?.params?.payment_gateway_fee.toString();
      let dtr2 = route?.params?.total_amount.toString();
      let str = route?.params?.amount.toString();

      if (!isApplePaySupported) return;
      const {error} = await presentApplePay({
        cartItems: [
          {
            label: 'Amount',
            amount: str,
            quantity: '0',
            paymentType: 'Immediate',
          },
          {
            label: 'Stripe fee',
            amount: dtr,
            quantity: '0',
            paymentType: 'Immediate',
          },
          {
            label: 'Gold',
            amount: dtr2,
            quantity: '0',
            paymentType: 'Immediate',
          },
        ],
        country: 'US',
        currency: 'USD',
      });
      confirmApplePayPaymentLocal(client_secret, intent_id);
    }
  };

  const confirmApplePayPaymentLocal = async (client_secret, intent_id) => {
    const {error: confirmError} = await confirmApplePayPayment(client_secret);
    if (confirmError) {
    } else {
      if (route?.params?.from == 'AddMoney') {
        addMoneyToVault(intent_id);
      } else {
        addCommodity(intent_id);
      }
    }
  };
  //Apple Pay end
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <AnimationModel
        modalvisible={animatedModal}
        label={label}
        backText={
          route.params.toBack == 'vault'
            ? 'Back To Vault'
            : route.params.toBack == 'conversion'
            ? 'Back To Conversions'
            : 'Back To Home'
        }
        getClick={() => {
          setAnimatedModal(false);
          if (route?.params?.toBack == 'vault') {
            if (route?.params?.from == 'Send') {
              navigation.goBack();
              navigation.goBack();
              return;
            }
          }

          if (route?.params?.paymentMethod != 1) {
            if (route?.params?.from != 'Request') {
              navigation.goBack();
            }

            if (
              route?.params?.from != 'Send' ||
              route?.params?.from != 'Request'
            ) {
              navigation.goBack(null, {fromSuccess: true});
            }
            if (
              route?.params?.from != 'WithDrawCash' ||
              route?.params?.from != 'Send' ||
              route?.params?.from != 'SEND' ||
              route?.params?.from != 'Request'
            ) {
              navigation.goBack();
            }

            if (
              route?.params?.from == 'AddMoney' ||
              route?.params?.from == 'WithDrawCash' ||
              route?.params?.from == 'CommodityToCash' ||
              route?.params?.from == 'SHIP' ||
              route?.params?.from == 'PHYSICAL_DELIVERY' ||
              route?.params?.from == 'Send' ||
              route?.params?.from == 'Request'
            ) {
            } else {
              navigation.goBack();
            }
          } else {
            navigation.goBack();

            if (
              route?.params?.from != 'Send' ||
              route?.params?.from != 'Request'
            ) {
              navigation.goBack(null, {fromSuccess: true});
            }

            if (
              route?.params?.from == 'AddMoney' ||
              route?.params?.from == 'WithDrawCash' ||
              route?.params?.from == 'CommodityToCash' ||
              route?.params?.from == 'SHIP' ||
              route?.params?.from == 'PHYSICAL_DELIVERY' ||
              route?.params?.from == 'Send' ||
              route?.params?.from == 'Request'
            ) {
            } else {
              navigation.goBack();
            }
          }

          if (route?.params?.from == 'SENDQR') {
            navigation.goBack();
          }
          if (route?.params?.from == 'REQUESTQR') {
            navigation.goBack();
            navigation.goBack();
          }
        }}
      />
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: 'white'}}
        behavior={Platform.OS == 'ios' ? 'position' : 'padding'}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../assets/images/icon_locker.png')}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  aspectRatio: 1.45 / 1,
                }}
              />
            </View>
            <Text
              style={{
                color: '#101010',
                fontFamily: 'Asap-Medium',
                fontSize: 25,
                fontWeight: '700',
                marginTop: 40,
              }}>
              Verify Pin
            </Text>
            {route?.params?.amount ? (
              <TextInputMask
                editable={false}
                style={{
                  color: '#ffc700',
                  fontFamily: 'Asap-Medium',
                  fontSize: 20,
                  fontWeight: '500',
                  marginTop: 10,
                }}
                type={'money'}
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  unit: route?.params?.currency == 'EUR' ? '€' : '$',
                  suffixUnit: '',
                }}
                value={
                  route?.params?.total_amount_formatted
                    ? route?.params?.total_amount_formatted
                    : route?.params?.amount
                }
                numberOfLines={1}></TextInputMask>
            ) : null}

            {route?.params?.from == 'SENDQR' ||
            route?.params?.from == 'Send' ||
            route?.params?.from == 'CommodityToCash' ||
            route?.params?.from == 'PHYSICAL_DELIVERY' ||
            route?.params?.from == 'RequestAction' ? (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 16, color: 'black'}}>
                  {' '}
                  Admin fee{' '}
                </Text>

                <Text
                  style={{textAlign: 'center', fontSize: 10, color: 'black'}}>
                  {' '}
                  {'(This amount deduct from your vault balance)'}
                </Text>
                <TextInputMask
                  editable={false}
                  style={{
                    textAlign: 'center',
                    //  color: '#FF8F00',
                    color: '#ffc700',
                    fontFamily: 'Asap-Medium',
                    fontSize: 12,
                    fontWeight: '400',
                    marginTop: Platform.OS == 'ios' ? 0 : -5,
                  }}
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: '.',
                    delimiter: ',',
                    unit: route?.params?.currency == 'EUR' ? '€' : '$',
                    suffixUnit: '',
                  }}
                  value={route?.params?.formattedAdminCommission}
                  numberOfLines={1}></TextInputMask>
              </View>
            ) : null}

            <Text
              style={{
                color: '#000000',
                fontFamily: 'Asap-Medium',
                fontSize: 20,
                fontWeight: '500',
                marginTop: 50,
              }}>
              Enter Your 4-Digit Pin
            </Text>
            <View style={{padding: 15, marginTop: 10}}>
              <CustomOtpInput getOTP={getOTP} />
            </View>
          </View>

          <View style={{padding: 15, width: '100%'}}>
            {/* <CustomRoundedBlackBtn
              getClick={() => {
                getClick();
              }}
              text={'DONE'}
            /> */}

            <TouchableOpacity
              onPress={() => {
                // setIstrue(true);
                getClick();
              }}
              disabled={istrue}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: 'black',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontWeight: '500',
                  // lineHeight: 20,
                  fontFamily: 'Asap-Medium',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <Loader isVisible={isLoading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default CheckPin;
