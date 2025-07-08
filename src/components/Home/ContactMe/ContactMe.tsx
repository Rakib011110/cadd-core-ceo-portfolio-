/* eslint-disable react/no-unescaped-entities */
// components/Contact.tsx
"use client";

import React, { useRef } from "react";
import emailjs from "emailjs-com";
import dynamic from "next/dynamic";


const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
  { ssr: false }
);


const Contact = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    emailjs
      .sendForm(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your template ID
        form.current,
        "your_user_id" // Replace with your public key
      )
      .then(
        () => {
          alert("Message sent successfully!");
          form.current?.reset();
        },
        (error) => {
          alert("Something went wrong!");
          console.error(error.text);
        }
      );
  };

  return (
    <section className=" max-w-7xl mx-auto  bg-white dark:bg-black px-4 py-12 border-t-4 rounded-lg ">
      {/* Section Title */}
      <div className="text-center mb-14 mt-14 px-4">
        <div className="relative inline-block max-w-xl mx-auto">
          {/* Decorative Corners */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gray-300 dark:border-gray-600"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gray-300 dark:border-gray-600"></div>

          {/* Title + Subtitle */}
          <div className="px-8 py-4 uppercase">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              📬{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r  from-blue-500 to-purple-600 ">
                Get in Touch
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Feel free to drop a message. I’ll get back to you as soon as
              possible.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-10">
        {/* Left - Lottie Animation */}
        <div className="w-full md:w-1/2">
          <Player
            autoplay
            loop
            src="https://assets5.lottiefiles.com/packages/lf20_zrqthn6o.json"
            className="w-full h-full"
          />
        </div>

        {/* Right - Contact Form */}
        <div className="w-full md:w-1/2">
          <form ref={form} onSubmit={sendEmail} className="space-y-4">
            <input
              type="text"
              name="user_name"
              placeholder="Your Name"
              required
              className="w-full p-3 border rounded-md bg-transparent dark:text-white text-black border-gray-400"
            />
            <input
              type="email"
              name="user_email"
              placeholder="Your Email"
              required
              className="w-full p-3 border rounded-md bg-transparent dark:text-white text-black border-gray-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="w-full p-3 border rounded-md bg-transparent dark:text-white text-black border-gray-400"
              rows={5}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
