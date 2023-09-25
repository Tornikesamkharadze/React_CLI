import {View} from 'react-native';
import React, {useState, useCallback} from 'react';
import Scan from './Scan';
import {useFocusEffect} from '@react-navigation/native';
import Axiosinstance from '../../../utils/Axiosinstance';
import ApiEndPoint from '../../../utils/ApiEndPoint';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {QRscanner} from 'react-native-qr-scanner';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const QRScannerComponent = ({navigation, route}) => {
  const [myId, setMyId] = useState();

  const [isCameraOpen, setCameraOpen] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getToken();
      setTimeout(() => {
        setCameraOpen(true);
      }, 1000);
    }, []),
  );

  const getToken = async () => {
    const userData = await AsyncStorage.getItem('userData');
    setMyId(JSON.parse(userData));
  };
  const userDetail = id => {
    try {
      // Axiosinstance.setHeader('Content-Type', '');
      Axiosinstance.post(ApiEndPoint.user_details, {
        user_id: id,
      }).then(({ok, status, data, problem}) => {
        if (ok) {
          navigation.navigate('Scan', {
            userId: id,
            userName: data.data.fullname,
            userEmail: data.data.email,
            userImg: data.data.profile_img,
          });
        } else {
          alert('user_data_not_available');
          //  showCustomAlert(data.message);
        }
      });
    } catch (e) {
      alert(e);
    }
  };

  const onRead = res => {
    console.log(JSON.stringify(res));
    console.log(typeof res?.data);

    try {
      const id = JSON.parse(res?.data);
      if (id.hasOwnProperty('user_id')) {
        if (myId?.id !== id?.user_id) {
          userDetail(id.user_id);
        } else {
          alert('You are not proceed with your own qr code');
        }
      }
    } catch {
      alert('Something went wrong.');
    }

    // if (typeof res?.data !== 'string') {
    //   const id = JSON.parse(res?.data);

    //   if (id.hasOwnProperty('user_id')) {
    //     if (myId?.id !== id?.user_id) {
    //       userDetail(id.user_id);
    //     } else {
    //       alert('You are not proceed with your own qr code');
    //     }
    //   } else {
    //     alert('Something went wrong inside.');
    //   }
    // } else {
    //   alert('Something went wrong.');
    // }
  };

  return (
    <View style={{flex: 1}}>
      {isCameraOpen ? (
        <QRscanner
          onRead={onRead}
          hintText={() => {
            return <View></View>;
          }}
          finderY={50}
          isRepeatScan={true}
        />
      ) : null}
    </View>
  );
};
export default QRScannerComponent;
