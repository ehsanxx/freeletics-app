import React, { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import Run from "./screens/Run";

export class App extends Component {
  state = {
    ready: false,
    latitude: 232,
    longitude: 34,
  };

  async componentDidMount() {
    /**Permission for Location */

    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

      this.setState({ ready: true, latitude, longitude });
    } else {
      alert("couldnt get access to location");
    }
  }

  render() {
    const { ready, latitude, longitude } = this.state;
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        {ready && <Run tdistance={1000} {...{ latitude, longitude }} />}
        {!ready && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </React.Fragment>
    );
  }
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
