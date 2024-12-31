import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Photos from "./routes/Photos";
import CreatePhoto from "./routes/CreatePhoto";
import Detail from "./routes/Detail";
import SignIn from "./routes/SignIn";
import Register from "./routes/Register";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./layout/Home";

const App = () => {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Photos />} />
          <Route path="create" element={<CreatePhoto />} />
          <Route path="photo/:id" element={<Detail />} />
        </Route>
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
