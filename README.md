### 進階語法介紹

## 

1. 主線任務說明
2. 環境與套件
3. React Hook Form 表單驗證
4. Loading 狀態管理
5. 購物車功能實作
6. 登入驗證
7. 補充

## 1. 主線任務說明

- 延續上一週的路由設置，新增登入路由 /login，並使用 [React Hook Form](https://react-hook-form.com/) 完成登入表單驗證功能，登入成功後轉至 /admin/product 畫面
- 使用 [React Hook Form](https://react-hook-form.com/) 完成前台結帳付款表單驗證功能
- 使用 [react-loader-spinner 套件](https://www.npmjs.com/package/react-loader-spinner) 製作 loading 效果
- 串接前台 API 完成購物車功能

注意：

- 新增相同產品到購物車時需累加項目
- 送出訂單後，購物車需要清除原本項目
- 購物車無產品時不建議發出結帳請求

**表單驗證，驗證內容包含：**

1. 登入驗證：

- 帳號：必填 / input type 為 email
- 密碼：必填 / input type 為 password

2. 前台結帳付款表單驗證：

- 姓名：必填
- Email：必填 / 需要符合格式 / input type 為 email
- 電話：必填 / 超過 8 碼 / input type 為 tel
- 地址：必填
- 留言：非必填

**課程 API 相關網址：**

- [註冊連結、測試管理平台](https://ec-course-api.hexschool.io/)
- [API 文件](https://hexschool.github.io/ec-courses-api-swaggerDoc/)

前台購物流程 API

- [產品列表](https://hexschool.github.io/ec-courses-api-swaggerDoc//#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E7%94%A2%E5%93%81%20(Products)/get_v2_api__api_path__products)
- [單一產品細節](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E7%94%A2%E5%93%81%20(Products)/get_v2_api__api_path__product__id_)
- [加入購物車](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E8%B3%BC%E7%89%A9%E8%BB%8A%20(Cart)/post_v2_api__api_path__cart)
- [購物車列表](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E8%B3%BC%E7%89%A9%E8%BB%8A%20(Cart)/get_v2_api__api_path__cart)
- 刪除購物車項目（[單一](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E8%B3%BC%E7%89%A9%E8%BB%8A%20(Cart)/delete_v2_api__api_path__cart__id_)、[全部](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E8%B3%BC%E7%89%A9%E8%BB%8A%20(Cart)/delete_v2_api__api_path__carts)）
- [調整購物車產品數量](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E8%B3%BC%E7%89%A9%E8%BB%8A%20(Cart)/put_v2_api__api_path__cart__id_)
- [結帳付款](https://hexschool.github.io/ec-courses-api-swaggerDoc/#/%E5%AE%A2%E6%88%B6%E8%B3%BC%E7%89%A9%20-%20%E7%B5%90%E5%B8%B3%20(Order)/post_v2_api__api_path__order)

頁面模板

- [前台購物流程](https://codepen.io/hexschool/pen/WbeOeJe)

作業須符合此[作業規範](https://hackmd.io/XbKPYiE9Ru6G0sAfB5PBJw)

每週主線任務範例：https://github.com/hexschool/react-training-chapter-2025

⭐️ 範例檔案中的 API Path 請換成自己的唷！

### 專案結構

```
src/
├── layout/              # 版面配置
│   └── FrontendLayout.jsx
├── views/              # 頁面元件
│   └── front/          # 前台頁面
│       ├── Checkout.jsx
│       └── Login.jsx
├── App.jsx             # 主應用程式
├── router.jsx          # 路由配置
└── main.jsx           # 應用程式入口
```

## 2. 環境設定與套件安裝

### 安裝必要套件

- react-hook-form：表單狀態與驗證
- react-loader-spinner：呈現 loading UI

```bash
npm install react-hook-form react-loader-spinner
```

### CSS 樣式引入

已引入 [Font Awesome](https://cdnjs.com/libraries/font-awesome)

```html
<!-- index.html -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

## 3. React Hook Form 表單驗證

### 核心概念

[React Hook Form](https://react-hook-form.com/get-started) 提供高效能的表單處理方案：

- **更少的重新渲染**：使用 uncontrolled components
- **內建驗證**：支援多種驗證規則
- **簡潔的 API**：減少樣板程式碼
```jsx
// 驗證流程圖
用戶提交表單
    ↓
handleSubmit 攔截
    ↓
檢查所有 register 欄位
    ↓
有錯誤？ → 顯示錯誤訊息，不執行 onSubmit
    ↓ 無錯誤
執行 onSubmit 函式
    ↓
發送 API 請求
    ↓
重置表單 (reset)
```

### 基本使用方式

```jsx
import { useForm } from "react-hook-form";

function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("表單資料:", data);
    // 處理表單提交
    reset(); // 重置表單
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* 表單欄位 */}</form>;
}

```
### **register**

```jsx
<input
  id="name"
  type="text"
  className="form-control"
  placeholder="請輸入姓名"
  {...register("name", { required: "請輸入收件人姓名。" })}
/>
```

### **errors 結構**

```jsx
{
  email: {
    type: "pattern",
    message: "Email 格式不正確"
  }
}
```

- errors 來自 `register` 規則
- **不是自己產生的**
- render 時有錯才顯示

### **mode 差異**

https://react-hook-form.com/docs/useform#mode

```jsx
useForm({ mode:"onSubmit"});// 預設
useForm({ mode:"onChange"});// 即時驗證
useForm({ mode:"onBlur"});// 離開欄位才驗
```

### 表單驗證實作

- 用 `register` 宣告驗證規則
- 用 `errors` 顯示錯誤訊息
- 表單送出時由 `onSubmit` 統一控管
- 結帳模板
    
    ```jsx
    {/* 結帳頁面 */}
    <div className="my-5 row justify-content-center">
      <form className="col-md-6">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="請輸入 Email"
            defaultValue="test@gamil.com"
          />
        </div>
    
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            收件人姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            placeholder="請輸入姓名"
            defaultValue="小明"
          />
        </div>
    
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">
            收件人電話
          </label>
          <input
            id="tel"
            name="tel"
            type="tel"
            className="form-control"
            placeholder="請輸入電話"
            defaultValue="0912345678"
          />
        </div>
    
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            收件人地址
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="form-control"
            placeholder="請輸入地址"
            defaultValue="臺北市信義區信義路5段7號"
          />
        </div>
    
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            留言
          </label>
          <textarea
            id="message"
            className="form-control"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-danger">
            送出訂單
          </button>
        </div>
      </form>
    </div>
    ```
    - 表單資料
    
    ```jsx
    <form onSubmit={handleSubmit(onSubmit)} className="col-md-6">
      {/* 姓名欄位 */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          收件人姓名
        </label>
        <input
          id="name"
          type="text"
          className="form-control"
          placeholder="請輸入姓名"
          {...register("name", { required: "請輸入收件人姓名。" })}
        />
        {errors.name && (
          <p className="text-danger">{errors.name.message}</p>
        )}
      </div>
    
      {/* Email 欄位 */}
    
      {/* 電話欄位 */}
    
      {/* 地址欄位 */}
    
      {/* 留言欄位 */}
    
      {/* 提交按鈕 */}
      <div className="text-end">
        <button type="submit" className="btn btn-danger">
          送出訂單
        </button>
      </div>
    </form>
    ```
```jsx

```

**Email**

- 必填
- 格式驗證（pattern）
- input type 使用 `email`
- 寬鬆規則：`/^\S+@\S+$/i`
    - `^\S+`：Email 開頭必須是一個或多個非空白字元
    - `@\S+`：接著必須有一個 `@`，後面跟著一個或多個非空白字元
    - `$/i`：結尾必須是非空白字元，且正則表達式不區分大小寫
- 嚴格格式：`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
    - `^[a-zA-Z0-9._%+-]+`：Email 的本地部分（@ 前的部分），允許字母、數字、點、底線、百分比、加號和減號
    - `@[a-zA-Z0-9.-]+`：Email 的域名部分，允許字母、數字、點和連字號
    - `\.[a-zA-Z]{2,}$`：頂級域名部分，必須以點開頭，後面跟至少兩個字母

```jsx
register("email", {
  required: "請輸入 Email",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
});
```

**收件人姓名（name）**

- 必填驗證（required）
- 可依需求加上長度限制（minLength / maxLength）

```jsx
register("name", {
  required: "請輸入收件人姓名",
  minLength: { value: 2, message: "姓名至少 2 個字" },
});
```

**收件人電話（tel）**

- 必填
- 最少 8 碼
- 僅允許數字
- input type 使用 `tel`
- 進階可改為限定台灣手機格式（09xxxxxxxx）
```jsx
register("tel", {
  required: "請輸入收件人電話",
  minLength: { value: 8, message: "電話至少 8 碼" },
  pattern: {
    value: /^\d+$/,
    message: "電話僅能輸入數字",
  },
});
```

**收件人地址（address）**

- 必填驗證

```jsx
register("address", {
  required: "請輸入收件人地址",
});

```

**留言（message）**
- 非必填
- 不需設定驗證規則

```jsx
register("message");
```

- 送出訂單 `POST ${API_BASE}/api/${API_PATH}/order`
    
    ```jsx
    const onSubmit = async (data) => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/order`;
        await axios.post(url, { 
          data: { user: data, message: data.message } 
        });
        reset();
        getCart();
      } catch (error) {
        console.error(error);
      }
    };
    ```
    

## 4. React L**oader Spinner** 載入效果

### 安裝與基本使用

[react-loader-spinner](https://mhnpd.github.io/react-loader-spinner/)
```bash
npm install react-loader-spinner
```

```jsx
import { ThreeDots, Oval, Puff } from "react-loader-spinner";

// 基本用法
<ThreeDots
  height="80"
  width="80"
  radius="9"
  color="#4fa94d"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClassName=""
  visible={true}
/>;

// 常用的載入動畫類型
// - ThreeDots: 三個點跳動
// - Oval: 橢圓旋轉
// - Puff: 煙霧效果
// - Circles: 圓圈載入
// - TailSpin: 尾巴旋轉
```

### 為什麼不用 isLoading？

- isLoading 會影響整個畫面
- 使用者體驗不佳

### 狀態管理設計

- loading + 行為對象 + Id
- 精準控制單一按鈕或區塊
- 產品列表模板
    
    ```jsx
    {/* 產品列表 */}
    <table className="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ width: "200px" }}>
            <div
              style={{
                height: "100px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url()`,
              }}
            ></div>
          </td>
          <td></td>
          <td>
            <del className="h6">原價：</del>
            <div className="h5">特價：</div>
          </td>
          <td>
            <div className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-secondary">
                <i className="fas fa-spinner fa-pulse"></i>
                查看更多
              </button>
              <button type="button" className="btn btn-outline-danger">
                <i className="fas fa-spinner fa-pulse"></i>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    ```
    

```jsx
function App() {
  // 載入狀態
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  ...
}
```

畫面

```jsx
{loadingCartId === product.id && (
  <div className="text-center">
		<RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  </div>
)}
```

## 5. 購物車功能實作

購物車並不是前端自行合併資料，而是由後端 API 負責處理

### **加入購物車時流程**

前端流程如下：

1. 使用者點擊「加入購物車」
2. 前端送出 product_id 與 qty
3. 後端 API 會判斷：
    - 若商品已存在於購物車 → 累加數量
    - 若不存在 → 新增一筆項目
4. 前端在 API 成功後：
    - 重新取得購物車列表
    - 不自行修改 cart state

### API 功能函式

- 取得購物車列表( 第五週） `GET ${API_BASE}/api/${API_PATH}/cart`
    
    ```jsx
    // 取得購物車列表
    const getCart = async () => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/cart`;
        const response = await axios.get(url);
        setCart(response.data.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    ```
    
- 加入購物車 ( 第五週，加上 **setLoadingCartId**）`POST ${API_BASE}/api/${API_PATH}/cart`
    
    ```jsx
    // 加入購物車
    const addCart = async (id, num) => {
      setLoadingCartId(id);
      const data = {
        product_id: id,
        qty: num,
      };
      try {
        const url = `${API_BASE}/api/${API_PATH}/cart`;
        await axios.post(url, { data });
        getCart();
      } catch (error) {
        console.log(error.response.data);
      } finally {
        setLoadingCartId(null);
        productModalRef.current.hide();
      }
    };
    ```
    
- 清除單一筆購物車( 第五週） `DELETE ${API_BASE}/api/${API_PATH}/cart/${id}`
    
    ```jsx
    // 清除單一筆購物車
    const deleteCart = async (id) => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
        await axios.delete(url);
        getCart();
      } catch (error) {
        console.log(error.response.data);
      }
    };
    ```
    
- 清空購物車 `DELETE ${API_BASE}/api/${API_PATH}/carts`
    
    ```jsx
    // 清空購物車
    const deleteCartAll = async () => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/carts`;
        await axios.delete(url);
        getCart();
      } catch (error) {
        console.log(error.response.data);
      }
    };
    ```
    
- 更新商品數量( 第五週） `PUT ${API_BASE}/api/${API_PATH}/cart/${cartId}`
    
    ```jsx
    // 更新商品數量
    const updateCart = async (cartId, productId, qty = 1) => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;
    
        const data = {
          product_id: productId,
          qty,
        };
        await axios.put(url, { data });
        getCart();
      } catch (error) {
        console.log(error.response.data);
      }
    };
    ```
    
- 取得單一產品( 第五週，加上 **setLoadingProductId**） `GET ${API_BASE}/api/${API_PATH}/product/${id}`
    
    ```jsx
    // 取得單一產品
    const getProduct = async (id) => {
      setLoadingProductId(id);
      try {
        const url = `${API_BASE}/api/${API_PATH}/product/${id}`;
        const response = await axios.get(url);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response.data);
      } finally {
        setLoadingProductId(null);
      }
    };
    ```
    

### 購物車列表元件

- 按鈕 disabled 樣式
- 加上 RotatingLines 效果

```jsx
<button
  type="button"
  className="btn btn-outline-danger"
  onClick={() => addCart(product.id, 1)}
  disabled={loadingCartId === product.id}
>
  {loadingCartId === product.id ? (
    <RotatingLines
      strokeColor="#fff"
      strokeWidth="5"
      width="20"
      visible={true}
    />
  ) : (
    "加入購物車"
  )}
</button>
```
### 產品詳情 Modal

- 按鈕 disabled 樣式
- 加上 RotatingLines 效果
- 產品詳情 Modal 模板
    
    ```jsx
    <div className="modal" id="productModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">產品名稱：</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <img className="w-100" src={null} />
            <p className="mt-3">產品內容：</p>
            <p>產品描述：</p>
            <p>
              價錢：<del>原價 $</del>，特價：$
            </p>
            <div className="d-flex align-items-center">
              <label style={{ width: "150px" }}>購買數量：</label>
              <button
                className="btn btn-danger"
                type="button"
                id="button-addon1"
                aria-label="Decrease quantity"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                className="form-control"
                type="number"
                min="1"
                max="10"
              />
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                aria-label="Decrease quantity"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    ```
- bootstrap Modal（同第三週）
    
    ```jsx
    import * as bootstrap from "bootstrap";
    
    // useRef 建立對 DOM 元素的參照
    const productModalRef = useRef(null);
    
    // 在 useEffect 中初始化
    useEffect(() => {
      productModalRef.current = new bootstrap.Modal("#productModal");
      
      // Modal 關閉時移除焦點
      document
        .querySelector("#productModal")
        .addEventListener("hide.bs.modal", () => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        });
    }, []);
    
    // 使用 ref 控制 Modal
    const openModal = () => {
      productModalRef.current.show();
    };
    ```
    

```jsx
<button
  className="btn btn-outline-secondary"
  onClick={() => openModal(product.id)}
  disabled={loadingProductId === product.id}
>
  {loadingProductId === product.id ? (
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  ) : (
    "查看更多"
  )}
</button>
```

## 6. 登入驗證

### 路由設置

- `router.jsx` 增加 login 路由配置檔案
    
    ```jsx
    // src/router.jsx
    import { createHashRouter } from "react-router-dom";
    
    export const router = createHashRouter([
      {
        path: "/",
        element: <FrontendLayout />,
        children: [
          // (延續第五週)
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
    ]);
    ```
    
- `FrontendLayout.jsx`  增加 link
    
    ```jsx
    <Link className="h4 mt-5 mx-2" to="/login">
      登入頁面
    </Link>
    ```
    
- 載入 css （同第二週）
    
    ```jsx
    // App.jsx
    import "./assets/style.css";
    ```
    

```jsx
const {
  register,
  formState: { errors },
  handleSubmit,
} = useForm();

<form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
...
</form>
```

### 表單驗證

- 帳號：必填 / 需要符合 email 格式

```jsx
{...register("username", {
  required: "請輸入 Email",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
});
```

- 密碼：必填 / 超過 6 碼

```jsx
{...register("password", {
  required: "請輸入密碼",
  minLength: {
    value: 6,
    message: "密碼長度至少需 6 碼",
  },
})}
```

## 7. 補充

### 常見錯誤提醒

- 表單未通過驗證仍送出 API
- loading 狀態忘記在 finally 關閉
- cart 為空仍送出訂單
- 使用 index 當 key 導致畫面錯亂

### 表單驗證進階技巧

**自訂驗證規則**

- 驗證規則應該語意化
- 規則可以抽出來
- 重用與重構性

```jsx
// 自訂驗證規則
const phonePattern = /^09\\\\d{8}$/;
const taiwanPhoneValidation = {
  required: "請輸入手機號碼",
  pattern: {
    value: phonePattern,
    message: "請輸入正確的台灣手機號碼格式 (09xxxxxxxx)",
  },
};

// 使用方式
<input
  type="tel"
  className="form-control"
  {...register("tel", taiwanPhoneValidation)}
/>
```

**即時驗證**

- 沒有設定 `mode: "onChange"`，`isValid` 只會在 submit 後才變化
- `errors`：用來顯示錯誤訊息
- `isValid`：用來**控制流程**

```jsx
// 即時驗證
const {
  register,
  formState: { errors, isValid },
} = useForm({
  mode: "onChange", // 沒有這行 isValid 幾乎不會即時更新
});

// 使用方式
<button type="submit"
  className="btn btn-primary"
  disabled={!isValid}
>
  送出訂單
</button>
```