# SHOP.CO

SHOP.CO is a modern e-commerce web application designed to provide users with a seamless shopping experience. It features a responsive and stylish user interface, allowing users to browse products, view product details, and interact with curated collections. Admin users can manage products through an easy-to-use dashboard.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Feature

- Browse a wide variety of products: electronics, clothing, makeup, utilities, and accessories  
- Responsive design for mobile and desktop  
- Dark and light mode toggle  
- Interactive hover panels for product categories  
- Admin dashboard to add, edit, and delete products  
- Product stats: international brands, high-quality products, happy customers  
- Shopping cart and user authentication features (via Firebase)  

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Icons  
- **State Management:** Zustand  
- **Routing:** React Router DOM  
- **Backend/Database:** Firebase Firestore & Firebase Storage  
- **Authentication:** Firebase Auth (Anonymous & Custom Token)  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/shop.co.git
cd shop.co
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser.

---

## Usage

* Navigate to `/dashboard` to browse products
* Navigate to `/admin` to manage products (Admin only)
* Use the **Shop Now** button on the homepage to quickly go to the product collection
* Toggle dark/light mode using the button in the navbar

---

## Folder Structure

```
src/
├─ components/       # Reusable React components (Navbar, HomePage, StatItem, etc.)
├─ pages/            # Page components (HomePage, Admin, Dashboard)
├─ hooks/            # Custom hooks (useTheme)
├─ context/          # Theme context
├─ store/            # Zustand stores
├─ firebase.js       # Firebase configuration
└─ App.jsx           # Main app component
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Screenshots
<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/b84d7a3d-afa2-49a9-845b-d9e15b053bc8" />
<img width="1916" height="866" alt="image" src="https://github.com/user-attachments/assets/3905d4ac-8aea-4d4d-91a3-4adb1b952b74" />


---

## Contact

For feedback or questions, contact **[Your Name](mailto:your.email@example.com)**.

```

