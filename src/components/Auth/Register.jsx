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
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/userSlice"; // Your slice
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    city: "",
    password: "",
    status: "Active", // Default value
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    // Email validation
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(formData.email)) {
      formErrors.email = "Invalid email format";
    }

    // Phone number validation (exactly 10 digits)
    if (formData.phoneNumber.length !== 10 || isNaN(formData.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({});

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Simulate a loading state
    setIsLoading(true);

    // Dispatch the form data to Redux
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
        navigate("/login"); // Redirect to login page after success
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
            <FormControl mb={4} isInvalid={errors.userName} isRequired>
              <FormLabel>Username:</FormLabel>
              <Input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isInvalid={errors.email} isRequired>
              <FormLabel>Email:</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isInvalid={errors.phoneNumber} isRequired>
              <FormLabel>Phone:</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {errors.phoneNumber && (
                <p style={{ color: "red" }}>{errors.phoneNumber}</p>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isRequired>
              <FormLabel>City:</FormLabel>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl mb={4} isRequired>
              <FormLabel>Password:</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          isLoading={isLoading} // Loading state for button
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
