# FE Base Project

Dự án frontend base với Vite, React, Ant Design, và Tailwind CSS v3.

## Tính năng

- ✅ Đăng nhập / Đăng ký
- ✅ Bảo vệ route (Protected Route)
- ✅ Trang Home hiển thị danh sách sản phẩm
- ✅ Tự động redirect về trang login nếu chưa đăng nhập

## Công nghệ sử dụng

- **Vite** - Build tool nhanh chóng
- **React 18** - UI library
- **TypeScript** - Type safety
- **Ant Design** - UI component library
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Router v6** - Routing
- **Axios** - HTTP client cho API calls

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── components/       # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── services/         # API services (Clean Architecture)
│   ├── api.ts        # Axios instance & interceptors
│   ├── authService.ts    # Authentication API calls
│   └── productService.ts # Product API calls
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Home.tsx
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Configuration

### Environment Variables

Tạo file `.env` trong thư mục root:

```env
VITE_API_URL=http://localhost:3000/api
```

### Service Layer (Clean Architecture)

API calls được tách riêng vào service layer:

- **`services/api.ts`**: Axios instance với interceptors
  - Tự động thêm token vào header
  - Xử lý lỗi 401 (unauthorized) - tự động logout
  - Base URL từ environment variable

- **`services/authService.ts`**: Authentication API
  - `login()` - Đăng nhập
  - `register()` - Đăng ký
  - `getCurrentUser()` - Lấy thông tin user
  - `logout()` - Đăng xuất

- **`services/productService.ts`**: Product API
  - `getProducts()` - Lấy danh sách sản phẩm
  - `getProductById()` - Lấy chi tiết sản phẩm
  - `createProduct()` - Tạo sản phẩm (admin)
  - `updateProduct()` - Cập nhật sản phẩm (admin)
  - `deleteProduct()` - Xóa sản phẩm (admin)

### Authentication Flow

1. User đăng nhập/đăng ký → `authService` gọi API
2. Token và user info được lưu vào localStorage
3. Token tự động được thêm vào header qua axios interceptor
4. Nếu token hết hạn (401), tự động logout và redirect về login

## Protected Routes

Trang `/home` được bảo vệ bởi `ProtectedRoute` component. Nếu người dùng chưa đăng nhập, sẽ tự động redirect về `/login`.

## Customization

- Thay đổi theme Ant Design trong `main.tsx` (ConfigProvider)
- Customize Tailwind trong `tailwind.config.js`
- Thêm các route mới trong `App.tsx`

