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
  Flex,
  Text,
  Link,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendForgotPasswordEmail,
  verifyOtp,
  changePassword,
  selectError,
} from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  // Get error from Redux state
  const error = useSelector(selectError);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await dispatch(
        sendForgotPasswordEmail(email)
      );
      if (success) {
        toast({
          title: "Email Sent",
          description: message,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setStep(2); // Move to OTP input step
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast({
        title: "Validation Error",
        description: "OTP is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const otpKey = localStorage.getItem("otp_key"); 
      const { success, message } = await dispatch(
        verifyOtp(otp, otpKey, email)
      );
      if (success) {
        toast({
          title: "OTP Verified",
          description: "You can now set your new password.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setStep(3); // Move to new password step
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast({
        title: "Validation Error",
        description: "New password is required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await dispatch(changePassword(newPassword));
      if (success) {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully changed.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Redirect to login or perform any other action
        setEmail("");
        setOtp("");
        setNewPassword("");
        setStep(1); 
      } else {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      navigate("/login");
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
          Forgot Password
        </Heading>

        {/* Render error alert from Redux state */}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {step === 1 && ( // Step 1: Email Input
          <form onSubmit={handleSendOtp}>
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px blue.400",
                }}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              width="full"
              type="submit"
              isLoading={loading}
              loadingText="Sending..."
              mb={4}
            >
              Send OTP
            </Button>
          </form>
        )}

        {step === 2 && ( // Step 2: OTP Input
          <>
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="otp">Enter OTP</FormLabel>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px blue.400",
                }}
              />
            </FormControl>
            <Button colorScheme="blue" width="full" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
            <Text textAlign="center" mt={2}>
              <Link
                color="blue.500"
                onClick={() =>
                  toast({
                    title: "OTP Resent",
                    description: "A new OTP has been sent.",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                  })
                }
              >
                Resend OTP
              </Link>
            </Text>
          </>
        )}

        {step === 3 && ( // Step 3: New Password Input
          <form onSubmit={handleChangePassword}>
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                borderRadius="md"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px blue.400",
                }}
              />
            </FormControl>
            <Button colorScheme="blue" width="full" type="submit">
              Change Password
            </Button>
          </form>
        )}

        <Text textAlign="center" fontSize="sm" mt={4}>
          Remembered your password?{" "}
          <Link color="blue.500" href="/login">
            Back to Login
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
