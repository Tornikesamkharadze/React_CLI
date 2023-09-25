/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';
import {BackHandler} from 'react-native';

//Custom Widget
import CustomOtpInput from '../../widgets/CustomOtpInput';
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../widgets/CustomAuthHeading';
import CustomSuccessAlert from '../../widgets/customalert/CustomSuccessAlert';
import Loader from '../../widgets/customalert/Loader';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const CreatePin = ({navigation, route}) => {
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [customSuccessAlertVisible, setCustomSuccessAlertVisible] =
    useState(false);
  const [customSuccessAlertText, setCustomSuccessAlertText] = useState('');
  const [customSuccessAlertTextTwo, setCustomSuccessAlertTextTwo] =
    useState('');
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
  const showCustomSuccessAlert = (text, textTwo) => {
    setCustomSuccessAlertVisible(true);
    setCustomSuccessAlertText(text);
    setCustomSuccessAlertTextTwo(textTwo);
  };
  const hideCustomSuccessAlert = () => {
    setCustomSuccessAlertVisible(false);
    navigation.navigate('AddBank', {
      addBankUrl:route.params.bank_url
    });
  //  navigation.navigate('SignIn');
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
    createPinApi();
  };
  const getOTP = number => {
    setOtp(number);
  };
  const createPinApi = () => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('transaction_pin', otp); //
      formdata.append('phone_dial_code', route.params.countryCodeSend); //
      formdata.append('phone_number', route.params.contactNumberSend); //

      Axiosinstance.post(ApiEndPoint.createPin, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            //alert(JSON.stringify(data.data));
            //  navigation.navigate('AddBank');
            showCustomSuccessAlert('Successful Registration', 'Bye');
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Do not allow the screen to go back
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);
  return (
    <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
      <View>
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <CustomSuccessAlert
          isVisible={customSuccessAlertVisible}
          hideAlert={hideCustomSuccessAlert}
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
                paddingHorizontal: 15,
                paddingTop: 10,
                alignSelf: 'flex-start',
              }}>
              <View
                style={{
                  padding: 8,
                  borderRadius: 15,
                }}>
                <View style={{height: 10, width: 10}} />
              </View>
            </View>
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
                topHeading={'Create pin'}
                bottomHeading={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
              <View style={{height: 50}} />
              <CustomOtpInput getOTP={getOTP} />

              <View style={{height: 140}} />
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

export default CreatePin;
