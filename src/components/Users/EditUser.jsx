import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  selectSelectedUser,
  selectUserError,
  selectUserLoading,
  editUser,
} from "../../features/userSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { FaEnvelope, FaUserAlt, FaPhone, FaLock } from "react-icons/fa";

export default function EditUser() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectSelectedUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    status: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        status: user.status || "",
        password: user.password || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state to true
    try {
      await dispatch(editUser({ id, ...formData }));
      toast({
        title: "User updated.",
        description: "The user details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/user"); // Redirect after successful update
    } catch (err) {
      toast({
        title: "Error.",
        description: "An error occurred while updating the user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  return (
    <Box p={4} mx="auto" maxW="600px" width="100%" height="100vh">
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <GridItem>
            <FormControl mb={4}>
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
                  required
                />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
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
                  required
                />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Phone Number:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaPhone} color="gray.400" />}
                />
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Status:</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Banned">Banned</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
              <FormLabel>Password:</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon as={FaLock} color="gray.400" />}
                />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>
        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Update User
        </Button>
        <Button colorScheme="red" onClick={handleCancel} ml={4}>
          Cancel
        </Button>
      </form>
    </Box>
  );
}
