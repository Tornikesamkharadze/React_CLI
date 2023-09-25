/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useCallback} from 'react';
import {useRef} from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GooglePlacesInput = props => {
  var textInput = useRef();

  return (
    <View
      style={{
        width: '100%',
        maxHeight: 200,
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
      <Modal
        visible={props.isVisible}
        transparent={true}
        statusBarTranslucent
        animationType={'fade'}>
        <SafeAreaView style={{backgroundColor: 'white'}} />
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            paddingTop: Platform.OS == 'android' ? 40 : 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
              borderBottomColor: '#626262',
              borderBottomWidth: 0.2,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                flex: 1,
                color: '#202020',
                paddingHorizontal: 15,
                fontFamily: 'Asap-Medium',
                fontWeight: '600',
                fontSize: 20,
              }}>
              Search And Select Address
            </Text>
            <TouchableOpacity
              style={{
                padding: 8,
              }}
              onPress={() => {
                props.hideModal();
              }}>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  alignSelf: 'flex-end',
                  marginHorizontal: 12,
                }}
                source={require('../assets/images/icon_close.png')}
              />
            </TouchableOpacity>
          </View>
          <TextInput autoFocus={true} />
          <GooglePlacesAutocomplete
            placeholder={'Search Address'}
            GooglePlacesDetailsQuery={{fields: 'geometry'}}
            fetchDetails
            textInputProps={{
              ref: textInput,
              //autoFocus: true,
              placeholderTextColor: '#626262',
              numberOfLines: 1,
              keyboardType: 'default',
              cursorColor: '#FFAD00',
              selectionColor: '#FFAD00',
            }}
            styles={{
              textInputContainer: {
                height: 50,
                paddingHorizontal: 10,
              },
              textInput: {
                height: 50,
                color: '#202020',
                paddingHorizontal: 15,
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
                backgroundColor: '#F4F4F4',
              },
              description: {
                color: '#202020',
                fontFamily: 'Asap-Medium',
                fontWeight: '400',
                fontSize: 15,
              },
            }}
            onPress={(data, details = null) => {
              props.getValue(data?.description, details?.geometry?.location);
              props.hideModal();
            }}
            query={{
              key: 'AIzaSyDTUWYvl9raBvAPprlYvqHUhwpMC9gLiNM',
              language: 'en',
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default GooglePlacesInput;
