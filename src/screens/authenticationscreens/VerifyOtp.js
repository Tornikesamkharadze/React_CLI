/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';

//Custom Widget
import CustomOtpInput from '../../widgets/CustomOtpInput';
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../widgets/CustomAuthHeading';
import Loader from '../../widgets/customalert/Loader';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const VerifyOtp = ({navigation, route}) => {
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [otp, setOtp] = useState('');
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
  };
  const getClick = () => {
    if (!otp.trim()) {
      showCustomAlert('Please enter otp');
      return;
    }
    if (!/^\d+$/.test(otp.trim())) {
      showCustomAlert('Incorrect otp');
      return;
    }
    if (otp.trim().length < 4) {
      showCustomAlert('Incorrect otp');
      return;
    }
    verifyOtpApi();
  };
  const getOTP = number => {
    setOtp(number);
  };
  //Api calls
  const verifyOtpApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('phone_dial_code', route.params.countryCodeSend);
      formdata.append('phone_number', route.params.contactNumberSend);
      formdata.append('verificaction_code', otp);
      Axiosinstance.post(ApiEndPoint.verifyPhoneNumber, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            navigation.navigate('Registration', {
              countryCodeSend: route.params.countryCodeSend,
              contactNumberSend: route.params.contactNumberSend,
              user: route?.params?.user,
              signUpBy: route?.params?.signUpBy,
              sName: route?.params?.sName,
              sEmail: route?.params?.sEmail,
            });
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
  };
  const signUpApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('phone_dial_code', route.params.countryCodeSend);
      formdata.append('phone_number', route.params.contactNumberSend);

      Axiosinstance.post(ApiEndPoint.createAccount, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);

          if (ok) {
            //  alert(data.data.otp);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
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
                  aspectRatio: 1.45 / 1,
                }}
              />
            </View>

            <View style={{padding: 15, backgroundColor: 'white'}}>
              <View style={{height: 10}} />
              <CustomAuthHeading
                topHeading={'Verification Code'}
                bottomHeading={`Please type the verification code sent to ${
                  route.params.countryCodeSend
                }${'*'.repeat(
                  route.params.contactNumberSend.length - 4,
                )}${route.params.contactNumberSend.slice(-4)}`}
              />
              <View style={{height: 50}} />
              <CustomOtpInput getOTP={getOTP} />
              <Text
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 10,
                  fontFamily: 'Asap-Medium',
                  fontWeight: '500',
                  color: '#202020',
                  // lineHeight: 20,
                  fontSize: 12,
                }}>
                Didn't get the code?
                <Text
                  onPress={() => {
                    signUpApi();
                  }}
                  style={{
                    color: '#ffc700',
                  }}>
                  {' '}
                  Resend{' '}
                </Text>
              </Text>

              <View style={{height: 120}} />
              <CustomRoundedBlackBtn
                showCustomAlert={showCustomAlert}
                getClick={getClick}
                text={'VERIFY'}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <Loader isVisible={isLoading} />
    </StatusBarCompo>
  );
};

export default VerifyOtp;
