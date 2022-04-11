import { Route, Routes } from "react-router-dom";
import "./App.css";
import BlogDetails from "./Blogs/BlogDetails";
import Blogs from "./Blogs/Blogs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Blogs />} />
      <Route path="/:blogId" element={<BlogDetails />} />
    </Routes>
  );
}

export default App;
