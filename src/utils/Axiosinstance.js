/* eslint-disable no-unused-vars */
import {create} from 'apisauce';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

//baseURL: 'http://192.168.1.35:4000/', //Local

const Axiosinstance = create({
  //baseURL: 'http://192.168.1.34:4000/',
  baseURL: 'https://api.goldtheapp.com/',
  headers: {
    // 'content-type': 'application/x-www-form-urlencoded',
    // 'accept': 'application/json',
    'api-key': 'jdb32165YV1dsdmz@f&2vfaBbGkd587!#dmv',
    'device-token': '',
    'device-type': Platform.OS === 'android' ? 1 : 2,
    'device-id': DeviceInfo.getUniqueId(),
  },
});

const naviMonitor = response =>
  //  console.log('hey!  listen! ', response.config.headers);
  console.log('hey!  listenaaaa! --------> ', JSON.stringify(response));

Axiosinstance.addMonitor(naviMonitor);
export default Axiosinstance;
