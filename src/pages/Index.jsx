import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Stack, Flex, Spinner, useToast } from "@chakra-ui/react";
import { FaLeaf, FaCloudSun, FaSeedling, FaExclamationTriangle } from "react-icons/fa";

const API_BASE_URL = "https://backengine-dlfl.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cropInfo, setCropInfo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchCropInfo();
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        fetchCropInfo();
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 204) {
        toast({
          title: "Signup Successful",
          description: "You can now log in with your credentials.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
    setIsLoading(false);
  };

  const fetchCropInfo = async () => {
    setIsLoading(true);
    try {
      // Here you would make an API call to fetch crop information
      // For demonstration purposes, we'll use dummy data
      const dummyData = {
        cropToPlant: "Wheat",
        plantingTime: "October to November",
        weatherForecast: "Sunny with occasional showers",
        fertilizers: ["Nitrogen", "Phosphorus", "Potassium"],
        bestYieldTime: "March to April",
        worstYieldTime: "June to July",
        precautions: ["Irrigate regularly", "Monitor for pests and diseases"],
      };
      setCropInfo(dummyData);
    } catch (error) {
      console.error("Error fetching crop info:", error);
    }
    setIsLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <Flex direction="column" align="center" justify="center" minHeight="100vh">
        <Heading mb={8}>Kheti App</Heading>
        <Stack spacing={4} width="300px">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin} isLoading={isLoading}>
            Login
          </Button>
          <Button onClick={handleSignup} isLoading={isLoading} variant="outline">
            Signup
          </Button>
        </Stack>
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Welcome to Kheti App</Heading>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : (
        <>
          {cropInfo ? (
            <Stack spacing={4}>
              <Flex align="center">
                <FaLeaf />
                <Text ml={2}>Crop to Plant: {cropInfo.cropToPlant}</Text>
              </Flex>
              <Flex align="center">
                <FaSeedling />
                <Text ml={2}>Planting Time: {cropInfo.plantingTime}</Text>
              </Flex>
              <Flex align="center">
                <FaCloudSun />
                <Text ml={2}>Weather Forecast: {cropInfo.weatherForecast}</Text>
              </Flex>
              <Text>Recommended Fertilizers: {cropInfo.fertilizers.join(", ")}</Text>
              <Text>Best Yield Time: {cropInfo.bestYieldTime}</Text>
              <Text>Worst Yield Time: {cropInfo.worstYieldTime}</Text>
              <Flex align="center">
                <FaExclamationTriangle />
                <Text ml={2}>Precautions:</Text>
              </Flex>
              <ul>
                {cropInfo.precautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </Stack>
          ) : (
            <Text>No crop information available.</Text>
          )}
        </>
      )}
    </Box>
  );
};

export default Index;
