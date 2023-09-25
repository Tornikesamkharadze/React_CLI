import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import CustomRoundedBlackBtn from '../../../widgets/CustomRoundedBlackBtn';
import Share from 'react-native-share';
import Clipboard from '@react-native-community/clipboard';

import {Dimensions} from 'react-native';
import GradientText from '../../../widgets/GradienText';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const InviteFriend = ({navigation, route}) => {
  //   const [url, setUrl] = useState();
  //   useFocusEffect(
  //     React.useCallback(() => {
  //       setUrl(route.params.url);
  //     }, []),
  //   );

  const copyToClipboard = () => {
    Clipboard.setString('https://www.mindiii.com/');
  };
  const showCustomAlert = () => {
    return;
  };
  const getClick = () => {
    const shareOptions = {
      title: 'Share link',
      url: 'https://www.mindiii.com/',
      failOnCancel: false,
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
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
          Invite Friends
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
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginVertical: 30,
          }}>
          <Image
            style={{
              height: windowHeight * 0.3,
              width: windowWidth,
              resizeMode: 'contain',
            }}
            source={require('../../../assets/images/ico_invite_friend.png')}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            marginTop: 15,
          }}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginHorizontal: 30,
            }}>
            <Text
              numberOfLines={2}
              style={{
                color: 'rgba(16, 16, 16, 1)',
                textAlign: 'center',
                //  lineHeight: 35,
                fontSize: 25,
                fontWeight: '700',
                fontFamily: 'Asap-Bold',
                textTransform: 'uppercase',
              }}>
              <Text
                style={{
                  color: '#ffc700',
                  textAlign: 'center',
                  lineHeight: 35,
                  fontSize: 25,
                  fontWeight: '700',
                  fontFamily: 'Asap-Bold',
                  textTransform: 'uppercase',
                }}>
                INVITE
              </Text>{' '}
              YOUR FRIENDS REWARD YOURSELF
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#82806C',
                lineHeight: 20,
                fontSize: 14,
                fontWeight: '400',
                fontFamily: 'Asap-Medium',
                // textTransform: 'uppercase',
              }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard();
            }}
            style={{
              marginTop: windowHeight * 0.2,
              alignSelf: 'center',
              padding: 3,
            }}>
            {/* <GradientText
              style={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
                alignSelf: 'center',
              }}>
              Copy Invite Link
            </GradientText> */}
            <Text
              style={{
                color: '#ffc700',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Asap-Medium',
              }}>
              Copy Invite Link
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: windowHeight * 0.03,
              marginBottom: 15,
            }}>
            <CustomRoundedBlackBtn
              showCustomAlert={showCustomAlert}
              getClick={getClick}
              text={'INVITE'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default InviteFriend;
