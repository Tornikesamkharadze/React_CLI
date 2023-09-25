/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useAuth} from '../authContext/AuthContexts';
import SplashScreen from 'react-native-splash-screen';
import {AuthProvider} from '../authContext/AuthContexts';
import HomeStackNavigator from './homestack/BottomTabStack';
import AuthStack from './appstack/AppStack';
import {Image, ImageBackground, StatusBar, View} from 'react-native';
import Loader from '../widgets/customalert/Loader';
import InternetConnectionModel from '../widgets/customalert/InternetConnectionModal';
import NetInfo from '@react-native-community/netinfo';
import {useState} from 'react';
import {createContext} from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';

//notification
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import Axiosinstance from '../utils/Axiosinstance';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

const StackSwitcher = () => {
  const [isConnectedInternet, setIsConnectedInternet] = useState(false);
  const [refreshPage, setRefreshPage] = useState(true);
  //internet and session expired management
  NetInfo.addEventListener(state => {
    if (isConnectedInternet !== state.isConnected) {
      setIsConnectedInternet(state.isConnected);
      if (isConnectedInternet === false) {
        setRefreshPage(!refreshPage);
      }
    }
  });
  //end here
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);
  const [notificationData, setNotificationData] = React.useState('');

  React.useEffect(() => {
    SplashScreen.hide();
    setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);
  }, []);

  //notification code
  const getToken = async () => {
    await messaging()
      .getToken()
      .then(token => {
        Axiosinstance.setHeader('device-token', token);
        console.log('Device token --> ', token);
      });
  };
  const requestUserPermission = async () => {
    await messaging().requestPermission();
  };
  const createChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.requestPermission();
  };
  const displayForgroundNotification = async remoteMessage => {
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data,
      android: {
        channelId: 'default',
        smallIcon: 'icon_notification',
        largeIcon: 'ic_launcher',
        color: '#ffc700',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
  const changeNotificationData = () => {
    setNotificationData('');
  };
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('cancelled 1');
          break;
        case EventType.PRESS:
          setNotificationData(detail.notification.data);
          break;
      }
    });
  }, []);

  useEffect(() => {
    createChannel();
    requestUserPermission();
    getToken();

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        setNotificationData(remoteMessage.data);
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      setNotificationData(remoteMessage.data);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Remote message ---->', JSON.stringify(remoteMessage));
      displayForgroundNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  if (isSplashVisible) {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle={'light-content'} backgroundColor={'#6f6c68'} />
        <ImageBackground
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          resizeMode={'cover'}
          source={require('../assets/images/icon_splash_bg.png')}>
          <Image
            style={{height: 200, width: 200, resizeMode: 'contain'}}
            source={require('../assets/images/gif_gold_app.gif')}
          />
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <NavigationContainer>
        <NotificationDataContext.Provider
          value={{notificationData, changeNotificationData}}>
          <StripeProvider
            publishableKey="pk_test_51MZ6lkLT5Z7vwZ1Tst0K6nuwZpeDKJb0C6x5W3Own9bkcANBmBbG8QxhVJ6WaxYaf71KmQVxTbDLajA741T6XCxi00CapupRLS"
            urlScheme="com.mindiii.gold.payments" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.mindiii.gold" // required for Apple Pay
          >
            <AuthProvider>
              <InternetConnectionModel modalvisible={isConnectedInternet} />
              <StackSwitch />
            </AuthProvider>
          </StripeProvider>
        </NotificationDataContext.Provider>
      </NavigationContainer>
    );
  }
};
const StackSwitch = () => {
  const {authData, loading} = useAuth();
  if (loading) {
    return <Loader isVisible={true} />;
  } else {
    return <>{authData ? <HomeStackNavigator /> : <AuthStack />}</>;
  }
};
export default StackSwitcher;
export const NotificationDataContext = createContext();
