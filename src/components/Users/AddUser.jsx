import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/userSlice"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [userDetails, setUserDetails] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    city: "",
    status: "Active",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // For form validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/; // Phone number should have exactly 10 digits

    if (!userDetails.userName) newErrors.userName = "User name is required.";
    if (!userDetails.email || !emailPattern.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (
      !userDetails.phoneNumber ||
      !phonePattern.test(userDetails.phoneNumber)
    ) {
      newErrors.phoneNumber =
        "Please enter a valid phone number with 10 digits.";
    }
    if (!userDetails.city) newErrors.city = "City is required.";
    if (!userDetails.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before proceeding

    setLoading(true);

    try {
      // Dispatch addUser action with userDetails
      await dispatch(addUser(userDetails));

      // Show success toast
      toast({
        title: "User added.",
        description: "User has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setUserDetails({
        userName: "",
        email: "",
        phoneNumber: "",
        city: "",
        status: "Active",
        password: "",
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error adding user.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      navigate("/user");
    }
  };

  return (
    <Box p={6} width={{ base: "100%", md: "700px" }} mx="auto" mt={10}>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <GridItem>
            <FormControl isRequired isInvalid={!!errors.userName}>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                name="userName"
                value={userDetails.userName}
                onChange={handleChange}
                placeholder="Enter user name"
              />
              {errors.userName && (
                <Text color="red.500">{errors.userName}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              {errors.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phoneNumber"
                value={userDetails.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <Text color="red.500">{errors.phoneNumber}</Text>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.city}>
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="city"
                value={userDetails.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
              {errors.city && <Text color="red.500">{errors.city}</Text>}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={userDetails.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Banned">Banned</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <Text color="red.500">{errors.password}</Text>
              )}
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={loading}
          mt={4}
        >
          Add User
        </Button>
      </form>
    </Box>
  );
}
