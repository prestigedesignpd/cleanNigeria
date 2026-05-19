# CleanNigeria Ecosystem 🇳🇬♻️

Welcome to the **CleanNigeria** ecosystem—a state-of-the-art, premium waste management and collection automation platform built for residential estates, businesses, administrators, and collection operators.

This monorepo houses the complete, fully responsive, and robust three-tier application architecture:
1.  **`cleannigeria-backend`**: Core Express REST API, MongoDB Database Mongoose Models, Real-time Socket.io channels, Automated Job Schedulers (Cron), Paystack Billing Gateway Integration, and Role-Based Access Control (RBAC).
2.  **`cleannigeria-client`**: Customer Portal for residents and business entities to request pick-ups, manage recurring subscription tiers, view real-time collector tracking, log support complaints, and pay bills.
3.  **`cleannigeria-admin`**: Central Command Dashboard for administrators, zone operators, and supervisors to monitor operations, manage collection zones, allocate fleets, resolve complaints, track revenues, and view rich Recharts analytics.

---

## 🛠️ Tech Stack & Architecture

### Backend API
*   **Runtime:** Node.js (TypeScript)
*   **Framework:** Express.js (v5)
*   **Database:** MongoDB via Mongoose
*   **Task Queues & Schedulers:** BullMQ / ioredis / node-cron
*   **Payment Gateway:** Paystack Nodes (Billing, recurring subscription callbacks)
*   **SMS & Email Service:** Termii API (SMS OTPs), SendGrid & Nodemailer (SMTP)
*   **File Storage:** Cloudinary CDN integration for vehicle and profile documents
*   **Security:** Helmet, Express Rate Limiter, Bcryptjs, Passport.js (JWT, Local, Google OAuth2)

### Client & Admin Frontends
*   **Build Pipeline:** Vite
*   **Framework:** React 19 (TypeScript)
*   **Styling:** Custom Glassmorphism TailwindCSS, Lucide Icons, Framer Motion transitions
*   **State Management:** Zustand
*   **Data Fetching:** TanStack React Query (v5) for real-time cache synchronization
*   **Data Visualization:** Recharts (Optimized explicit rendering)
*   **Interactive Maps:** React Leaflet (Mapbox layer maps for live truck locations)

---

## 🚀 One-Click Cloud Deployment (Render Blueprint)

This project is optimized for instant, single-click deployment using **Render Infrastructure-as-Code (Blueprints)**. The root `render.yaml` file is pre-configured to build, link, and run all 3 services automatically.

### Environment Variable Requirements

#### 💻 Backend Web Service (`cleannigeria-backend`)
Configure these environment variables in your Render blueprint:
*   `MONGODB_URI`: Your MongoDB database connection string.
*   `REDIS_URL`: Your Redis instance URL (used for background workers and schedulers).
*   `PAYSTACK_PUBLIC_KEY` & `PAYSTACK_SECRET_KEY`: Paystack gateway API keys.
*   `PAYSTACK_WEBHOOK_SECRET`: Secure token signature to verify Paystack subscription events.
*   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media management credentials.
*   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM_ADDRESS`: SMTP configurations for sending account statements, invoices, and transactional updates.
*   *Note: JWT and Session Secrets are automatically and cryptographically generated on Render.*

#### 🌐 Frontends (`cleannigeria-client` & `cleannigeria-admin`)
*   `VITE_API_BASE_URL`: Dynamically injected from the backend web service host. (We defensively resolve, parse, and append `/api/v1` automatically at runtime).
*   `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack integration public key.

---

## 💻 Local Development Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Redis server (Running on port 6379)

### Running the Services

1.  **Start the Backend API:**
    ```bash
    cd cleannigeria-backend
    npm install
    # Seed default administrator accounts (admin@cleannigeria.com / password)
    npm run seed:admin
    # Start development hot-reloading server
    npm run dev
    ```
2.  **Start the Client Dashboard:**
    ```bash
    cd cleannigeria-client
    npm install
    npm run dev
    ```
3.  **Start the Admin Console:**
    ```bash
    cd cleannigeria-admin
    npm install
    npm run dev
    ```

---

## 🔒 Security & Performance
*   Defensive validation inputs on all endpoints using `express-validator` and `zod`.
*   Custom API request caching systems to support high user traffic.
*   Automated periodic Mongoose indexing pipelines for high-performance query execution.
