import { Box, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box className="not-found-page" textAlign="center" mt="20">
        <Text fontSize="2xl" fontWeight="bold">404 Not Found</Text>
        <Button data-testid="back" mt="4" onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
};

export default NotFound;
