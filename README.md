# Home Library Service

**Node.js 2025 Q2 REST Service project**

## 📚 Description

This is a RESTful web service built with **NestJS** that allows users to manage their home music library. 

# Home Library Service

## Description

The Home Library Service is a music library management system that allows you to manage your music collection. You can work with artists, albums, tracks, and create your favorites list.

## Running the application

1. Clone this repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Check a `.env` file in the root directory with the following environment variables:
```env
PORT=4000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Environment variables description:
- PORT: The port on which the application will run (default: 4000)
- POSTGRES_HOST: The hostname of the Postgres database (default: postgres)
- POSTGRES_PORT: The port number of the Postgres database (default: 5432)
- POSTGRES_USER: The username for accessing the Postgres database
- POSTGRES_PASSWORD: The password for accessing the Postgres database

Note: The database name will be automatically set to the same value as POSTGRES_USER.

3. Build and start the application:
```bash
docker compose build
docker compose up
```

By default, the application will run on port 4000, in development mode, so it will automatically restart when you make changes to the code in the `src` directory.

4. To stop the application:
```bash
docker compose down
```

Users can manage entities such as:

- Users
- Artists
- Albums
- Tracks
- Favorites

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
