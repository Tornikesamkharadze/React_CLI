import {useState, useRef, useEffect, useCallback} from 'react';
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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Scan = ({navigation, route}) => {
  const [user_id, setUser_id] = useState({
    id: '',
  });
  const [userDetails, serUserDetails] = useState({
    name: '',
    email: '',
    imgUrl: '',
  });
  useFocusEffect(
    useCallback(() => {
      setUser_id({
        id: route.params.userId,
      });
      serUserDetails({
        name: route.params.userName,
        email: route.params.userEmail,
        imgUrl: route.params.userImg,
      });
    }, []),
  );

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
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      {/* <Loader isVisible={isLoading} /> */}
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View>
          <Image
            style={{
              alignSelf: 'center',
              marginTop: windowHeight * 0.1,
              height: 100,
              width: 100,
              borderRadius: 100 / 1,
              resizeMode: 'contain',
              borderWidth: 2,
              borderColor: 'rgba(255, 173, 0, 0.5)',
            }}
            source={{uri: userDetails?.imgUrl}}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 20,
              fontSize: 22,
              fontFamily: 'Asap-SemiBold',
              color: '#202020',
            }}>
            {userDetails?.name}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 10,
              fontSize: 14,
              fontFamily: 'Asap-Regular',
              color: '#828282',
            }}>
            {userDetails?.email}
          </Text>
        </View>
        <View
          style={{
            marginTop: windowHeight * 0.05,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SendCommoditiesScreen', {
                userId: user_id,
                userName: userDetails?.name,
                userEmail: userDetails?.email,
                userImg: userDetails?.imgUrl,
              });
            }}
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 165,
              height: 40,
              backgroundColor: '#000000',
              borderRadius: 6,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 15,
                fontFamily: 'Asap-Medium',
                color: '#FFFFFF',
              }}>
              SEND
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RequestCommoditiesScreen', {
                userId: user_id,
                userName: userDetails?.name,
                userEmail: userDetails?.email,
                userImg: userDetails?.imgUrl,
              });
            }}
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 165,
              height: 40,
              backgroundColor: '#ffc700',
              borderRadius: 6,
              marginTop: 20,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 15,
                fontFamily: 'Asap-Medium',
                color: '#FFFFFF',
              }}>
              REQUEST
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: windowHeight * 0.2,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 165,
              height: 40,
              borderWidth: 1.5,
              borderColor: '#ffc700',
              borderRadius: 7,
              marginTop: 20,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 16,
                fontFamily: 'Asap-SemiBolditalic',
                color: '#ffc700',
              }}>
              Back To Scan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default Scan;
