// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PostForm from "./PostForm";
//import Register from "./pages/Register";
//import Login from "./pages/Login";
//import Feed from "./pages/Feed";

function App(){
  const handlePostCreated = (post: any) => {
    console.log("Post created:", post);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/PostForm" element={<PostForm onPostCreated={handlePostCreated} />} />
      </Routes>
    </BrowserRouter>
  );
};
    /*<BrowserRouter>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>*/

export default App;
