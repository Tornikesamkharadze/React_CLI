/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
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
//Libraries

//Custom Widget
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../../widgets/CustomAuthHeading';
import CustomTextField from '../../../widgets/CustomTextField';
import Loader from '../../../widgets/customalert/Loader';
import StatusBarCompo from '../../../widgets/customalert/StatusBarCompo';

import CustomSucAlert from '../../../widgets/customalert/CustomSucAlert';

import {Dimensions} from 'react-native';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//Path
const iconsLocker = '../../../assets/images/icon_lock.png';

const ChangePass = ({navigation, route}) => {
  const passRef = useRef();
  const newPassRef = useRef();
  const confirmNewPassRef = useRef();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [customSuccessAlertVisible, setCustomSuccessAlertVisible] =
    useState(false);
  const [customSuccessAlertText, setCustomSuccessAlertText] = useState('');
  const [isSessionExpired, setisSessionExpired] = useState(false);

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

  const showCustomSuccessAlert = text => {
    setCustomSuccessAlertVisible(true);
    setCustomSuccessAlertText(text);
  };

  const hideCustomSuccessAlert = () => {
    setCustomSuccessAlertVisible(false);
    navigation.goBack();
  };

  const getClick = () => {
    let regPass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{4,}/;
    if (!currentPassword.trim()) {
      showCustomAlert('Please enter current password');
      return;
    }
    if (!regPass.test(currentPassword.trim())) {
      showCustomAlert(
        'You have entered an invalid current password, Please try again. \nHint:- Password should have 1 upper case, 1 lower case, 1 number, 1 special character min 4 char.',
      );
      return;
    }
    if (!newPassword.trim()) {
      showCustomAlert('Please enter new password');
      return;
    }
    if (!regPass.test(newPassword.trim())) {
      showCustomAlert(
        'You have entered an invalid new password, Please try again. \nHint:- Password should have 1 upper case, 1 lower case, 1 number, 1 special character min 4 char.',
      );
      return;
    }
    if (!confirmNewPassword.trim()) {
      showCustomAlert('Please enter confirm new password');
      return;
    }
    if (confirmNewPassword.trim() !== newPassword.trim()) {
      showCustomAlert(
        'The new passwords do not match , please enter your new password, and confirm by entering again.',
      );
      return;
    }
    getToken();
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    updatePassApi(token);
  };

  const updatePassApi = token => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('password', newPassword);
      formdata.append('cnf_password', confirmNewPassword);
      formdata.append('current_password', currentPassword);
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.change_pass, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setisSessionExpired(true);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  const getCurPassValue = pass => {
    setCurrentPassword(pass);
  };
  const getNewPassValue = pass => {
    setNewPassword(pass);
  };
  const getConfirmNewPassValue = pass => {
    setConfirmNewPassword(pass);
  };

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
          Change Password
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
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <CustomSucAlert
          isVisible={customSuccessAlertVisible}
          hideAlert={hideCustomSuccessAlert}
          alertText={customSuccessAlertText}
        />
        <Loader isVisible={isLoading} />
        <SessionExpiredModel modalvisible={isSessionExpired} />

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
                  //  aspectRatio: 1.45 / 1,
                  height: 131,
                  width: 131,
                }}
              />
            </View>

            <View style={{padding: 15, backgroundColor: 'white'}}>
              <View style={{height: 10}} />
              <CustomAuthHeading
                topHeading={'Change password'}
                bottomHeading={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
              <View style={{height: 50}} />
              <CustomTextField
                ref={passRef}
                placeholder={'Enter current password'}
                getValue={getCurPassValue}
                keyboardType={'default'}
                onSubmitEditing={() => {
                  newPassRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View style={{height: 20}} />
              <CustomTextField
                ref={newPassRef}
                placeholder={'Enter new password'}
                getValue={getNewPassValue}
                keyboardType={'default'}
                onSubmitEditing={() => {
                  confirmNewPassRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View style={{height: 20}} />
              <CustomTextField
                ref={confirmNewPassRef}
                placeholder={'Enter confirm password'}
                getValue={getConfirmNewPassValue}
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
    </StatusBarCompo>
  );
};

export default ChangePass;
