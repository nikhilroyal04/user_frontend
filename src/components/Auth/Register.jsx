import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Select,
  Grid,
  GridItem,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { FaUserAlt, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signUp, verifyOtp, selectError } from "../../features/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First name is required";
    if (!formData.lastName) formErrors.lastName = "Last name is required";
    if (!formData.gender) formErrors.gender = "Gender is required";
    if (!formData.email.includes("@")) formErrors.email = "Email is invalid";
    if (formData.phone.length !== 10) formErrors.phone = "Phone is invalid";
    if (formData.password.length < 6)
      formErrors.password = "Password too short";
    return formErrors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await dispatch(signUp(formData));
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setStep(1);
      } else {
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setIsLoading(true);
    try {
      const otp_key = localStorage.getItem("otp_key");
      const response = await dispatch(verifyOtp(otp, otp_key, formData.email));
      if (response.success) {
        toast({
          title: "Verified",
          description: "OTP verified successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setStep(2);
      } else {
      }
    } finally {
      setIsLoading(false);
    }
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
        {step === 0
          ? "Register"
          : step === 1
          ? "Verify Email"
          : "Registration Complete"}
      </Heading>

      {step === 0 && (
        <form onSubmit={handleRegisterSubmit}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {/* First Name */}
            <GridItem>
              <FormControl isRequired isInvalid={errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaUserAlt} />} />
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Last Name */}
            <GridItem>
              <FormControl isRequired isInvalid={errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaUserAlt} />} />
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Gender */}
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormControl>
            </GridItem>

            {/* Phone Number */}
            <GridItem>
              <FormControl isRequired isInvalid={errors.phone}>
                <FormLabel>Phone Number</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaPhone} />} />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Email */}
            <GridItem>
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaEnvelope} />} />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Password */}
            <GridItem>
              <FormControl isRequired isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={FaLock} />} />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          {/* Error Message */}
          {error && (
            <Text color="red.500" mt={4}>
              {error}
            </Text>
          )}

          {/* Register Button */}
          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isLoading}
            type="submit"
            width="full"
          >
            Register
          </Button>

          <Text mt={4} textAlign="center">
            Already have an account?{" "}
            <Text
              as={RouterLink}
              to="/login"
              color="blue.500"
              fontWeight="bold"
            >
              Login
            </Text>
          </Text>
        </form>
      )}

      {step === 1 && (
        <Box mt={6}>
          <FormControl isRequired>
            <FormLabel>OTP</FormLabel>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </FormControl>

          {error && (
            <Text color="red.500" mt={4}>
              {error}
            </Text>
          )}

          <Button
            mt={4}
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleOtpVerify}
            width="full"
          >
            Verify OTP
          </Button>
        </Box>
      )}

      {step === 2 && (
        <Box mt={6} textAlign="center">
          <Text fontSize="lg" color="green.500">
            Registration Complete! 🎉
          </Text>
          <Button mt={4} colorScheme="blue" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Box>
      )}
    </Box>
  );
}
