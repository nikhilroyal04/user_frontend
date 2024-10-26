import React from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
    // Logic for handling logout goes here
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} p={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="lg" color={useColorModeValue("gray.800", "gray.200")}>
          User Management
        </Heading>
        <Button colorScheme="teal" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
}
