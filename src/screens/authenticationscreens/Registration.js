/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
//Libraries
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

//Custom Widget
import CustomRoundedBlackBtn from '../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../widgets/customalert/CustomAlert';
import CustomAuthHeading from '../../widgets/CustomAuthHeading';
import CustomTextField from '../../widgets/CustomTextField';
import GooglePlacesInput from '../../widgets/GooglePlacesInput';
import StatusBarCompo from '../../widgets/customalert/StatusBarCompo';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axiosinstance from '../../utils/Axiosinstance';
import ApiEndPoint from '../../utils/ApiEndPoint';
import Loader from '../../widgets/customalert/Loader';

//Path
const iconsLocker = '../../assets/images/icon_locker.png';

const Registration = ({navigation, route}) => {
  const nameRef = useRef();
  const emailRef = useRef();

  const securityRef = useRef();

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressObject, setAddressObject] = useState({});
  const [shippingAddressObject, setShippingAddressObject] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAddclicked, setIsAddClicked] = useState(true);

  const [dob, setDob] = useState('');
  const [date, setDate] = useState(
    new Date(new Date(moment().subtract(13, 'years'))),
  );
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [isRoute, setIsRoute] = useState(route?.params?.sName);

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
  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  const getClick = () => {
    if (!name.trim()) {
      showCustomAlert('Please enter your name');
      return;
    }
    if (name.trim().length < 3) {
      showCustomAlert('Name is too short');
      return;
    }
    if (name.trim().length > 50) {
      showCustomAlert('Name is too long');
      return;
    }
    if (!email.trim()) {
      showCustomAlert('Please enter your email');
      return;
    }
    if (!validateEmail(email.trim())) {
      showCustomAlert('Please check your email again');
      return;
    }
    if (!dob.trim()) {
      showCustomAlert('Please enter your date of birth');
      return;
    }

    if (!address.trim()) {
      showCustomAlert('Please enter address');
      return;
    }
    if (!shippingAddress.trim()) {
      showCustomAlert('Please enter shipping address');
      return;
    }
    if (!securityNumber.trim()) {
      showCustomAlert('Please enter security number');
      return;
    }
    if (!/^\d+$/.test(securityNumber)) {
      showCustomAlert('Please enter only numbers as security number');
      return;
    }
    if (securityNumber.trim().length < 4 || securityNumber.trim().length > 4) {
      showCustomAlert('Please enter 4 digit security number');
      return;
    }
    if (!addressObject) {
      showCustomAlert('Please enter valid address');
      return;
    }
    if (!shippingAddressObject) {
      showCustomAlert('Please enter valid address');
      return;
    }
    let registerObject = {
      name: name,
      email: email,
      dob: moment(date).format('yyyy-MM-DD'),
      address: addressObject,
      shippingAddress: shippingAddressObject,
      securityNumber: securityNumber,
      both_address_same_chk: toggleCheckBox ? 1 : 0,
      countryCodeSend: route.params.countryCodeSend,
      contactNumberSend: route.params.contactNumberSend,
      signup_type: route?.params?.signUpBy ? 2 : 1,
      social_type: route?.params?.signUpBy ? route?.params?.signUpBy : '',
      social_key: route?.params?.user ? route?.params?.user : '',
    };
    validateData(registerObject);
  };

  const validateData = registerObject => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('fullname', registerObject.name);
      formdata.append('email', registerObject.email);
      formdata.append('dob', registerObject.dob);
      formdata.append(
        'both_address_same_chk',
        registerObject.both_address_same_chk,
      );
      formdata.append('phone_dial_code', registerObject.countryCodeSend);
      formdata.append('phone_number', registerObject.contactNumberSend);
      formdata.append('ssn_number', registerObject.securityNumber);
      formdata.append('address', JSON.stringify(registerObject.address));
      formdata.append(
        'shipping_address',
        JSON.stringify(registerObject.shippingAddress),
      );
      formdata.append('action_type', 1);
      formdata.append('signup_type', registerObject.signup_type);
      formdata.append('social_type', registerObject.social_type);
      formdata.append('social_key', registerObject.social_key);
      // alert(JSON.stringify(formdata));
      // return;
      Axiosinstance.post(ApiEndPoint.createProfile, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            //  alert(JSON.stringify(data.data));
            navigation.navigate('CreatePass', registerObject);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getNameValue = val => {
    setName(val);
  };
  const getEmailValue = val => {
    setEmail(val);
  };
  const getAddressValue = (val, latlng) => {
    let address;
    let city;
    let state;
    let stateCode;
    let country;
    let countryCode;
    let pinCode;
    let lat = latlng.lat;
    let lng = latlng.lng;

    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latlng.lat +
        ',' +
        latlng.lng +
        '&key=' +
        'AIzaSyAva3JK2uJN2iNbVyooBDlBPhSGnb3dg2A',
    )
      .then(response => response.json())
      .then(responseJson => {
        address = responseJson.results[0].formatted_address;
        for (
          let i = 0;
          i < responseJson.results[0].address_components.length;
          i++
        ) {
          if (
            responseJson.results[0].address_components[i].types[0] === 'country'
          ) {
            country = responseJson.results[0].address_components[i].long_name;
            countryCode =
              responseJson.results[0].address_components[i].short_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'administrative_area_level_1'
          ) {
            state = responseJson.results[0].address_components[i].long_name;
            stateCode =
              responseJson.results[0].address_components[i].short_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'postal_code'
          ) {
            pinCode = responseJson.results[0].address_components[i].long_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'locality'
          ) {
            city = responseJson.results[0].address_components[i].long_name;
          }
        }

        let locationObject = {
          address: address ? address : 'NA',
          city: city ? city : 'NA',
          state: state ? state : 'NA',
          state_code: stateCode ? stateCode : 'NA',
          country: country ? country : 'NA',
          country_code: countryCode ? countryCode : 'NA',
          pin_code: pinCode ? pinCode : '452016',
          latitude: lat,
          longitude: lng,
        };
        if (toggleCheckBox) {
          setAddress(val);
          setShippingAddress(val);
          setAddressObject(locationObject);
          setShippingAddressObject(locationObject);
        } else {
          setAddress(val);
          setAddressObject(locationObject);
        }
      });
  };
  const getShipAddValue = (val, latlng) => {
    let address;
    let city;
    let state;
    let stateCode;
    let country;
    let countryCode;
    let pinCode;
    let lat = latlng.lat;
    let lng = latlng.lng;
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latlng.lat +
        ',' +
        latlng.lng +
        '&key=' +
        'AIzaSyAva3JK2uJN2iNbVyooBDlBPhSGnb3dg2A',
    )
      .then(response => response.json())
      .then(responseJson => {
        address = responseJson.results[0].formatted_address;
        for (
          let i = 0;
          i < responseJson.results[0].address_components.length;
          i++
        ) {
          if (
            responseJson.results[0].address_components[i].types[0] === 'country'
          ) {
            country = responseJson.results[0].address_components[i].long_name;
            countryCode =
              responseJson.results[0].address_components[i].short_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'administrative_area_level_1'
          ) {
            state = responseJson.results[0].address_components[i].long_name;
            stateCode =
              responseJson.results[0].address_components[i].short_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'postal_code'
          ) {
            pinCode = responseJson.results[0].address_components[i].long_name;
          }
          if (
            responseJson.results[0].address_components[i].types[0] ===
            'locality'
          ) {
            city = responseJson.results[0].address_components[i].long_name;
          }
        }

        let locationObject = {
          address: address ? address : 'NA',
          city: city ? city : 'NA',
          state: state ? state : 'NA',
          state_code: stateCode ? stateCode : 'NA',
          country: country ? country : 'NA',
          country_code: countryCode ? countryCode : 'NA',
          pin_code: pinCode ? pinCode : '452016',
          latitude: lat,
          longitude: lng,
        };
        setShippingAddress(val);
        setShippingAddressObject(locationObject);
      });
  };
  const getSecurityNumValue = val => {
    setSecurityNumber(val);
  };
  const hidePlaceApiModal = () => {
    setIsVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getAddData();
    }, []),
  );

  useEffect(() => {
    clearAdd();
    clearShipAdd();
    if (route.params.sName !== '') {
      setName(route.params.sName);
    }
    if (route.params.sEmail !== '') {
      setEmail(route.params.sEmail);
    }
  }, []);
  const clearAdd = () => {
    AsyncStorage.setItem('address', '');
  };
  const clearShipAdd = () => {
    AsyncStorage.setItem('shipAddress', '');
  };

  const getAddData = async () => {
    AsyncStorage.getItem('isFromAdd').then(val => {
      if (val == 'true') {
        AsyncStorage.getItem('address').then(val => {
          const value = JSON.parse(val);
          if (val) {
            AsyncStorage.getItem('toggle').then(valToggle => {
              if (valToggle == 'true') {
                getShipAddValue(value.discription, value.location);
              }
            });
            getAddressValue(value.discription, value.location);
          }

          console.log(val);
        });
      } else {
        AsyncStorage.getItem('shipAddress').then(val => {
          const value = JSON.parse(val);
          if (val) {
            getShipAddValue(value.discription, value.location);
          }

          console.log(val);
        });
      }
    });
  };
  return (
    <StatusBarCompo backgroundColor="white" barStyle={'dark-content'}>
      <View>
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <DatePicker
          modal
          mode={'date'}
          maximumDate={new Date(moment().subtract(13, 'years')._d)}
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDob(moment(date).format('DD/MM/yyyy'));
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <GooglePlacesInput
          isVisible={isVisible}
          hideModal={hidePlaceApiModal}
          getValue={isAddclicked ? getAddressValue : getShipAddValue}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{backgroundColor: 'white'}}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
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
                topHeading={'Account Registration'}
                bottomHeading={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
              <View style={{height: 50}} />
              <CustomTextField
                ref={nameRef}
                placeholder={'Name'}
                defaultValue={route.params.sName}
                getValue={getNameValue}
                keyboardType={'default'}
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                blurOnSubmit={false}
              />
              <View style={{height: 20}} />
              <CustomTextField
                ref={emailRef}
                placeholder={'Email'}
                defaultValue={route?.params?.sEmail}
                getValue={getEmailValue}
                keyboardType={'email-address'}
                blurOnSubmit={true}
              />
              <View style={{height: 20}} />
              <TouchableOpacity
                onPress={() => setOpen(true)}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  height: 50,
                  paddingHorizontal: 15,
                  backgroundColor: '#F4F4F4',
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: dob ? '#202020' : '#626262',
                    fontFamily: 'Asap-Medium',
                    fontWeight: '400',
                    fontSize: 15,
                  }}>
                  {dob ? dob : 'Date of birth'}
                </Text>
                <Image
                  style={{height: 17, width: 17, resizeMode: 'contain'}}
                  source={require('../../assets/images/icon_calender.png')}
                />
              </TouchableOpacity>
              <View style={{height: 20}} />
              {/* Place Api Code */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Address', {
                    add: 'true',
                    toggleCheckBox: toggleCheckBox ? 'true' : 'false',
                  });
                  setIsAddClicked(true);
                  // setIsVisible(true);
                }}
                activeOpacity={0.5}
                style={{
                  width: '100%',
                  backgroundColor: '#F4F4F4',
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    minHeight: 50,
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text
                    numberOfLines={3}
                    style={{
                      color: address ? '#202020' : '#626262',
                      paddingHorizontal: 15,
                      marginVertical: 10,
                      fontFamily: 'Asap-Medium',
                      fontWeight: '400',
                      fontSize: 15,
                      textAlignVertical: 'center',
                    }}>
                    {address ? address : 'Address'}
                  </Text>
                </View>
                {address ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (toggleCheckBox) {
                        setAddress('');
                        setAddressObject({});
                        setShippingAddress('');
                        setShippingAddressObject({});
                        clearAdd();
                        clearShipAdd();
                      } else {
                        setAddress('');
                        setAddressObject({});
                        clearAdd();
                      }
                    }}
                    style={{
                      padding: 7,
                      backgroundColor: '#C6C6C6',
                      marginEnd: 15,
                      borderRadius: 10,
                    }}>
                    <Image
                      style={{
                        height: 7,
                        width: 7,
                        resizeMode: 'center',
                        alignSelf: 'flex-end',
                      }}
                      source={require('../../assets/images/icon_close.png')}
                    />
                  </TouchableOpacity>
                ) : null}
              </TouchableOpacity>

              <View style={{height: 20}} />
              {/* Place Api Code */}
              <TouchableOpacity
                onPress={() => {
                  if (!toggleCheckBox) {
                    navigation.navigate('Address', {add: 'false'});
                    setIsAddClicked(false);
                    // setIsVisible(true);
                  }
                }}
                activeOpacity={!toggleCheckBox ? 0.5 : 1}
                style={{
                  width: '100%',
                  backgroundColor: '#F4F4F4',
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    minHeight: 50,
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text
                    numberOfLines={3}
                    style={{
                      color: !toggleCheckBox
                        ? shippingAddress
                          ? '#202020'
                          : '#626262'
                        : '#626262',
                      paddingHorizontal: 15,
                      fontFamily: 'Asap-Medium',
                      fontWeight: '400',
                      marginVertical: 10,
                      fontSize: 15,
                      textAlignVertical: 'center',
                    }}>
                    {shippingAddress ? shippingAddress : 'Shipping Address'}
                  </Text>
                </View>
                {shippingAddress ? (
                  toggleCheckBox ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        setShippingAddress('');
                        setShippingAddressObject({});
                        clearShipAdd();
                      }}
                      style={{
                        padding: 7,
                        backgroundColor: '#C6C6C6',
                        marginEnd: 15,
                        borderRadius: 15,
                      }}>
                      <Image
                        style={{
                          height: 7,
                          width: 7,
                          resizeMode: 'center',
                          alignSelf: 'flex-end',
                        }}
                        source={require('../../assets/images/icon_close.png')}
                      />
                    </TouchableOpacity>
                  )
                ) : null}
              </TouchableOpacity>

              <View
                style={{
                  marginTop: 13,
                  marginLeft: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <CheckBox
                  style={{height: 25, width: 25}}
                  disabled={false}
                  value={toggleCheckBox}
                  boxType={'square'}
                  onCheckColor={'#ffc700'}
                  tintColor={'#C6C6C6'}
                  onTintColor={'#ffc700'}
                  tintColors={{true: '#ffc700', false: '#C6C6C6'}}
                  onValueChange={newValue => {
                    setToggleCheckBox(newValue);
                    if (newValue) {
                      setShippingAddress(address);
                      setShippingAddressObject(addressObject);
                      AsyncStorage.getItem('address').then(val => {
                        AsyncStorage.setItem('shipAddress', val);
                      });
                    } else {
                      setShippingAddress('');
                      setShippingAddressObject({});
                      clearShipAdd();
                    }
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: '400',
                    fontFamily: 'Asap',
                    color: '#202020',
                    marginLeft: 10,
                  }}>
                  Same as a address
                </Text>
              </View>

              <View style={{height: 20}} />
              <CustomTextField
                ref={securityRef}
                placeholder={'Security number'}
                getValue={getSecurityNumValue}
                keyboardType={'phone-pad'}
                blurOnSubmit={true}
              />
              <View style={{height: 50}} />
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

export default Registration;
