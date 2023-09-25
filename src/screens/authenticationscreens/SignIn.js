/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {Modal} from 'react-native';

//Custom Widget
import PhoneNumberField from '../../widgets/PhoneNumberField';
import CustomTextField from '../../widgets/CustomTextField';
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import SocialBtn from '../../widgets/SocialBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';
import Loader from '../../widgets/customalert/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../authContext/AuthContexts';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Settings,
} from 'react-native-fbsdk-next';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const SignIn = ({navigation}) => {
  const [isVisible, setIsVisible] = useState(false);

  const numberRef = useRef();
  const passRef = useRef();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setcountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const showCustomAlert = text => {
    setCustomAlertVisible(true);
    setCustomAlertText(text);
  };
  const hideCustomAlert = () => {
    setCustomAlertVisible(false);
  };
  const getClick = () => {
    // navigation.navigate('AddBank');
    // return;
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

    if (!password.trim()) {
      showCustomAlert('Please enter password');
      return;
    }

    setCustomAlertVisible(false);
    signInApi();
  };
  const getNumber = number => {
    setContactNumber(number);
  };
  const getCountryCode = countryCodeVal => {
    setcountryCode(countryCodeVal);
  };
  const getPassValue = pass => {
    setPassword(pass);
  };

  const signInApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('phone_dial_code', countryCode.trim());
      formdata.append('phone_number', contactNumber.trim());
      formdata.append('password', password.trim());

      Axiosinstance.post(ApiEndPoint.login, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            if (data.data.is_pin_created === 1) {
              storeData(
                data.data.token,
                data.data.stripe_customer_id
                  ? data.data.stripe_customer_id
                  : '',
                JSON.stringify(data.data),
              );
            } else {
              navigation.navigate('CreatePin', {
                countryCodeSend: data.data.phone_dial_code,
                contactNumberSend: data.data.phone_number,
              });
            }
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  const storeData = async (value, stripeCustomerId, userData) => {
    try {
      await AsyncStorage.setItem('token', value);
      await AsyncStorage.setItem('stripeCustomerId', stripeCustomerId);
      await AsyncStorage.setItem('userData', userData);

      signIn();
    } catch (e) {}
  };

  const signIn = async () => {
    await auth.signIn();
  };

  //Google Signin code start here

  useEffect(() => {
    _configureGoogleSignIn(); //Google initialisation
    Settings.initializeSDK(); //Facebook initialisation
  }, []);
  const _configureGoogleSignIn = () => {
    GoogleSignin.configure();
  };
  const googleSignin = social_type => {
    GoogleSignin.signOut();
    GoogleSignin.signIn()
      .then(user => {
        isSocialUserRegister(
          user.user.id,
          social_type,
          user.user.name,
          user.user.email,
        );
      })
      .catch(error => {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // sign in was cancelled
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert('IN Progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // android only`
            Alert.alert('Play services not available or outdated');
            break;
          default:
            Alert.alert('Something went wrong', error.toString());
          // setError(typedError);
        }
      });
  };
  //Google Signin code end here

  //Fb sign in code start here
  const handleFacebookSignIn = async social_type => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        console.log('User cancelled request');
      } else {
        const request = new GraphRequest(
          '/me',
          {
            parameters: {
              fields: {
                string: 'email,name',
              },
            },
          },
          responseInfoCallback,
        );

        new GraphRequestManager().addRequest(request).start();
      }
    } catch (error) {
      console.log(`Login failed with error: ${error}`);
    }
  };
  const responseInfoCallback = (error, result) => {
    if (error) {
      console.log(error);
    } else {
      isSocialUserRegister(result.id, 2, result.name, result.email);
    }
  };
  // fb end here

  const checkSocial = social_type => {
    switch (social_type) {
      case 1:
        googleSignin(social_type);
        break;
      case 2:
        handleFacebookSignIn(social_type);
        break;
      case 3:
        setIsVisible(true);
        showCustomAlert('Under Devlopment');
        break;
      default:
        break;
    }
  };
  const isSocialUserRegister = (user, social_type, sName, sEmail) => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('social_key', user);
      formdata.append('social_type', social_type);

      Axiosinstance.post(ApiEndPoint.checkSocial, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            if (data.data.is_registered === 1) {
              if (data.data.is_pin_created === 1) {
                storeData(
                  data.data.token,
                  data.data.stripe_customer_id
                    ? data.data.stripe_customer_id
                    : '',
                  JSON.stringify(data.data),
                );
              } else {
                navigation.navigate('CreatePin', {
                  countryCodeSend: data.data.phone_dial_code,
                  contactNumberSend: data.data.phone_number,
                });
              }
            } else {
              navigation.navigate('SignUp', {
                user: user,
                signUpBy: social_type,
                sName: sName,
                sEmail: sEmail,
              });
            }
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
        {/* <Modal
          visible={isVisible}
          transparent={true}
          //   statusBarTranslucent
          animationType={'fade'}
          // onShow={() => {
          //   setCustomAlertVisible(!customAlertVisible);
          // }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: Platform.OS === 'ios' ? 100 : 80,
            }}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 17,
                  borderRadius: 60,
                  position: 'absolute',
                  zIndex: 99,
                  top: -50,
                }}>
                <Image
                  style={{height: 60, width: 60}}
                  source={require('../../assets/images/icon_alert_cross.png')}
                />
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  paddingTop: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text
                  // onPress={() => {
                  //   hideCustomAlert();
                  // }}
                  style={{
                    color: '#101010',
                    fontSize: 22,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Uh Oh!
                </Text>
                <Text
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 30,
                    color: '#626262',
                    fontSize: 14,
                    fontWeight: '400',
                    fontFamily: 'Asap-Medium',
                    textAlign: 'center',
                  }}>
                  {customAlertText}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(false);
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    backgroundColor: '#F45353',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: '600',
                      fontFamily: 'Asap-Medium',
                    }}>
                    OKAY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{backgroundColor: 'white'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: 'white', height: '100%'}}
            contentInsetAdjustmentBehavior="automatic">
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
                    lineHeight: 35,
                    fontSize: 25,
                    fontWeight: '700',
                    fontFamily: 'Asap-Medium',
                    textTransform: 'uppercase',
                    marginHorizontal: 10,
                  }}>
                  Welcome Back to
                  <Text
                    style={{
                      color: '#ffc700',
                    }}>
                    {' '}
                    Gold App{' '}
                  </Text>
                  Sign in now
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#82806C',
                    lineHeight: 20,
                    fontSize: 14,
                    fontWeight: '400',
                    fontFamily: 'Asap-Medium',
                    // textTransform: 'uppercase',
                    marginTop: 15,
                    marginHorizontal: 30,
                  }}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <View style={{height: 50}} />
              <PhoneNumberField
                ref={numberRef}
                getNumber={getNumber}
                getCountryCode={getCountryCode}
                onSubmitEditing={() => {
                  passRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View style={{height: 20}} />
              <CustomTextField
                ref={passRef}
                placeholder={'Password'}
                getValue={getPassValue}
                keyboardType={'default'}
                blurOnSubmit={true}
              />
              <Text
                onPress={() => {
                  navigation.navigate('ForgotPass');
                }}
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 10,
                  fontFamily: 'Asap-Medium',
                  fontWeight: '500',
                  color: '#202020',
                  lineHeight: 20,
                  fontSize: 12,
                }}>
                Forgot Password?
              </Text>
              <View style={{height: 30}} />
              <CustomRoundedBlackBtn getClick={getClick} text={'CONTINUE'} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginVertical: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{backgroundColor: '#626262', height: 1, width: 30}}
                />
                <Text
                  style={{
                    marginHorizontal: 10,
                    color: '#333333',
                    fontSize: 12,
                    fontFamily: 'Asap-Medium',
                    lineHeight: 20,
                    fontWeight: '500',
                  }}>
                  Or signin with
                </Text>
                <View
                  style={{backgroundColor: '#626262', height: 1, width: 30}}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <SocialBtn
                  socialType={2}
                  icon={require('../../assets/images/icon_fb.png')}
                  getClick={checkSocial}
                />
                <View style={{width: 20}} />
                <SocialBtn
                  socialType={1}
                  icon={require('../../assets/images/icon_google.png')}
                  getClick={checkSocial}
                />
                <View style={{width: 20}} />

                {Platform.OS === 'ios' ? (
                  <SocialBtn
                    socialType={3}
                    icon={require('../../assets/images/icon_apple.png')}
                    getClick={checkSocial}
                  />
                ) : null}
              </View>

              <Text
                style={{
                  marginVertical: 18,
                  textAlign: 'center',
                  color: '#333333',
                  lineHeight: 20,
                  fontSize: 15,
                  fontWeight: '500',
                  fontFamily: 'Asap-Medium',
                }}>
                Don't have an account yet?
                <Text
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}
                  style={{
                    color: '#ffc700',
                  }}>
                  {' '}
                  Sign Up{' '}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Loader isVisible={isLoading} />
      </View>
    </StatusBarCompo>
  );
};

export default SignIn;
