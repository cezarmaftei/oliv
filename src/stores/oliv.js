import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

import {
  websiteOptions,
  pageData,
  articleData,
  productsData,
  productsCatData,
  userAccountActions,
  customerData,
  customerOrders,
  getCoupon,
  getImageData,
  createOrder,
  shippingData,
  updateUser,
  createUser,
} from "@/api";

import { gmapsCheckUserAddress } from "@/api/gmaps.js";

const { cookies } = useCookies();

export const useOlivStore = defineStore({
  /**
   * The store's id
   */
  id: "oliv",

  /**
   * The store's state
   */
  state: () => ({
    isLoaded: false,
    storeLiveUpdate: false,
    websiteOptions: [],
    pageData: [],
    articleData: [],
    storeData: {},
    searchData: {
      searchString: "",
      searchResults: {},
    },
    imageData: {},
    userData: {
      loggedIn: false,
      credentials: {
        user: "",
        pass: "",
      },
      customerAddresses: {
        shipping: [],
        billing: [],
      },
      customerOrdersData: false,
    },
    cartData: {
      items: [],
      coupon: {
        codes: false,
        errorMsg: false,
      },
      addresses: {},
      showBilling: false,
      deliveryMethod: false,
      paymentMethod: false,
      orderExtras: {
        cutlery: {
          title: "Doresc tacamuri",
          active: false,
        },
      },
      orderComments: "",
      totalQty: 0,
      subTotal: 0,
      totalDiscount: 0,
      totalShipping: 0,
      totalPrice: 0,
    },
    shippingLimitsAndFees: false,
    shippingFieldsMapping: {
      shipping_first_name: {
        name: "Nume si Prenume",
        type: "text",
        required: true,
        value: "",
        priority: "core",
      },
      shipping_email: {
        name: "Email",
        type: "email",
        required: true,
        value: "",
        priority: "core",
      },
      shipping_phone: {
        name: "Telefon",
        type: "tel",
        required: true,
        value: "",
        priority: "core",
      },
      shipping_address_1: {
        name: "Adresa",
        type: "text",
        required: true,
        value: "",
        priority: "regular",
      },
      shipping_city: {
        name: "Oras/Localitate",
        type: "text",
        required: true,
        value: "",
        priority: "regular",
      },
      shipping_country: {
        name: "Tara",
        type: "hidden",
        value: "Romania",
      },
      shipping_state: {
        name: "Judet/Sector",
        type: "hidden",
        value: "Iasi",
      },
      shipping_distance: {
        name: "Distanta de la sediu pana la client",
        type: "hidden",
        value: "",
      },
    },
    billingFieldsMapping: {
      billing_first_name: {
        name: "Nume si Prenume",
        type: "text",
        required: true,
        value: "",
      },
      billing_phone: {
        name: "Telefon",
        type: "tel",
        required: false,
        value: "",
      },
      billing_email: {
        name: "Email",
        type: "email",
        required: false,
        value: "",
      },
      billing_company: {
        name: "Numele Firmei",
        type: "text",
        required: true,
        value: "",
      },
      billing_address_1: {
        name: "Adresa",
        type: "text",
        required: true,
        value: "",
      },
      billing_city: {
        name: "Oras/Localitate",
        type: "text",
        required: true,
        value: "",
      },
      billing_state: {
        name: "Judet/Sector",
        type: "text",
        required: true,
        value: "",
      },
      billing_country: {
        name: "Tara",
        type: "text",
        required: true,
        value: "Romania",
      },
      billing_vat_registration_number: {
        name: "CUI",
        type: "text",
        required: true,
        value: "",
      },
      billing_company_registration_number: {
        name: "Nr. Reg. Com.",
        type: "text",
        required: true,
        value: "",
      },
      billing_company_bank_name: {
        name: "Banca",
        type: "text",
        required: true,
        value: "",
      },
      billing_company_bank_account_number: {
        name: "Cont Bancar",
        type: "text",
        required: false,
        value: "",
      },
    },
  }),

  /**
   * Getters
   */
  getters: {
    /**
     * Get page data(head/content) by slug
     * @param {Object} state the store's state
     * @param {String} slug the page slug
     * @returns {Object} wordpress data for the page
     */
    getPageBySlug: (state) => {
      return (route) => {
        if (state.isLoaded) {
          let result = false;
          switch (route.name) {
            case "home":
              result = state.pageData.filter(
                (page) => page.slug === "meniu"
                // (page) => page.slug === "home"
              )[0];
              break;
            case "page":
              result = state.pageData.filter(
                (page) => page.slug === route.params.slug
              )[0];
              break;
            case "product":
              result = state.storeData.products.filter(
                (product) => product.slug === route.params.slug
              )[0];
              break;
            case "account":
              result = state.pageData.filter(
                (page) => page.slug === "contul-meu"
              )[0];
              break;
          }

          return result;
        }

        return false;
      };
    },

    /**
     * Order all product by category order
     * @param {Object} state the store's state
     * @returns {Array} products
     */
    getProductsByCategory: (state) => {
      return (productCat) => {
        if (productCat === "Toate") {
          return state.storeData.products;
        } else {
          let products = [];
          for (const productId in state.storeData.products) {
            const product = state.storeData.products[productId];
            for (const catCount in product.categories) {
              if (product.categories[catCount].name === productCat) {
                products.push(product);
                break;
              }
            }
          }
          return products;
        }
      };
    },

    /**
     * Get the product extras
     * @param {Object} product Woo product object
     * @returns {Array} the product's extras, like "Extra cheese"
     */
    getProductExtras: () => {
      return (product) => {
        if (!product) return false;
        if (product.meta_data) {
          const productExtras = product.meta_data.filter(
            (meta) => meta.key === "exwo_options"
          );
          if (productExtras[0]) return productExtras[0].value;
        }
      };
    },

    getCartItems(state) {
      //
      // Merge items
      //
      state.cartData.items.forEach((compareItem, compareItemIndex) => {
        state.cartData.items.forEach((compareToItem, compareToItemIndex) => {
          if (
            compareItemIndex !== compareToItemIndex &&
            compareItem.id === compareToItem.id &&
            JSON.stringify(compareItem.productExtras) ===
              JSON.stringify(compareToItem.productExtras)
          ) {
            state.cartData.items[compareItemIndex].productQty +=
              compareToItem.productQty;

            // Remove product
            state.cartData.items.splice(compareToItemIndex, 1);
          }
        });
      });

      if (state.isLoaded) this.updateCartTotals();

      return state.cartData.items;
    },

    getUserOrders: (state) => {
      const orders = [];
      for (const [orderIndex, orderData] of Object.entries(
        state.userData.customerOrdersData
      )) {
        if (["processing", "completed"].indexOf(orderData.status) !== -1)
          orders.push(orderData);
      }

      return orders.reverse();
    },
  },

  /**
   * The store's actions
   */
  actions: {
    /**
     * Init the website
     */
    async initWebsite() {
      await websiteOptions().then((data) => {
        this.websiteOptions = data.data;
      });

      await pageData().then((data) => {
        this.pageData = data.data;
      });

      await articleData().then((data) => {
        this.articleData = data.data;
      });

      await productsData().then((data) => {
        this.storeData.products = data.data;
      });

      await productsCatData().then((data) => {
        this.storeData.categories = data.data;

        // Order products by categories
        let orderedProducts = [];
        if (this.storeData.products) {
          Object.entries(this.storeData.categories).forEach(
            ([catNumber, catData]) => {
              this.storeData.products.filter((product) => {
                product.categories.every((cat) => {
                  if (cat.id === catData.term_id) {
                    orderedProducts.push(product);
                  }
                });
              });
            }
          );

          this.storeData.products = orderedProducts;
        }
      });

      await shippingData().then((data) => {
        this.shippingLimitsAndFees = data.data;
      });

      // Init cart addresses
      this.initCartAddresses();

      // Check if user is logged in
      await this.userActions("verify");

      // Check user cart cookie
      this.checkCart();

      this.$patch({ isLoaded: true });
    },

    // Runs only to build/reset the cart address objects
    initCartAddresses() {
      // Shipping
      const shippingAddress = {};
      for (const [fieldName, fieldValue] of Object.entries(
        this.shippingFieldsMapping
      )) {
        shippingAddress[fieldName] = "";
      }
      this.$patch((state) => {
        state.cartData.addresses["shipping"] = shippingAddress;
      });

      // Billing
      const billingAddress = {};
      for (const [fieldName, fieldValue] of Object.entries(
        this.billingFieldsMapping
      )) {
        billingAddress[fieldName] = "";
      }
      this.cartData.addresses["billing"] = billingAddress;
    },

    /**
     * Validate email address
     * @param {String} email email address
     * @returns {Bool}
     */
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },

    /**
     * Register a new user
     */
    async registerCustomer() {
      if (!this.userData.credentials.user) {
        this.userData.error = "Te rugam introdu adresa de email!";
        return;
      }

      if (!this.userData.credentials.pass) {
        this.userData.error = "Te rugam introdu parola!";
        return;
      }

      // Validate email address
      if (!this.validateEmail(this.userData.credentials.user)) {
        return;
      }

      // Check if user exists
      const userExists = await userAccountActions(
        "exists",
        this.userData.credentials.user
      ).then((data) => data.data);

      if (userExists) {
        this.userData.error =
          "Exista deja un utilizator inregistrat cu aceasta adresa de email!";
        return;
      }

      // Start creation process
      this.storeLiveUpdate = true;

      const userData = {
        email: this.userData.credentials.user,
        username: this.userData.credentials.user,
        pass: this.userData.credentials.pass,
      };

      await createUser(userData);

      this.storeLiveUpdate = false;
    },

    /**
     * User account actions that use get method(no auth needed)
     * - uses userAccountActions (action, user, email, pass, cookie, key) from @/api/index.js
     * - see user_actions() in custom-api-endpoints.php
     * @param {String} action the operation that needs to be done:
     *            verify | Verify if is logged in. Runs on load with initWebsite()
     *            login  | Log in user. Returns user logged_in cookie and user data
     *            reset  | Reset password request
     *            recovery | The actual password reset
     * @param {String} user
     * @param {String} email
     * @param {String} pass
     * @param {String} key the key generated by wordpress and sent by email, for account recovery/activation
     */
    async userActions(action, user, email, pass, key) {
      this.storeLiveUpdate = true;
      const loggedInCookie = cookies.get("oliv_logged_in");

      switch (action) {
        case "verify":
          // User is logged in
          if (loggedInCookie) {
            await userAccountActions(
              "verify",
              null,
              null,
              null,
              loggedInCookie,
              null
            ).then(async (data) => {
              if (data.data.success) {
                this.userData.loggedIn = true;
                this.userData["ID"] = data.data.success.userData.ID;
                await this.loadCustomerData();
              }
            });
          }

          this.storeLiveUpdate = false;
          break;

        case "login":
          await userAccountActions(action, user, null, pass, null, null).then(
            async (data) => {
              if (data.data.success) {
                cookies.set(
                  "oliv_logged_in",
                  data.data.success.cookie,
                  data.data.success.expires
                );

                this.userData.loggedIn = true;
                this.userData["ID"] = data.data.success.userData.ID;
                await this.loadCustomerData();
              }

              if (data.data.error) {
                this.userData.error = data.data.error;
              }

              this.storeLiveUpdate = false;
            }
          );
          break;

        case "logout":
          this.userData.loggedIn = false;
          this.userData.customerOrdersData = false;
          this.userData.credentials.user = "";
          this.userData.credentials.pass = "";

          // Reset addresses
          this.initCartAddresses();
          this.userData.customerAddresses = {
            shipping: [],
            billing: [],
          };

          // Remove logged in cookie
          cookies.remove("oliv_logged_in");

          // Refresh cart data cookie without addresses
          cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");

          this.storeLiveUpdate = false;
          break;

        case "activate":
          await userAccountActions(action, user, null, pass, null, key).then(
            (data) => {
              if (data.data.success) {
                cookies.set(
                  "oliv_logged_in",
                  data.data.success.cookie,
                  data.data.success.expires
                );
                this.userData.loggedIn = true;
              }

              if (data.data.error) {
                this.userData.error = data.data.error;
              }

              this.storeLiveUpdate = false;
            }
          );
          break;

        case "reset":
          userAccountActions(action, null, email, null, null, null).then(
            (data) => {
              if (data.data.error) {
                this.userData.error = data.data.error;
              }

              this.storeLiveUpdate = false;
            }
          );
          break;

        case "recovery":
          userAccountActions(action, user, null, pass, null, key).then(
            (data) => {
              if (data.data.success) {
                cookies.set(
                  "oliv_logged_in",
                  data.data.success.cookie,
                  data.data.success.expires
                );
                this.userData.loggedIn = true;
              }

              if (data.data.error) {
                this.userData.error = data.data.error;
              }

              this.storeLiveUpdate = false;
            }
          );
          break;
      }
    },

    /**
     * If user is logged in get his general info, addresses and order history
     * @param {Object} state the store's state
     * @returns nothing. It just updates the store's state.
     */
    async loadCustomerData() {
      const cData = await customerData(this.userData.ID).then(
        (data) => data.data
      );

      // Update state
      this.userData["avatarUrl"] = cData.avatar_url;
      this.userData["firstName"] = cData.first_name;
      this.userData["email"] = cData.email;

      // Get addresses
      cData.meta_data.forEach((meta) => {
        if (meta.key === "user_shipping_addresses" && meta.value.length) {
          // Load addresses in state
          this.userData.customerAddresses["shipping"] = meta.value;

          // Patch to trigger cart update
          this.$patch((state) => {
            state.cartData.addresses.shipping = meta.value[0];
          });
        }
        if (meta.key === "user_billing_addresses" && meta.value.length) {
          this.userData.customerAddresses["billing"] = meta.value;
          // No patch because we don't need cart update
          // this.cartData.addresses.billing = meta.value[0];
        }
      });

      await customerOrders(this.userData.ID).then(
        (data) => (this.userData.customerOrdersData = data.data)
      );
    },

    /**
     * Update cart after quantities change
     */
    async updateCartTotals() {
      // Cart product object:
      //
      // id -> product ID === Is added here
      // name -> product name === Is added here
      // thumbId -> product thumbnail ID === Is added here
      // productWeight -> product weight === Is added here
      // productQty -> quantity === Is added here
      // productPrice -> product price === Is added here
      // productExtras -> array with extra options: === Is added here
      //    _id -> extra ID === Is added here
      //    extraName -> extra name === Is added here
      //    extraQty -> extra quantity === Is added here
      //    extraPrice -> extra price === Is added here
      // productWithExtrasPrice -> product price including extras
      // itemTotal -> productQty * productWithExtrasPrice - item total price

      if (this.cartData.items.length < 1) {
        //
        // Set all to 0 if there are no products in cart
        //
        this.cartData.totalQty = 0;
        this.cartData.subTotal = 0;
        this.cartData.totalDiscount = 0;
        this.cartData.totalShipping = false;
        this.cartData.totalPrice = 0;
      } else {
        //
        // Calculate totals
        //
        let cartTotalQty = 0;
        let cartSubTotalPrice = 0;
        this.cartData.items.forEach((product) => {
          let extrasPrice = 0;
          product.productExtras.forEach((extra) => {
            const extraQty = parseInt(extra.extraQty);
            if (extraQty > 0)
              extrasPrice += extraQty * parseFloat(extra.extraPrice);
          });

          product.productWithExtrasPrice =
            parseFloat(product.productPrice) + extrasPrice;

          product.itemTotal =
            product.productWithExtrasPrice * product.productQty;

          cartTotalQty += parseInt(product.productQty);
          cartSubTotalPrice += product.itemTotal;
        });

        this.cartData.totalQty = cartTotalQty;
        this.cartData.subTotal = cartSubTotalPrice;

        //
        // Set coupon discount
        //
        let cartDiscount = 0;
        if (this.cartData.coupon.codes.length) {
          this.cartData.coupon.codes.forEach((coupon) => {
            if (coupon.discount_type === "percent") {
              coupon["discount"] =
                (parseFloat(coupon.amount) * this.cartData.subTotal) / 100;
              cartDiscount += coupon.discount;
            }
          });
        }
        this.cartData.totalDiscount = cartDiscount;

        //
        // Set shipping cost
        //
        if (
          this.cartData.deliveryMethod !== "pickup" &&
          this.cartData.addresses.shipping &&
          typeof this.cartData.addresses.shipping.shipping_distance ===
            "number" &&
          this.cartData.addresses.shipping.shipping_distance > 0
        ) {
          this.cartData.totalShipping = this.addressShippingFee(
            this.cartData.addresses.shipping.shipping_distance
          );
        } else if (this.cartData.deliveryMethod === "pickup") {
          this.cartData.totalShipping = 0;
        } else {
          this.cartData.totalShipping = false;
        }

        // Calculate totals
        let totalPrice = this.cartData.subTotal - this.cartData.totalDiscount;

        if (typeof this.cartData.totalShipping === "number")
          totalPrice += this.cartData.totalShipping;

        this.cartData.totalPrice = totalPrice;

        // Save cart in cookie for 1 week
        cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
      }
    },

    /**
     * Check the cart cookie and save it in the shop's state
     */
    checkCart() {
      const userCart = cookies.get("oliv_cart");
      if (userCart) this.cartData = userCart;
    },

    /**
     * Create order parameters to be sent to Woo via API and create a new order
     * @returns {Object} orderParams
     */
    createOrderParams() {
      let orderParams = {};

      if (this.userData) {
        orderParams.customer_id = this.userData.loggedIn ? this.userData.ID : 0;
      }

      // line_items
      orderParams.line_items = [];
      this.cartData.items.forEach((item, itemIndex) => {
        orderParams.line_items.push({
          product_id: item.id,
          quantity: item.productQty,
          subtotal: String(item.itemTotal),
          total: String(item.itemTotal),
        });

        if (item.lineId) {
          orderParams.line_items[itemIndex].id = item.lineId;
        }

        if (item.productExtras.length > 0) {
          orderParams.line_items[itemIndex].meta_data = [];
          let priceValues = [];
          item.productExtras.forEach((productExtra) => {
            // productExtra
            //
            // _id -> extra ID
            // extraName -> extra name
            // extraQty -> extra quantity
            // extraPrice -> extra price

            // woocommerce object
            //
            // key -> productExtra.extraName
            // value -> productExtra.extraQty
            const displayValue = `${productExtra.extraName}(x ${productExtra.extraPrice}lei)`;

            // Push cart meta
            orderParams.line_items[itemIndex].meta_data.push({
              key: displayValue,
              value: productExtra.extraQty,
              display_key: displayValue,
              display_value: String(productExtra.extraQty),
            });

            priceValues.push({
              name: productExtra.extraName,
              value: productExtra.extraQty,
              price: productExtra.extraPrice,
            });
          });

          // Push price meta
          orderParams.line_items[itemIndex].meta_data.push({
            key: "api_exoptions",
            value: priceValues,
          });
        }
      });

      // Add payment method
      if (this.cartData.paymentMethod) {
        orderParams.payment_method = this.cartData.paymentMethod;
        orderParams.payment_method_title = `${this.cartData.paymentMethod} la livrare`;
      }

      // Add coupon(s)
      orderParams.coupon_lines = [];
      if (this.cartData.coupon.codes) {
        this.cartData.coupon.codes.forEach((couponData) =>
          orderParams.coupon_lines.push({ code: couponData.code })
        );
      }

      // Set status
      orderParams.status = "processing";

      // Set meta
      orderParams.meta_data = [];
      for (const [extraName, extraValue] of Object.entries(
        this.cartData.orderExtras
      )) {
        if (extraValue.active) {
          orderParams.meta_data.push({
            key: `order_extras_${extraName}`,
            value: extraValue.title,
          });
        }
      }

      // Pickup
      if (this.cartData.deliveryMethod === "pickup") {
        orderParams.meta_data.push({
          key: "pickup",
          value: "Comanda va fi ridicata de client de la sediu!",
        });
      }

      // Delivery address
      const orderShipping = {};
      for (const [fieldName, fieldData] of Object.entries(
        this.shippingFieldsMapping
      )) {
        orderShipping[fieldName] = {
          name: fieldData.name,
          value:
            this.cartData.addresses.shipping[fieldName].length ||
            fieldName === "shipping_distance"
              ? this.cartData.addresses.shipping[fieldName]
              : this.shippingFieldsMapping[fieldName].value,
        };
      }
      orderParams.meta_data.push({
        key: "shipping",
        value: orderShipping,
      });

      // Billing address
      if (this.showBilling) {
        const orderBilling = {};
        for (const [fieldName, fieldData] of Object.entries(
          this.billingFieldsMapping
        )) {
          orderBilling[fieldName] = {
            name: fieldData.name,
            value: this.cartData.addresses.billing[fieldName].length
              ? this.cartData.addresses.billing[fieldName]
              : this.billingFieldsMapping[fieldName].value,
          };
        }
        orderParams.meta_data.push({
          key: "billing",
          value: orderBilling,
        });
      }

      // Save cartData.items to use on re-order
      orderParams.meta_data.push({
        key: "reorder_items",
        value: this.cartData.items,
      });

      // Order comments
      if (this.cartData.orderComments.length > 0) {
        orderParams["customer_note"] = this.cartData.orderComments;
      }

      return orderParams;
    },

    /**
     * Add coupon to order and update cart totals
     * @param {String} coupon the coupon code
     */
    async addOrderCoupon(coupon) {
      // Check if the coupon input field is not empty
      if (!coupon) {
        this.cartData.coupon.errorMsg = "Te rugam introdu codul cuponului!";
        return false;
      }

      /*
      Maybe will be needed later
      Currently the coupon use is limited to 1
      */
      // // Check if the coupon is already applied
      // if (this.cartData.coupon.codes.length) {
      //   const couponExists = this.cartData.coupon.codes.filter(
      //     (couponData) => couponData.code === coupon
      //   );
      //   if (couponExists.length) {
      //     this.cartData.coupon.errorMsg = "Cuponul este deja aplicat!";
      //     return false;
      //   }
      // }

      // Check if the coupon exists in woo
      this.storeLiveUpdate = true;

      const couponData = await getCoupon(coupon).then((data) => data.data);

      if (couponData.length) {
        // Coupoon exists, add it to cartData
        this.$patch((state) => {
          state.cartData.coupon.codes = [
            {
              code: coupon,
              discount_type: couponData[0].discount_type,
              amount: couponData[0].amount,
            },
          ];
        });
      } else {
        this.cartData.coupon.errorMsg = "Cupon invalid!";
      }
      this.storeLiveUpdate = false;
    },

    /**
     * Remove coupon from order
     * @param {String} couponCode
     */
    removeOrderCoupon(couponCode) {
      // Get coupon to remove index
      const couponIndexToRemove = this.cartData.coupon.codes.filter(
        (code, index) => (code === couponCode ? index : false)
      );

      if (couponIndexToRemove) {
        this.cartData.coupon.codes.splice(
          this.cartData.coupon.codes[couponIndexToRemove],
          1
        );
      }
    },

    /**
     * Check if 2 addresses objects are identical
     * @param {Object} obj1 address
     * @param {Object} obj2 address
     * @returns {Bool}
     */
    compareAddressObjects(obj1, obj2) {
      // Ignore some key which are not important
      const ignoreKeys = ["address_2", "shipping", "billing", "distance"];

      // Compares 1-level objects
      // only letters and numbers are taken in consideration
      for (const [obj1Key, obj1Value] of Object.entries(obj1)) {
        if (ignoreKeys.indexOf(obj1Key) === -1) {
          if (
            obj1Value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() !==
            obj2[obj1Key].replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
          ) {
            return false;
          }
        }
      }

      return true;
    },

    /**
     * Handles user's address:
     * creates, updates, deletes, sends to Woo
     * @returns errors or updates cartData.addresses
     */
    async handleUserAddress(action, addressType, addressIndex) {
      // Show loading screen
      this.storeLiveUpdate = true;

      // Allow a maximum of 5 addresses for each type
      if (
        action === "add" &&
        this.cartData.addresses[addressType].length === 5
      ) {
        return {
          error:
            "Poti avea un numar maxim de 5 adrese pentru livrare si 5 pentru facturare.",
        };
      }

      // Get shipping addresses
      let userShippingAddresses = this.userData.customerAddresses.shipping
        .length
        ? Object.values(
            Object.assign({}, this.userData.customerAddresses.shipping)
          )
        : [];

      let userBillingAddresses = this.userData.customerAddresses.billing.length
        ? Object.values(
            Object.assign({}, this.userData.customerAddresses.billing)
          )
        : [];

      if (!["setfirst", "delete"].includes(action)) {
        const addressData =
          addressType === "shipping"
            ? this.shippingFieldsMapping
            : this.billingFieldsMapping;

        // Object that will be also sent to Woo
        // Also check for required fields
        let userAddress = {};
        for (const [fieldName, fieldData] of Object.entries(addressData)) {
          // Check for empty
          if (fieldData.required && fieldData["value"].length < 1)
            return { error: `${fieldData.name} este obligatoriu!` };

          // Add to address object
          userAddress[fieldName] = fieldData["value"];
        }

        if (addressType === "shipping") {
          // Check if exists
          if (userShippingAddresses.length > 0) {
            for (const address of userShippingAddresses) {
              if (this.compareAddressObjects(address, userAddress)) {
                this.storeLiveUpdate = false;
                return {
                  error: "Aceasta adresa exista deja!",
                };
              }
            }
          }

          // Check if is eligible for shipping
          const newAddressDistance = await this.addressDistance(
            `${this.shippingFieldsMapping.shipping_address_1.value}, ${this.shippingFieldsMapping.shipping_city.value}, Romania`
          ).then((data) => data);

          // If is not number then it's an error
          if (typeof newAddressDistance !== "number")
            return { error: newAddressDistance };

          /**
           * It's eligible, now continue
           */
          // Add distance to address data
          userAddress["shipping_distance"] = newAddressDistance;

          // Add address to userShippingAddresses
          if (action === "add") userShippingAddresses.unshift(userAddress);

          if (action === "edit")
            userShippingAddresses[addressIndex] = userAddress;
        }

        if (addressType === "billing") {
          // Check if exists
          if (userBillingAddresses.length > 0) {
            for (const address of userBillingAddresses) {
              if (this.compareAddressObjects(address, userAddress)) {
                this.storeLiveUpdate = false;
                return {
                  error: "Aceasta adresa exista deja!",
                };
              }
            }
          }

          // Add address to userBillingAddresses
          if (action === "add") userBillingAddresses.unshift(userAddress);

          if (action === "edit")
            userBillingAddresses[addressIndex] = userAddress;
        }
      }

      if (["setfirst", "delete"].includes(action)) {
        if (addressType === "shipping") {
          // First remove the item
          const removedItem = userShippingAddresses.splice(addressIndex, 1);

          // Now set it first
          if (action === "setfirst") {
            userShippingAddresses.unshift(removedItem[0]);
          }
        }

        if (addressType === "billing") {
          // First remove the item
          const removedItem = userBillingAddresses.splice(addressIndex, 1);

          // Now set it first
          if (action === "setfirst") {
            userBillingAddresses.unshift(removedItem[0]);
          }
        }
      }

      const userUpdate = {
        id: this.userData.ID,
        meta_data: [
          {
            key:
              addressType === "shipping"
                ? "user_shipping_addresses"
                : "user_billing_addresses",
            value:
              addressType === "shipping"
                ? userShippingAddresses
                : userBillingAddresses,
          },
        ],
      };

      const updateWoo = await updateUser(userUpdate).then((data) => data.data);

      if (updateWoo.id) {
        // Update store state
        if (addressType === "shipping") {
          this.$patch((state) => {
            state.userData.customerAddresses.shipping = userShippingAddresses;
            state.cartData.addresses.shipping = userShippingAddresses[0];
          });
        }

        if (addressType === "billing") {
          this.userData.customerAddresses.billing = userBillingAddresses;
          this.cartData.addresses.billing = userBillingAddresses[0];
        }

        // Update cart cookie
        cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
      } else {
        return {
          error:
            "A aparut o problema la crearea adresei. Te rugam revino mai tarziu!",
        };
      }

      this.storeLiveUpdate = false;

      return {
        success: updateWoo,
      };
    },

    /**
     * Check if user address exists using gmaps API
     * and also checks if is in range of delivery
     * see gmapsCheckUserAddress in /src/api/gmaps.js
     * @param {String} clientAddress
     * @returns {Float/Bool} delivery distance/false
     */
    addressDistance(clientAddress) {
      this.storeLiveUpdate = true;
      return gmapsCheckUserAddress(
        this.shippingLimitsAndFees,
        clientAddress
      ).then(
        // If response is float then address exists and is in range
        (response) => {
          this.storeLiveUpdate = false;
          return response;
        }
      );
    },

    /**
     * Returns data about the cost of shipping
     * @param {Float} distance the distance from store to client
     * @returns {Array/Bool} fees data/false if address is too far
     */
    addressDistanceFees(distance) {
      const fees =
        this.shippingLimitsAndFees.shipping_options.exwfood_adv_feekm;
      const results = fees.filter((fee) => parseFloat(fee.km) <= distance);
      return results.length ? results[results.length - 1] : false;
    },

    /**
     * Get the shipping fee for a distance
     * This assumes that the distance is in range of delivery
     * The distance is obtained using addressDistance()
     * @param {Float} distance
     * @returns {Float} shipping fee
     */
    addressShippingFee(distance) {
      const distanceFees = this.addressDistanceFees(distance);
      const cartSubTotal = this.cartData.subTotal - this.cartData.totalDiscount;

      let shippingFee = 0;
      if (cartSubTotal < parseFloat(distanceFees.free)) {
        shippingFee = parseFloat(distanceFees.fee);
      }

      return shippingFee;
    },

    /**
     * Update user general info like, name, email
     * @param {Object} updateData
     */
    updateUserGeneral(updateData) {
      this.storeLiveUpdate = true;
      updateData.id = this.userData.ID;
      updateUser(updateData).then((data) => {
        this.userData.customerData = data.data;
        this.storeLiveUpdate = false;
      });
    },

    /**
     * Sends order to Woo
     * @returns {Int/Bool} order id or false onerror
     */
    async submitOrder() {
      this.storeLiveUpdate = true;

      // Check if is available for shipping
      if (this.cartData.totalShipping === false) {
        this.storeLiveUpdate = false;

        return {
          checkoutError:
            "Trebuie sa completezi detaliile despre livrarea comenzii!",
        };
      }

      if (
        this.cartData.paymentMethod === false &&
        this.cartData.deliveryMethod !== "pickup"
      ) {
        this.storeLiveUpdate = false;

        return {
          checkoutError: "Trebuie sa selectezi o metoda de plata!",
        };
      }

      const cartProductsIds = this.cartData.items.map((product) => product.id);
      let productsAvailable = true;
      await productsData(cartProductsIds).then((data) => {
        this.storeLiveUpdate = false;
        // Loop through products to check if they are in stock
        data.data.forEach((product, productIndex) => {
          if (product.stock_status !== "instock") {
            // Out of stock
            this.cartData.items[
              productIndex
            ].errorMsg = `Ne pare rau, dar acest produs nu mai este in stoc!`;

            setTimeout(() => {
              // Remove from cart
              this.cartData.items.splice(productIndex, 1);
            }, 5000);

            productsAvailable = false;
          }

          if (
            product.stock_status === "instock" &&
            typeof product.stock_quantity === "number"
          ) {
            // Limited stock
            const cartProductQty = this.cartData.items[productIndex].productQty;
            if (parseInt(product.stock_quantity) < cartProductQty) {
              this.cartData.items[
                productIndex
              ].errorMsg = `Ne pare rau, dar mai avem doar ${product.stock_quantity} produse in stoc! Am schimbat noi cantitatea pentru tine.`;

              this.cartData.items[productIndex].productQty = parseInt(
                product.stock_quantity
              );

              productsAvailable = false;
            }
          }
        });
      });

      if (!productsAvailable) return "productError";

      return await createOrder(this.createOrderParams()).then((data) => {
        this.storeLiveUpdate = false;

        if (data.data.id) {
          //
          // The order has been created
          //

          // Reset cart data, but keep addresses(for guests)?
          this.cartData.coupon = {
            codes: false,
            errorMsg: false,
          };
          this.cartData.showBilling = false;
          this.cartData.deliveryMethod = false;
          this.cartData.paymentMethod = false;
          this.cartData.orderComments = "";
          this.cartData.orderExtras = {
            cutlery: {
              title: "Doresc tacamuri",
              active: false,
            },
          };
          // This last beacuse it also calculates cart totals
          this.cartData.items = [];

          cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
          return data.data;
        } else {
          return false;
        }
      });
    },
    /**
     * Get image data from wordpress
     * @param {Int} id
     * @returns {Array} of sizes. Eg: ['full' :{ scrset: '...', sizes: '...', url: '...'}]
     */
    async fetchImageData(id) {
      return await getImageData(id).then((data) => data.data);
    },

    /**
     * Get the fields by priority, to split them in .form-group(s) as per design
     * @param {String} priority "core" or "regular"
     * @param {Object} fields store.shippingFieldsMapping or store.billingFieldsMapping
     */
    getMappingFieldsByPriority(priority, fields) {
      const sortedFields = [];
      Object.entries(fields).forEach((fieldData) => {
        if (fieldData[1].priority === priority) sortedFields.push(fieldData[0]);
      });

      return sortedFields;
    },

    getReorder(orderMeta) {
      const reorderData = orderMeta.filter(
        (data) => data.key === "reorder_items"
      );
      return reorderData[0].value;
    },
  },
});
