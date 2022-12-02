import axios from "axios";
export const apiRoot = "https://api.olivbistro.ro";
export const websiteRoot = "https://www.olivbistro.ro";
const WcApiKey = "ck_3e7c8da8d2e14dd12f16728e59f2913e21be74aa";
const WcApiSecret = "cs_61a323188b907910d977f5af4317cf1250f55c6d";
const WpApiUser = "cezar.maftei@gmail.com";
const WpApiKey = "CWu8 buzP t5sf eit5 7cQx IAZ6";

const wpAjax = axios.create({
  baseURL: apiRoot,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  auth: {
    username: WpApiUser,
    password: WpApiKey,
  },
});

const wooAjax = axios.create({
  baseURL: apiRoot,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  auth: {
    username: WcApiKey,
    password: WcApiSecret,
  },
});

/**
 * Axios API calls
 */
export const websiteOptions = () => {
  return wpAjax.get(`/wp-json/olivbistro/v1/theme-options`);
};

export const pageData = () => {
  return wpAjax.get(`/wp-json/wp/v2/pages`);
};

export const articleData = () => {
  return wpAjax.get(`/wp-json/wp/v2/posts`);
};

export const productsData = (productIds) => {
  const queryParams = {
    consumer_key: WcApiKey,
    consumer_secret: WcApiSecret,
    per_page: 100,
  };

  if (productIds) queryParams["include"] = productIds;

  return wooAjax.get(`/wp-json/wc/v3/products`, {
    params: queryParams,
  });
};

export const customerData = (customerId) => {
  return wooAjax.get(`/wp-json/wc/v3/customers/${customerId}`);
};

export const customerOrders = (customerId) => {
  return wooAjax.get(`/wp-json/wc/v3/orders/`, {
    params: {
      customer: customerId,
    },
  });
};

export const createOrder = (orderData) => {
  return wooAjax.post(`/wp-json/wc/v3/orders`, orderData);
};

export const updateOrder = (orderId, productData) => {
  return wooAjax.put(`/wp-json/wc/v3/orders/${orderId}`, productData);
};

export const getCoupon = (couponCode) => {
  return wooAjax.get(`/wp-json/wc/v3/coupons`, {
    params: {
      code: couponCode,
    },
  });
};

export const productsCatData = () => {
  return wpAjax.get(`/wp-json/olivbistro/v1/product-categories`);
};

export const shippingData = () => {
  return wpAjax.get(`/wp-json/olivbistro/v1/shipping-data`);
};

export const userAccountActions = (action, user, email, pass, cookie, key) => {
  return wpAjax.get(
    `/wp-json/olivbistro/v1/user-actions?action=${action}&user=${user}&email=${email}&pass=${pass}&cookie=${cookie}&key=${key}`
  );
};

export const createUser = (userData) => {
  return wooAjax.post(`/wp-json/wc/v3/customers`, userData);
};

export const updateUser = (userData) => {
  return wooAjax.put(`/wp-json/wc/v3/customers/${userData.id}`, userData);
};

export const getImageData = (id) => {
  return wpAjax.get(`/wp-json/olivbistro/v1/image-data?id=${id}`);
};

export const sendFormDataToWP = (formData) => {
  return wpAjax.post(`/wp-json/olivbistro/v1/form-data`, formData);
};
