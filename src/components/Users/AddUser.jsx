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
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function AddUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!userDetails.name) newErrors.name = "User name is required.";
    if (!userDetails.email || !emailPattern.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!userDetails.phone || !phonePattern.test(userDetails.phone)) {
      newErrors.phone = "Please enter a valid phone number with 10 digits.";
    }
    if (!userDetails.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await dispatch(addUser(userDetails));
      toast({
        title: "User added.",
        description: "User has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        status: "Active",
        password: "",
      });
    } catch (error) {
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
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>User Name</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaUserAlt} color="gray.400" />}
                />
                <Input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                />
              </InputGroup>
              {errors.name && (
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaEnvelope} color="gray.400" />}
                />
                <Input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </InputGroup>
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.phone}>
              <FormLabel>Phone Number</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaPhone} color="gray.400" />}
                />
                <Input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </InputGroup>
              {errors.phone && (
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              )}
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
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaLock} color="gray.400" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userDetails.password}
                  onChange={handleChange}
                  placeholder="Enter password"
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
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
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
          loadingText="Adding User"
        >
          Add User
        </Button>
      </form>
    </Box>
  );
}
