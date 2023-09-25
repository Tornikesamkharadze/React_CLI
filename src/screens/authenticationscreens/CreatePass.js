/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';
//Libraries

//Custom Widget
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../widgets/CustomAuthHeading';
import CustomTextField from '../../widgets/CustomTextField';
import Loader from '../../widgets/customalert/Loader';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const CreatePass = ({navigation, route}) => {
  const passRef = useRef();
  const confirmPassRef = useRef();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    let regPass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{4,}/;
    if (!password.trim()) {
      showCustomAlert('Please enter password');
      return;
    }
    if (!regPass.test(password.trim())) {
      showCustomAlert(
        'Password must contain at least one uppercase, lowercase, number, and a special character.',
      );
      return;
    }
    if (!confirmPassword.trim()) {
      showCustomAlert('Please enter confirm password');
      return;
    }
    if (confirmPassword.trim() !== password.trim()) {
      showCustomAlert(
        'The passwords do not match, please enter your password, and confirm by entering again.',
      );
      return;
    }
    createPassApi();
  };
  const getPassValue = pass => {
    setPassword(pass);
  };
  const getConfirmPassValue = pass => {
    setConfirmPassword(pass);
  };
  //Api calls
  // fullname:string (Required)
  // email: email (Required)
  // dob: date (Required)
  // both_address_same_chk: {0: NO, 1:YES}
  // phone_dial_code:string (Required)
  // phone_number:number (Required)
  // ssn_number: Number (Required)
  // address:JSON (Required)
  // shipping_address:JSON (Required)
  // password: string (Required)
  // cnf_password: string (Required )
  // fullname is require and should be minimum 2 & maximum 30.
  // ssn_number is require and should be minimum  & maximum 4.

  const createPassApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('fullname', route.params.name);
      formdata.append('email', route.params.email);
      formdata.append('dob', route.params.dob);
      formdata.append(
        'both_address_same_chk',
        route.params.both_address_same_chk,
      );
      formdata.append('phone_dial_code', route.params.countryCodeSend);
      formdata.append('phone_number', route.params.contactNumberSend);
      formdata.append('ssn_number', route.params.securityNumber);
      formdata.append('address', JSON.stringify(route.params.address));
      formdata.append(
        'shipping_address',
        JSON.stringify(route.params.shippingAddress),
      );
      formdata.append('action_type', 2);

      formdata.append('password', password.trim());
      formdata.append('cnf_password', confirmPassword.trim());
      formdata.append('signup_type', route.params.signup_type);
      formdata.append('social_type', route.params.social_type);
      formdata.append('social_key', route.params.social_key);
      Axiosinstance.post(ApiEndPoint.createProfile, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
          //  alert(JSON.stringify(data.data))
            navigation.navigate('CreatePin', {
              countryCodeSend: route.params.countryCodeSend,
              contactNumberSend: route.params.contactNumberSend,
              bank_url: data.data.stripe_onboarding_url
            });
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
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
                topHeading={'Create password'}
                bottomHeading={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
              <View style={{height: 50}} />
              <CustomTextField
                ref={passRef}
                placeholder={'Password'}
                getValue={getPassValue}
                keyboardType={'default'}
                onSubmitEditing={() => {
                  confirmPassRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View style={{height: 20}} />
              <CustomTextField
                ref={confirmPassRef}
                placeholder={'Confirm password'}
                getValue={getConfirmPassValue}
                keyboardType={'default'}
                blurOnSubmit={true}
              />

              <View style={{height: 90}} />
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

export default CreatePass;
