/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import {useState} from 'react';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import {useEffect} from 'react';
import CustomKeyboard from '../../../widgets/CustomKeyboard';
import Loader from '../../../widgets/customalert/Loader';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useRef} from 'react';
import CustomAlert from '../../../widgets/customalert/CustomAlert';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import SessionExpiredModel from '../../../widgets/customalert/SessionExpiredModal';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {CancelToken} from 'apisauce';
import {TextInputMask} from 'react-native-masked-text';
import {back} from 'react-native/Libraries/Animated/Easing';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../../widgets/GradienText';
const AddComodities = ({
  navigation,
  from,
  id,
  name,
  icon,
  usrId,
  usrName,
  usrEmail,
  usrImg,
  back,
}) => {
  const source = CancelToken.source();
  const [isAmountSelected, setIsAmountSelected] = useState(false);
  const [isQtySelected, setIsQtySelected] = useState(false);
  const [amount, setAmount] = useState('');
  const [adminFee, setAdminFee] = useState('');
  const [adminFeeFormatted, setAdminFeeFormatted] = useState('');
  const [qty, setQty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [comodities, setComodities] = useState([]);
  const [comoditiesExtraData, setComoditiesExtraData] = useState(false);
  const [comoCalculationData, setcomoCalculationData] = useState({});
  const [convertionData, setConvertionData] = useState();
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertText, setCustomAlertText] = useState('Alert');
  const [isSessionExpired, setisSessionExpired] = useState(false);
  const [isComoditySelectionViewVisiable, setComoditySelectionViewVisiable] =
    useState(false);

  const [isCalculation, setCalculation] = useState(false);

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

  const [currencyArray, setCurrencyArray] = useState([
    {name: 'USD', isSelected: true},
    {name: 'EUR', isSelected: false},
    {name: 'CAD', isSelected: false},
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencyExtraData, setCurrencyExtraData] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [quantityArray, setQuantityArray] = useState([
    {name: 'gram', isSelected: true},
    {name: 'grain', isSelected: false},
    {name: 'oz', isSelected: false},
  ]);
  const [selectedQuantity, setSelectedQuantity] = useState('gram');

  const [quantityExtraData, setQuantityExtraData] = useState(false);
  const [quantityModal, setQuantityModal] = useState(false);
  const [isSelectUserVisible, setIsSelectUserVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [ExtraForUserList, setExtraForUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const renderComo = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const updatedItems = comodities.map(item => ({
            ...item,
            isSelected: false,
          }));
          const finalItem = updatedItems.map((item, indexx) => {
            if (indexx === index) {
              return {...item, isSelected: true};
            }
            return item;
          });
          setComodities(finalItem);
          setComoditiesExtraData(!comoditiesExtraData);
          setcomoCalculationData(item);
          calculateCurrenty(
            selectedQuantity,
            selectedCurrency,
            'weight_to_currency',
            '1',
            item.commodity_type,
          );
          setQty('1');
        }}
        activeOpacity={0.5}
        style={{
          width: 115,
          backgroundColor: '#F1F1F1',
          borderRadius: 5,
          marginHorizontal: 10,
          padding: 8,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
            source={
              item.isSelected
                ? require('../../../assets/images/icon_checked.png')
                : require('../../../assets/images/icon_unchecked.png')
            }
          />
          <Image
            style={{
              width: '100%',
              height: 40,
              resizeMode: 'contain',
            }}
            source={{uri: item.commodity_img}}
          />
        </View>
        <View>
          {/* {item.isSelected ? (
            <GradientText
              style={{
                //  fontFamily: 'Asap-Medium',
                fontSize: 14,
                //  fontWeight: '600',
                marginTop: 12,
              }}>
              {item.name}
            </GradientText>
          ) : ( */}
          <Text
            numberOfLines={1}
            style={{
              color: item.isSelected ? '#ffc700' : '#333333',
              fontFamily: 'Asap-Medium',
              fontSize: 14,
              fontWeight: '600',
            }}>
            {item.name}
          </Text>
          {/* )} */}
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      setcomoCalculationData({});

      if (usrId) {
        setSelectedUser(usrId);
      } else {
        setSelectedUser();
      }
      getToken();
      //setIsLoading(false);
    }, []),
  );

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setAccessToken(token);
    getComodities(token);
  };

  //Api calls
  const getComodities = async token => {
    //setIsLoading(false);
    setIsLoading(true);
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.get(ApiEndPoint.commodityRates).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            const updatedItems = data.data.commodity_rates.map(item => ({
              ...item,
              isSelected: false,
            }));

            if (id) {
              const finalItem = updatedItems.map((item, indexx) => {
                if (item.id === id) {
                  return {...item, isSelected: true};
                }
                return item;
              });
              const index = finalItem.findIndex(item => item.isSelected);
              setComodities(finalItem);

              setComoditiesExtraData(!comoditiesExtraData);

              setcomoCalculationData(finalItem[index]);
              calculateCurrenty(
                selectedQuantity,
                selectedCurrency,
                'weight_to_currency',
                '1',
                finalItem[index].commodity_type,
                token,
              );
              setQty('1');

              setConvertionData(data.data.currency_conversion_rate);
              setComoditySelectionViewVisiable(false);
            } else {
              setComoditySelectionViewVisiable(true);
              const finalItem = updatedItems.map((item, indexx) => {
                if (item.id === 1) {
                  return {...item, isSelected: true};
                }
                return item;
              });
              const index = finalItem.findIndex(item => item.isSelected);
              setComodities(finalItem);

              setComoditiesExtraData(!comoditiesExtraData);
              // alert(JSON.stringify(finalItem[index]));

              setcomoCalculationData(finalItem[index]);
              calculateCurrenty(
                selectedQuantity,
                selectedCurrency,
                'weight_to_currency',
                '1',
                finalItem[index].commodity_type,
                token,
              );
              setQty('1');

              setConvertionData(data.data.currency_conversion_rate);
            }

            getUserList(token);
          } else {
            showCustomAlert(data.message);
            setIsLoading(false);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getUserList = async token => {
    try {
      Axiosinstance.setHeader('access-token', token);
      Axiosinstance.post(ApiEndPoint.userList).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            const updatedItems = data.data.map(item => ({
              ...item,
              isSelected: false,
            }));
            setUserList(updatedItems);
            setFullUserList(updatedItems);
          } else {
            showCustomAlert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const calculateCurrenty = async (
    weightUnit,
    currencyUnit,
    conversionType,
    value,
    commodityType,
    token,
  ) => {
    if (parseFloat(value) == 0) {
      if (conversionType == 'currency_to_weight') {
        setQty('0');
      } else {
        setAmount('0');
      }
      return;
    }
    try {
      let formdata = new FormData();

      formdata.append('weight_unit', weightUnit);
      formdata.append('currency_unit', currencyUnit);
      formdata.append('conversion_type', conversionType);
      formdata.append('value', value == '' ? 0 : value);
      formdata.append('commodity_type', commodityType);
      Axiosinstance.setHeader(
        'access-token',
        accessToken ? accessToken : token,
      );
      //
      Axiosinstance.post(ApiEndPoint.calculation, formdata, {
        cancelToken: source.token,
      }).then(({ok, status, data, problem}) => {
        // setIsLoading(false);
        if (status === 401) {
          setisSessionExpired(true);
        } else if (ok) {
          let result = data.data.result;
          if (conversionType == 'currency_to_weight') {
            setQty(result.toFixed(4).toString());
          } else {
            setAmount(result.toFixed(2).toString());
          }
          setAdminFee(data.data.admin_commission);
          setAdminFeeFormatted(data.data.formatted_admin_commission);
        } else {
          showCustomAlert(data.message);
        }
      });
    } catch (e) {
      // setIsLoading(false);
    }
  };

  //getVaultAmount
  const getWalletAmount = token => {
    //setIsLoading(false);
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('cash_unit', selectedCurrency);
      Axiosinstance.setHeader('access-token', accessToken);
      Axiosinstance.post(ApiEndPoint.getWalletAmount, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);
          } else if (ok) {
            // alert(
            //   amountInfo.current.getRawValue() + ' ' + data.data.total_cash,
            // );
            if (amountInfo.current.getRawValue() <= data.data.total_cash) {
              navigation.navigate('SavedCards', {
                isFromAddCammodityOnlyVault: true,
                amount: amountInfo.current.getRawValue().toString(),
                currency: selectedCurrency,
                quantity: qty,
                quantityUnit: selectedQuantity,
                commodityId: comoCalculationData.id,
                currencySign: selectedCurrency == 'EUR' ? '€' : '$',
                toBack: back == 'vault' ? 'vault' : '',
              });
            } else {
              showCustomAlert('Insufficient cash.');
            }
          } else {
            alert(data.message);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  const checkCommodityAvailibility = async from => {
    //setIsLoading(false);
    setIsLoading(true);
    try {
      let formdata = new FormData();
      formdata.append('commodity_id', comoCalculationData.id);
      formdata.append('total_quantity', qty);
      formdata.append('quantity_unit', selectedQuantity);

      Axiosinstance.setHeader(
        'access-token',
        accessToken ? accessToken : token,
      );
      Axiosinstance.post(ApiEndPoint.check_availability, formdata).then(
        ({ok, status, data, problem}) => {
          setIsLoading(false);
          if (status === 401) {
            setisSessionExpired(true);

            setIsLoading(false);
            return false;
          } else if (ok) {
            setIsLoading(false);

            //alert(from);

            if (from == 'PHYSICAL_DELIVERY') {
              navigation.navigate('CheckPin', {
                from: 'PHYSICAL_DELIVERY',
                amount: amount,
                currency: selectedCurrency,
                total_quantity: qty,
                quantity_unit: selectedQuantity,
                commodity_id: comoCalculationData.id,
                adminFee: adminFee,
                formattedAdminCommission: adminFeeFormatted,
                toBack: back == 'vault' ? 'vault' : '',
              });
            } else if (from == 'SEND') {
              //  alert(selectedCurrency);
              navigation.navigate('CheckPin', {
                // amount: amountInfo.current.getRawValue().toString(),
                amount: amount,
                currency: selectedCurrency,
                quantity: qty,
                quantityUnit: selectedQuantity,
                commodityId: comoCalculationData.id,
                selectedUser: selectedUser,
                from: from == 'SEND' ? 'Send' : 'Request',
                adminFee: adminFee,
                formattedAdminCommission: adminFeeFormatted,
                toBack: back == 'vault' ? 'vault' : '',
              });
            } else if (from == 'SENDQR') {
              navigation.navigate('CheckPin', {
                // amount: amountInfo.current.getRawValue().toString(),
                amount: amount,
                currency: selectedCurrency,
                quantity: qty,
                quantityUnit: selectedQuantity,
                commodityId: comoCalculationData.id,
                selectedUser: selectedUser,
                from: 'SENDQR',
                adminFee: adminFee,
                formattedAdminCommission: adminFeeFormatted,
              });
            } else if (from == 'CONVERSIONTOCASH') {
              navigation.navigate('CheckPin', {
                from: 'CommodityToCash',
                amount: amount,
                total_quantity: qty,
                currency: selectedCurrency,
                quantity_unit: selectedQuantity,
                commodity_id: comoCalculationData.id,
                adminFee: adminFee,
                formattedAdminCommission: adminFeeFormatted,
                toBack: back == 'conversion' ? 'conversion' : '',
              });
            }
          } else {
            showCustomAlert(data.message);
            setIsLoading(false);
          }
        },
      );
    } catch (e) {
      setIsLoading(false);

      // setIsLoading(false);
    }
  };

  const [fullUserList, setFullUserList] = useState([]);

  const [searchByName, setSearchByName] = useState('');

  // user search handler
  const handleSearch = e => {
    setSearchByName(e);
    let text = e.toLowerCase();
    let trucks = fullUserList;
    let filteredName = trucks.filter(item => {
      return item.fullname.toLowerCase().match(text);
    });
    if (!text || text === '') {
      setUserList(fullUserList);
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      setUserList(filteredName);
    } else if (Array.isArray(filteredName)) {
      setUserList(filteredName);
    }
  };

  // let newAmount = amount;
  // var x = newAmount.split('.');
  // if (x[0].length < 5) {
  //   if (x[0].length > 3) {
  //     y = x[0].slice(0, 2) + ',' + x[0].slice(2);
  //     if (x[1] == undefined) {
  //       newAmount = y;
  //     } else {
  //       newAmount = y.slice() + '.' + x[1];
  //     }
  //   }
  // }

  const amountInfo = useRef();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <FlashMessage
        position="bottom"
        duration={500}
        style={{
          backgroundColor: 'rgba(255, 173, 0, 1)',
          justifyContent: 'center',
        }}
        statusBarHeight={true}
        floating={true}
      />
      <SessionExpiredModel modalvisible={isSessionExpired} />

      <CustomAlert
        isVisible={customAlertVisible}
        hideAlert={hideCustomAlert}
        alertText={customAlertText}
      />
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: 'white'}}
        behavior="padding">
        {/* Currency Modal start */}
        <Modal
          visible={currencyModal}
          transparent={true}
          statusBarTranslucent
          animationType={'fade'}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 20,
                width: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <View style={{height: 12, width: 12}} />
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Select Currency
                </Text>
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => {
                    setCurrencyModal(false);
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../../assets/images/icon_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: '100%',
                  height: 1,
                  marginVertical: 20,
                }}
              />
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={currencyArray}
                extraData={currencyExtraData}
                renderItem={({item, index}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          const updatedItems = currencyArray.map(itemChild => ({
                            ...itemChild,
                            isSelected: false,
                          }));
                          const finalItem = updatedItems.map(
                            (itemChild, indexx) => {
                              if (indexx === index) {
                                return {...itemChild, isSelected: true};
                              }
                              return itemChild;
                            },
                          );
                          setCurrencyArray(finalItem);
                          setCurrencyExtraData(!currencyArray);
                        }}
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 10,
                          paddingVertical: 15,
                          justifyContent: 'space-between',
                          // borderBottomColor: '#D9D9D9',
                          // borderBottomWidth: 1,
                        }}>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 16,
                            fontWeight: '600',
                            fontFamily: 'Asap-Medium',
                          }}>
                          {item.name}
                        </Text>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                          }}
                          source={
                            item.isSelected
                              ? require('../../../assets/images/icon_radio_active.png')
                              : require('../../../assets/images/icon_radio_inactive.png')
                          }
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: '#D9D9D9',
                          width: '100%',
                          height: 1,
                        }}
                      />
                    </View>
                  );
                }}
              />
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <CustomRoundedBlackBtn
                  text={'DONE'}
                  getClick={() => {
                    let notSelected = true;
                    for (let i = 0; i < currencyArray.length; i++) {
                      if (currencyArray[i].isSelected == true) {
                        setSelectedCurrency(currencyArray[i].name);
                        calculateCurrenty(
                          selectedQuantity,
                          currencyArray[i].name,
                          'currency_to_weight',
                          amount,
                          comoCalculationData.commodity_type,
                        );
                        notSelected = false;
                      }
                    }
                    if (notSelected) {
                      showCustomAlert('Please select currrency');
                    } else {
                      setCurrencyModal(false);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* Currency Modal end */}
        {/* Quantity Modal start */}
        <Modal
          visible={quantityModal}
          transparent={true}
          statusBarTranslucent
          animationType={'fade'}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 20,
                width: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <View style={{height: 12, width: 12}} />
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Select Unit
                </Text>
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => {
                    setQuantityModal(false);
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../../assets/images/icon_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: '100%',
                  height: 1,
                  marginVertical: 20,
                }}
              />
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={quantityArray}
                extraData={quantityExtraData}
                // extraData={comoditiesExtraData}
                renderItem={({item, index}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          const updatedItems = quantityArray.map(item => ({
                            ...item,
                            isSelected: false,
                          }));
                          const finalItem = updatedItems.map((item, indexx) => {
                            if (indexx === index) {
                              return {...item, isSelected: true};
                            }
                            return item;
                          });
                          setQuantityArray(finalItem);
                          setQuantityExtraData(!quantityExtraData);
                        }}
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 10,
                          paddingVertical: 15,
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 16,
                            fontWeight: '600',
                            fontFamily: 'Asap-Medium',
                          }}>
                          {item.name}
                        </Text>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                          }}
                          source={
                            item.isSelected
                              ? require('../../../assets/images/icon_radio_active.png')
                              : require('../../../assets/images/icon_radio_inactive.png')
                          }
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: '#D9D9D9',
                          width: '100%',
                          height: 1,
                        }}
                      />
                    </View>
                  );
                }}
              />
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <CustomRoundedBlackBtn
                  text={'DONE'}
                  getClick={() => {
                    let notSelected = true;
                    for (let i = 0; i < quantityArray.length; i++) {
                      if (quantityArray[i].isSelected == true) {
                        setSelectedQuantity(quantityArray[i].name);
                        calculateCurrenty(
                          quantityArray[i].name,
                          selectedCurrency,
                          'weight_to_currency',
                          qty,
                          comoCalculationData.commodity_type,
                        );
                        notSelected = false;
                      }
                    }
                    if (notSelected) {
                      showCustomAlert('Please select unit');
                    } else {
                      setQuantityModal(false);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* Quantity Modal end */}
        {/* Select User Modal start */}

        <Modal
          visible={isSelectUserVisible}
          transparent={true}
          statusBarTranslucent
          animationType={'fade'}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 20,
                width: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                maxHeight: 700,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <View style={{height: 12, width: 12}} />
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Asap-Medium',
                  }}>
                  Select User
                </Text>
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => {
                    //  setSearchByName('');
                    for (let index = 0; index < userList.length; index++) {
                      const element = userList[index];
                      if (element.isSelected) {
                        element.isSelectedTemp = true;
                      } else {
                        element.isSelectedTemp = false;
                        setIsSelectUserVisible(false);
                      }
                    }
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../../assets/images/icon_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#D9D9D9',
                  width: '100%',
                  height: 1,
                  marginTop: 20,
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  height: 40,
                  marginVertical: 10,
                  marginHorizontal: 15,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: '#F6F6F6',
                }}>
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/ico_search.png')}
                />
                <TextInput
                  style={{
                    marginLeft: 10,
                    fontSize: 13,
                    marginRight: 10,
                    width: '92%',
                    color: 'black',
                    fontFamily: 'Asap-Medium',
                  }}
                  placeholder="Search User"
                  placeholderTextColor={'#828282'}
                  value={searchByName}
                  onChangeText={val => {
                    handleSearch(val);
                  }}
                />
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={userList}
                extraData={ExtraForUserList}
                renderItem={({item, index}) => {
                  let previousIndex =
                    userList.findIndex(itemm => itemm.isSelected) - 1;

                  return (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          const updatedItems = userList.map(item => ({
                            ...item,
                            isSelectedTemp: false,
                          }));
                          const finalItem = updatedItems.map((item, indexx) => {
                            if (indexx === index) {
                              return {...item, isSelectedTemp: true};
                            }
                            return item;
                          });
                          setUserList(finalItem);
                          //  setFullUserList(finalItem);

                          // setUserList by search by name list array
                          setExtraForUserList(!quantityExtraData);
                        }}
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 10,
                          marginHorizontal: 15,
                          paddingVertical: 15,
                          backgroundColor: item.isSelectedTemp
                            ? '#ffc700'
                            : 'white',
                          borderTopRightRadius: 15,
                          borderBottomRightRadius: 15,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 35,
                            height: 35,
                            //  resizeMode: 'cover',
                            marginRight: 15,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: '#4545E0',
                            justifyContent: 'center',
                          }}>
                          <Image
                            style={{
                              alignSelf: 'center',
                              width: 34,
                              height: 34,
                              resizeMode: 'contain',
                              borderRadius: 20,
                              // borderWidth: 1,
                              // borderColor: '#4545E0',
                            }}
                            source={{uri: item.profile_img}}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: item.isSelectedTemp ? 'white' : '#000000',
                              fontSize: 16,
                              fontWeight: '600',
                              fontFamily: 'Asap-Medium',
                              lineHeight: 20,

                              marginTop: -5,
                            }}>
                            {item.fullname}
                          </Text>
                          <Text
                            style={{
                              color: item.isSelectedTemp ? 'white' : '#626262',
                              fontSize: 13,
                              fontWeight: '400',
                              fontFamily: 'Asap-Medium',
                              lineHeight: 20,
                            }}>
                            {item.email}
                          </Text>
                        </View>

                        {item.isSelectedTemp ? (
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: 'contain',
                            }}
                            source={require('../../../assets/images/icon_right.png')}
                          />
                        ) : null}
                      </TouchableOpacity>

                      <View
                        style={{
                          backgroundColor: item.isSelectedTemp
                            ? 'white'
                            : previousIndex == index
                            ? 'white'
                            : '#D9D9D9',
                          flex: 1,
                          height: 1,
                          marginHorizontal: 15,
                        }}
                      />
                    </View>
                  );
                }}
                style={{
                  height: '75%',
                }}
              />
              <View
                style={{
                  marginHorizontal: 15,
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <CustomRoundedBlackBtn
                  text={'DONE'}
                  getClick={() => {
                    let selectedUserr = userList.filter(
                      itemm => itemm.isSelectedTemp,
                    );

                    for (let index = 0; index < userList.length; index++) {
                      const element = userList[index];
                      if (element.isSelectedTemp) {
                        element.isSelected = true;
                      } else {
                        element.isSelected = false;
                      }
                    }
                    setSelectedUser(selectedUserr[0]);
                    setIsSelectUserVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* Select User Modal end */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1,
          }}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
            {isComoditySelectionViewVisiable ? (
              <View style={{height: 75}}>
                <FlatList
                  overScrollMode="never"
                  showsHorizontalScrollIndicator={false}
                  data={comodities}
                  extraData={comoditiesExtraData}
                  renderItem={renderComo}
                  horizontal
                />
              </View>
            ) : (
              <>
                <Image
                  style={{
                    alignSelf: 'center',
                    width: windowWidth / 2 - 90,
                    height: windowWidth / 2 - 90,
                  }}
                  resizeMode={'contain'}
                  source={{uri: icon}}></Image>

                <Text
                  style={{
                    color: '#202020',
                    fontFamily: 'Asap-Medium',
                    fontSize: 25,
                    marginTop: 8,
                    fontWeight: '800',
                    lineHeight: 25,
                  }}>
                  {name}
                </Text>
                {name != undefined ? (
                  <LinearGradient
                    style={{
                      //  backgroundColor: '#FFAD00',
                      marginTop: 20,
                      borderRadius: 5,
                      height: 3,
                      width: 25,
                    }}
                    colors={['#AE8625', '#F7EA8A', '#D2AC47', '#EDC967']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}></LinearGradient>
                ) : null}
                {/* <View
                  style={{
                    marginTop: 20,
                    borderRadius: 5,
                    height: 3,
                    width: 25,
                    backgroundColor: '#FF8F00',
                  }}></View> */}
              </>
            )}

            <View style={{height: 30}} />
            {comoCalculationData ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setIsAmountSelected(true);
                    setIsQtySelected(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isAmountSelected ? '#F1F1F1' : null,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                  }}>
                  {/* <Text
                    style={{
                      color: '#101010',
                      fontFamily: 'Asap-Medium',
                      fontSize: 40,
                      fontWeight: '600',
                    }}
                    numberOfLines={1}>
                    {selectedCurrency == 'EUR' ? '€' : '$'}
                    {amount == '' || qty == '' ? '0' : amount}
                  </Text> */}
                  <TextInputMask
                    ref={amountInfo}
                    onPressIn={() => {
                      setIsAmountSelected(true);
                      setIsQtySelected(false);
                    }}
                    editable={false}
                    style={{
                      color: '#101010',
                      fontFamily: 'Asap-Medium',
                      fontSize: 40,
                      fontWeight: '600',
                    }}
                    // onFocus={() => {
                    //   setIsAmountSelected(true);
                    // }}
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: '.',
                      delimiter: ',',
                      unit: selectedCurrency == 'EUR' ? '€' : '$',
                      suffixUnit: '',
                    }}
                    value={amount == '' || qty == '' ? '0' : amount}
                    numberOfLines={1}></TextInputMask>
                </TouchableOpacity>
                <DropButton
                  lable={selectedCurrency}
                  getClick={() => {
                    setCurrencyModal(true);
                  }}
                />
                <View style={{height: 20}} />
                <TouchableOpacity
                  onPress={() => {
                    setIsAmountSelected(false);
                    setIsQtySelected(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isQtySelected ? '#F1F1F1' : null,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#101010',
                      fontFamily: 'Asap-Medium',
                      fontSize: 40,
                      fontWeight: '600',
                    }}>
                    {qty == '' || amount == '' ? '0' : qty}
                  </Text>
                </TouchableOpacity>
                <DropButton
                  lable={selectedQuantity}
                  getClick={() => {
                    setQuantityModal(true);
                  }}
                />
                <View style={{height: 20}} />
              </>
            ) : (
              <Text
                numberOfLines={1}
                style={{
                  color: '#101010',
                  fontFamily: 'Asap-Medium',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Please select commodity
              </Text>
            )}
          </View>
          {comoCalculationData ? (
            <View>
              {from == 'ADD' ||
              from == 'CONVERSION' ||
              from == 'CONVERSIONTOCASH' ||
              from == 'SHIP' ||
              from == 'PHYSICAL_DELIVERY' ? null : usrId ? (
                <View
                  style={{
                    marginHorizontal: 15,
                    // height: 60,
                    backgroundColor: 'white',
                    borderColor: '#CBCBCB',
                    borderRadius: 5,
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                      resizeMode: 'cover',
                      marginRight: 15,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#FFAD00',
                    }}
                    source={{uri: usrImg}}
                  />

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 16,
                        fontWeight: '600',
                        fontFamily: 'Asap-Medium',
                        lineHeight: 20,
                      }}>
                      {usrName}
                    </Text>
                    <Text
                      style={{
                        color: '#626262',
                        fontSize: 13,
                        fontWeight: '400',
                        fontFamily: 'Asap-Medium',
                        lineHeight: 20,
                      }}>
                      {usrEmail}
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setIsSelectUserVisible(true);
                  }}
                  style={{
                    marginHorizontal: 15,
                    // height: 60,
                    backgroundColor: 'white',
                    borderColor: '#CBCBCB',
                    borderRadius: 5,
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  {selectedUser ? (
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        resizeMode: 'cover',
                        marginRight: 15,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#4545E0',
                      }}
                      source={{uri: selectedUser?.profile_img}}
                    />
                  ) : (
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        resizeMode: 'contain',
                        marginRight: 15,
                        borderWidth: 1,
                        borderColor: '#4545E0',
                        borderRadius: 20,
                      }}
                      source={require('../../../assets/images/placeholder_user_icon.png')}
                    />
                  )}

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    {selectedUser ? (
                      <>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 16,
                            fontWeight: '600',
                            fontFamily: 'Asap-Medium',
                            lineHeight: 20,
                          }}>
                          {selectedUser.fullname}
                        </Text>
                        <Text
                          style={{
                            color: '#626262',
                            fontSize: 13,
                            fontWeight: '400',
                            fontFamily: 'Asap-Medium',
                            lineHeight: 20,
                          }}>
                          {selectedUser.email}
                        </Text>
                      </>
                    ) : (
                      <Text
                        style={{
                          color: '#000000',
                          fontSize: 16,
                          fontWeight: '600',
                          fontFamily: 'Asap-Medium',
                          lineHeight: 20,
                        }}>
                        Select User
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}

              <CustomKeyboard
                label={
                  from == 'CONVERSIONTOCASH'
                    ? 'CONTINUE'
                    : from == 'CONVERSION'
                    ? 'ADD'
                    : from == 'PHYSICAL_DELIVERY'
                    ? 'CONTINUE'
                    : from == 'SENDQR'
                    ? 'SEND'
                    : from == 'REQUESTQR'
                    ? 'REQUEST'
                    : from
                }
                getDoneClick={async () => {
                  // const newAmou = amountInfo.current;
                  // //if (newAmou.hasOwnProperty('.')) {
                  // alert(amount);
                  // //   } else alert('hh');
                  // return;
                  if (!parseFloat(amount)) {
                    showCustomAlert('Please enter amount');
                    return;
                  }
                  // if (parseFloat(amount) > 999999.99) {
                  //   showCustomAlert('Amount must be than $999,999.00');
                  //   setAmount('0');
                  //   setQty('0');
                  //   return;
                  // }
                  if (!parseFloat(qty)) {
                    showCustomAlert('Please enter quantity');
                    return;
                  }

                  if (
                    from != 'ADD' &&
                    from != 'CONVERSION' &&
                    from != 'CONVERSIONTOCASH' &&
                    from != 'SHIP' &&
                    from != 'PHYSICAL_DELIVERY'
                  ) {
                    if (!selectedUser) {
                      showCustomAlert('Please select user!');
                      return;
                    }
                    if (from == 'SEND') {
                      checkCommodityAvailibility('SEND');
                    } else if (from == 'SENDQR') {
                      checkCommodityAvailibility('SENDQR');
                    } else if (from == 'REQUESTQR') {
                      navigation.navigate('CheckPin', {
                        // amount: amountInfo.current.getRawValue().toString(),
                        amount: amount,
                        currency: selectedCurrency,
                        quantity: qty,
                        quantityUnit: selectedQuantity,
                        commodityId: comoCalculationData.id,
                        selectedUser: selectedUser,
                        from: 'REQUESTQR',
                        adminFee: adminFee,
                        formattedAdminCommission: adminFeeFormatted,
                      });
                    } else {
                      navigation.navigate('CheckPin', {
                        //amount: amountInfo.current.getRawValue().toString(),
                        amount: amount,
                        currency: selectedCurrency,
                        quantity: qty,
                        quantityUnit: selectedQuantity,
                        commodityId: comoCalculationData.id,
                        selectedUser: selectedUser,
                        adminFee: adminFee,
                        formattedAdminCommission: adminFeeFormatted,
                        from: from == 'SEND' ? 'Send' : 'Request',
                        toBack: back == 'vault' ? 'vault' : '',
                      });
                    }
                  } else {
                    if (from == 'CONVERSION') {
                      //checkCommodityAvailibility('CONVERSION');
                      getWalletAmount();
                    } else if (from == 'CONVERSIONTOCASH') {
                      checkCommodityAvailibility('CONVERSIONTOCASH');
                    } else if (from == 'SHIP') {
                      // navigation.navigate('CheckPin', {
                      //   from: 'SHIP',
                      //   total_quantity: qty,
                      //   quantity_unit: selectedQuantity,
                      //   commodity_id: comoCalculationData.id,
                      //   toBack: back == 'vault' ? 'vault' : '',
                      // });
                      navigation.navigate('Shipment', {
                        from: 'SHIP',
                        qnt: qty,
                        quantity_unit: selectedQuantity,
                        commodity_id: comoCalculationData.id,
                        com_img: comoCalculationData.commodity_img,
                        com_name: comoCalculationData.name,
                        toBack: back == 'vault' ? 'vault' : '',
                        amount: amount,
                        qnt_unit: selectedQuantity,
                        currency: selectedCurrency,
                      });
                    } else if (from == 'PHYSICAL_DELIVERY') {
                      //checkCommodityAvailibility('PHYSICAL_DELIVERY');

                      navigation.navigate('ShipmentToME', {
                        from: 'SHIP',
                        qnt: qty,
                        quantity_unit: selectedQuantity,
                        commodity_id: comoCalculationData.id,
                        com_img: comoCalculationData.commodity_img,
                        com_name: comoCalculationData.name,
                        toBack: back == 'vault' ? 'vault' : '',
                        amount: amount,
                        qnt_unit: selectedQuantity,
                        currency: selectedCurrency,
                      });
                    } else {
                      navigation.navigate('SavedCards', {
                        isFromAddCammodity: true,
                        amount: amountInfo.current.getRawValue().toString(),
                        currency: selectedCurrency,
                        quantity: qty,
                        quantityUnit: selectedQuantity,
                        commodityId: comoCalculationData.id,
                        currencySign: selectedCurrency == 'EUR' ? '€' : '$',
                        toBack: back == 'vault' ? 'vault' : '',
                      });
                    }
                  }
                }}
                getKeyBoardClick={item => {
                  //source.cancel();
                  if (isAmountSelected) {
                    if (item.value === '<') {
                      setAmount(amount.slice(0, -1) ? amount.slice(0, -1) : '');

                      setTimeout(() => {
                        const newAmout = amountInfo.current
                          .getRawValue()
                          .toString();

                        calculateCurrenty(
                          selectedQuantity,
                          selectedCurrency,
                          'currency_to_weight',
                          newAmout,
                          comoCalculationData.commodity_type,
                        );
                      }, 500);

                      // //alert(amount);
                      // calculateCurrenty(
                      //   selectedQuantity,
                      //   selectedCurrency,
                      //   'currency_to_weight',
                      //   amount.slice(0, -1) ? amount.slice(0, -1) : 0,
                      //   comoCalculationData.commodity_type,
                      // );
                    } else if (item.value == '.') {
                      let count = 0;
                      for (let index = 0; index < amount.length; index++) {
                        if (amount[index] == '.') {
                          count = count + 1;
                        }
                      }
                      if (amount.length < 1) {
                        if (item.value == '.') {
                          setAmount('0.');
                        }
                      } else {
                        if (count == 0) {
                          setAmount(amount + item.value);

                          setTimeout(() => {
                            const newAmout = amountInfo.current
                              .getRawValue()
                              .toString();

                            calculateCurrenty(
                              selectedQuantity,
                              selectedCurrency,
                              'currency_to_weight',
                              newAmout,
                              comoCalculationData.commodity_type,
                            );
                          }, 500);

                          // calculateCurrenty(
                          //   selectedQuantity,
                          //   selectedCurrency,
                          //   'currency_to_weight',
                          //   amount + item.value,
                          //   comoCalculationData.commodity_type,
                          // );
                        }
                      }
                    } else {
                      if (amount.includes('.')) {
                        var amountNew = amount.split('.');

                        if (amount.length < 8) {
                          setAmount(amount + item.value);

                          setTimeout(() => {
                            const newAmout = amountInfo.current
                              .getRawValue()
                              .toString();

                            calculateCurrenty(
                              selectedQuantity,
                              selectedCurrency,
                              'currency_to_weight',
                              newAmout,
                              comoCalculationData.commodity_type,
                            );
                          }, 500);

                          // calculateCurrenty(
                          //   selectedQuantity,
                          //   selectedCurrency,
                          //   'currency_to_weight',
                          //   amount + item.value,
                          //   comoCalculationData.commodity_type,
                          // );
                        } else {
                          showMessage({
                            message: 'Only two digit allow after decimal.',
                            type: 'info',
                          });
                        }
                      } else {
                        if (amount.length < 7) {
                          if (amount.length == 1 && amount == '0') {
                            setAmount(item.value);
                          } else {
                            setAmount(amount + item.value);
                          }
                          //   }

                          setTimeout(() => {
                            const newAmout = amountInfo.current
                              .getRawValue()
                              .toString();

                            calculateCurrenty(
                              selectedQuantity,
                              selectedCurrency,
                              'currency_to_weight',
                              newAmout,
                              comoCalculationData.commodity_type,
                            );
                          }, 500);

                          // calculateCurrenty(
                          //   selectedQuantity,
                          //   selectedCurrency,
                          //   'currency_to_weight',
                          //   amount + item.value,
                          //   comoCalculationData.commodity_type,
                          // );
                        }
                      }
                    }
                  }
                  // else

                  if (isQtySelected) {
                    if (item.value === '<') {
                      setQty(qty.slice(0, -1) ? qty.slice(0, -1) : '');

                      calculateCurrenty(
                        selectedQuantity,
                        selectedCurrency,
                        'weight_to_currency',
                        qty.slice(0, -1) ? qty.slice(0, -1) : 0,
                        comoCalculationData.commodity_type,
                      );
                    } else if (item.value == '.') {
                      let count = 0;
                      for (let index = 0; index < qty.length; index++) {
                        if (qty[index] == '.') {
                          count = count + 1;
                        }
                      }
                      if (qty.length < 1) {
                        if (item.value == '.') {
                          setQty('0.');
                        }
                      } else {
                        if (count == 0) {
                          setQty(qty + item.value);
                          calculateCurrenty(
                            selectedQuantity,
                            selectedCurrency,
                            'weight_to_currency',
                            qty + item.value,
                            comoCalculationData.commodity_type,
                          );
                        }
                      }
                    } else {
                      if (qty.includes('.')) {
                        var qtyNew = qty.split('.');
                        if (qtyNew[1].length < 4) {
                          setQty(qty + item.value);
                          calculateCurrenty(
                            selectedQuantity,
                            selectedCurrency,
                            'weight_to_currency',
                            qty + item.value,
                            comoCalculationData.commodity_type,
                          );
                        } else {
                          showMessage({
                            message: 'Only four digit allow after decimal.',
                            type: 'info',
                          });
                        }
                      } else {
                        if (qty.length < 5) {
                          if (qty.length == 1 && qty == '0') {
                            setQty(item.value);
                          } else {
                            setQty(qty + item.value);
                          }
                          calculateCurrenty(
                            selectedQuantity,
                            selectedCurrency,
                            'weight_to_currency',
                            qty + item.value,
                            comoCalculationData.commodity_type,
                          );
                        }
                      }
                    }
                  }
                }}
              />
            </View>
          ) : null}

          <Loader isVisible={isLoading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default AddComodities;
const DropButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.getClick}
      style={{
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: '#DDDDDD',
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
      }}>
      <Text
        style={{
          color: '#333333',
          fontFamily: 'Asap-Medium',
          fontSize: 13,
          fontWeight: '500',
        }}>
        {props.lable}
      </Text>
      <Image
        style={{
          width: 13,
          height: 7,
          resizeMode: 'contain',
          marginLeft: 8,
        }}
        source={require('../../../assets/images/icon_drop.png')}
      />
    </TouchableOpacity>
  );
};
