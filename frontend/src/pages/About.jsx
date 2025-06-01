import React from "react";
import pizzaImage from "../assets/logo-pizza.png";
import ingredientsImage from "../assets/parts.pizza.jpg";
import Team from "../assets/meet-our.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6">
            About Our Pizza
          </h1>
          <div className="flex justify-center mb-10">
            <img
              src={pizzaImage}
              alt="Delicious Pizza"
              className="filter drop-shadow-lg w-full max-w-xl"
            />
          </div>
        </div>

        <div className="space-y-16">
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
              Our Story
            </h2>
            <article className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-6">
                La nostra pizza nasce da un impasto ricco, rustico e saporito,
                realizzato con una miscela di farine selezionate. Usiamo infatti
                3-4 tipi di farina diversi, tra cui la semola di grano duro, la
                farina integrale, la farina di segale, avena, e una speciale
                miscela chiamata "pane farro e grano saraceno", che conferisce
                all'impasto un gusto unico e un profilo nutrizionale più
                completo.
              </p>
              <p className="mb-6">
                Il nostro impasto viene lavorato con una lievitazione lunga, di
                oltre 48 ore, per garantire una pizza leggera, digeribile e
                fragrante. Utilizziamo una tecnica tradizionale chiamata "biga",
                un preimpasto che richiede tempo, cura e attenzione.
              </p>
              <p>
                Cos'è la biga? La biga è un preimpasto fatto con farina, acqua e
                una piccola quantità di lievito. Viene lasciata fermentare
                lentamente per 16-24 ore a temperatura controllata. Questo
                processo sviluppa aromi complessi, migliora la struttura
                dell'impasto finale e rende la pizza più leggera e profumata.
                Dopo la maturazione della biga, viene impastata nuovamente con
                il resto degli ingredienti per creare l'impasto definitivo, che
                poi continua la sua lunga lievitazione prima di essere steso e
                cotto.
              </p>
            </article>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-50 p-8 rounded-xl shadow-md border-l-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700">
                Portare gioia a ogni amante della pizza con sapori autentici e
                ingredienti freschi, preparati con amore e perfezione.
              </p>
            </div>
            <div className="bg-green-50 p-8 rounded-xl shadow-md border-l-4 border-green-400">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-700">
                Diventare il punto di riferimento per gli amanti della pizza in
                tutto il mondo, offrendo un'esperienza deliziosa in ogni morso.
              </p>
            </div>
          </div>

          {/* Ingredients Section */}
          <section className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
              Quality Ingredients
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img
                  src={ingredientsImage}
                  alt="Fresh Ingredients"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              <div className="md:w-1/2">
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>
                    Ogni pizza inizia con una scelta accurata degli ingredienti.
                    Utilizziamo solo prodotti freschi, genuini e di alta
                    qualità, selezionati con cura ogni giorno. Dalle verdure di
                    stagione ai salumi artigianali, dai formaggi autentici alla
                    passata di pomodoro profumata, ogni componente è scelto per
                    esaltare il sapore e garantire un'esperienza autentica.
                  </p>
                  <p className="mt-4">
                    Crediamo che la qualità si senta al primo morso, ed è per
                    questo che non scendiamo mai a compromessi sulla selezione
                    dei nostri ingredienti.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 p-8 rounded-xl shadow-md border-l-4 border-blue-400">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
              Our Team
            </h2>
            <div className="text-center">
              <img
                src={Team}
                alt="Our Team"
                className="rounded-xl shadow-lg w-full"
              />
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Passione, qualità e gusto: il nostro team lavora ogni giorno per
                offrirti la pizza perfetta, morso dopo morso. Ogni membro del
                nostro staff è dedicato a mantenere gli alti standard che ci
                distinguono.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
              Featured Article About Us
            </h2>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="h-96 w-full">
                {" "}
                <iframe
                  className="w-full h-full"
                  src="https://corrieredibologna.corriere.it/notizie/cronaca/24_febbraio_04/bologna-hussain-e-hassan-la-fuga-dalla-guerra-poi-l-apertura-di-due-pizzerie-tutte-loro-ora-una-casa-64c290f4-b54a-43b8-9701-336586389xlk.shtml"
                  title="Corriere di Bologna Article About Our Pizzeria"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="mt-6 prose prose-lg max-w-none text-gray-700">
              <p className="text-center">
                Scopri la nostra storia ispiratrice in questo articolo del
                Corriere di Bologna – dalla fuga dalla guerra all’apertura di
                due pizzerie di successo a Bologna.
              </p>
              <div className="text-center mt-4">
                <a
                  href="https://corrieredibologna.corriere.it/notizie/cronaca/24_febbraio_04/bologna-hussain-e-hassan-la-fuga-dalla-guerra-poi-l-apertura-di-due-pizzerie-tutte-loro-ora-una-casa-64c290f4-b54a-43b8-9701-336586389xlk.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Read Full Article
                </a>
              </div>
            </div>{" "}
          </section>
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
              Visit Our Pizzerias in Bologna
            </h2>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="h-96 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2846.1529902922857!2d11.329174276641153!3d44.49153189780795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477fd5fe539fb66b%3A0x63cfb4f9ab408962!2sPizzeria%20AZZIPIZZA%20mica%20pizza%20e%20fichi!5e0!3m2!1sen!2s!4v1744142734200!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div className="mt-6 prose prose-lg max-w-none text-gray-700">
              <p className="text-center">
                Vuoi gustare una pizza autentica e fresca nel cuore di Bologna?
                Vieni a trovarci in una delle nostre due accoglienti pizzerie,
                dove la tradizione incontra il sapore. Trovarci è facilissimo
                grazie alla mappa qui sopra — siamo proprio dietro l'angolo,
                pronti a servirti una fetta di felicità.
              </p>
              <p className="text-center mt-2">
                Che tu voglia uno spuntino veloce o una cena in compagnia di
                amici e famiglia, le nostre porte sono sempre aperte e i forni
                sempre caldi!
              </p>
              <div className="text-center mt-4">
                <a
                  href="https://www.google.com/maps/place/Pizzeria+AZZIPIZZA+mica+pizza+e+fichi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
