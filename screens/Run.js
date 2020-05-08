import * as _ from "lodash";
import * as turf from "@turf/turf";
import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import Monitor from "./Monitor";
import Pin from "./Pin";
const { Polyline, Marker } = MapView;

export class Run extends Component {
  map = React.createRef();

  state = {
    positions: [],
    distance: 0,
    pace: 0,
  };

  async componentDidMount() {
    const options = {
      enableHighAccuracy: true,
      timeInterval: 1000,
      distanceInterval: 1,
    };

    this.listener = await Location.watchPositionAsync(
      options,
      this.onPositionChange
    );
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  distanceBetween = (lastposition, position) => {
    const from = turf.point([
      lastposition.coords.longitude,
      lastposition.coords.latitude,
    ]);
    const to = turf.point([
      position.coords.longitude,
      position.coords.latitude,
    ]);
    const options = { units: "meters" };
    return _.round(turf.distance(from, to, options));
  };

  computePace = (delta, previousPosition, position) => {
    const time = position.timestamp - previousPosition.timestamp;
    const pace = time / delta;
    return pace;
  };

  onPositionChange = (position) => {
    this.map.current.animateCamera(position.coords, 1000);
    const { latitude, longitude } = this.props;
    const lastPosition =
      this.state.positions.length === 0
        ? { coords: { latitude, longitude }, timestamp: position.timestamp }
        : this.state.positions[this.state.positions.length - 1];
    const delta = this.distanceBetween(lastPosition, position);
    const distance = this.state.distance + delta;
    const pace =
      delta > 0 ? this.computePace(delta, lastPosition, position) : 0;
    this.setState({
      positions: [...this.state.positions, position],
      distance,
      pace,
    });
  };

  render() {
    const { positions, distance, pace } = this.state;
    const { latitude, longitude, tdistance } = this.props;
    const currentPosition =
      positions.length === 0
        ? { coords: { latitude, longitude } }
        : positions[positions.length - 1];

    return (
      <View style={styles.container}>
        <Monitor {...{ distance, pace, tdistance }} />
        <MapView
          ref={this.map}
          provider="google"
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.01,
          }}
          style={styles.map}
        >
          <Marker
            coordinate={currentPosition.coords}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Pin />
          </Marker>
          <Polyline
            coordinates={positions.map((position) => position.coords)}
            strokeWidth={10}
            strokeColor="#007fff"
          />
        </MapView>
      </View>
    );
  }
}

export default Run;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 1,
  },
  map: {
    flex: 1,
  },
});
