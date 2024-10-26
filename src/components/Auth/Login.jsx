import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Flex,
  Text,
  Link,
} from "@chakra-ui/react";
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectIsLoading,
  selectError,
} from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Both fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(loginUser({ email, password }));
      const user = localStorage.getItem("user"); 
      if (user) {
        navigate("/"); 
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="gray.100">
      <Box
        maxWidth="400px"
        width="95%"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={6}>
          Login
        </Heading>

        <form onSubmit={handleLogin}>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<HiUser color="gray.300" />}
              />
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px blue.400",
                }}
              />
            </InputGroup>
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<HiLockClosed color="gray.300" />}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px blue.400",
                }}
              />
              <InputRightElement>
                <IconButton
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={
                    showPassword ? (
                      <HiEyeOff color="gray.500" />
                    ) : (
                      <HiEye color="gray.500" />
                    )
                  }
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  size="md"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Link
            color="blue.500"
            onClick={() => navigate("/forgot-password")}
            fontSize="sm"
            mb={4}
            display="block"
          >
            Forgot Password?
          </Link>

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Button
            colorScheme="blue"
            width="full"
            type="submit"
            isLoading={loading}
            loadingText="Logging in"
            mb={4}
          >
            Login
          </Button>

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/register")}>
              Sign Up
            </Link>
          </Text>
        </form>
      </Box>
    </Flex>
  );
}
