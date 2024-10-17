import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import {
  Box,
  Center,
  Container,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logoutAndRedirect = async () => {
      dispatch(logoutUser());
      // Clear all session storage
      sessionStorage.clear();

      // Redirect to home page after a delay
      setTimeout(() => {
        navigate("/login"); // Redirect to home
      }, 2000); // Redirect after 2 seconds
    };

    logoutAndRedirect();
  }, [dispatch, navigate]);

  return (
    <Center minH="100vh">
      <Container maxW="container.md" centerContent>
        <Box
          textAlign="center"
          py={10}
          px={6}
          bg={useColorModeValue("gray.50", "gray.800")}
          borderRadius="md"
          shadow="md"
        >
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            color={useColorModeValue("gray.800", "gray.50")}
          >
            Successfully Logged Out
          </Heading>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
            You have been logged out. Redirecting to home page...
          </Text>
        </Box>
      </Container>
    </Center>
  );
}
