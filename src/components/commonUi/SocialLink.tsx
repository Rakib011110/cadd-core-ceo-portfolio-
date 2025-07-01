import React from "react";
import { FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const SocialLinks = () => {
  const links = [
    {
      id: 1,
      child: (
        <>
          LinkedIn <FaLinkedin size={30} />
        </>
      ),
      href: "https://www.linkedin.com",
      style: "",
      download: false,
    },
    {
      id: 2,
      child: (
        <>
          Facebook <FaFacebook size={30} />
        </>
      ),
      href: "", // Replace with your actual FB URL
      style: "",
      download: false,
    },
    {
      id: 3,
      child: (
        <>
          Mail <HiOutlineMail size={30} />
        </>
      ),
      href: "mailto:foo@gmail.com", // Update email if needed
      style: "",
      download: false,
    },
    {
      id: 4,
      child: (
        <>
          WhatsApp <FaWhatsapp size={30} />
        </>
      ),
      href: "https://wa.me/8801XXXXXXXXX", // Replace with your WhatsApp number
      style: "",
      download: false,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col top-[35%] left-0 fixed">
      <ul>
        {links.map(({ id, child, href, style, download }) => (
          <li
            key={id}
            className={
              "flex justify-between items-center bg-blue-50 border-2 w-40 h-14 px-4 ml-[-90px] hover:ml-[-10px] hover:rounded-md duration-300 backdrop-blur-2xl border-r shadow-lg" +
              " " +
              (style || "")
            }>
            <a
              href={href}
              className="flex justify-between items-center w-full btn text-blue-700 hover:text-red-500"
              download={download}
              target="_blank"
              rel="noreferrer">
              {child}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialLinks;
