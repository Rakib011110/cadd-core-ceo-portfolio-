/* eslint-disable react/no-unescaped-entities */
// components/Contact.tsx
"use client";

import React, { useRef } from "react";
import emailjs from "emailjs-com";
import { Player } from "@lottiefiles/react-lottie-player";

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
    <section className=" max-w-7xl mx-auto bg-white dark:bg-black px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          📬 Get in Touch
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Feel free to drop a message. I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-10">
        {/* Left - Lottie Animation */}
        <div className="w-full md:w-1/2">
          <Player
            autoplay
            loop
            src="https://assets5.lottiefiles.com/packages/lf20_jtbfg2nb.json"
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
