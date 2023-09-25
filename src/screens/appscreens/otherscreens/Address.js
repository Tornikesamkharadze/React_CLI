/* eslint-disable react-native/no-inline-styles */
import React from "react";

import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Address = ({ route }) => {
  const navigation = useNavigation();
  //navigation header desing
  navigation.setOptions({
    headerShadowVisible: false, // remove shadow on Android
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "white",
      height: Platform.OS === "android" ? 80 : 120,
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
    headerLeft: () => (
      <View>
        <Text
          style={{
            color: "black",
            fontSize: 18,
            fontWeight: "600",
            // lineHeight: 20,
            fontFamily: "Asap-Medium",
          }}
        >
          Search And Select Address
        </Text>
      </View>
    ),
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 15,
              width: 15,
              resizeMode: "cover",
            }}
            source={require("../../../assets/images/icon_close.png")}
          />
        </TouchableOpacity>
      </View>
    ),
    headerTitle: () => <View />,
  });

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        backgroundColor: "#F4F4F4",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 1,
        flexDirection: "row",
      }}
    >
      <SafeAreaView style={{ backgroundColor: "white" }} />
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <GooglePlacesAutocomplete
          placeholder={"Search Address"}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          fetchDetails
          textInputProps={{
            autoFocus: true,
            placeholderTextColor: "#626262",
            numberOfLines: 1,
            keyboardType: "default",
            cursorColor: "#FFAD00",
            selectionColor: "#FFAD00",
          }}
          styles={{
            textInputContainer: {
              height: 50,
              paddingHorizontal: 10,
            },
            textInput: {
              height: 50,
              color: "#202020",
              paddingHorizontal: 15,
              fontFamily: "Asap-Medium",
              fontWeight: "400",
              fontSize: 15,
              backgroundColor: "#F4F4F4",
            },
            description: {
              color: "#202020",
              fontFamily: "Asap-Medium",
              fontWeight: "400",
              fontSize: 15,
            },
          }}
          onPress={(data, details = null) => {
            AsyncStorage.setItem("isFromAdd", route.params.add);
            AsyncStorage.setItem("toggle", route.params.toggleCheckBox);
            if (route.params.add == "true") {
              AsyncStorage.setItem(
                "address",
                JSON.stringify({
                  discription: data?.description,
                  location: details?.geometry?.location,
                })
              );
              if (route.params.toggleCheckBox == "true") {
                AsyncStorage.setItem(
                  "shipAddress",
                  JSON.stringify({
                    discription: data?.description,
                    location: details?.geometry?.location,
                  })
                );
              }
            } else {
              AsyncStorage.setItem(
                "shipAddress",
                JSON.stringify({
                  discription: data?.description,
                  location: details?.geometry?.location,
                })
              );
            }
            navigation.goBack();
            // navigation.goBack(null, {
            //   discription: data?.description,
            //   location: details?.geometry?.location,
            // });
            // navigation.goBack({
            //   data: 'This is some data from the previous screen.',
            // });
            // routes.params.getValue();
            // routes.params.getValue(
            //   data?.description,
            //   details?.geometry?.location,
            // );
            // routes.params.hideModal();
          }}
          query={{
            key: "AIzaSyDTUWYvl9raBvAPprlYvqHUhwpMC9gLiNM",
            language: "en",
          }}
        />
      </View>
    </View>
  );
};

export default Address;
