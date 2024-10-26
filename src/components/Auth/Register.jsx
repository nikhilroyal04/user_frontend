import React, { useState } from "react";
import {
  useToast,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Grid,
  GridItem,
  Text,
  Link,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormErrorMessage,
  Icon,
} from "@chakra-ui/react";
import { FaUserAlt, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(formData.email)) {
      formErrors.email = "Invalid email format";
    }
    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
      formErrors.phone = "Phone number must be exactly 10 digits";
    }
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsLoading(true);
    dispatch(addUser(formData))
      .then(() => {
        setIsLoading(false);
        toast({
          title: "Account created.",
          description: "Your account has been created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "Error.",
          description: "An error occurred during registration.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box
      p={8}
      maxW="600px"
      mx="auto"
      mt="100px"
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Heading mb={6} textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <GridItem>
            <FormControl mb={4} isInvalid={errors.name} isRequired>
              <FormLabel>name:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaUserAlt} color="gray.400" />}
                />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isInvalid={errors.email} isRequired>
              <FormLabel>Email:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaEnvelope} color="gray.400" />}
                />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isInvalid={errors.phone} isRequired>
              <FormLabel>Phone:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaPhone} color="gray.400" />}
                />
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors.phone && (
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl mb={4} isRequired>
              <FormLabel>Password:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaLock} color="gray.400" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          isLoading={isLoading}
        >
          Register
        </Button>
      </form>

      <Text textAlign="center" mt={4}>
        Already have an account?{" "}
        <Link color="teal.500" onClick={() => navigate("/login")}>
          Login
        </Link>
      </Text>
    </Box>
  );
}
