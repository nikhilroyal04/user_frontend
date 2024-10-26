import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useToast,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Heading,
  Text,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { EmailIcon, LockIcon } from "@chakra-ui/icons";
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
  const [showPassword, setShowPassword] = useState(false);

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
      if (!error) {
        toast({
          title: "Login Successful.",
          description: "You have logged in successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        sessionStorage.setItem("auth", true);
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

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

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
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <EmailIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password:</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LockIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleShowPassword}
                  variant="none"
                />
              </InputRightElement>
            </InputGroup>
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
