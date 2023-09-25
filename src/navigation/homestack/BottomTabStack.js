/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../../screens/appscreens/bottomtabscreens/HomeScreen';
import VaultScreen from '../../screens/appscreens/bottomtabscreens/VaultScreen';
import Card from '../../screens/appscreens/bottomtabscreens/Card';
import Transactions from '../../screens/appscreens/bottomtabscreens/Transactions';
import GoldScreen from '../../screens/appscreens/bottomtabscreens/GoldScreen';
import MyProfile from '../../screens/appscreens/otherscreens/MyProfile';
import {
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import SavedCards from '../../screens/appscreens/otherscreens/SavedCards';
import CheckPin from '../../screens/appscreens/otherscreens/CheckPin';
import SendCommoditiesScreen from '../../screens/appscreens/otherscreens/SendCommoditiesScreen';
import AddCommoditiesScreen from '../../screens/appscreens/otherscreens/AddCommoditiesScreen';
import RequestCommoditiesScreen from '../../screens/appscreens/otherscreens/RequestCommoditiesScreen';
import Request from '../../screens/appscreens/otherscreens/RequestList';
import TermsAndConditions from '../../screens/appscreens/otherscreens/TermsAndConditions';
import InviteFriend from '../../screens/appscreens/otherscreens/InviteFriend';
import VerifyPin from '../../screens/appscreens/otherscreens/VerifyPin';
import ChangePin from '../../screens/appscreens/otherscreens/ChangePin';
import ChangePass from '../../screens/appscreens/otherscreens/ChangePass';
import Tutorial from '../../screens/appscreens/otherscreens/Tutorial';
import Address from '../../screens/appscreens/otherscreens/Address';
import WithdrawCash from '../../screens/appscreens/otherscreens/WithdrawCash';
import AddCommoditiComponent from '../../screens/appscreens/otherscreens/AddCommoditiComponent';
import WithdrawCommoditiComponent from '../../screens/appscreens/otherscreens/WithdrawCommoditiComponent';
import AddAndWithdrawCommodity from '../../screens/appscreens/otherscreens/AddAndWithdrawCommodity';
import Notification from '../../screens/appscreens/otherscreens/Notification';
import Conversions from '../../screens/appscreens/otherscreens/Conversions';
import Scan from '../../screens/appscreens/otherscreens/Scan';
import QRScannerScreen from '../../screens/appscreens/otherscreens/QRScannerScreen';

import QRScannerComponent from '../../screens/appscreens/otherscreens/QRScannerComponent';
import BankDetails from '../../screens/appscreens/otherscreens/BankDetails';
import AddBankAccount from '../../screens/appscreens/otherscreens/AddBankAccount';
import WithdrawCommodity from '../../screens/appscreens/otherscreens/WithdrawCommodity';
import Shipment from '../../screens/appscreens/otherscreens/Shipment';
import ShippingPayment from '../../screens/appscreens/otherscreens/ShippingPayment';
import MyShipment from '../../screens/appscreens/otherscreens/MyShipment';
import ShipmentCheckPin from '../../screens/appscreens/otherscreens/ShipmentCheckPin';
import ShipmentToME from '../../screens/appscreens/otherscreens/ShipmentToMe';
import ShippingDetails from '../../screens/appscreens/otherscreens/ShippingDetails';

const BottomTabStack = () => {
  const Tab = createBottomTabNavigator();

  function TabBar({state, descriptors, navigation}) {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            marginHorizontal: 20,
            borderRadius: 16,
            paddingHorizontal: 4,
            paddingVertical: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            marginBottom: Platform.OS === 'ios' ? 25 : 20,
            marginTop: 2,
          }}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({name: route.name, merge: true});
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    //'#FFF7E6',
                    backgroundColor: isFocused ? '#FFF7E6' : null,
                    paddingHorizontal: 13,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    style={
                      Platform.OS == 'ios'
                        ? {
                            height:
                              label === 'VaultScreen' || label === 'Card'
                                ? 25
                                : label === 'Transactions'
                                ? 23
                                : label === 'HomeScreen'
                                ? 29
                                : 30,
                            width:
                              label === 'HomeScreen'
                                ? 26
                                : label === 'VaultScreen'
                                ? 27
                                : label === 'Transactions' || label === 'Card'
                                ? 25
                                : 30,
                            resizeMode: 'contain',
                          }
                        : {
                            height:
                              label === 'VaultScreen' || label === 'Card'
                                ? 27
                                : label === 'Transactions'
                                ? 25
                                : label === 'HomeScreen'
                                ? 29
                                : 30,
                            width:
                              label === 'HomeScreen'
                                ? 26
                                : label === 'VaultScreen'
                                ? 27
                                : label === 'Transactions' || label === 'Card'
                                ? 25
                                : 30,
                            resizeMode: 'center',
                          }
                    }
                    source={
                      label === 'HomeScreen'
                        ? isFocused
                          ? require('../../assets/images/icon_home.png')
                          : require('../../assets/images/icon_home.png')
                        : label === 'Transactions'
                        ? isFocused
                          ? require('../../assets/images/icon_transactions_list.png')
                          : require('../../assets/images/icon_transactions_list.png')
                        : label === 'GoldScreen'
                        ? isFocused
                          ? require('../../assets/images/icon_active_gold.png')
                          : require('../../assets/images/icon_inactive_Gold.png')
                        : label === 'VaultScreen'
                        ? isFocused
                          ? require('../../assets/images/close_locker_tab.png')
                          : require('../../assets/images/close_locker_tab.png')
                        : isFocused
                        ? require('../../assets/images/icon_credit_card.png')
                        : require('../../assets/images/icon_credit_card.png')
                    }
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        screenOptions={{headerShown: false}}
      />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="GoldScreen" component={GoldScreen} />
      <Tab.Screen
        name="VaultScreen"
        component={VaultScreen}
        screenOptions={{headerShown: false}}
      />
      <Tab.Screen name="Card" component={Card} />
    </Tab.Navigator>
  );
};
const HomeStackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerBackVisible: false,
      }}>
      <Stack.Screen
        name="BottomTabStack"
        component={BottomTabStack}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="InviteFriend"
        component={InviteFriend}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="VerifyPin"
        component={VerifyPin}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ChangePin"
        component={ChangePin}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePass}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="Tutorial"
        component={Tutorial}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen name="SavedCards" component={SavedCards} />
      <Stack.Screen name="WithdrawCash" component={WithdrawCash} />
      <Stack.Screen name="CheckPin" component={CheckPin} />
      <Stack.Screen
        name="SendCommoditiesScreen"
        component={SendCommoditiesScreen}
      />
      <Stack.Screen
        name="AddCommoditiesScreen"
        component={AddCommoditiesScreen}
      />
      <Stack.Screen
        name="RequestCommoditiesScreen"
        component={RequestCommoditiesScreen}
      />
      <Stack.Screen name="Request" component={Request} />
      <Stack.Screen
        name="AddressFromProfile"
        component={Address}
        options={{headerShown: true, headerBackVisible: false}}
      />
      <Stack.Screen
        name="AddAndWithdrawCommodity"
        component={AddAndWithdrawCommodity}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="AddCommoditiComponent"
        component={AddCommoditiComponent}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="WithdrawCommoditiComponent"
        component={WithdrawCommoditiComponent}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="Notification"
        component={Notification}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="Conversions"
        component={Conversions}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="Scan"
        component={Scan}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="QRScannerScreen"
        component={QRScannerScreen}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen name="QRScannerComponent" component={QRScannerComponent} />
      <Stack.Screen
        name="BankDetails"
        component={BankDetails}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="AddBankAccount"
        component={AddBankAccount}
        options={{headerShown: false}}
        // component={ScreenComponent}
        // screenOptions={{
        //   // animation: 'slide_from_right',
        //   // headerBackVisible: true,
        //   // headerBlurEffect: 'systemChromeMaterialLight',
        //   //  headerShadowVisible: false,
        //   headerShown: false,
        // }}
      />
      <Stack.Screen
        name="WithdrawCommodity"
        component={WithdrawCommodity}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="Shipment"
        component={Shipment}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="MyShipment"
        component={MyShipment}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ShippingPayment"
        component={ShippingPayment}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ShipmentCheckPin"
        component={ShipmentCheckPin}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ShipmentToME"
        component={ShipmentToME}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="ShippingDetails"
        component={ShippingDetails}
        screenOptions={{
          animation: 'slide_from_right',
          headerBackVisible: true,
          headerBlurEffect: 'systemChromeMaterialLight',
          headerShadowVisible: true,
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeStackNavigator;
