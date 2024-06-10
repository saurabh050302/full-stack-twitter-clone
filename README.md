# Twitter Clone

This project is a clone of the popular social media platform Twitter. It is built using the MERN stack (MongoDB, Express.js, React.js, and Node.js) along with various other libraries and technologies.

## Description

The Twitter Clone application allows users to create accounts, log in, create posts, follow/unfollow other users, view posts from accounts they follow, like/unlike posts, add comments to posts, and perform other actions similar to the real Twitter platform. Users can also upload profile and cover images, update their profile details, and change their passwords.

## Tech Stack

### Frontend

- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **DaisyUI**: A component library for Tailwind CSS.
- **react-icons**: A library that provides a collection of popular icons for React applications.
- **react-hot-toast**: A lightweight, customizable, and beautiful React toast library.
- **tanstack/react-query**: A powerful React library for managing server state with query caching, auto re-fetching, and more.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A popular NoSQL database for storing and retrieving data.
- **Cloudinary**: A cloud-based image and video management service for uploading and delivering media assets.
- **bcrypt**: A library for hashing passwords to store them securely.
- **jsonwebtoken**: A library for generating and verifying JSON Web Tokens (JWT) for authentication and authorization.

## Getting Started

Follow these steps to run the project locally:

1. Clone the repository:

```bash
https://github.com/saurabh050302/full-stack-twitter-clone.git
```

2. Navigate to the project directory:

```bash
cd full-stack-twitter-clone
```

3. Reset repo to proper commit:

```bash
git reset --hard a1af00b4352c705a87692f995de19baffdf5bfcc
```

4. Install the dependencies for the backend:

```bash
npm install
```

5. Install the dependencies for the frontend:

```bash
cd .\frontend\
npm install
```

6. Create a `.env` file in the `backend` directory and add the following environment variables:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

7. Start the backend server:

```bash
npm run dev
```

8. Start the frontend development server:

```bash
cd .\frontend\
npm run dev
```

The application should now be running locally at `http://localhost:3000`. Use Ctrl+Click to open the application in browser.

## Resources

- [Tutorial](https://www.youtube.com/watch?v=4GUVz2psWUg) by @burakorkmez
- [Git Repo](https://github.com/burakorkmez/twitter-clone) by @burakorkmez
  
- [DaisyUI Documentation](https://daisyui.com/docs/install/)
- [tanstack/react-query Documentation](https://tanstack.com/query/v4/docs/overview)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
