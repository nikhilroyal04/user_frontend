import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Divider, useBreakpointValue, Box } from "@chakra-ui/react";

const FullLayouts = () => {
  // Determine if the BottomBar should be displayed based on screen size
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <>
      <Header />
      <Divider borderColor="gray.300" />
      <main>
        <Box mt={5}>
          {" "}
          <Outlet />
        </Box>{" "}
      </main>
      <Box mb={isSmallScreen ? 12 : 0}>
        <Footer />
      </Box>
    </>
  );
};

export default FullLayouts;
