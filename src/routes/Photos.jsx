import { Box, Image, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const loadPhotos = async (userData) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/photos?userId=" + userData.id
      );
      const data = await response.json();
      setPhotos(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    loadPhotos(userData);
  }, []);
  return (
    <Box className="photo-page">
      <VStack spacing={4}>
        {user && (
          <Box mb={6}>
            <Image
              src={user.profilePic}
              alt={user.username}
              boxSize="100px"
              borderRadius="full"
              mb={4}
            />
            <Text fontSize="xl" fontWeight="bold">
              {user.username}
            </Text>
            <Text fontSize={"16px"} mb={4}>
              <span style={{ fontWeight: "bold" }}>{photos.length}</span>{" "}
              {photos.length > 1 ? "Posts" : "Post"}
            </Text>
            <Text fontSize="xl" fontWeight="bold">
              {user.fullname}
            </Text>
            <Text>{user.desc}</Text>
          </Box>
        )}
        {loading ? (
          <Box className="photo-loading-template">Loading...</Box>
        ) : (
          <SimpleGrid columns={3} spacing={1}>
            {photos.map((photo) => (
              <Box
                key={photo.id}
                onClick={() => navigate(`/photo/${photo.id}`)}
              >
                <Image src={photo.url} alt={photo.caption} />
                <Text>{photo.caption}</Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default Photos;
