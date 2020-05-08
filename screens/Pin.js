import React, { Component } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";

export class Pin extends Component {
  state = {
    animation: new Animated.Value(0),
  };

  componentDidMount() {
    /**Animation of the marker scaling can be appllied to any of three*/
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 1000,
        }),
        Animated.timing(this.state.animation, {
          toValue: 0,
          duration: 1000,
        }),
      ]),
      {
        useNativeDriver: true,
      }
    ).start();
  }

  render() {
    const { animation } = this.state;
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.5],
    });

    return (
      <View style={styles.outerPin}>
        <View style={styles.pin}>
          <Animated.View
            style={[styles.innerPin, { transform: [{ scale }] }]}
          />
        </View>
      </View>
    );
  }
}

export default Pin;

const styles = StyleSheet.create({
  outerPin: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,127,255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  pin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  innerPin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
