// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";

import PostForm from "./PostForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";


function App(){
  const handlePostCreated = (post: any) => {
    console.log("Post created:", post);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/PostForm" element={<PostForm onPostCreated={handlePostCreated} />} />
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
