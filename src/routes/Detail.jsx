import { Box, Button, Image, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Detail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async () => {
      const userData = await JSON.parse(localStorage.getItem("user"));
      setUser(userData);

      const response = await fetch(`http://localhost:3001/photos/${id}`);
      const data = await response.json();
      setPhoto(data);
    };

    fetchPhoto();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`http://localhost:3001/photos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    navigate("/");
  };

  if (!photo) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box className="detail-photo-page">
      <Image data-testid="photo-image" src={photo.url} alt={photo.caption} />
      <Text data-testid="photo-username">
        Username: {photo.userId.username}
      </Text>
      <Box display={"flex"}>
        <Image
          src={user.profilePic}
          boxSize={10}
          objectFit={"cover"}
          mr={4}
          rounded={"full"}
        />
        <Text fontSize={"sm"} maxWidth={"250px"}>
          <span style={{ fontWeight: "bold" }}>{user.username}</span>{" "}
          {photo.caption}
        </Text>
      </Box>
      <Text data-testid="photo-caption">Caption: {photo.caption}</Text>
      <Button data-testid="delete-button" onClick={handleDelete}>
        Delete Photo
      </Button>
    </Box>
  );
};

export default Detail;
