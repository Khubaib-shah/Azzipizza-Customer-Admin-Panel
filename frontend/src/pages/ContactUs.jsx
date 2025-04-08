import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the email content
    const subject = `New Contact Form Submission from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;

    // Open default email client - CORRECTED EMAIL FORMAT
    window.location.href = `mailto:khubaibsyed820@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // In handleSubmit:
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Clear the form
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl rounded-xl p-6 w-full">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-6">
          Contact Us
        </h1>
        <p className="text-gray-700 text-lg text-center mb-4">
          We'd love to hear from you! Whether you have questions, feedback, or
          special requests, feel free to reach out to us.
        </p>

        {/* Contact Form */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Get in Touch
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send via Email"}
            </button>
            {submitted && (
              <p className="text-green-600 text-center mt-2">
                Email client opened! Please send your message.
              </p>
            )}
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
              Via Frassinago, 16b, 40123 Bologna BO
            </p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow-md text-center">
            <FaPhoneAlt className="text-green-800 text-4xl mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-green-800">Call Us</h2>
            <p className="text-gray-700 mt-2 text-base">
              <a href="tel:393713985810" className="hover:underline">
                371 39 85 810
              </a>
            </p>
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
              <Link
                to="https://www.instagram.com/azzipizzamicapizzaefichi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
              >
                {" "}
                <FaInstagram className="text-orange-800 text-4xl" />
              </Link>
            </div>
            <h2 className="text-xl font-semibold text-orange-800">Follow Us</h2>
            <p className="text-gray-700 mt-2 text-base">
              @Appi Pizza on Social Media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
