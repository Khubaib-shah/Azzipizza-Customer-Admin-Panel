import React from "react";
import pizzaImage from "../assets/hero-image.jpg"; // Ensure you have a pizza image in your project
import teamImage from "../assets/hero-image.jpg"; // Add an image of the team or restaurant
import ingredientsImage from "../assets/parts.pizza.jpg"; // Add an image of fresh ingredients
import restaurantImage from "../assets/restunent.jpg"; // Add an image of the restaurant ambiance
import Team from "../assets/meet-our.png"; // Add an image of the restaurant ambiance

const AboutUs = () => {
  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6">
          About Our Pizza
        </h1>
        <p className="text-gray-700 text-lg text-center mb-4">
          We craft the most delicious and mouth-watering pizzas using fresh
          ingredients and traditional recipes. Our goal is to serve you the best
          pizza experience you'll ever have.
        </p>
        <div className="flex justify-center mb-6">
          <img
            src={pizzaImage}
            alt="Delicious Pizza"
            className="rounded-lg shadow-md w-full max-w-lg"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800">
              Our Mission
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              To bring joy to every pizza lover with authentic flavors and fresh
              ingredients crafted with love and perfection.
            </p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800">Our Vision</h2>
            <p className="text-gray-700 mt-2 text-base">
              To be the go-to destination for pizza enthusiasts worldwide,
              offering a delightful experience in every bite.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quality Ingredients
          </h2>
          <img
            src={ingredientsImage}
            alt="Fresh Ingredients"
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-800">
              Quality Ingredients
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              We source only the finest and freshest ingredients to ensure every
              pizza delivers an authentic taste and a delightful experience.
            </p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-800">
              Fresh & Natural
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              Our commitment to quality means using natural, preservative-free
              ingredients that enhance flavor and promote a healthier dining
              experience.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Our Restaurant
          </h2>
          <img
            src={restaurantImage}
            alt="Our Restaurant"
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-purple-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-purple-800">
              Our Restaurants
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              Designed for comfort and warmth, our restaurants provide a
              welcoming atmosphere where families and friends can enjoy
              delicious meals together.
            </p>
          </div>
          <div className="p-4 bg-orange-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-800">
              Exceptional Service
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              Our dedicated staff ensures a delightful dining experience,
              offering prompt service and a friendly ambiance in every visit.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img
            src={Team}
            alt="Meet Our Team"
            className="rounded-lg shadow-md w-full max-w-md mx-auto"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-teal-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-teal-800">Our Team</h2>
            <p className="text-gray-700 mt-2 text-base">
              Our passionate and skilled team works tirelessly to craft the
              perfect pizza experience, ensuring quality and satisfaction in
              every bite.
            </p>
          </div>
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-indigo-800">
              Dedicated Professionals
            </h2>
            <p className="text-gray-700 mt-2 text-base">
              From our chefs to our customer service staff, every team member is
              dedicated to providing the best service and delicious meals with a
              smile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
