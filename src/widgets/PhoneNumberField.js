/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Image} from 'react-native';
import CountryPicker, {FlagButton} from 'react-native-country-picker-modal';

const PhoneNumberField = React.forwardRef((props, ref) => {
  const [isCCModalVisible, setIsCCModalVisible] = useState(false);
  const [country, setcountry] = useState({
    callingCode: ['1'],
    cca2: 'US',
    currency: ['USD'],
    flag: 'flag-us',
    name: 'United States',
    region: 'Americas',
    subregion: 'North America',
  });

  return (
    <View
      style={{
        width: '100%',
        height: 50,
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 1,
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          setIsCCModalVisible(true);
        }}
        style={{
          height: '100%',
          paddingLeft: 15,
          marginRight: 15,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <View
          pointerEvents="none"
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <FlagButton withEmoji={true} countryCode={country.cca2} />
          <CountryPicker
            withFilter
            withAlphaFilter
            visible={isCCModalVisible}
            renderFlagButton={e => {
              return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {country.callingCode[0] ? (
                    <Text
                      style={{
                        color: '#202020',
                        fontFamily: 'Asap-Medium',
                        fontWeight: '700',
                        fontSize: 15,
                      }}>
                      +{country.callingCode[0]}
                    </Text>
                  ) : null}
                  <Image
                    style={{height: 13, width: 13, marginLeft: 8}}
                    source={require('../assets/images/icon_drop_down.png')}
                  />
                </View>
              );
            }}
            onSelect={e => {
              props.getCountryCode('+' + e.callingCode[0]);
              setcountry(e);
            }}
            onClose={() => {
              setIsCCModalVisible(false);
            }}
          />
        </View>

        <View
          style={{
            height: 15,
            width: 1,
            backgroundColor: '#626262',
            borderRadius: 20,
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <TextInput
          ref={ref}
          numberOfLines={1}
          keyboardType="phone-pad"
          returnKeyType="done"
          maxLength={20}
          cursorColor="#FFAD00"
          selectionColor={'#FFAD00'}
          style={{
            flex: 1,
            paddingRight: 15,
            color: '#202020',
            fontFamily: 'Asap-Medium',
            fontWeight: '400',
            fontSize: 15,
          }}
          placeholder="Enter your number"
          placeholderTextColor="#626262"
          onChangeText={val => {
            props.getNumber(val);
          }}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
        />
      </View>
    </View>
  );
});

export default PhoneNumberField;
