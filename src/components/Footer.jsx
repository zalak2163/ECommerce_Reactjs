import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.forever_icon} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600 ">
            At Forever, we are dedicated to offering high-quality, stylish, and
            affordable fashion for everyone. Our collection is curated with
            care, bringing you the latest trends in clothing and accessories
            that help you look and feel your best. Whether you're dressing for a
            casual day out or a special occasion, we’ve got you covered.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-454-7890</li>
            <li>contact@forever@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center ">
          Copyright 2025@ forever.com All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
