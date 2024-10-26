import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { Box, Flex, Text, Heading, Link, Button } from "@chakra-ui/react";

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
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg="gray.100" // Optional: adds a background color for contrast
    >
      <Box
        maxWidth="400px"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
        bg="white"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "xl",
          transform: "translateY(-2px)",
          bg: "gray.50",
        }}
      >
        <Heading as="h2" size="xl" mb={4} color="teal.600">
          Logged out.
        </Heading>
        <Text mb={4} fontSize="md" color="gray.500">
          You will be redirected to the login page shortly.
        </Text>
        <Link href="/login">
          <Button
            colorScheme="blue"
            variant="outline"
            _hover={{ bg: "blue.500", color: "white" }}
            size="lg"
          >
            Go to Login
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
