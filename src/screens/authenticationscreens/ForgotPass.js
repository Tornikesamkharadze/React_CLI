/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

//Custom Widget
import PhoneNumberField from '../../widgets/PhoneNumberField';
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../widgets/CustomAuthHeading';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';
import CustomTextField from '../../widgets/CustomTextField';

import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';
import Loader from '../../widgets/customalert/Loader';

//Path
const iconsLocker = '../../assets/images/icon_lock.png';

const ForgotPass = ({navigation, route}) => {
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setcountryCode] = useState('+1');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

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
    //  setCustomAlertVisible(false);
  };

  const getEmailValue = val => {
    setEmail(val);
  };

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const getClick = () => {
    if (!email.trim()) {
      showCustomAlert('Please enter your email');
      return;
    }
    if (!validateEmail(email.trim())) {
      showCustomAlert('Please check your email again');
      return;
    }

    // if (!countryCode.trim()) {
    //   showCustomAlert('Please enter valid country code');
    //   return;
    // }
    // if (!contactNumber.trim()) {
    //   showCustomAlert('Please enter your number');
    //   return;
    // }
    // if (!/^\d+$/.test(contactNumber.trim())) {
    //   showCustomAlert('Please check your number again');
    //   return;
    // }
    // if (contactNumber.trim().length < 6) {
    //   showCustomAlert('Please check your number again');
    //   return;
    // }
    resetPasswordApi();
  };

  resetPasswordApi = () => {
    setIsLoading(true);
    try {
      Axiosinstance.post(ApiEndPoint.forgotPass, {
        email: email,
      }).then(({ok, status, data, problem}) => {
        setIsLoading(false);
        if (ok) {
          navigation.goBack();
        } else {
          showCustomAlert(data.message);
        }
      });
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getNumber = number => {
    setContactNumber(number);
    console.log(number);
  };
  const getCountryCode = countryCodeVal => {
    setcountryCode(countryCodeVal);
  };
  return (
    <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
      <View>
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{backgroundColor: 'white'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'white', height: '100%'}}
            contentInsetAdjustmentBehavior="automatic">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                paddingHorizontal: 15,
                paddingTop: 10,
                alignSelf: 'flex-start',
              }}>
              <View
                style={{
                  backgroundColor: 'black',
                  padding: 8,
                  borderRadius: 15,
                }}>
                <Image
                  style={{height: 10, width: 10}}
                  source={require('../../assets/images/icon_back.png')}
                />
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require(iconsLocker)}
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  aspectRatio: 3 / 2,
                }}
              />
            </View>

            <View style={{padding: 15, backgroundColor: 'white'}}>
              <View style={{height: 10}} />
              <CustomAuthHeading
                topHeading={'Forgot your password?'}
                bottomHeading={
                  'Please enter your email, You will receive a new password via email.'
                }
              />
              <View style={{height: 50}} />
              {/* <PhoneNumberField
                getNumber={getNumber}
                getCountryCode={getCountryCode}
              /> */}
              <CustomTextField
                placeholder={'Email'}
                defaultValue={route?.params?.sEmail}
                getValue={getEmailValue}
                keyboardType={'email-address'}
                blurOnSubmit={true}
              />

              <View style={{height: 120}} />
              <CustomRoundedBlackBtn
                showCustomAlert={showCustomAlert}
                getClick={getClick}
                text={'CONTINUE'}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <Loader isVisible={isLoading} />
    </StatusBarCompo>
  );
};

export default ForgotPass;
