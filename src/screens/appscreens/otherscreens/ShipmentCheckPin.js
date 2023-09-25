/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useEffect} from 'react';
import CustomOtpInput from '../../../widgets/CustomOtpInput';
import Loader from '../../../widgets/customalert/Loader';
import AnimationModel from '../../../widgets/AnimationModel';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import {TextInputMask} from 'react-native-masked-text';
import {useApplePay} from '@stripe/stripe-react-native';

const ShipmentCheckPin = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
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
    veryfyPin();
  };
  //Apple Pay Start
  const {stripe, presentApplePay, confirmApplePayPayment, isApplePaySupported} =
    useApplePay();

  const payApple = async (client_secret, intent_id) => {
    let dtr = route?.params?.payment_gateway_fee.toString();
    let dtr1 = route?.params?.adminFee.toFixed(2).toString();
    let dtr2 = route?.params?.total_amount.toString();
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
      currency: route?.params?.currency,
    });
    confirmApplePayPaymentLocal(client_secret, intent_id);
  };

  const confirmApplePayPaymentLocal = async (client_secret, intent_id) => {
    const {error: confirmError} = await confirmApplePayPayment(client_secret);
    if (confirmError) {
    } else {
      createShipment(intent_id);
    }
  };
  //Apple Pay end
  const veryfyPin = async () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('transaction_pin', otp);
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.verifyTransactionPin, formdata).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            if (route?.params?.payment_method !== 1) {
              createShipment();
            } else {
              createIntent();
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
      formdata.append('currency', 'USD');
      formdata.append('payment_method', route?.params?.payment_method);
      formdata.append('stripe_customer_id', route?.params?.stripeCustomerId);
      if (route?.params?.paymentMethod != 3) {
        formdata.append('stripe_card_id', route.params.stripe_card_id);
      }
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.createIntent, formdata).then(
        ({ok, status, data, problem}) => {
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
    try {
      let formdata = new FormData();
      formdata.append('intent_id', intent_id);
      formdata.append('stripe_card_id', route?.params?.stripe_card_id);
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.confirmIntent, formdata).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            createShipment(data.data.id);
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

  const createShipment = intent => {
    try {
      let formdata = new FormData();
      formdata.append('rate_id', route?.params?.id);
      formdata.append('payment_intent', intent);
      Axiosinstance.post(ApiEndPoint.create_shipment, formdata).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setIsLoading(false);
            setisSessionExpired(true);
          } else if (ok) {
            setIsLoading(false);
            setLabel(data.message);
            setAnimatedModal(true);
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
        backText={'Go to MyShipment'}
        getClick={() => {
          setAnimatedModal(false);
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.navigate('MyShipment');
        }}
      />
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: 'white'}}
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
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
                unit: '$',
                suffixUnit: '',
              }}
              value={route?.params?.total_amount}
              numberOfLines={1}
            />

            <Text
              style={{
                color: '#000000',
                fontFamily: 'Asap-Medium',
                fontSize: 20,
                fontWeight: '500',
                marginTop: 25,
              }}>
              Enter Your 4-Digit Pin
            </Text>
            <View style={{padding: 15, marginTop: 10}}>
              <CustomOtpInput getOTP={getOTP} />
            </View>
          </View>

          <View style={{padding: 15, width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
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
export default ShipmentCheckPin;
