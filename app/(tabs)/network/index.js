import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

import axios from "axios";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";
import { ConnectionRequest, UserProfile } from "../../../conponents";
import { ActivityIndicator } from "react-native";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [posts, setPosts] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const Id = await AsyncStorage.getItem("authId");
      setUserId(Id);
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUsers();
      fetchFriendRequests();
    }
  }, [userId]);
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/api/profile/${userId}`
      );
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/api/users/${userId}`
      );
      const userData = response.data;
      setUsers(userData);
    } catch (error) {
      console.log("error fetching users", error);
    }
  };

  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);
  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };
  const [isLiked, setIsLiked] = useState(false);
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://10.0.2.2:8000/like/${postId}/${userId}`
      );
      if (response.status === 200) {
        const updatedPost = response.data.post;
        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("Error liking/unliking the post", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/api/connection-request/${userId}`
      );
      if (response.status === 200) {
        const connectionRequestData = response?.data.map((friendReq) => ({
          _id: friendReq._id,
          name: friendReq.name,
          email: friendReq.email,
          profileImage: friendReq.profileImage,
        }));
        setConnectionRequests(connectionRequestData);
      }
      // setUsers(userData);
    } catch (error) {
      console.log("error fetching users", error);
    }
  };

  const router = useRouter();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable
        onPress={() => router.push("/network/connections")}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Manage My Network
        </Text>
        <AntDesign name="arrowright" size={24} color={"black"} />
      </Pressable>
      <View
        style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }}
      />
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Invitations (0)</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>

      <View
        style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }}
      />
      <View>
        {connectionRequests?.map((item, index) => (
          <ConnectionRequest
            item={item}
            key={index}
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            userId={userId}
          />
        ))}
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>

        <Text>
          Find and contact the right people. Plus see who's viewed your profile
        </Text>
        <View
          style={{
            backgroundColor: "#FFC72C",
            width: 140,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 25,
            marginTop: 8,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Try Premium
          </Text>
        </View>
      </View>
      {!users ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={users}
          columnWrapperStyle={{ justifyContent: "space-evenly" }}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UserProfile item={item} userId={userId} />}
        />
      )}
    </ScrollView>
  );
};

export default index;
