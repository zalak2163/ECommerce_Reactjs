import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar/";
import { ToastContainer, toast } from "react-toastify";
import Add from "./Admin/Add";
import List from "./Admin/List";
import Admin from "./Admin/Admin";
import AdminOrders from "./Admin/AdminOrders";
import Edit from "./Admin/Edit";

export const currency = "$";

function App() {
  return (
    <>
      <Navbar />
      <SearchBar />
      <div className="px-4 sm:px-[5vh] md:px-[7vh] lg:px-[9vh]">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/adminorders" element={<AdminOrders />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
