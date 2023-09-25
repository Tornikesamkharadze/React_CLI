/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../../utils/Axiosinstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import CustomTextField from '../../../widgets/CustomTextField';
import {TextInputMask} from 'react-native-masked-text';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import Loader from '../../../widgets/customalert/Loader';
import CountryPicker from 'react-native-country-picker-modal';

const Shipment = ({navigation, route}) => {
  const addOne = useRef();
  const addTwo = useRef();
  const citi = useRef();
  const stat = useRef();
  const pin = useRef();
  const width = useRef();
  const length = useRef();
  const height = useRef();
  const weight = useRef();

  const [addressOne, setAddressOne] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState();
  const [parsWidth, setParsWidth] = useState('');
  const [parsLength, setParsLength] = useState('');
  const [parsHeight, setParsHeight] = useState('');
  const [parsWeight, setParsWeight] = useState('');
  const [userData, setUserData] = useState();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');
  const [rateId, setRateId] = useState('');
  const [fetchVisible, setFetchVisible] = useState(true);
  const [continueVisible, setContinueVisible] = useState(true);
  const [showPrice, setShowPrice] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');

  const [isCCModalVisible, setIsCCModalVisible] = useState(false);
  const [country, setcountry] = useState({
    callingCode: ['1'],
    cca2: 'US',
    currency: ['USD'],
    flag: 'flag-us',
    name: 'United States',
    region: 'Americas',
    subregion: 'North America',
  });

  useEffect(() => {
    setShowPrice(false);
    setContinueVisible(true);
    setShippingCharge('');
    if (
      addressOne == '' ||
      city == '' ||
      state == '' ||
      pinCode == '' ||
      parsWidth == '' ||
      parsLength == '' ||
      parsHeight == '' ||
      parsWeight == '' ||
      parsWeight == '0.00'
    ) {
      setFetchVisible(true);
    } else {
      setFetchVisible(false);
    }
  }, [
    addressOne,
    city,
    state,
    pinCode,
    parsWidth,
    parsLength,
    parsHeight,
    parsWeight,
  ]);

  useFocusEffect(
    useCallback(() => {
      getToken();
    }, []),
  );
  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(userData));
    getAdminAddress(token);
  };

  const getAdminAddress = token => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.admin_address).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            setDestinationAddress(
              data.data.address_line1 +
                ', ' +
                data.data.address_line2 +
                ', ' +
                data.data.city_locality +
                ', ' +
                data.data.state_province +
                ', ' +
                data.data.postal_code +
                ', ' +
                data.data.country_code +
                '.',
            );
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const showCustomAlert = text => {
    setCustomAlertText(text);
    setCustomAlertVisible(true);
  };
  const hideCustomAlert = () => {
    setCustomAlertVisible(false);
  };

  const fetchClick = () => {
    if (!addressOne.trim()) {
      showCustomAlert('Please enter your address');
      return;
    }
    if (addressOne.trim().length < 3) {
      showCustomAlert('Please enter your full address');
      return;
    }
    if (addressOne.trim().length > 100) {
      showCustomAlert('Address is too long');
      return;
    }
    if (!city.trim()) {
      showCustomAlert('Please enter your city');
      return;
    }
    if (!state.trim()) {
      showCustomAlert('Please enter your state');
      return;
    }
    if (!pinCode.trim()) {
      showCustomAlert('Please enter your address pincode');
      return;
    }
    if (!parsWidth.trim()) {
      showCustomAlert('Please enter your parcel width');
      return;
    }
    if (!parsLength.trim()) {
      showCustomAlert('Please enter your parcel length');
      return;
    }
    if (!parsHeight.trim()) {
      showCustomAlert('Please enter your parcel height');
      return;
    }
    if (!parsWeight.trim()) {
      showCustomAlert('Please enter your parcel weight');
      return;
    }

    let addressObject = {
      name: userData?.fullname,
      phone: userData?.phone_number,
      address_line1: addressOne + ' ' + addressTwo,
      city_locality: city,
      state_province: state,
      postal_code: pinCode,
      country_code: country.cca2,
      address_residential_indicator: 'yes',
    };
    setFetchVisible(true);
    fetchShippingRate(addressObject);
  };

  const fetchShippingRate = obj => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', route?.params?.commodity_id);
      formdata.append('quantity', route?.params?.qnt);
      formdata.append('quantity_unit', route?.params?.qnt_unit);
      formdata.append('address_json', JSON.stringify(obj));
      formdata.append('shipment_type', 9);
      formdata.append('pkg_weight', parseFloat(parsWeight.replace(',', '')));
      formdata.append('pkg_dimension_length', parseFloat(parsLength));
      formdata.append('pkg_dimension_width', parseFloat(parsWidth));
      formdata.append('pkg_dimension_height', parseFloat(parsHeight));

      Axiosinstance.post(ApiEndPoint.shipping_rate, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            setShippingCharge(data.data.formatted_shipping_charge);
            setRateId(data.data.rate_id);
            setContinueVisible(false);
          } else {
            showCustomAlert(data.message);
            setFetchVisible(false);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getClick = () => {
    navigation.navigate('ShippingPayment', {
      rate_id: rateId,
      amount: shippingCharge,
    });
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
          Create Shipment
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
      }}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={{backgroundColor: 'white'}}>
        <CustomAlert
          isVisible={customAlertVisible}
          hideAlert={hideCustomAlert}
          alertText={customAlertText}
        />
        <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
        <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
          <View
            style={{
              flex: 1,
              marginVertical: 20,
            }}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Commodity Type
            </Text>
            <View
              style={{
                marginTop: 15,
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
                paddingHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 50,
                alignItems: 'center',
              }}>
              <Image
                style={{
                  height: 35,
                  width: 35,
                  resizeMode: 'contain',
                }}
                source={{uri: route?.params?.com_img}}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Asap-Medium',
                  color: 'black',
                }}>
                {route?.params?.com_name}
              </Text>
            </View>
            <View
              style={{
                height: 20,
              }}
            />
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Commodity Weight & Price
            </Text>
            <View
              style={{
                marginTop: 15,
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
                paddingHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 50,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  fontWeight: '400',
                  fontSize: 15,
                }}>
                {route?.params?.qnt} {route?.params?.qnt_unit}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Asap-Medium',
                  color: 'black',
                }}>
                {' '}
                {route?.params?.currency == 'EUR' ? '€' : '$'}
                {route?.params?.amount}
              </Text>
            </View>
            <View style={{height: 25}} />
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Source Address
            </Text>
            <View style={{height: 10}} />
            <CustomTextField
              ref={addOne}
              placeholder={'Address'}
              defaultValue={''}
              getValue={val => {
                setAddressOne(val);
              }}
              keyboardType={'default'}
              onSubmitEditing={() => {
                addTwo.current.focus();
              }}
              blurOnSubmit={false}
            />
            <View style={{height: 20}} />
            <CustomTextField
              ref={addTwo}
              placeholder={'Address (optional)'}
              defaultValue={''}
              getValue={val => {
                setAddressTwo(val);
              }}
              onSubmitEditing={() => {
                citi.current.focus();
              }}
              keyboardType={'default'}
              blurOnSubmit={true}
            />
            <View style={{height: 20}} />
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '45%',
                }}>
                <CustomTextField
                  ref={citi}
                  placeholder={'City'}
                  defaultValue={''}
                  getValue={val => {
                    setCity(val);
                  }}
                  onSubmitEditing={() => {
                    stat.current.focus();
                  }}
                  keyboardType={'default'}
                  blurOnSubmit={true}
                />
              </View>
              <View
                style={{
                  width: '45%',
                  marginLeft: '10%',
                }}>
                <CustomTextField
                  ref={stat}
                  placeholder={'State Code'}
                  defaultValue={''}
                  getValue={val => {
                    setState(val);
                  }}
                  onSubmitEditing={() => {
                    pin.current.focus();
                  }}
                  keyboardType={'default'}
                  blurOnSubmit={true}
                />
              </View>
            </View>
            <View style={{height: 20}} />

            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '45%',
                }}>
                <View
                  style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: '#F4F4F4',
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    elevation: 1,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      alignContent: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      setIsCCModalVisible(true);
                    }}>
                    <CountryPicker
                      withFilter
                      withAlphaFilter
                      visible={isCCModalVisible}
                      renderFlagButton={e => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                flex: 1,
                                color: '#202020',
                                fontFamily: 'Asap-Medium',
                                fontWeight: '400',
                                fontSize: 15,
                              }}>
                              {country.name}
                            </Text>
                            <Image
                              style={{
                                width: 13,
                                alignSelf: 'flex-end',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}
                              source={require('../../../assets/images/icon_drop_down.png')}
                            />
                          </View>
                        );
                      }}
                      onSelect={e => {
                        setcountry(e);
                      }}
                      onClose={() => {
                        setIsCCModalVisible(false);
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: '45%',
                  marginLeft: '10%',
                }}>
                <CustomTextField
                  ref={pin}
                  placeholder={'Postal Code'}
                  defaultValue={''}
                  getValue={val => {
                    setPinCode(val);
                  }}
                  onSubmitEditing={() => {
                    width.current.focus();
                  }}
                  keyboardType={'phone-pad'}
                  blurOnSubmit={true}
                />
              </View>
            </View>
            <View style={{height: 25}} />
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Delivery Address
            </Text>
            <View
              style={{
                marginTop: 10,
                justifyContent: 'center',
                width: '100%',
                height: 60,
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
                paddingHorizontal: 15,
              }}>
              <Text
                style={{
                  color: '#202020',
                  fontFamily: 'Asap-Medium',
                  fontWeight: '400',
                  fontSize: 15,
                }}>
                {destinationAddress}
              </Text>
            </View>
            <View style={{height: 25}} />
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Parcel Details
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Asap-Regular',
                }}>
                {' (in inch)'}
              </Text>
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  width: '30%',
                }}>
                <CustomTextField
                  ref={width}
                  placeholder={'Width'}
                  defaultValue={''}
                  getValue={val => {
                    setParsWidth(val);
                  }}
                  onSubmitEditing={() => {
                    length.current.focus();
                  }}
                  keyboardType={'phone-pad'}
                  blurOnSubmit={true}
                />
              </View>
              <View
                style={{
                  width: '30%',
                  marginHorizontal: '5%',
                }}>
                <CustomTextField
                  ref={length}
                  placeholder={'Length'}
                  defaultValue={''}
                  getValue={val => {
                    setParsLength(val);
                  }}
                  onSubmitEditing={() => {
                    height.current.focus();
                  }}
                  keyboardType={'phone-pad'}
                  blurOnSubmit={true}
                />
              </View>
              <View
                style={{
                  width: '30%',
                }}>
                <CustomTextField
                  ref={height}
                  placeholder={'Height'}
                  defaultValue={''}
                  getValue={val => {
                    setParsHeight(val);
                  }}
                  keyboardType={'phone-pad'}
                  blurOnSubmit={true}
                />
              </View>
            </View>
            <View style={{height: 20}} />
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Asap-Medium',
                color: 'black',
              }}>
              Parcel Weight
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Asap-Regular',
                }}>
                {' (in gram)'}
              </Text>
            </Text>
            <View
              style={{
                marginTop: 10,
                height: 50,
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
                paddingHorizontal: 15,
              }}>
              <TextInputMask
                ref={weight}
                type={'money'}
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  unit: '',
                  suffixUnit: '',
                }}
                defaultValue={parsWeight}
                value={parsWeight}
                placeholder="Parcel Weight"
                keyboardType="numeric"
                placeholderTextColor={'#828282'}
                returnKeyType={'done'}
                editable={true}
                onChangeText={textTyped => {
                  setParsWeight(textTyped);
                }}
                maxLength={9}
                style={{
                  color: 'black',
                  fontFamily: 'Asap-Medium',
                  fontSize: 15,
                  fontWeight: '400',
                  width: '90%',
                  height: '100%',
                }}
              />
            </View>
            <View style={{height: 25}} />
            <View
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Asap-Regular',
                  color: 'black',
                }}>
                Shipping Price : {' $'}
                {shippingCharge != '' ? shippingCharge : 'XXXX'}
              </Text>
              <TouchableOpacity
                disabled={fetchVisible}
                onPress={() => {
                  fetchClick();
                }}
                style={{
                  height: 25,
                  width: '22%',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  backgroundColor: fetchVisible ? '#F4F4F4' : 'black',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 1,
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                    color: fetchVisible ? 'black' : 'white',
                  }}>
                  Fetch
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{height: 25}} />
            <TouchableOpacity
              disabled={continueVisible}
              onPress={() => {
                getClick();
              }}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: continueVisible ? '#F4F4F4' : 'black',
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
                  color: continueVisible ? 'black' : 'white',
                  fontSize: 17,
                  fontWeight: '500',
                  fontFamily: 'Asap-Medium',
                }}>
                CONTINUE
              </Text>
            </TouchableOpacity>
            <View style={{height: 30}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Loader isVisible={isLoading} />
    </View>
  );
};
export default Shipment;
