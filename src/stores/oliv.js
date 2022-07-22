import { defineStore } from "pinia";
import { websiteOptions, pageData, productsData, productsCatData } from "@/api";

export const useOlivStore = defineStore({
  id: "oliv",
  state: () => ({
    websiteOptions: [],
    pageData: [],
    storeData: {},
  }),
  getters: {},
  actions: {
    initWebsite() {
      websiteOptions().then((data) => {
        this.websiteOptions = data.data;
      });

      pageData().then((data) => {
        this.pageData = data.data;
      });

      productsData().then((data) => {
        this.storeData.products = data.data;
      });

      productsCatData().then((data) => {
        this.storeData.categories = data.data;
      });
    },
  },
});
