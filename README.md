# ePharmacy Backend Microservices

This backend consists of multiple microservices built using **Node.js**, **Express**, and **MongoDB** for an ePharmacy application. Each microservice is independently deployable and registered using **Consul** for service discovery.

---

## Microservices Implemented

- **User Management Service**: Handles user registration, login, profile, and JWT-based authentication.
- **Medicine Management Service**: Manages medicine listings, categories, discounts, and stock.
- **Cart Management Service**: Handles cart operations like add, update, and fetch.
- **Order Management Service**: Places and retrieves user orders.
- **Payment Management Service**: Manages payments and card details.

---

## Common Features

- JWT-based authentication (optional per service).
- MongoDB for data storage.
- Logger middleware.
- Swagger API documentation available individually per service.

---

## Running the Project

Each microservice is a separate Node.js app. Use the following steps to run them:

```bash
# For each microservice
cd user-service
npm install
npm start

cd medicine-service
npm install
npm start

cd cart-service
npm install
npm start

cd order-service
npm install
npm start

cd payment-service
npm install
npm start
```

---

## Running Consul Locally (Without Docker)

Download and install Consul from the official website: https://developer.hashicorp.com/consul/downloads

To run Consul agent locally:

```bash
consul agent -dev
```

Visit Consul UI at:

```text
http://localhost:8500
```

Make sure your microservices register with Consul on startup. Each service has its own registration configuration.

---

## Notes

- Update environment variables as needed in each microservice.
- Swagger docs can be accessed at `/api-docs` in each service.

---

## Author

- Built and maintained by your ePharmacy Backend Developer.
