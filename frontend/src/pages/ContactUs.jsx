import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-xl p-6 w-full">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg text-center mb-4">
          We'd love to hear from you! Whether you have questions, feedback, or
          special requests, feel free to reach out to us.
        </p>

        {/* Contact Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Get in Touch
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md text-center">
            <FaMapMarkerAlt className="text-yellow-800 text-4xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-yellow-800">
              Our Location
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              123 Pizza Street, Food City, 56789
            </p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow-md text-center">
            <FaPhoneAlt className="text-green-800 text-4xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-green-800">Call Us</h2>
            <p className="text-gray-700 mt-2 text-base">+1 (234) 567-890</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-purple-100 rounded-lg shadow-md text-center">
            <FaEnvelope className="text-purple-800 text-4xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-purple-800">Email Us</h2>
            <p className="text-gray-700 mt-2 text-base">
              support@AppiPizza.com
            </p>
          </div>
          <div className="p-4 bg-orange-100 rounded-lg shadow-md text-center">
            <div className="flex justify-center gap-4 mb-2">
              <FaFacebook className="text-orange-800 text-4xl" />
              <FaTwitter className="text-orange-800 text-4xl" />
              <FaInstagram className="text-orange-800 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-orange-800">Follow Us</h2>
            <p className="text-gray-700 mt-2 text-base">
              @AppiPizza on Social Media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
