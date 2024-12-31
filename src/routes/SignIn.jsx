import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, FormControl, FormLabel, Text } from '@chakra-ui/react';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {Í
          const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
      
          if (data.length > 0) {
            localStorage.setItem('user', JSON.stringify(data[0]));
            navigate('/');
          } else {
            setError('Invalid Username or Password');
          }
        } catch (err) {
          console.error(err);
        }
      };
      

    return (
        <Box className="signin-page">
          <form onSubmit={handleSignIn}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input data-testid="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input data-testid="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            {error && <Text color="red.500">{error}</Text>}
            <Button data-testid="signin-button" type="submit">Sign In</Button>
            <Button data-testid="register-button" onClick={() => navigate('/register')}>Register</Button>
          </form>
    </Box>
    );
};

export default SignIn;
