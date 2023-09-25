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
  StatusBar,
  Animated,
} from 'react-native';
//Libraries
import PagerView from 'react-native-pager-view';
import {ExpandingDot} from 'react-native-animated-pagination-dots';

import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tutorial = ({navigation, route}) => {
  const DATA = [
    {
      src: require('../../../assets/tutorialmages/1_Tutorial.png'),
    },
    {
      src: require('../../../assets/tutorialmages/4_Tutorial.png'),
    },
    {
      src: require('../../../assets/tutorialmages/2_Tutorial.png'),
    },
    {
      src: require('../../../assets/tutorialmages/3_Tutorial.png'),
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  // dot indicator code starts here
  const width = Dimensions.get('window').width;
  const ref = React.useRef(PagerView);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, DATA?.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, DATA?.length * width],
  });
  const onPageScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    [],
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
          Tutorial
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
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View>
        <PagerView
          onPageScroll={onPageScroll}
          style={{
            alignSelf: 'center',
            width: windowWidth,
            height: windowHeight * 0.93,
            backgroundColor: 'white',
          }}
          initialPage={0}
          ref={ref}>
          {DATA?.map((item, index) => (
            <View
              style={{
                borderRadius: 28,
              }}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 12,
                  resizeMode: 'contain',
                }}
                source={item.src}
                //   key={index}
              />
            </View>
          ))}
        </PagerView>
        <View
          style={{
            zIndex: 1,
            marginTop: 0,
          }}>
          <ExpandingDot
            data={DATA}
            expandingDotWidth={12}
            scrollX={scrollX}
            inActiveDotOpacity={0.2}
            activeDotColor={'black'}
            dotStyle={{
              width: 12,
              height: 12,
              borderRadius: 6,
              marginHorizontal: 5,
              borderColor: 'white',
              borderWidth: 1,
            }}
            containerStyle={{}}
          />
        </View>
      </View>
    </View>
  );
};

export default Tutorial;
