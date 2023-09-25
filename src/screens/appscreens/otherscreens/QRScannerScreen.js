import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import QRScannerComponent from './QRScannerComponent';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const QRScannerScreen = ({navigation, route}) => {
  const [scan, setScan] = useState(true);
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
          Scan
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
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {/* <Loader isVisible={isLoading} /> */}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      {scan ? (
        <View />
      ) : (
        <View
          style={{
            zindex: 1,
            alignSelf: 'center',
            height: 50,
            width: '90%',
            borderWidth: 1,
            borderColor: '#D3D3D3',
            borderRadius: 10,
            flexDirection: 'row',
            backgroundColor: 'white',
            marginTop: 15,
            marginBottom: 10,
          }}>
          <View
            style={{
              height: 50,
              width: '49%',
              borderLeftRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setScan(true);
              }}
              style={{
                height: '88%',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 14,
                  fontFamily: 'Asap-SemiBold',
                  fontWeight: '600',
                  color: scan ? '#FF8F00' : '#000000',
                }}>
                Scan Code
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: 'white',
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
            />
          </View>
          <View
            style={{
              height: 20,
              backgroundColor: '#D3D3D3',
              width: 2,
              marginHorizontal: 3,
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              height: 50,
              width: '49%',
              borderLeftRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setScan(false);
              }}
              style={{
                height: '88%',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 14,
                  fontFamily: 'Asap-SemiBold',
                  fontWeight: '600',
                  color: scan ? '#000000' : '#4545E0',
                }}>
                My QR Code
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: scan ? 'white' : '#4545E0',
                height: 3,
                width: '25%',
                alignSelf: 'center',
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      )}
      {scan ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'column-reverse',
          }}>
          <QRScannerComponent navigation={navigation} />
          <View
            style={{
              zindex: -1,
              marginBottom: -50,
              marginTop: 15,
            }}>
            <View
              style={{
                zindex: -1,
                marginBottom: -50,
                alignSelf: 'center',
                height: 50,
                width: '90%',
                borderWidth: 1,
                borderColor: '#D3D3D3',
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: 50,
                  width: '49%',
                  borderLeftRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setScan(true);
                  }}
                  style={{
                    height: '88%',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      fontFamily: 'Asap-SemiBold',
                      fontWeight: '600',
                      color: scan ? '#4545E0' : '#000000',
                    }}>
                    Scan Code
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: scan ? '#4545E0' : 'white',
                    height: 3,
                    width: '25%',
                    alignSelf: 'center',
                    borderRadius: 6,
                  }}
                />
              </View>
              <View
                style={{
                  height: 20,
                  backgroundColor: '#D3D3D3',
                  width: 2,
                  marginHorizontal: 3,
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  height: 50,
                  width: '49%',
                  borderLeftRadius: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setScan(false);
                  }}
                  style={{
                    height: '88%',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      fontFamily: 'Asap-SemiBold',
                      fontWeight: '600',
                      color: 'white',
                    }}>
                    My QR Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: route.params.qrcode}}
            style={{
              width: '100%',
              aspectRatio: 1 / 1,
              borderRadius: 10,
              resizeMode: 'contain',
            }}
          />
        </View>
      )}
    </View>
  );
};
export default QRScannerScreen;
