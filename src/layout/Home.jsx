import React, { useEffect } from "react";
import { Box, Button, VStack } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/signin');
    };
  
    return (
      <Box className="home-page">
        <Button
          data-testid="home-button"
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button
          data-testid="create-button"
          onClick={() => navigate('/create')}
        >
          Create
        </Button>
        <Button
          data-testid="logout-button"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Outlet />
      </Box>
    );
};

export default Home;
