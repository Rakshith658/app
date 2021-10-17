import React, { Component } from "react";
import { Dimensions, Text, View } from "react-native";
import {
  DataProvider,
  RecyclerListView,
  LayoutProvider,
} from "recyclerlistview";
import fakeServer from "./fakeserver";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      fakeData: [],
      loadingMore: false,
    };
  }

  layoutProvider = new LayoutProvider(
    (index) => {
      if (this.state.dataProvider.getDataForIndex(index).type) {
        return this.state.dataProvider.getDataForIndex(index).type;
      } else {
        return "dufault";
      }
    },
    (type, dim) => {
      switch (type) {
        case "half":
          dim.width = Dimensions.get("window").width;
          dim.height = 50;
          break;
        default:
          dim.width = Dimensions.get("window").width / 2;
          dim.height = 50;
      }
    }
  );

  fetchData = async (qty) => {
    this.setState({ ...this.state, loadingMore: true });
    const data = await fakeServer(qty);
    if (data === "done")
      return this.setState({ ...this.state, loadingMore: false });
    this.setState({
      ...this.state,
      dataProvider: this.state.dataProvider.cloneWithRows([
        ...this.state.fakeData,
        ...data,
      ]),
      fakeData: [...this.state.fakeData, ...data],
      loadingMore: false,
    });
  };
  componentDidMount() {
    this.fetchData(20);
  }
  onEndReached = async () => {
    console.log("calling function");
    await this.fetchData(20);
  };
  rowRenderer = (type, data) => {
    switch (type) {
      case "half":
        return (
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 5,
                borderBottomColor: "red",
                borderBottomWidth: 1,
                backgroundColor: "green",
              }}
            >
              {data.item}
            </Text>
          </View>
        );
      case "full":
        return (
          <View style={{ right: 0 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 5,
                borderBottomColor: "red",
                borderBottomWidth: 1,
                backgroundColor: "yellow",
              }}
            >
              {data.item}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  render() {
    if (!this.state.dataProvider._data.length) return null;

    return (
      <RecyclerListView
        dataProvider={this.state.dataProvider}
        layoutProvider={this.layoutProvider}
        rowRenderer={this.rowRenderer}
        onEndReached={this.onEndReached}
        renderFooter={() =>
          this.state.loadingMore && (
            <Text
              style={{ padding: 10, fontWeight: "bold", textAlign: "center" }}
            >
              Loading
            </Text>
          )
        }
      />
    );
  }
}

export default App;
