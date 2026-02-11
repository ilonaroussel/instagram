// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";

import PostForm from "./PostForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import Navbar from "./components/navbar";



function App(){
  const handlePostCreated = (post: unknown) => {
    console.log("Post created:", post);
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/PostForm" element={<PostForm onPostCreated={handlePostCreated} />} />
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
