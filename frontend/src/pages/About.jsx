import React from "react";
import pizzaImage from "../assets/logo-pizza.png";
import ingredientsImage from "../assets/parts.pizza.jpg";
import restaurantImage from "../assets/resturent.jpg";
import Team from "../assets/meet-our.png";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl p-6">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-6">
          About Our Pizza
        </h1>
        <p className="text-gray-700 text-lg text-center mb-4">
          La nostra pizza nasce da un impasto ricco, rustico e saporito,
          realizzato con una miscela di farine selezionate. Usiamo infatti 3-4
          tipi di farina diversi, tra cui la semola di grano duro, la farina
          integrale, la farina di segale, avena, e una speciale miscela chiamata
          “pane farro e grano saraceno”, che conferisce all’impasto un gusto
          unico e un profilo nutrizionale più completo. Il nostro impasto viene
          lavorato con una lievitazione lunga, di oltre 48 ore, per garantire
          una pizza leggera, digeribile e fragrante. Utilizziamo una tecnica
          tradizionale chiamata “biga”, un preimpasto che richiede tempo, cura e
          attenzione. Cos’è la biga? La biga è un preimpasto fatto con farina,
          acqua e una piccola quantità di lievito. Viene lasciata fermentare
          lentamente per 16-24 ore a temperatura controllata. Questo processo
          sviluppa aromi complessi, migliora la struttura dell’impasto finale e
          rende la pizza più leggera e profumata. Dopo la maturazione della
          biga, viene impastata nuovamente con il resto degli ingredienti per
          creare l’impasto definitivo, che poi continua la sua lunga
          lievitazione prima di essere steso e cotto.
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

export default About;
