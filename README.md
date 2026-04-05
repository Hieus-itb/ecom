# E-commerce Full-Stack Application

## 📋 Tổng quan dự án
Hệ thống thương mại điện tử hoàn chỉnh với frontend React.js và backend Node.js, bao gồm quản lý sản phẩm, đơn hàng, người dùng và tin tức.

## 🏗️ Kiến trúc hệ thống

```
ecom/
├── fe-ecomerse-raw/          # Frontend React Application
├── api-ecomerse-raw/         # Backend Node.js API
└── README.md                 # Tài liệu chính
```

## 🚀 Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool & Dev server
- **SCSS** - CSS Preprocessor
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger** - API documentation

## 📁 Cấu trúc dự án

### Frontend (`fe-ecomerse-raw/`)
```
fe-ecomerse-raw/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Header/          # Navigation & header
│   │   ├── Footer/          # Footer component
│   │   ├── Layout/          # Main layout
│   │   └── SafeImage/       # Image handling
│   ├── pages/               # Page components
│   │   ├── News/            # News & articles
│   │   ├── Contacts/        # Contact page
│   │   ├── UserSettings/    # User account settings
│   │   ├── AboutUs/         # About page
│   │   ├── OurShop/         # Product catalog
│   │   ├── Cart/            # Shopping cart
│   │   ├── Checkout/        # Checkout process
│   │   └── Orders/          # Order management
│   ├── apis/                # API services
│   │   ├── axiosClient.js   # HTTP client config
│   │   ├── newsService.js   # News API
│   │   ├── userService.js   # User API
│   │   └── settingsService.js # Settings API
│   ├── utils/               # Utility functions
│   │   ├── imageUtils.js    # Image handling
│   │   └── errorHandler.js  # Error management
│   └── routers/             # Route configuration
│       └── routers.js       # Main routes
├── public/                  # Static assets
└── package.json
```

### Backend (`api-ecomerse-raw/`)
```
api-ecomerse-raw/
├── models/                  # Database models
│   ├── User.js             # User model
│   ├── Setting.js          # Settings model
│   └── Base.js             # Base schema
├── controllers/            # Business logic
│   ├── user.js             # User controller
│   └── setting.js          # Settings controller
├── routers/                # API routes
│   ├── user.js             # User routes
│   └── setting.js          # Settings routes
├── middleware/             # Middleware functions
│   └── middleware.js       # Auth middleware
├── docs/                   # Documentation
└── package.json
```

## 🛠️ Cài đặt và chạy

### Prerequisites
- Node.js 18+
- MongoDB
- npm hoặc yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd ecom
```

### 2. Cài đặt Frontend
```bash
cd fe-ecomerse-raw
npm install
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

### 3. Cài đặt Backend
```bash
cd api-ecomerse-raw
npm install
npm start
```
Backend sẽ chạy tại: `http://localhost:3000`

### 4. Cấu hình Database
```bash
# Khởi động MongoDB
mongod

# Hoặc sử dụng MongoDB Atlas
# Cập nhật MONGODB_URI trong .env
```

## 🌐 URLs chính

### Frontend
- **Trang chủ**: `http://localhost:5173/`
- **Tin tức**: `http://localhost:5173/news`
- **Liên hệ**: `http://localhost:5173/contacts`
- **Cài đặt**: `http://localhost:5173/user-settings`
- **Cửa hàng**: `http://localhost:5173/shop`

### Backend API
- **API Base**: `http://localhost:3000/api/v1`
- **Swagger Docs**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/`

## 📊 API Endpoints

### Authentication
```
POST /api/v1/auth/register    # Đăng ký
POST /api/v1/auth/login       # Đăng nhập
```

### Users
```
GET  /api/v1/user/profile     # Lấy profile
PUT  /api/v1/user/profile     # Cập nhật profile
PUT  /api/v1/user/password    # Đổi mật khẩu
POST /api/v1/user/avatar      # Upload avatar
```

### Settings
```
GET /api/v1/settings           # Lấy cài đặt
PUT /api/v1/settings         # Cập nhật cài đặt
```

## 🎯 Tính năng chính

### Frontend Features
- ✅ **Responsive Design** - Hoạt động trên mọi thiết bị
- ✅ **Modern UI/UX** - Giao diện hiện đại, chuyên nghiệp
- ✅ **News System** - Hệ thống tin tức với HTML content
- ✅ **Contact Page** - Trang liên hệ với form và thông tin
- ✅ **User Settings** - Cài đặt tài khoản người dùng
- ✅ **Image Handling** - Xử lý ảnh an toàn với fallback
- ✅ **Error Handling** - Xử lý lỗi graceful
- ✅ **Loading States** - Trạng thái loading cho UX tốt

### Backend Features
- ✅ **RESTful API** - API chuẩn REST
- ✅ **JWT Authentication** - Xác thực bảo mật
- ✅ **Database Models** - Models MongoDB với Mongoose
- ✅ **Error Handling** - Xử lý lỗi toàn diện
- ✅ **API Documentation** - Tài liệu Swagger
- ✅ **Security** - Bảo mật password và validation

## 🔧 Development

### Scripts
```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build

# Backend
npm start            # Production server
npm run dev          # Development server
```

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/ecom
JWT_SECRET=your-secret-key
PORT=3000

# Frontend (Vite)
VITE_API_URL=http://localhost:3000/api/v1
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Features
- Touch-friendly interfaces
- Mobile navigation
- Optimized images
- Fast loading
- Offline support

## 🔒 Security

### Frontend
- Input validation
- XSS prevention
- Safe image handling
- Error boundary

### Backend
- JWT authentication
- Password hashing
- Input sanitization
- CORS configuration
- Rate limiting

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd fe-ecomerse-raw
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd api-ecomerse-raw
# Configure environment variables
# Deploy to platform
```

## 📚 Documentation

### Folder Documentation
- **`fe-ecomerse-raw/README.md`** - Frontend overview
- **`api-ecomerse-raw/README.md`** - Backend overview
- **`fe-ecomerse-raw/src/components/README.md`** - Components guide
- **`fe-ecomerse-raw/src/pages/README.md`** - Pages guide
- **`fe-ecomerse-raw/src/apis/README.md`** - API services guide
- **`fe-ecomerse-raw/src/utils/README.md`** - Utilities guide
- **`fe-ecomerse-raw/src/routers/README.md`** - Routing guide
- **`api-ecomerse-raw/models/README.md`** - Database models
- **`api-ecomerse-raw/controllers/README.md`** - Controllers guide

### API Documentation
- Swagger UI: `http://localhost:3000/api-docs`
- Interactive API testing
- Request/Response examples
- Authentication guide

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Create Pull Request

### Code Standards
- ESLint configuration
- Prettier formatting
- Component-based architecture
- Responsive design
- Error handling

**Happy Coding! 🚀**
