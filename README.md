# Home Library Service

**Node.js 2025 Q2 REST Service project**

## 📚 Description

This is a RESTful web service built with **NestJS** that allows users to manage their home music library. Users can manage entities such as:

- Users
- Artists
- Albums
- Tracks
- Favorites

The application supports full CRUD operations and provides endpoints to mark/unmark entities as favorites.

---

## 📦 Installation

1. **Clone the repository**

2. **Install dependencies**:

```bash
npm install
```

3. **Run the application**:

```bash
npm start
```

The server will start on `http://localhost:4000`

---

## 🧪 Scripts

- `npm start` — starts the application
- `npm run lint` — runs ESLint with auto-fix
- `npm test` — runs Jest tests once
- `npm run test:watch` — runs Jest tests in watch mode

---

## 🚦 API Endpoints

### 👤 Users (`/user`)

- `GET /user` — get all users
- `GET /user/:id` — get user by ID
- `POST /user` — create a user  
  **Body**:
  ```ts
  { login: string; password: string; }
  ```
- `PUT /user/:id` — update user password  
  **Body**:
  ```ts
  { oldPassword: string; newPassword: string; }
  ```
- `DELETE /user/:id` — delete user

### 🎤 Artists (`/artist`)

- `GET /artist`
- `GET /artist/:id`
- `POST /artist`  
  **Body**:
  ```ts
  { name: string; grammy: boolean; }
  ```
- `PUT /artist/:id`
- `DELETE /artist/:id`

### 💿 Albums (`/album`)

- `GET /album`
- `GET /album/:id`
- `POST /album`  
  **Body**:
  ```ts
  { name: string; year: number; artistId: string | null; }
  ```
- `PUT /album/:id`
- `DELETE /album/:id`

### 🎶 Tracks (`/track`)

- `GET /track`
- `GET /track/:id`
- `POST /track`  
  **Body**:
  ```ts
  {
    name: string;
    artistId: string | null;
    albumId: string | null;
    duration: number;
  }
  ```
- `PUT /track/:id`
- `DELETE /track/:id`

### ⭐ Favorites (`/favs`)

- `GET /favs` — get all favorites
- `POST /favs/track/:id` — add track to favorites
- `DELETE /favs/track/:id` — remove track from favorites
- `POST /favs/album/:id` — add album to favorites
- `DELETE /favs/album/:id` — remove album from favorites
- `POST /favs/artist/:id` — add artist to favorites
- `DELETE /favs/artist/:id` — remove artist from favorites

---

## 📐 Entity Interfaces

```ts
interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
```

---

## ✅ Validation and Status Codes

- All `:id` parameters must be valid UUID v4.
- Proper `400`, `403`, `404`, `422` and `201/200/204` status codes are returned according to the endpoint rules.

---
