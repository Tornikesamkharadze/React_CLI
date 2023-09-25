/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useState, useCallback, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../../utils/Axiosinstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import Loader from '../../../widgets/customalert/Loader';
import RNFS from 'react-native-fs';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {NotificationDataContext} from '../../../navigation/StackSwitcher';
import CustomAlert from '../../../widgets/customalert/CustomAlert';

const ShippingDetails = ({navigation, route}) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [myDetails, setMyDetails] = useState();
  const [sourceAddress, setSourceAddress] = useState();
  const [parcelWeight, setParcelWeight] = useState();
  const [parcelDim, setParcelDim] = useState();

  const [tokenId, setTokenId] = useState('');
  const notification = useContext(NotificationDataContext);

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');

  const showCustomAlert = text => {
    // setTimeout(() => {
    setCustomAlertText(text);
    // }, 500);
    // setTimeout(() => {
    setCustomAlertVisible(true);
    //  }, 1000);
  };
  const hideCustomAlert = () => {
    setCustomAlertVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (notification) {
        notification.changeNotificationData();
      }
      getToken();
      requestStoragePermission();
      getShippingDetails(route?.params?.rate_id);
    }, []),
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setTokenId(token);
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

  const getShippingDetails = id => {
    setIsLoading(true);
    try {
      Axiosinstance.post(ApiEndPoint.shipping_details, {
        rate_id: id,
      }).then(({ok, status, data, problem}) => {
        setIsLoading(false);
        if (ok) {
          setMyDetails(data.data);
          setSourceAddress(JSON.parse(data.data.address_json));
          setParcelWeight(JSON.parse(data.data.pkg_weight));
          setParcelDim(JSON.parse(data.data.pkg_dimensions));
          if (!data.data.tracking_url || !data.data.label_file_url) {
            getTrackingUrl(id);
          }
        } else {
          showCustomAlert(data.message);
        }
      });
    } catch (e) {
      setIsLoading(false);
    }
  };
  const getTrackingUrl = id => {
    try {
      Axiosinstance.post(ApiEndPoint.trackingUrl, {
        rate_id: id,
      }).then(({ok, status, data, problem}) => {
        if (ok) {
          getShippingDetails(id);
        }
      });
    } catch (e) {}
  };

  const cancelRequest = () => {
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', tokenId);
      Axiosinstance.post(ApiEndPoint.cancelShip, {
        rate_id: route?.params?.rate_id,
      }).then(({ok, status, data, problem}) => {
        setIsLoading(false);
        if (status === 401) {
          setisSessionExpired(true);
        } else if (ok) {
          navigation.goBack();
        } else {
          showCustomAlert(data.message);
        }
      });
    } catch (e) {
      setIsLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const readGranted =
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const writeGranted =
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED;
      return readGranted && writeGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const downloadFile = async url => {
    setIsLoading(true);
    const downloadDest =
      Platform.OS == 'ios'
        ? `${RNFS.DocumentDirectoryPath}/${url.substring(
            url.lastIndexOf('/') + 1,
          )}`
        : `${RNFS.DownloadDirectoryPath}/${url.substring(
            url.lastIndexOf('/') + 1,
          )}`;
    console.log(downloadDest);
    const options = {
      fromUrl: url,
      toFile: downloadDest,
    };
    try {
      const result = await RNFS.downloadFile(options).promise;
      showMessage({
        message: 'Download Successfully!!',
        type: 'info',
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('Error downloading file:', error);
    }
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
          Shipment Detail
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <FlashMessage
        position="bottom"
        duration={1000}
        style={{
          backgroundColor: '#ffc700',
          justifyContent: 'center',
        }}
        statusBarHeight={true}
        floating={true}
      />
      <ScrollView>
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 20,
            marginBottom: 50,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Asap-Medium',
              color: 'black',
            }}>
            Shipment Type
          </Text>
          <View style={styles.container}>
            <Text
              style={{
                color: '#202020',
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
              }}>
              {route?.params?.shipping_type == 9
                ? 'Ship to admin'
                : 'Ship to me'}
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
            Shipment Status
          </Text>
          <View style={styles.container}>
            <Text
              style={{
                color: '#202020',
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
              }}>
              {myDetails?.status_text}
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
            Commodity Type
          </Text>
          <View style={styles.container}>
            <Image
              style={{
                height: 35,
                width: 35,
                resizeMode: 'contain',
              }}
              source={{uri: myDetails?.commodity_image}}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Asap-Medium',
                color: '#202020',
              }}>
              {myDetails?.commodity_name}
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
          <View style={styles.container}>
            <Text
              style={{
                color: '#202020',
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
              }}>
              {myDetails?.quantity} {myDetails?.quantity_unit}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Asap-Medium',
                color: '#202020',
              }}>
              {myDetails?.currency_unit == 'EUR' ? '€' : '$'}{' '}
              {myDetails?.commodity_amount}
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
            Shipment Price
          </Text>
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Asap-Medium',
                color: '#ffc700',
              }}>
              {myDetails?.currency_unit == 'EUR' ? '€' : '$'}
              {myDetails?.total_amount}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Asap-Medium',
              color: 'black',
              marginTop: 20,
            }}>
            Source Address
          </Text>
          <View style={styles.container}>
            <Text
              style={{
                color: '#202020',
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
              }}>
              {sourceAddress?.address_line1}
              {', '}
              {sourceAddress?.city_locality}
              {', '}
              {sourceAddress?.state_province}
              {', '}
              {sourceAddress?.postal_code}
              {', '}
              {sourceAddress?.country_code}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'Asap-Medium',
              color: 'black',
              marginTop: 20,
            }}>
            Delivery Address
          </Text>
          <View style={styles.container}>
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
          {myDetails?.shipment_type == 9 ? (
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Asap-Medium',
                  color: 'black',
                  marginTop: 20,
                }}>
                Parcel Details
              </Text>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '30%'}}>
                  <View style={styles.container}>
                    <Text
                      style={{
                        color: '#202020',
                        fontFamily: 'Asap-Medium',
                        fontWeight: '400',
                        fontSize: 15,
                      }}>
                      Height: {parcelDim?.height}
                    </Text>
                  </View>
                </View>
                <View style={{width: '30%', marginHorizontal: '5%'}}>
                  <View style={styles.container}>
                    <Text
                      style={{
                        color: '#202020',
                        fontFamily: 'Asap-Medium',
                        fontWeight: '400',
                        fontSize: 15,
                      }}>
                      Width: {parcelDim?.width}
                    </Text>
                  </View>
                </View>
                <View style={{width: '30%'}}>
                  <View style={styles.container}>
                    <Text
                      style={{
                        color: '#202020',
                        fontFamily: 'Asap-Medium',
                        fontWeight: '400',
                        fontSize: 15,
                      }}>
                      Length: {parcelDim?.length}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Asap-Medium',
                  color: 'black',
                  marginTop: 20,
                }}>
                Parcel Weight
              </Text>
              <View
                style={{
                  width: '30%',
                }}>
                <View style={styles.container}>
                  <Text
                    style={{
                      color: '#202020',
                      fontFamily: 'Asap-Medium',
                      fontWeight: '400',
                      fontSize: 15,
                    }}>
                    {parcelWeight?.value} {parcelWeight?.unit}
                  </Text>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    downloadFile(myDetails?.label_file_url);
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: 'black',
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
                    marginTop: 15,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontWeight: '500',
                      fontFamily: 'Asap-Medium',
                    }}>
                    Download Shipping Label
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {myDetails?.status == 2 ? (
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <TouchableOpacity
                onPress={() => {
                  console.log(
                    'Amoumnt : ',
                    myDetails?.total_amount,
                    'rateID',
                    myDetails?.rate_id,
                  );
                  navigation.navigate('ShippingPayment', {
                    rate_id: myDetails?.rate_id,
                    amount: myDetails?.total_amount,
                  });
                }}
                style={{
                  flex: 1,
                  marginRight: 5,
                  height: 50,
                  backgroundColor: 'black',
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
                    color: 'white',
                    fontSize: 15,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Accept & Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Alert',
                    'Are you sure? You want to cancel this request.',
                    [
                      {
                        text: 'No',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'Yes', onPress: () => cancelRequest()},
                    ],
                  );
                }}
                style={{
                  flex: 1,
                  height: 50,
                  marginLeft: 5,
                  backgroundColor: 'black',
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
                    color: 'white',
                    fontSize: 15,
                    fontWeight: '500',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Cancel Request
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <Loader isVisible={isLoading} />
    </View>
  );
};
export default ShippingDetails;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 17,
    fontFamily: 'Asap-Medium',
    color: 'black',
  },
  container: {
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
  },
});
