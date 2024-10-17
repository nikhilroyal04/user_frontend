import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  const [loadingDelete, setLoadingDelete] = useState(false); // New loading state for delete

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    onOpen(); // Open the delete confirmation modal
  };

  const confirmDelete = async () => {
    setLoadingDelete(true); // Set loading state to true when delete starts
    try {
      await dispatch(deleteUser(userToDelete._id)); // Await the delete action
      onClose(); // Close the modal
    } catch (error) {
      // Handle any errors if needed
      console.error("Failed to delete user:", error);
    } finally {
      setLoadingDelete(false); // Reset loading state after delete operation
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const pageRange = 3;
    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    if (currentPage > 2) {
      pages.push(
        <Button key="first" onClick={() => handlePageChange(1)}>
          First
        </Button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <Button key="prev" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </Button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          colorScheme={i === currentPage ? "teal" : undefined}
          disabled={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <Button key="next" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </Button>
      );
    }

    return pages;
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

  return (
    <Box p={6} height="100vh" maxW="95vw" mx="auto">
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl">User List</Text>
        <Button colorScheme="blue" onClick={() => navigate("/user/adduser")}>
          Add User
        </Button>
      </HStack>
      <Box overflow="auto">
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>User Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>City</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.userName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>{user.city}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate(`/user/edituser/${user._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <HStack spacing={4} justifyContent="center" mt={6}>
        {renderPaginationButtons()}
      </HStack>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the user {userToDelete?.userName}?
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
