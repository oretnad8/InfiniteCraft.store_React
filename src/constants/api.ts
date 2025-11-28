
export const BASE_URLS = {
  AUTH: "http://fotomarwmsdb.ddns.net:8081/auth",
  USER: "http://fotomarwmsdb.ddns.net:8082/users",
  PRODUCT: "http://fotomarwmsdb.ddns.net:8083/products",
  CART: "http://fotomarwmsdb.ddns.net:8084/cart",
};

export const ENDPOINTS = {
  LOGIN: `${BASE_URLS.AUTH}/login`,
  REGISTER: `${BASE_URLS.AUTH}/register`,
  VALIDATE_TOKEN: `${BASE_URLS.AUTH}/validate`,
  GET_PRODUCTS: BASE_URLS.PRODUCT,
  ADD_PRODUCT: BASE_URLS.PRODUCT,
  UPLOAD_IMAGE: `${BASE_URLS.PRODUCT}/images`,
  GET_USER_CART: (userId: number) => `${BASE_URLS.CART}/${userId}`,
  CLEAR_CART: (userId: number) => `${BASE_URLS.CART}/${userId}/clear`,
  ADD_TO_CART: (userId: number) => `${BASE_URLS.CART}/${userId}/add`,
  CHECKOUT: (userId: number) => `${BASE_URLS.CART}/${userId}/checkout`,
  GET_USER_ORDERS: (userId: number) => `${BASE_URLS.CART}/orders/${userId}`,
  GET_ALL_ORDERS: `${BASE_URLS.CART}/orders`,
};
