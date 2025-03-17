# USAGE.md

This document explains how to use the `useApi` hook and `localStorageService` in your Vite React TypeScript project. These utilities abstract API calls with `@tanstack/react-query` and `axios`, and provide a type-safe interface for `localStorage` operations.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Using `useApi` Hook](#using-useapi-hook)
   - [Setup](#setup)
   - [GET Request Example](#get-request-example)
   - [POST Request Example](#post-request-example)
   - [Authentication](#authentication)
3. [Using `localStorageService`](#using-localstorageservice)
   - [Setting a Value](#setting-a-value)
   - [Getting a Value](#getting-a-value)
   - [Removing a Value](#removing-a-value)
   - [Clearing Storage](#clearing-storage)
4. [API Endpoint Enums](#api-endpoint-enums)
5. [Tips](#tips)

---

## Prerequisites
- Install required dependencies:
  ```bash
  npm install @tanstack/react-query axios
  ```
- Ensure you have a `QueryClientProvider` set up in your app (typically in `main.tsx` or `App.tsx`):
  ```tsx
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

  const queryClient = new QueryClient();

  function App() {
    return (
      <QueryClientProvider client={queryClient}>
        {/* Your app components */}
      </QueryClientProvider>
    );
  }
  ```

---

## Using `useApi` Hook

The `useApi` hook abstracts API calls using `@tanstack/react-query` and `axios`. It supports both queries (GET) and mutations (POST, PUT, PATCH, DELETE) with optional authentication.

### Setup
- Import the hook and enums:
  ```tsx
  import { useApi } from "@/apis/useApi";
  import { ApiEndpoints, HttpMethod } from "@/apis/apis.enum";
  ```

### GET Request Example
Fetch data using a GET request:
```tsx
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function TodoList() {
  const query = useApi<Todo[]>(
    HttpMethod.GET,
    false, // No auth
    "todos", // Query key
    { url: ApiEndpoints.TODOS } // Endpoint config
  );

  if ("isPending" in query && query.isPending) return <p>Loading...</p>;
  if ("error" in query && query.error) return <p>Error: {query.error.message}</p>;

  return (
    <ul>
      {"data" in query && query.data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

### POST Request Example
Submit data using a POST request:
```tsx
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function CreateTodo() {
  const mutation = useApi<Todo>(
    HttpMethod.POST,
    false, // No auth
    "create-todo", // Mutation key
    {
      url: ApiEndpoints.TODOS,
      body: { title: "New Todo", userId: 1, completed: false },
    }
  );

  return (
    <div>
      <button
        onClick={() => "mutate" in mutation && mutation.mutate()}
        disabled={"isPending" in mutation && mutation.isPending}
      >
        {"isPending" in mutation && mutation.isPending ? "Submitting..." : "Create Todo"}
      </button>
      {"data" in mutation && mutation.data && (
        <p>Created: {mutation.data.title}</p>
      )}
    </div>
  );
}
```

### Authentication
To include an auth token from `localStorage`:
- Set the `auth` parameter to `true`.
- Ensure a token is stored using `localStorageService` (see below).
- The hook will automatically add an `Authorization: Bearer <token>` header.

Example:
```tsx
const query = useApi<Todo[]>(
  HttpMethod.GET,
  true, // With auth
  "todos",
  { url: ApiEndpoints.TODOS }
);
```

---

## Using `localStorageService`

The `localStorageService` provides a type-safe abstraction for `localStorage` operations.

### Setting a Value
Store a value (automatically serialized to JSON):
```tsx
import { localStorageService } from "@/apis/localStorage.service";

localStorageService.setItem("token", "my-auth-token");
localStorageService.setItem("user", { id: 1, name: "John" });
```

### Getting a Value
Retrieve a value (automatically parsed from JSON):
```tsx
import { localStorageService } from "@/apis/localStorage.service";

const token = localStorageService.getItem<string>("token"); // "my-auth-token" or null
const user = localStorageService.getItem<{ id: number; name: string }>("user"); // { id: 1, name: "John" } or null
```

- Returns `null` if the key doesn’t exist or parsing fails.
- Specify the type with generics for better type safety.

### Removing a Value
Delete a specific key:
```tsx
localStorageService.removeItem("token");
```

### Clearing Storage
Remove all items from `localStorage`:
```tsx
localStorageService.clear();
```

---

## API Endpoint Enums

Define your API endpoints in `apis.enum.ts`:
```tsx
export enum ApiEndpoints {
  TODOS = "https://jsonplaceholder.typicode.com/todos",
  LOGIN = "https://api.example.com/login",
  // Add more endpoints as needed
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}
```
- Use these in your `useApi` calls to keep endpoints consistent.

---

## Tips
- **Type Safety:** Always specify the generic type `<T>` in `useApi<T>` for better TypeScript support (e.g., `<Todo[]>` for an array of todos).
- **Error Handling:** Check `query.error` or `mutation.error` for API errors.
- **Query Keys:** Use unique keys (e.g., `"todos"`) to avoid cache collisions.
- **LocalStorage Limits:** Be mindful of the ~5-10MB limit in `localStorage`.
- **Testing:** Use a mock API like JSONPlaceholder (`https://jsonplaceholder.typicode.com`) for development.

---
