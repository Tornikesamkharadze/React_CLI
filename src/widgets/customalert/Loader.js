import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {Modal, View} from 'react-native';
var Spinner = require('react-native-spinkit');
const Loader = props => {
  const [loader, setLoader] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setLoader(props.isVisible);
      console.log(props.isVisible);
    }, [props.isVisible]),
  );

  if (props.isVisible) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          opacity: 0.9,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            borderRadius: 20,
            padding: 40,
            justifyContent: 'center',
          }}>
          <Spinner
            isVisible={props.isVisible}
            size={80}
            type={'ChasingDots'}
            color={'#ffc700'}
          />
        </View>
      </View>
    );
  } else {
    null;
  }
};

export default Loader;
