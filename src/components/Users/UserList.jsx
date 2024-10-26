import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Badge,
  Stack,
} from "@chakra-ui/react";
import {
  selectUserData,
  selectTotalPages,
  selectUserError,
  selectUserLoading,
  fetchUserData,
  deleteUser,
} from "../../features/userSlice";
import Loader from "../Not_Found/Loader";
import Error502 from "../Not_Found/Error502";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectUserData);
  const totalPages = useSelector(selectTotalPages);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    // dispatch(fetchUserData());
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    onOpen();
  };

  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      await dispatch(deleteUser(userToDelete.id));
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "yellow";
      case "Banned":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error502 />;
  }

  const userData = [{
    name:"nikhil",
    email: "nikhil@example.com",
    phone: "1234567890",
    status: "Active"
  }]

  return (
    <Box p={6} maxW="95vw" mx="auto">
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">User List</Text>
        <Button colorScheme="blue" onClick={() => navigate("/user/adduser")}>
          Add User
        </Button>
      </HStack>

      <Stack spacing={4}>
        {userData.map((user) => (
          <Box
            key={user.id}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            p={4}
            bg="white"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)", boxShadow: "lg" }}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box flex="1">
              <Text fontSize="lg" fontWeight="bold">{user.name}</Text>
              <Text color="gray.500">{user.email}</Text>
              <HStack spacing={2}>
                <Text>Phone: {user.phone}</Text>
                <Badge colorScheme={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </HStack>
            </Box>
            <HStack spacing={2} mt={{ base: 4, md: 4 }}>
              <Button
                colorScheme="blue"
                leftIcon={<FaEdit />}
                onClick={() => navigate(`/user/edituser/${user.id}`)}
              >
                Edit
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FaTrash />}
                onClick={() => handleDelete(user)}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        ))}
      </Stack>

      <HStack spacing={4} justifyContent="center" mt={6}>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            colorScheme={currentPage === index + 1 ? "teal" : undefined}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the user {userToDelete?.name}?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={confirmDelete}
              isLoading={loadingDelete}
              loadingText="Deleting..."
            >
              Delete
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
