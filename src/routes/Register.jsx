import { Box, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          fullname,
          description,
          profilePic,
        }),
      });
      const data = await response.json();
      navigate("/");
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Error registering user:", error);
    }
  };

  return (
    <Box className="register-page" p={4}>
      <form onSubmit={handleRegister}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="@jhon"
            onChange={(e) => setUsername(e.target.value)}
            required
            data-testid="username"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Use at least 8 characters"
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Fullname</FormLabel>
          <Input
            placeholder="Jhon Doe"
            onChange={(e) => setFullname(e.target.value)}
            required
            data-testid="fullname"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="Tell us about you"
            onChange={(e) => setDescription(e.target.value)}
            data-testid="description"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            placeholder="Photo URL here ..."
            onChange={(e) => setProfilePic(e.target.value)}
            required
            data-testid="profile-picture"
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" data-testid="register-button">
          Register
        </Button>
        <Button onClick={() => navigate("/signin")} data-testid="signin-button">
          Sign In
        </Button>
        {error && <Box color="red">{error}</Box>}
      </form>
    </Box>
  );
};

export default Register;
