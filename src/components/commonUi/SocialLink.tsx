import React from "react";
import { FaLinkedin, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const SocialLinks = () => {
  const links = [
    {
      id: 1,
      child: (
        <>
          LinkedIn <FaLinkedin size={30} className="text-blue-700" />
        </>
      ),
      href: "https://linkedin.com/in/hachnayen",
    },
    {
      id: 2,
      child: (
        <>
          Facebook <FaFacebook size={30} className="text-blue-600" />
        </>
      ),
      href: "https://facebook.com/hachnayenofficial",
    },
    {
      id: 3,
      child: (
        <>
          Email <HiOutlineMail size={30} className="text-rose-600" />
        </>
      ),
      href: "mailto:hachnayen@gmail.com",
    },
    {
      id: 4,
      child: (
        <>
          WhatsApp <FaWhatsapp size={30} className="text-green-600" />
        </>
      ),
      href: "https://wa.me/8801711486779",
    },
   
  ];

  return (
    <div className="hidden lg:flex flex-col top-[35%] left-0 fixed z-50">
      <ul>
        {links.map(({ id, child, href }) => (
          <li
            key={id}
            className="group flex justify-between items-center w-40 h-14 px-4 ml-[-110px] hover:ml-[-10px] hover:rounded-xl duration-300 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all ease-in-out rounded-r-2xl"
          >
            <a
              href={href}
              className="flex justify-between items-center w-full text-white font-medium group-hover:text-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              {child}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialLinks;
