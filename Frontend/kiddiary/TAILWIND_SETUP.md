# Tailwind CSS Setup - Kiddiary Frontend

## ✅ Đã cài đặt thành công Tailwind CSS

### Các file đã được tạo/cập nhật:

1. **tailwind.config.js** - Cấu hình Tailwind CSS v3
2. **postcss.config.js** - Cấu hình PostCSS
3. **vite.config.js** - Cấu hình Vite (đã sửa)
4. **src/index.css** - Import Tailwind directives
5. **src/App.jsx** - Demo sử dụng Tailwind classes

### Dependencies đã cài đặt:
- `tailwindcss@^3.4.0` - Framework CSS utility-first (phiên bản ổn định)
- `postcss@^8.5.6` - CSS post-processor
- `autoprefixer@^10.4.21` - Tự động thêm vendor prefixes
- `vite@^5.4.0` - Build tool (tương thích với Node.js 20.18.3)
- `react-icons@^5.5.0` - Thư viện icon với nhiều bộ icon phổ biến

### Cấu hình Vite:

File `vite.config.js` đã được cấu hình đúng cách:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Lưu ý:** Không cần plugin Vite riêng cho Tailwind CSS v3. Tailwind sẽ được xử lý qua PostCSS.

### Cách sử dụng:

1. **Chạy development server:**
   ```bash
   npm run dev
   ```

2. **Truy cập ứng dụng:**
   - Mở browser tại `http://localhost:5174/`
   - Xem demo Tailwind CSS đã hoạt động

3. **Sử dụng Tailwind classes trong components:**
   ```jsx
   <div className="bg-blue-500 text-white p-4 rounded-lg">
     Hello Tailwind!
   </div>
   ```

### Ví dụ các class phổ biến:

- **Layout:** `flex`, `grid`, `block`, `hidden`
- **Spacing:** `p-4`, `m-2`, `px-6`, `py-3`
- **Colors:** `bg-blue-500`, `text-white`, `border-gray-300`
- **Typography:** `text-xl`, `font-bold`, `text-center`
- **Effects:** `shadow-lg`, `rounded-lg`, `hover:bg-blue-600`

### Sử dụng React Icons:

```jsx
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import { MdEmail, MdNotifications } from 'react-icons/md'
import { FaHeart, FaStar } from 'react-icons/fa'

function MyComponent() {
  return (
    <div>
      <FiHome className="text-2xl text-blue-500" />
      <MdEmail className="text-3xl text-red-500" />
      <FaHeart className="text-xl text-pink-500" />
    </div>
  )
}
```

**Các bộ icon có sẵn:**
- `react-icons/fi` - Feather Icons (nhẹ, đẹp)
- `react-icons/md` - Material Design Icons
- `react-icons/fa` - Font Awesome Icons
- `react-icons/ai` - Ant Design Icons
- `react-icons/bs` - Bootstrap Icons
- Và nhiều bộ khác...

### Tài liệu tham khảo:
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [React Icons Documentation](https://react-icons.github.io/react-icons/)
- [Feather Icons](https://feathericons.com/) - Xem tất cả icon có sẵn

### Lưu ý:
- Tailwind CSS đã được cấu hình để scan tất cả file `.js`, `.jsx`, `.ts`, `.tsx` trong thư mục `src/`
- Các class không sử dụng sẽ được loại bỏ trong quá trình build để tối ưu kích thước file CSS
