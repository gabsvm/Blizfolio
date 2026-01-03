# API Contract Specification

This document describes the data contracts used by the frontend to communicate with the mock backend services.

## Authentication (`auth.service`)

### POST `/login`
**Request:**
```json
{ "email": "string", "password": "string" }
```
**Response:**
```json
{
  "token": "jwt_string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "admin|user"
  }
}
```

## Company (`company.service`)

### GET `/company`
**Response:** `Company` object (see types.ts).

### PUT `/company`
**Request:** Partial `Company` object.
**Response:** Updated `Company` object.

## Folders (`folders.service`)

### GET `/folders`
**Response:** Array of `Folder` objects.

### POST `/folders`
**Request:** `{ name, description, category, tags, status }`
**Response:** Created `Folder`.

## Products (`products.service`)

### GET `/folders/:id/products`
**Response:** Array of `Product` objects belonging to the folder.

### POST `/products`
**Request:** `Product` creation DTO.
**Response:** Created `Product`.
