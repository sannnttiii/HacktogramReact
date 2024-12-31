import { Box, Input, Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [description, setDescription] = useState('');
  const [profilePic, setprofilePic] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          fullname,
          description,
          profilePic,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Error registering user:', error);
    }
  };

  return (
    <Box className="register-page" p={4}>
      <form onSubmit={handleRegister}>
       
          <FormControl isRequired>
            <FormLabel >Username</FormLabel>
            <Input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              data-testid="username" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              data-testid="password" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Fullname</FormLabel>
            <Input 
              type="text" 
              value={fullname} 
              onChange={(e) => setFullname(e.target.value)} 
              data-testid="fullname" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              data-testid="description" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Profile Picture URL</FormLabel>
            <Input 
              type="text" 
              value={profilePic} 
              onChange={(e) => setprofilePic(e.target.value)} 
              data-testid="profile-picture" 
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="teal" 
            data-testid="register-button"
          >
            Register
          </Button>
          {error && <Box color="red">{error}</Box>}
      </form>
    </Box>
  );
};

export default Register;
