// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyApp/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

function MyApp(){
return(
  <>
  <h1>test</h1>
  </>
)
}

export default App;
