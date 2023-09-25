import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../../screens/authenticationscreens/SignIn';
import SignUp from '../../screens/authenticationscreens/SignUp';
import ForgotPass from '../../screens/authenticationscreens/ForgotPass';
import VerifyOtp from '../../screens/authenticationscreens/VerifyOtp';
import Registration from '../../screens/authenticationscreens/Registration';
import CreatePass from '../../screens/authenticationscreens/CreatePass';
import CreatePin from '../../screens/authenticationscreens/CreatePin';
import Address from '../../screens/appscreens/otherscreens/Address';
import AddBank from '../../screens/authenticationscreens/AddBank';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="CreatePass" component={CreatePass} />
      <Stack.Screen name="CreatePin" component={CreatePin} />
      <Stack.Screen name="AddBank" component={AddBank} />
      <Stack.Screen
        name="Address"
        component={Address}
        options={{headerShown: true, headerBackVisible: false}}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
