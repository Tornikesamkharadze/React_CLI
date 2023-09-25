/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {exp} from 'react-native/Libraries/Animated/Easing';

const GradientText = props => {
  return (
    <View>
      <MaskedView maskElement={<Text {...props} />}>
        <LinearGradient
          colors={['#AE8625', '#F7EA8A', '#D2AC47', '#EDC967']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text
            {...props}
            style={{
              //  fontFamily: 'Asap-Regular',
              fontStyle: 'normal',
              //  fontWeight: '700',
              fontSize: 24,
              opacity: 0,
            }}
          />
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

export default GradientText;
