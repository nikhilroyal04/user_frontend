import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  selectSelectedUser,
  selectUserError,
  selectUserLoading,
  editUser,
} from "../../features/userSlice";
import { useParams } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  Spinner,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";

export default function EditUser() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectSelectedUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    phoneNumber: "",
    status: "",
    password: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        userName: user.userName || "",
        phoneNumber: user.phoneNumber || "",
        status: user.status || "",
        password: user.password || "",
        city: user.city || "",
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
    try {
      await dispatch(editUser({ id, ...formData }));
      toast({
        title: "User updated.",
        description: "The user details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error.",
        description: "An error occurred while updating the user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
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
            <FormControl mb={4}>
              <FormLabel>Phone Number:</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
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
              <Input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl mb={4}>
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
        </Grid>
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading} // Show loading state when dispatching
        >
          Update User
        </Button>
      </form>
    </Box>
  );
}
