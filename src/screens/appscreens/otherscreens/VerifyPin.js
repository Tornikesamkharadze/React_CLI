/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {BackHandler} from 'react-native';

//Custom Widget
import CustomOtpInput from '../../../widgets/CustomOtpInput';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../../widgets/CustomAuthHeading';
import CustomSuccessAlert from '../../../widgets/customalert/CustomSuccessAlert';
import Loader from '../../../widgets/customalert/Loader';
import StatusBarCompo from '../../../widgets/customalert/StatusBarCompo';

//Path
const iconsLocker = '../../../assets/images/ico_pin_lock.png';

import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VerifyPin = ({navigation, route}) => {
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [customSuccessAlertVisible, setCustomSuccessAlertVisible] =
    useState(false);
  const [customSuccessAlertText, setCustomSuccessAlertText] = useState('');
  const [customSuccessAlertTextTwo, setCustomSuccessAlertTextTwo] =
    useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [accessToken, setAccessToken] = useState('');

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

  const showCustomSuccessAlert = (text, textTwo) => {
    setCustomSuccessAlertVisible(true);
    setCustomSuccessAlertText(text);
    setCustomSuccessAlertTextTwo(textTwo);
  };
  //   const hideCustomSuccessAlert = () => {
  //     setCustomSuccessAlertVisible(false);
  //     navigation.navigate('SignIn');
  //   };

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

    getToken();
  };
  const getOTP = number => {
    setOtp(number);
  };
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    verifyPinApi(token);
  };

  const verifyPinApi = token => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('transaction_pin', otp);
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.verifyTransactionPin, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            navigation.navigate('ChangePin');
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  //   useEffect(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       () => {
  //         // Do not allow the screen to go back
  //         return true;
  //       },
  //     );

  //     return () => {
  //       backHandler.remove();
  //     };
  //   }, []);

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
          Change Pin
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
    <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
      <View>
        <Loader isVisible={isLoading} />

        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <CustomSuccessAlert
          isVisible={customSuccessAlertVisible}
          // hideAlert={hideCustomSuccessAlert}
          alertText={customSuccessAlertText}
          alertTextTwo={customSuccessAlertTextTwo}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{backgroundColor: 'white'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'white', height: '100%'}}
            contentInsetAdjustmentBehavior="automatic">
            <View
              style={{
                justifyContent: 'center',
                marginTop: windowHeight * 0.05,
              }}>
              <Image
                source={require(iconsLocker)}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  //aspectRatio: 1.45 / 1,
                  height: 131,
                  width: 131,
                }}
              />
            </View>

            <View style={{padding: 15, backgroundColor: 'white'}}>
              <View style={{height: 10}} />
              <CustomAuthHeading
                topHeading={'CURRENT PIN'}
                bottomHeading={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
              <View style={{height: 50}} />
              <CustomOtpInput getOTP={getOTP} />

              <View style={{height: 140}} />
              <View
                style={{
                  marginTop: windowHeight * 0.05,
                }}>
                <CustomRoundedBlackBtn
                  showCustomAlert={showCustomAlert}
                  getClick={getClick}
                  text={'RESET PIN'}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </StatusBarCompo>
  );
};

export default VerifyPin;
