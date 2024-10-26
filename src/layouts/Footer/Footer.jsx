import React from "react";
import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("gray.800", "gray.200")}
      py={4}
      position="relative"
      bottom={0}
      width="100%"
    >
      <Container maxW="container.md" textAlign="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} User Management. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
