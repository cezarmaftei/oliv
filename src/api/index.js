import axios from "axios";
const apiRoot = "https://new-site.olivbistro.ro";
// const WcApiKey = "ck_600ec0deee5141d9f47df5630197fbecbe2fc54d";
// const WcApiSecret = "cs_d7f90b6535a732bd53e3363c110a25f6db982599";
// const WcApiKey = "ck_2da30df94b9c39b9a003e73601d651e3cff87b8d";
// const WcApiSecret = "cs_27f46a0ed988d53c9ebbffe7f1880f3b7f57c39b";
const WcApiKey = "ck_3e7c8da8d2e14dd12f16728e59f2913e21be74aa";
const WcApiSecret = "cs_61a323188b907910d977f5af4317cf1250f55c6d";
// const WpApiUser = "cezar.maftei@gmail.com";
// const WpApiKey = "CWu8 buzP t5sf eit5 7cQx IAZ6";

const ajax = axios.create({
  baseURL: `${apiRoot}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Axios API calls
 */

export const websiteOptions = () => {
  return ajax.get(`/wp-json/olivbistro/v1/theme-options`);
};

export const pageData = () => {
  return ajax.get(`/wp-json/wp/v2/pages`);
};

export const articleData = () => {
  return ajax.get(`/wp-json/wp/v2/posts`);
};

export const productsData = (productIds) => {
  const queryParams = {
    consumer_key: WcApiKey,
    consumer_secret: WcApiSecret,
    per_page: 100,
  };

  if (productIds) queryParams["include"] = productIds;

  return ajax.get(`/wp-json/wc/v3/products`, {
    params: queryParams,
  });
};

export const customerData = (customerId) => {
  return ajax.get(`/wp-json/wc/v3/customers/${customerId}`, {
    params: {
      consumer_key: WcApiKey,
      consumer_secret: WcApiSecret,
    },
  });
};

export const customerOrders = (customerId) => {
  return ajax.get(`/wp-json/wc/v3/orders/`, {
    params: {
      consumer_key: WcApiKey,
      consumer_secret: WcApiSecret,
      customer: customerId,
    },
  });
};

export const createOrder = (orderData) => {
  return ajax.post(
    `/wp-json/wc/v3/orders?consumer_key=${WcApiKey}&consumer_secret=${WcApiSecret}`,
    orderData
  );
};

export const updateOrder = (orderId, productData) => {
  return ajax.put(
    `/wp-json/wc/v3/orders/${orderId}?consumer_key=${WcApiKey}&consumer_secret=${WcApiSecret}`,
    productData
  );
};

export const getCoupon = (couponCode) => {
  if (couponCode)
    return ajax.get(`/wp-json/wc/v3/coupons`, {
      params: {
        consumer_key: WcApiKey,
        consumer_secret: WcApiSecret,
        code: couponCode,
      },
    });
};

export const productsCatData = () => {
  return ajax.get(`/wp-json/olivbistro/v1/product-categories`);
};

export const shippingData = () => {
  return ajax.get(`/wp-json/olivbistro/v1/shipping-data`);
};

export const userAccountActions = (action, user, email, pass, cookie, key) => {
  return ajax.get(
    `/wp-json/olivbistro/v1/user-actions?action=${action}&user=${user}&email=${email}&pass=${pass}&cookie=${cookie}&key=${key}`
  );
};

export const createUser = (userData) => {
  return ajax.post(
    `/wp-json/wc/v3/customers/?consumer_key=${WcApiKey}&consumer_secret=${WcApiSecret}`,
    userData
  );
};

// export const createWpUser = (userData) => {
//   return axios.post(`${apiRoot}/wp-json/wp/v2/users`, userData, {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     auth: {
//       username: WpApiUser,
//       password: WpApiKey,
//     },
//   });
// };

export const updateUser = (userData) => {
  return ajax.put(
    `/wp-json/wc/v3/customers/${userData.id}?consumer_key=${WcApiKey}&consumer_secret=${WcApiSecret}`,
    userData
  );
};

export const getPaymentGateways = () => {
  return ajax.get(`/wp-json/wc/v3/payment_gateways`, {
    params: {
      consumer_key: WcApiKey,
      consumer_secret: WcApiSecret,
    },
  });
};

export const getImageData = (id) => {
  return ajax.get(`/wp-json/olivbistro/v1/image-data?id=${id}`);
};

export const sendFormDataToWP = (formData) => {
  return ajax.post(`/wp-json/olivbistro/v1/form-data`, formData);
};
