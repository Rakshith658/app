import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { fakeServer } from "./fakeserver";

const renderItem = ({ item }) => {
  return (
    <Text
      style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        padding: 10,
        borderBottomColor: "red",
        borderBottomWidth: 2,
      }}
    >
      {item}
    </Text>
  );
};

const ListFooterComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Loading...</Text>
    </View>
  );
};
let StopfetchMore = true;

export default function App() {
  const [data, setdata] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const fetchdata = async () => {
    try {
      const info = await fakeServer(20);
      setdata([...info]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  const onhandleEndReached = async () => {
    setIsloading(true);
    if (!StopfetchMore) {
      try {
        const response = await fakeServer(20);
        if (response === "done") return setIsloading(false);
        setdata([...data, ...response]);
        StopfetchMore = true;
      } catch (error) {
        console.log(error);
      }
    }
    setIsloading(false);
  };
  return (
    <FlatList
      style={{ marginTop: 30 }}
      data={data}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      onScrollBeginDrag={() => {
        StopfetchMore = false;
      }}
      onEndReached={onhandleEndReached}
      onEndReachedThreshold={0.01}
      ListFooterComponent={() => isloading && <ListFooterComponent />}
    />
  );
}
