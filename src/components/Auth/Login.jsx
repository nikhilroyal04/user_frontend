import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useToast,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  selectAuthError,
  selectAuthLoading,
  clearError,
} from "../../features/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await dispatch(loginUser({ email, password }));
      // Check if the login was successful and then navigate to /user
      if (!error) {
        toast({
          title: "Login Successful.",
          description: "You have logged in successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/user");
      }
    } catch (err) {
      if (error) {
        toast({
          title: "Login Failed.",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Center minH="100vh">
      <Box
        p={8}
        maxW="400px"
        w="full"
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading mb={6} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            width="full"
            mb={4}
          >
            Login
          </Button>
        </form>

        <Text textAlign="center" mt={4}>
          Don't have an account?{" "}
          <Link color="teal.500" onClick={() => navigate("/register")}>
            Register
          </Link>
        </Text>
      </Box>
    </Center>
  );
}
