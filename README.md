# 🍕 Azzipizza – Online Pizza Ordering Website

Azzipizza is a modern and user-friendly online pizza takeaway website where customers can easily browse a rich pizza menu, customize their orders, and securely pay online. Designed for speed, simplicity, and scalability, Azzipizza aims to bring the pizzeria experience right to your fingertips.

---

## 🚀 Key Features

- 🧾 **Online Ordering System** – Customers can browse the menu, select items, and place orders instantly.
- 🍕 **Pizza Customization** – Choose pizza size, crust, toppings, and extras before checkout.
- 💳 **Secure Online Payments** – Integrated with payment gateway PayPal for fast and safe transactions.
- 📦 **Real-Time Order Management** – Orders are sent to the backend for processing and can be managed by the kitchen.
- 📱 **Responsive Design** – Mobile-friendly UI ensures a smooth experience across devices.
- 🔔 **Live Order Notifications** – Kitchen/manager receives order alerts via sound and sockets (socket.io).
- 📊 **Admin Features (Optional)** – Easily extendable to support admin dashboard, order history, and analytics.

---

## 🧰 Tech Stack

### Frontend:
- React
- TailwindCss
- ShadCn

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB (via Mongoose)

### Other Tools:
- Socket.io (for real-time order updates)
- Satispay or Stripe (for payment integration)
- dotenv (for environment variable management)

---

## 📦 Project Structure


---

## ✅ Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- (Optional) [Postman](https://www.postman.com/) – for API testing
- (Optional) [Vercel](https://vercel.com/) – for frontend deployment
- (Optional) [Render](https://render.com/) / [Railway](https://railway.app/) – for backend deployment

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Khubaib-shah/azzipizza.git

# 2. Navigate into the project
cd azzipizza/frontend pr cd azzipizza/admin 

# 3. Install frontend or admin dependencies
npm install

# 4. Create a .env file at the root with the following:
VITE_BASE_URL_PRO=your_backend_url
VITE_BASE_URL_DEV=http://localhost:5000

# 5. Start the server
npm start

Now open your browser and visit:
👉 http://localhost:5173

🧪 Usage

Browse the pizza menu on the homepage.
Customize pizzas and add them to your cart.
Place your order and pay securely.
Kitchen receives order in real-time.

🙌 Author
Built with ❤️ by Khubaib Shah

Feel free to star ⭐ the repo and contribute!
