# Mango Mania — Backend API

Express + MongoDB REST API for the Mango Mania ecommerce store, based in Multan, Pakistan.

## Stack

- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (access + refresh tokens)
- **Payments**: JazzCash, EasyPaisa, Stripe, COD
- **File Uploads**: Cloudinary + Sharp (image optimization)
- **Email**: Nodemailer (Gmail)
- **SMS/WhatsApp**: Twilio

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Edit `.env` and fill in your actual credentials:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for access tokens |
| `JWT_REFRESH_SECRET` | Long random string for refresh tokens |
| `CLOUDINARY_*` | Cloudinary account credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `JAZZCASH_*` | JazzCash merchant credentials |
| `EASYPAISA_*` | EasyPaisa store credentials |
| `TWILIO_*` | Twilio account SID, auth token, phone |
| `EMAIL_USER` | Gmail address for transactional emails |
| `EMAIL_PASS` | Gmail app password (not your account password) |
| `CLIENT_URL` | Frontend URL (e.g. http://localhost:5173) |

### 3. Seed the database

```bash
npm run seed
```

This creates:
- 4 categories (Mangoes, Dairy, Halwa, Desi Items)
- 19 products with images, variants, and pricing
- 3 coupons (MANGO20, FREESHIP, WELCOME10)
- 1 admin user + 5 sample customers
- 5 sample orders in various statuses

**Admin credentials:** `admin@mangomania.pk` / `admin123`

### 4. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Health Check
```
GET /api/health
```

### Auth — /api/auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /register | — | Register new user |
| POST | /login | — | Login |
| POST | /logout | — | Logout |
| POST | /refresh-token | — | Rotate JWT tokens |
| GET | /me | User | Get current user |
| PUT | /update-profile | User | Update name/phone/addresses |
| PUT | /change-password | User | Change password |
| POST | /forgot-password | — | Send OTP to email |
| POST | /reset-password | — | Reset with OTP |
| POST | /send-otp | — | Send OTP (email verification) |
| POST | /verify-otp | — | Verify OTP |

### Products — /api/products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | — | List all products (search, filter, sort, paginate) |
| GET | /featured | — | Featured products |
| GET | /category/:slug | — | Products by category |
| GET | /:slug | — | Single product by slug |
| POST | / | Admin | Create product |
| PUT | /:id | Admin | Update product |
| DELETE | /:id | Admin | Soft-delete product |

**Query params for GET /:** `search`, `minPrice`, `maxPrice`, `inStock=true`, `sort`, `page`, `limit`, `category`

### Cart — /api/cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | User | Get cart |
| POST | /add | User | Add item to cart |
| PUT | /update | User | Update item quantity |
| DELETE | /remove/:productId | User | Remove item |
| DELETE | /clear | User | Clear cart |

### Orders — /api/orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | / | User | Place order |
| GET | /my-orders | User | My order history |
| GET | /:id | User/Admin | Order detail |
| PUT | /:id/cancel | User | Cancel order |
| GET | / | Admin | All orders |
| PUT | /:id/status | Admin | Update order status |
| PUT | /:id/rider | Admin | Assign rider |

### Payments — /api/payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /jazzcash | User | Initiate JazzCash payment |
| POST | /easypaisa | User | Initiate EasyPaisa payment |
| POST | /stripe | User | Create Stripe PaymentIntent |
| POST | /verify | User | Verify payment status |
| POST | /stripe/webhook | — | Stripe webhook handler |

### Reviews — /api/reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /:productId | User | Submit review |
| GET | /:productId | — | Get approved reviews |
| GET | /pending | Admin | Pending reviews |
| PUT | /:id/approve | Admin | Approve review |
| DELETE | /:id | Admin | Delete review |

### Coupons — /api/coupons
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /validate | User | Validate coupon code |
| GET | / | Admin | List all coupons |
| POST | / | Admin | Create coupon |
| PUT | /:id | Admin | Update coupon |
| DELETE | /:id | Admin | Delete coupon |

### Admin — /api/admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /dashboard | Admin | Stats + top products + recent orders |
| GET | /analytics | Admin | Revenue over time + by category |
| GET | /users | Admin | List customers |
| PUT | /users/:id/block | Admin | Block/unblock user |

### Upload — /api/upload
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /image | Admin | Upload single image |
| POST | /images | Admin | Upload multiple images (max 10) |

---

## Coupon Codes (seeded)

| Code | Type | Value | Min Order |
|---|---|---|---|
| MANGO20 | Percent | 20% off | Rs. 1,000 |
| FREESHIP | Flat | Rs. 200 off | Rs. 500 |
| WELCOME10 | Percent | 10% off | None |

## Delivery Logic

- Orders Rs. 3,000 and above — **free delivery**
- Orders below Rs. 3,000 — **Rs. 200 delivery charge**

## Order Status Flow

`pending` → `confirmed` → `packed` → `dispatched` → `delivered`

Can be cancelled at `pending` or `confirmed` stage. Stock is restored on cancellation.

## Notes

- JazzCash uses sandbox URL by default. Switch to live URL in production.
- Stripe webhook requires raw body — handled before `express.json()` middleware.
- Images are resized to max 800px width and compressed to 85% JPEG quality before uploading to Cloudinary.
- Rate limiting is applied to auth endpoints (10 requests per 15 minutes).
