# 🍕 Azzipizza – Online Pizza Ordering Website

**Azzipizza** is a modern, fast, and mobile-friendly online pizza ordering platform. Customers can browse a rich menu, customize pizzas, place orders, and securely pay online — all from the comfort of home. Designed for simplicity and scalability, it supports real-time order tracking and smooth kitchen management.

---

## 📌 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Prerequisites](#-prerequisites)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🚀 Key Features

- 🧾 **Online Ordering** – Browse menu, customize pizzas, and checkout online.
- 🍕 **Pizza Customization** – Choose size, crust, toppings, and extras.
- 💳 **Secure Payments** – Integrated with **Satispay** or **Paypal**.
- 📦 **Real-Time Order System** – Kitchen receives instant order notifications via **socket.io**.
- 📱 **Responsive UI** – Works flawlessly on mobile, tablet, and desktop.
- 🔔 **Live Order Notifications** – Sound alerts for new orders.
- 📊 **Scalable Backend** – Easily expandable for admin dashboard, analytics, etc.

---

## 🧰 Tech Stack

### Frontend:
- React.js (Vite)
- Tailwind CSS
- ShadCN/UI
- Context API

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB (via Mongoose)

### Others:
- Socket.io (for real-time updates)
- Satispay or Paypal (payment integration)
- dotenv (environment config)

---

## 📦 Project Structure
azzipizza/
├── frontend/      # Customer web interface
├── admin/         # Optional admin dashboard (for kitchen/staff)
├── backend/       # REST API server


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
