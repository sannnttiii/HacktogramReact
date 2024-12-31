import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, FormControl, FormLabel, Textarea } from '@chakra-ui/react';

const CreatePhoto = () => {
    const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    const newPhoto = {
      url: photoUrl,
      caption,
      userId: user.id,
      username: user.username,
    };

    try {
      await fetch('http://localhost:3001/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto),
      });

      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };


    return (
        <Box className="create-photo-page">
      <form onSubmit={handleUpload}>
        <FormControl id="photo-url" isRequired>
          <FormLabel>Photo URL</FormLabel>
          <Input data-testid="photo-url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        </FormControl>
        <FormControl id="caption" isRequired>
          <FormLabel>Caption</FormLabel>
          <Textarea data-testid="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </FormControl>
        <Button data-testid="upload-button" type="submit">Upload</Button>
      </form>
    </Box>  
    );
};

export default CreatePhoto;
