import axios from "axios";
const apiRoot = "https://new-site.olivbistro.ro";
const WcApiKey = "ck_600ec0deee5141d9f47df5630197fbecbe2fc54d";
const WcApiSecret = "cs_d7f90b6535a732bd53e3363c110a25f6db982599";

const ajax = axios.create({
  baseURL: `${apiRoot}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// function ajaxRequest(endpoint) {
//   return ajax.get(`/${endpoint}/`)
// }

export const websiteOptions = () => {
  return ajax.get(`/wp-json/olivbistro/v1/theme-options`);
};

export const pageData = () => {
  return ajax.get(`/wp-json/wp/v2/pages`);
};

export const productsData = () => {
  return ajax.get(`/wp-json/wc/v3/products`, {
    params: {
      consumer_key: WcApiKey,
      consumer_secret: WcApiSecret,
      per_page: 100,
    },
  });
};

export const productsCatData = () => {
  return ajax.get(`/wp-json/olivbistro/v1/product-categories`);
};
