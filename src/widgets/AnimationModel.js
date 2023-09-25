/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  PixelRatio,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const AnimationModel = props => {
  return (
    <Modal
      visible={props.modalvisible}
      statusBarTranslucent
      transparent={true}
      animationType="fade">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: 'white',
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={{alignItems: 'center', marginTop: 70}}>
          <Image
            style={{
              height: 120,
              width: 120,
              marginBottom: 40,
              resizeMode: 'cover',
              // borderRadius: 150,
            }}
            source={require('../assets/images/gold_logo.png')}
          />
          <Image
            style={{
              height: 200,
              width: 200,
              marginBottom: 20,
              resizeMode: 'cover',
              // borderRadius: 150,
            }}
            source={require('../assets/images/icon_success.png')}
          />
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 35,
              color: '#12B736',
              fontFamily: 'Asap-Medium',
              fontWeight: '600',
            }}>
            Successful
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 22,
              color: '#626262',
              fontFamily: 'Asap-Italic',
              fontWeight: '500',
              textAlign: 'center',
              marginTop: 30,
            }}>
            {props.label}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            props.getClick();
          }}
          style={{
            width: '50%',
            //  borderColor: '#FFAD00',
            marginBottom: 60,
            borderRadius: 10,
            //  borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            height: 50,
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }} //back_to_conversion
            source={
              props.backText == 'Back To Vault'
                ? require('../assets/images/back_to_vault.png')
                : props.backText == 'Back To Conversions'
                ? require('../assets/images/back_to_conversion.png')
                : props.backText == 'Go to MyShipment'
                ? require('../assets/images/go_to_myshipments.png')
                : require('../assets/images/back_to_home.png')
            }
          />
          {/* <Text
            style={{
              alignSelf: 'center',
              fontSize: 14 / PixelRatio.getFontScale(),
              color: '#FFAD00',
              fontFamily: 'Asap-Italic',
              fontWeight: '700',
            }}>
            {props.backText}
          </Text> */}
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default AnimationModel;
