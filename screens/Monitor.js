import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import moment from "moment";
import Svg, { Path } from "react-native-svg";
import SVGPath from "art/modes/svg/path";
import * as path from "svg-path-properties";

/** these values can be changed for responsiveness */
const radius = 70;
const padding = 7;

const d = SVGPath()
  .moveTo(padding, radius + padding)
  .arcTo(radius * 2, radius + padding, radius)
  .toSVG();
const properties = path.svgPathProperties(d);
const length = properties.getTotalLength();

export class Monitor extends Component {
  state = {
    duration: 0,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ duration: this.state.duration + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  formatDuration = (duration) =>
    moment.utc(moment.duration(duration, "s").asMilliseconds()).format("mm:ss");

  render() {
    const { distance, pace, tdistance } = this.props;
    const { duration } = this.state;
    const ratio = distance / tdistance;
    return (
      <View style={styles.container}>
        <View style={styles.svg}>
          <Svg style={styles.progress}>
            <Path
              stroke="white"
              strokeWidth={padding * 2}
              fill="transparent"
              {...{ d }}
            />
            <Path
              stroke="#007fff"
              strokeWidth={padding * 2}
              fill="transparent"
              strokeDasharray={length}
              strokeDashoffset={length - ratio * length}
              {...{ d }}
            />
          </Svg>
        </View>
        <View style={styles.progressLabel}>
          <Text style={{ fontSize: 40, color: "white" }}> {distance} </Text>
        </View>
        <View></View>
        <View style={styles.rows}>
          <View style={styles.row}>
            <Icon name="watch" size={28} color="white" />
            <Text style={styles.label}>{this.formatDuration(pace)}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="clock" size={28} color="white" />
            <Text style={styles.label}>{this.formatDuration(duration)}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Monitor;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#29252b",
  },
  svg: {
    alignItems: "center",
  },
  progress: {
    width: radius * 2 + padding * 2,
    height: radius * 2 + padding * 2,
  },
  progressLabel: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  rows: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 40,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
