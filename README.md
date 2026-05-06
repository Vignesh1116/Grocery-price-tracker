# Smart Price Tracker 🛒

A production-ready crowdsourced price tracking system.

## ✨ Features
- **Add Product Entries**: Contribute prices from your local shops.
- **Smart Search**: Find products and compare prices instantly.
- **Price Comparison**: Identify the cheapest options and view average market prices.
- **Shop Details**: View location and contact information for shops.
- **Redis Caching**: Optimized search performance.
- **Duplicate Detection**: Prevents identical data entry.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React.
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Redis.
- **Database**: PostgreSQL.
- **DevOps**: Docker, Docker Compose.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed.

### Installation & Run
1. Clone the repository.
2. Run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs

## 📁 Project Structure
- `backend/`: FastAPI application, models, and logic.
- `frontend/`: React application with Tailwind CSS.
- `docker-compose.yml`: Orchestration for all services.

## 📝 API Endpoints
- `POST /api/products`: Create a new price entry.
- `GET /api/products/search?name={name}`: Search and compare prices.
