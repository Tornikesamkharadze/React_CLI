import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  mainView: {
    flex: 1,
    //    backgroundColor: "red",
    marginTop: 15,
    paddingHorizontal: 15,
  },
  activeLineView: {
    height: 0.5,
    backgroundColor: '#333333',
    marginVertical: Platform.OS === 'ios' ? 7 : 5,
  },
  inactiveLineView: {
    height: 0.5,
    backgroundColor: '#D9D9D9',
    marginVertical: Platform.OS === 'ios' ? 7 : 5,
  },
  infoMainView: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    height: 30,
    //  backgroundColor:'red'
  },
  addressMainView: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 12,
    // backgroundColor: 'red',
  },
  leftInfoView: {
    width: '20%',
    justifyContent: 'center',
  },
  leftAddressView: {
    width: '20%',
    //  backgroundColor: 'red',
    //  justifyContent: 'center',
  },
  leftInfoTextStyle: {
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#202020',
  },
  changeInfoMainView: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeAddressMainView: {
    width: '80%',
    flexDirection: 'row',
    //  backgroundColor: 'red',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  inputTextStyle: {
    width: '80%',
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#202020',
    height: 25,
    paddingVertical: -4,
    //  backgroundColor:'red',
    paddingHorizontal: 0,
  },
  middleInfoTextStyle: {
    width: '85%',
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#202020',
  },
  rightInfoView: {
    width: '15%',
    paddingVertical: 2,
  },
  rightTextStyle: {
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#ffc700',
    alignSelf: 'flex-end',
  },
  rightImgStyle: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  settingBodyContentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  paddingVertical: 3,
    alignItems: 'center',
    marginVertical: 9,
    paddingHorizontal: 0,
    //  backgroundColor:'pink',
    height: 25,
  },
  settingLeftTextStyle: {
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#202020',
  },
  settingRightIconsStyle: {
    height: 14,
    width: 9,
    resizeMode: 'contain',
  },
  notificationIconStyle: {
    marginRight: -2,
    height: 17,
    width: 25,
    resizeMode: 'contain',
  },
});
