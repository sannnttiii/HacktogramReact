import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Photos = () => {
    const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (userData) {
            const userResponse = await fetch(`http://localhost:3001/users/${userData.id}`);
            const userInfo = await userResponse.json();
            setUser(userInfo);
            
            const photoResponse = await fetch(`http://localhost:3001/photos?userId=${userData.id}`);
            const photoData = await photoResponse.json();
            setPhotos(photoData);
          }
          setLoading(false);
        }

        fetchUserData();

  }, []);
  return (
    <Box className="photos-page">
      {loading ? (
        <Box className="photo-loading-template">Loading...</Box>
      ) : (
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
              <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
              <Text fontSize="xl" fontWeight="bold">{user.fullname}</Text>
              <Text>{user.desc}</Text>
              <Text>{photos.length} Posts</Text>
            </Box>
          )}
          {photos.map(photo => (
            <Box key={photo.id} onClick={() => navigate(`/photo/${photo.id}`)}>
              <Image src={photo.url} alt={photo.caption} />
              <Text>{photo.caption}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};


export default Photos;
