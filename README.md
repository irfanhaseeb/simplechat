# SimpleChat
A simple chat app made with MongoDB, React, Express, and Node.

## Usage
.env file
```shell
MONGODB_URI=<...>
PORT=<...>
JWT_SECRET=<...>
NODE_ENV=<development | production>
CLOUDINARY_CLOUD_NAME=<...>
CLOUDINARY_API_KEY=<...>
CLOUDINARY_API_SECRET=<...>
```


## Learnings

### Passwords
- Never store plaintext passwords in databases. Hash before storing.
- To prevent the use of rainbow tables, use a random salt before hashing as well.
- Use a slow hash function (bcrypt) which is designed to be computationally intensive. Don't use SHA-256 or
any fast hashing functions.

### Session Management
- JWTs are stateless (no server storage) and stored completely on client-side. Only use when stateless authentication is necessary (microservices or APIs).
- Session storage on server (ie Redis), session ID passed to client.
- Use secure cookie settings (HttpOnly, Secure, SameSite).
- Rotate session id after login.
- Be aware of CSRF and XSS. (CSRF tokens).

### React
- React context should be used only with data that doesn't change a lot. Static states, etc.
    - Causes many unrelated components to re-render
    - With zustand, only components subscribed to the global store re-render.
- In development (React's strict mode), every useEffect runs twice

### Socket.io
- Need to add socket server on top of the REST API for realtime communication.
    - Socket.io and Socket.io-client are both needed.