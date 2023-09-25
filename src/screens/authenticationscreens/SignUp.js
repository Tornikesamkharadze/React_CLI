/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';

//Custom Widget
import PhoneNumberField from '../../widgets/PhoneNumberField';
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import Loader from '../../widgets/customalert/Loader';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const SignUp = ({navigation, route}) => {
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setcountryCode] = useState('+1');
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
    //  alert(customAlertVisible);
    if (!countryCode.trim()) {
      showCustomAlert('Please enter valid country code');
      return;
    }
    if (!contactNumber.trim()) {
      showCustomAlert('Please enter your number');
      return;
    }
    if (!/^\d+$/.test(contactNumber.trim())) {
      showCustomAlert('Please check your number again');
      return;
    }
    if (contactNumber.trim().length < 6) {
      showCustomAlert('Please check your number again');
      return;
    }
    signUpApi();
  };
  const getNumber = number => {
    setContactNumber(number);
  };
  const getCountryCode = countryCodeVal => {
    setcountryCode(countryCodeVal);
  };
  //Api calls
  const signUpApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('phone_dial_code', countryCode);
      formdata.append('phone_number', contactNumber);

      Axiosinstance.post(ApiEndPoint.createAccount, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);

          if (ok) {
            // alert(data.data.otp);
            navigation.navigate('VerifyOtp', {
              countryCodeSend: countryCode,
              contactNumberSend: contactNumber,
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
  return (
    <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
      <View>
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={() => {
            setCustomAlertVisible(false);
          }}
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
                  resizeMode: 'cover',
                  aspectRatio: 1.45 / 1,
                }}
              />
            </View>

            <View style={{padding: 15, backgroundColor: 'white'}}>
              <View style={{height: 10}} />
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#101010',
                    // lineHeight: 35,
                    fontSize: 25,
                    fontWeight: '700',
                    fontFamily: 'Asap-Medium',
                    textTransform: 'uppercase',
                    marginHorizontal: 10,
                  }}>
                  Welcome to
                  <Text
                    style={{
                      color: '#ffc700',
                    }}>
                    {' '}
                    Gold App{' '}
                  </Text>
                  Safest investing
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#82806C',
                    // lineHeight: 20,
                    fontSize: 14,
                    fontWeight: '400',
                    fontFamily: 'Asap-Medium',
                    //   textTransform: 'uppercase',
                    marginTop: 15,
                    marginHorizontal: 30,
                  }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <View style={{height: 50}} />
              <PhoneNumberField
                getNumber={getNumber}
                getCountryCode={getCountryCode}
                blurOnSubmit={true}
              />
              <View style={{height: 120}} />
              <CustomRoundedBlackBtn
                showCustomAlert={showCustomAlert}
                getClick={getClick}
                text={'CONTINUE'}
              />
              <Text
                style={{
                  marginVertical: 18,
                  textAlign: 'center',
                  color: '#333333',
                  // lineHeight: 20,
                  fontSize: 15,
                  fontWeight: '500',
                  fontFamily: 'Asap-Medium',
                }}>
                Don't have an account yet?
                <Text
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    color: '#ffc700',
                  }}>
                  {' '}
                  Sign In{' '}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <Loader isVisible={isLoading} />
    </StatusBarCompo>
  );
};

export default SignUp;
