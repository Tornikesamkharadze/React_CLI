/* eslint-disable react/self-closing-comp */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useState, useEffect, useCallback} from 'react';

import React from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import CustomSucAlert from '../../../widgets/customalert/CustomSucAlert';
import GooglePlacesInput from '../../../widgets/GooglePlacesInput';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import Loader from '../../../widgets/customalert/Loader';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
import styles from '../../../styles/MyProfileStyle';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../../widgets/GradienText';

const MyProfile = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [changeName, setChangeName] = useState(false);
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [changeEmail, setChangeEmail] = useState(false);
  const [address, setAddress] = useState('');
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [customSuccessAlertVisible, setCustomSuccessAlertVisible] =
    useState(false);
  const [customSuccessAlertText, setCustomSuccessAlertText] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [isImgPickerOpen, setIsImgPickerOpen] = useState(false);
  const [settingData, setSettingData] = useState();
  const [notificationToggle, setNotificationToggle] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [isAddclicked, setIsAddClicked] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [addressObject, setAddressObject] = useState({});
  const [imageChanged, setImageChanged] = useState(false);

  const hideCustomSuccessAlert = () => {
    setCustomSuccessAlertVisible(false);
  };
  const showCustomSuccessAlert = text => {
    setCustomSuccessAlertVisible(true);
    setCustomSuccessAlertText(text);
  };

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

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 400,
      height: 400,
    }).then(images => {
      setIsImgPickerOpen(!isImgPickerOpen);
      setImageSource(images.path);
      setImageChanged(true);
    });
  };
  const selectFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 400,
      height: 400,
    }).then(images => {
      setIsImgPickerOpen(!isImgPickerOpen);
      setImageSource(images.path);
      setImageChanged(true);
    });
  };

  useEffect(() => {
    clearAdd();
    const getToken = async () => {
      await AsyncStorage.setItem('isFromHome', 'false');
    };
    getToken();
  }, []);

  useEffect(() => {
    if (route?.params?.toScreen === 'request') {
      navigation.navigate('Request');
    } else if (route?.params?.toScreen === 'myShipment') {
      navigation.navigate('MyShipment', {
        notificationData: route?.params?.notificationData,
      });
    }
  }, []);

  const clearAdd = () => {
    AsyncStorage.setItem('address', '');
  };

  const hidePlaceApiModal = () => {
    setIsVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('isFromAddress', (_err, value) => {
        if (value != 'true') {
          getAddData();
          getToken();
        } else {
          getAddData();
          AsyncStorage.setItem('isFromAddress', 'false');
        }
      });
      setIsLoading(false);
    }, []),
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    userProfileData(token);
  };

  //api calls
  const userProfileData = token => {
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.myProfile).then(
        ({ok, status, data, problem}) => {
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            var myDate = new Date(data.data.userDetail.dob);
            setDate(myDate);
            if (data.data.userDetail.age == 0) {
              setAge('Less than one year');
            } else if (data.data.userDetail.age == 1) {
              setAge(data.data.userDetail.age + ' year');
            } else {
              setAge(data.data.userDetail.age + ' years');
            }
            setName(data.data.userDetail.fullname);
            setEmail(data.data.userDetail.email);
            setImageSource(data.data.userDetail.profile_img);
            setAddressObject(data.data.userAddress);
            setAddress(data.data.userAddress.address);
            setSettingData(data.data.settings);
            setNotificationToggle(data.data.settings.notification_enable);
          } else {
            alert('Profile data not available.');
          }
        },
      );
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
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
          setAddress(locationObject.address);
          setAddressObject(locationObject);
        } else {
          setAddress(locationObject.address);
          setAddressObject(locationObject);
        }
      });
  };

  const getAddData = async () => {
    AsyncStorage.getItem('isFromAdd').then(val => {
      if (val == 'true') {
        AsyncStorage.getItem('address').then(val => {
          console.log(JSON.stringify(val));
          const value = JSON.parse(val);
          if (val) {
            getAddressValue(value.discription, value.location);
          }

          console.log(val);
        });
      }
    });
  };

  //navigatin header ui
  navigation.setOptions({
    headerShadowVisible: false, // remove shadow on Android
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: 'black',
      height: Platform.OS === 'android' ? 80 : 120,
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
    headerTitle: () => (
      <View>
        <Text
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: '600',
            fontFamily: 'Asap-Medium',
          }}>
          Account Details
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
            height: 30,
            width: 30,
            backgroundColor: '#5b5b5b',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 15,
              width: 15,
              resizeMode: 'cover',
            }}
            source={require('../../../assets/images/icon_back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => null,
  });

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
      setChangeName(true);
      return;
    } else if (name.trim().length < 3) {
      showCustomAlert('Name is too short');
      setChangeName(true);
      return;
    } else if (name.trim().length > 50) {
      showCustomAlert('Name is too long');
      setChangeName(true);
      return;
    } else {
      setChangeName(false);
    }
    if (!email.trim()) {
      showCustomAlert('Please enter your email');
      setChangeEmail(true);
      return;
    } else if (!validateEmail(email.trim())) {
      showCustomAlert('Please check your email again');
      setChangeEmail(true);
      return;
    } else {
      setChangeEmail(false);
    }

    updateProfile();
  };

  const storeDataUser = async userData => {
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (e) {}
  };

  // Update profile api call
  const updateProfile = updateProfileObject => {
    setIsLoading(true);
    try {
      let formdata = new FormData();
      Axiosinstance.setHeader('Content-Type', 'multipart/form-data');
      formdata.append('fullname', name);
      formdata.append('email', email);
      formdata.append('dob', moment(date).format('YYYY-MM-DD'));
      formdata.append('address', JSON.stringify(addressObject));
      if (imageChanged) {
        if (imageSource) {
          formdata.append('profile_img', {
            uri: imageSource,
            type: 'image/png',
            name: 'image.png',
          });
        }
      }

      Axiosinstance.put(ApiEndPoint.updateProfile, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (ok) {
            storeDataUser(JSON.stringify(data.data.userDetail));
            showCustomSuccessAlert(data.message);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Notification Status Update api call
  const callUpdateNotificationApi = () => {
    try {
      let formdata = new FormData();
      if (notificationToggle == 0) {
        formdata.append('notification_enable', 1);
      } else {
        formdata.append('notification_enable', 0);
      }

      Axiosinstance.post(ApiEndPoint.notification_status, formdata).then(
        ({ok, status, problem, data}) => {
          if (ok) {
            if (notificationToggle == 0) {
              setNotificationToggle(1);
            } else {
              setNotificationToggle(0);
            }
          }
        },
      );
    } catch (e) {
      alert(e);
    }
  };

  // Setting Options On-press events
  const onClicked = id => {
    if (id == 0) {
      callUpdateNotificationApi();
    }
    if (id == 1) {
      navigation.navigate('Tutorial');
    }
    if (id == 2) {
      navigation.navigate('InviteFriend');
    }
    if (id == 3) {
      AsyncStorage.setItem('isFromAddress', 'true');
      navigation.navigate('VerifyPin');
    }
    if (id == 4) {
      navigation.navigate('ChangePass');
    }
    if (id == 5) {
      navigation.navigate('TermsAndConditions', {
        from: 'PP',
        url: settingData.privacy_policy,
      });
    }
    if (id == 6) {
      navigation.navigate('TermsAndConditions', {
        from: 'TC',
        url: settingData.terms_and_conditions,
      });
    }

    if (id == 8) {
      navigation.navigate('Request');
    }

    if (id == 10) {
      navigation.navigate('MyShipment');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <SessionExpiredModel modalvisible={isSessionExpired} />
      <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
      <Loader isVisible={isLoading} />
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

      <Modal
        visible={isImgPickerOpen}
        transparent={true}
        animationType={'fade'}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            flexDirection: 'column-reverse',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              margin: 15,
              borderRadius: 12,
              paddingVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  selectFromCamera();
                }}
                style={{
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}>
                <View>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={require('../../../assets/images/icon_camera.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Asap-Medium',
                      fontSize: 15,
                      color: '#000000',
                      marginTop: 5,
                    }}>
                    Camera
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  selectFromGallery();
                }}
                style={{
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}>
                <View>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={require('../../../assets/images/icon_gallery.png')}
                  />
                  <Text
                    style={{
                      fontFamily: 'Asap-Medium',
                      fontSize: 15,
                      color: '#000000',
                      marginTop: 5,
                    }}>
                    Gallery
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.inactiveLineView} />
            <View
              style={{
                justifyContent: 'center',
                marginVertical: 10,
                paddingVertical: 5,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsImgPickerOpen(!isImgPickerOpen);
                }}>
                <View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: 'Asap-Medium',
                      fontSize: 15,
                      color: '#000000',
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        mode={'date'}
        maximumDate={moment().subtract(13, 'years')._d}
        open={open}
        date={date}
        onConfirm={date => {
          setDate(date);
          setOpen(false);
          var today = new Date();
          var birthDate = new Date(date); // create a date object directly from `dob1` argument
          var age_now = today.getFullYear() - birthDate.getFullYear();
          if (age_now == 0) {
            setAge('Less than one year');
          } else if (age_now == 1) {
            setAge(age_now + ' year');
          } else {
            setAge(age_now + ' years');
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <GooglePlacesInput
        isVisible={isVisible}
        hideModal={hidePlaceApiModal}
        getValue={isAddclicked ? getAddressValue : null}
      />
      <View style={{width: '100%', zIndex: 1}}>
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'black',
            borderBottomRightRadius: 30,
          }}
        />
        <Image
          style={{
            height: 100,
            width: 100,
            position: 'absolute',
            zIndex: 1,
            top: 10,
            left: 25,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: '#4545E0',
            backgroundColor: 'white',
            resizeMode: 'contain',
          }}
          source={{uri: imageSource}}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            height: 30,
            width: 30,
            borderRadius: 50,
            position: 'absolute',
            zIndex: 1,
            top: 80,
            left: 90,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            justifyContent: 'center',
          }}
          onPress={() => {
            setIsImgPickerOpen(!isImgPickerOpen);
          }}>
          <Image
            style={{
              height: 15,
              width: 15,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/icon_camera.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          paddingHorizontal: 15,
          paddingTop: 70,
        }}>
        <View>
          <View style={styles.infoMainView}>
            <View style={styles.leftInfoView}>
              <Text style={styles.leftInfoTextStyle}>Name :</Text>
            </View>
            <View style={styles.changeInfoMainView}>
              {changeName ? (
                <TextInput
                  numberOfLines={1}
                  style={styles.inputTextStyle}
                  placeholder="Name"
                  value={name}
                  onChangeText={val => {
                    if (val !== ' ') {
                      setName(val);
                    }
                  }}
                />
              ) : (
                <Text numberOfLines={1} style={styles.middleInfoTextStyle}>
                  {name}
                </Text>
              )}
              <TouchableOpacity
                style={styles.rightInfoView}
                onPress={() => {
                  setChangeEmail(false);
                  setChangeName(!changeName);
                }}>
                {changeName ? (
                  <GradientText numberOfLines={1} style={styles.rightTextStyle}>
                    Done
                  </GradientText>
                ) : (
                  <Image
                    style={styles.rightImgStyle}
                    source={require('../../../assets/images/icon_edit.png')}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {changeName ? (
            <View style={styles.activeLineView} />
          ) : (
            <View style={styles.inactiveLineView} />
          )}
          <View style={styles.infoMainView}>
            <View style={styles.leftInfoView}>
              <Text style={styles.leftInfoTextStyle}>Age :</Text>
            </View>
            <View style={styles.changeInfoMainView}>
              <Text numberOfLines={1} style={styles.middleInfoTextStyle}>
                {age}
              </Text>

              <TouchableOpacity
                style={styles.rightInfoView}
                onPress={() => {
                  setOpen(true);
                  setChangeEmail(false);
                  setChangeName(false);
                }}>
                <Image
                  style={styles.rightImgStyle}
                  source={require('../../../assets/images/icon_edit.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inactiveLineView} />

          <View style={styles.infoMainView}>
            <View style={styles.leftInfoView}>
              <Text style={styles.leftInfoTextStyle}>Email :</Text>
            </View>
            <View style={styles.changeInfoMainView}>
              {changeEmail ? (
                <TextInput
                  numberOfLines={1}
                  style={styles.inputTextStyle}
                  placeholder="Email"
                  value={email}
                  keyboardType="email-address"
                  onChangeText={val => {
                    if (val !== ' ') {
                      setEmail(val);
                    }
                  }}
                />
              ) : (
                <Text numberOfLines={1} style={styles.middleInfoTextStyle}>
                  {email}
                </Text>
              )}
              <TouchableOpacity
                style={styles.rightInfoView}
                onPress={() => {
                  setChangeEmail(!changeEmail);
                  setChangeName(false);
                  //  }
                }}>
                {changeEmail ? (
                  <GradientText numberOfLines={1} style={styles.rightTextStyle}>
                    Done
                  </GradientText>
                ) : (
                  <Image
                    style={styles.rightImgStyle}
                    source={require('../../../assets/images/icon_edit.png')}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {changeEmail ? (
            <View style={styles.activeLineView} />
          ) : (
            <View style={styles.inactiveLineView} />
          )}
          <View style={styles.addressMainView}>
            <View style={styles.leftAddressView}>
              <Text numberOfLines={1} style={styles.leftInfoTextStyle}>
                Address :
              </Text>
            </View>
            <View style={styles.changeAddressMainView}>
              <Text style={styles.middleInfoTextStyle}>
                {address ? address : 'Address'}
              </Text>
              <TouchableOpacity
                style={styles.rightInfoView}
                onPress={async () => {
                  await AsyncStorage.setItem('isFromAddress', 'true');
                  setChangeEmail(false);
                  setChangeName(false);
                  navigation.navigate('AddressFromProfile', {
                    add: 'true',
                  });
                }}>
                <Image
                  style={styles.rightImgStyle}
                  source={require('../../../assets/images/icon_edit.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inactiveLineView} />
        </View>
        <View
          style={{
            marginTop: 15,
          }}>
          <Text
            style={{
              color: '#101010',
              fontFamily: 'Asap-Medium',
              fontSize: 22,
              fontWeight: '600',
            }}>
            Settings
          </Text>
          <LinearGradient
            style={{
              height: 5,
              width: 36,
              borderRadius: 5,
              marginTop: 3,
            }}
            colors={['#AE8625', '#F7EA8A', '#D2AC47', '#EDC967']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}></LinearGradient>
        </View>
        <View style={{height: 20}} />
        <ProfileTouchableCompo
          label={'Notification'}
          onClicked={onClicked}
          id={0}
          status={notificationToggle}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />

        <ProfileTouchableCompo
          label={'Tutorial'}
          id={1}
          onClicked={onClicked}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Invite Friends'}
          onClicked={onClicked}
          id={2}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Change Pin'}
          onClicked={onClicked}
          id={3}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Change Password'}
          onClicked={onClicked}
          id={4}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Privacy Policy'}
          onClicked={onClicked}
          id={5}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Term & Conditions'}
          onClicked={onClicked}
          id={6}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'Request Commodity'}
          onClicked={onClicked}
          id={8}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <ProfileTouchableCompo
          label={'My Shipments'}
          onClicked={onClicked}
          id={10}
        />
        <View style={{height: 1, backgroundColor: '#D9D9D9'}} />
        <View style={{height: 20}} />
        <CustomRoundedBlackBtn text={'Update Profile'} getClick={getClick} />
        <View style={{height: 150}} />
      </ScrollView>
    </View>
  );
};
export default MyProfile;

const ProfileTouchableCompo = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
      }}
      onPress={() => {
        props.onClicked(props.id);
      }}>
      <Text
        style={{
          color: '#202020',
          fontFamily: 'Asap-Medium',
          fontSize: 17,
          fontWeight: '500',
          flex: 1,
        }}>
        {props.label}
      </Text>
      {props.id == 0 ? (
        <Image
          style={{
            height: 20,
            width: 25,
            resizeMode: 'contain',
            marginTop: 5,
          }}
          source={
            props.status == 1
              ? require('../../../assets/images/icon_active_toggleNotification.png')
              : require('../../../assets/images/icon_inactive_toggleNotification.png')
          }
        />
      ) : (
        <Image
          style={{
            height: 20,
            width: 10,
            resizeMode: 'contain',
          }}
          source={require('../../../assets/images/icon_forward_arrow.png')}
        />
      )}
    </TouchableOpacity>
  );
};
