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
        name: "Strada si Numarul",
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
      shipping_address_2: {
        name: "Bloc, Scara, Etaj, Apartament",
        type: "text",
        required: false,
        value: "",
        priority: "regular",
        class: "col-12",
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
      shipping_latitude: {
        name: "Latitudine",
        type: "hidden",
        value: "",
      },
      shipping_longitude: {
        name: "Longitudine",
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

            case "article":
              {
                result = state.articleData.filter(
                  (article) => article.slug === route.params.slug
                )[0];

                // Get blog title for article
                const blogPage = state.pageData.filter(
                  (page) => page.slug === "blog"
                )[0];

                result["acf"]["page_header_content"] =
                  blogPage.acf.page_header_content;
              }
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
          return state.storeData.products.filter((product) => {
            if (
              product.categories.filter((cat) => productCat === cat.name).length
            ) {
              return product;
            }
          });
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

      return orders;
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

      this.$patch({
        isLoaded: true,
      });
    },

    // Runs only to build/reset the cart address objects
    initCartAddresses(initOnly) {
      // Shipping
      if (!initOnly || (initOnly && initOnly === "shipping")) {
        const shippingAddress = {};
        for (const [fieldName, fieldValue] of Object.entries(
          this.shippingFieldsMapping
        )) {
          let newFieldValue = "";

          if (this.userData.loggedIn && fieldName === "shipping_first_name") {
            newFieldValue = this.userData.firstName;
          }

          if (this.userData.loggedIn && fieldName === "shipping_email") {
            newFieldValue = this.userData.email;
          }

          shippingAddress[fieldName] = newFieldValue ? newFieldValue : "";
        }
        this.$patch((state) => {
          state.cartData.addresses["shipping"] = shippingAddress;
        });
      }

      // Billing
      if (!initOnly || (initOnly && initOnly === "billing")) {
        const billingAddress = {};
        for (const [fieldName, fieldValue] of Object.entries(
          this.billingFieldsMapping
        )) {
          billingAddress[fieldName] = "";
        }
        this.cartData.addresses["billing"] = billingAddress;
      }
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
    async registerCustomer(formFields) {
      if (!formFields.username) {
        return {
          error: "Te rugam introdu adresa de email!",
        };
      }

      if (!formFields.password) {
        return {
          error: "Te rugam introdu parola!",
        };
      }

      // Validate email address
      if (!this.validateEmail(formFields.username)) {
        return;
      }

      // Start async actions
      this.storeLiveUpdate = true;

      // Check if user exists
      const userExists = await userAccountActions(
        "exists",
        formFields.username
      ).then((data) => data.data);

      if (userExists) {
        this.storeLiveUpdate = false;
        return {
          error:
            "Exista deja un utilizator inregistrat cu aceasta adresa de email!",
        };
      }

      console.log(userExists);

      const userData = {
        email: formFields.username,
        username: formFields.username,
        password: formFields.password,
      };

      await createUser(userData);

      this.storeLiveUpdate = false;
      return true;
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
      const actionResult = {};

      switch (action) {
        case "verify":
          {
            // User is logged in
            const loggedInCookie = cookies.get("oliv_logged_in");
            if (loggedInCookie) {
              const userVerification = await userAccountActions(
                "verify",
                null,
                null,
                null,
                loggedInCookie,
                null
              ).then((data) => data.data);

              if (userVerification.success) {
                await this.loginUser(userVerification);
                actionResult["success"] = true;
              }
            }
          }
          break;

        case "login":
          {
            // Attempt log in
            const userLogin = await userAccountActions(
              action,
              user,
              null,
              pass,
              null,
              null
            ).then((data) => data.data);

            if (userLogin.success) {
              await this.loginUser(userLogin);
              actionResult["success"] = true;
            }

            if (userLogin.error) {
              actionResult["error"] = userLogin.error;
            }
          }
          break;

        case "logout":
          // Reset userdata
          this.userData = {
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
          };

          // Reset coupons
          this.cartData.coupon = {
            codes: false,
            errorMsg: false,
          };

          // Reset addresses
          this.initCartAddresses();

          // Remove logged in cookie
          cookies.remove("oliv_logged_in");

          // Refresh cart data cookie without addresses
          cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
          break;

        case "activate":
          {
            const activateUser = await userAccountActions(
              action,
              user,
              null,
              pass,
              null,
              key
            ).then((data) => data.data);

            if (activateUser.success) {
              await this.loginUser(activateUser);
              actionResult["success"] = true;
            }

            if (activateUser.error) {
              actionResult["error"] = activateUser.error;
            }
          }
          break;

        case "reset":
          await userAccountActions(action, null, email, null, null, null);
          break;

        case "recovery":
          {
            const passRecovery = await userAccountActions(
              action,
              user,
              null,
              pass,
              null,
              key
            ).then((data) => data.data);

            if (passRecovery.success) {
              actionResult["success"] = true;
            }

            if (passRecovery.error) {
              actionResult["error"] = passRecovery.error;
            }
          }
          break;
      }

      this.storeLiveUpdate = false;

      return actionResult;
    },

    async loginUser(userData) {
      if (userData.success.cookie && userData.success.expires) {
        cookies.set(
          "oliv_logged_in",
          userData.success.cookie,
          userData.success.expires
        );
      }

      this.userData.loggedIn = true;
      this.userData["ID"] = userData.success.userData.ID;
      this.userData["accountActive"] = userData.success.accountActive;
      this.initCartAddresses();
      await this.loadCustomerData();

      // Do this to add default name and email
      if (!this.userData.customerAddresses.shipping.length) {
        this.initCartAddresses("shipping");
      }
    },

    /**
     * If user is logged in get his general info, addresses and order history
     * @returns nothing. It updates the store's state.
     */
    async loadCustomerData() {
      const cData = await customerData(this.userData.ID).then(
        (data) => data.data
      );

      // Update state
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
          this.cartData.addresses.billing = meta.value[0];
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
      // id -> product ID
      // name -> product name
      // thumbId -> product thumbnail ID
      // productWeight -> product weight
      // productQty -> quantity
      // productPrice -> product price
      // isCouponEligible -> accepts coupon discount
      // productExtras -> array with extra options:
      //    _id -> extra ID
      //    extraName -> extra name
      //    extraQty -> extra quantity
      //    extraPrice -> extra price
      // productWithExtrasPrice -> product price including extras === Is added here
      // itemSubtotal -> productQty * productWithExtrasPrice === Is added here
      // itemTotal -> itemSubtotal - coupon discount === Is added here

      if (!this.cartData.items.length) {
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
        // Get coupon discount
        //
        let percentageDiscount = false;
        if (this.cartData.coupon.codes.length) {
          percentageDiscount = (
            parseFloat(this.cartData.coupon.codes[0].amount) / 100
          ).toFixed(2);
          percentageDiscount = parseFloat(percentageDiscount);
        }

        // let cartDiscount = 0;
        // if (this.cartData.coupon.codes.length) {
        //   this.cartData.coupon.codes.forEach((coupon) => {
        //     if (coupon.discount_type === "percent") {
        //       coupon["discount"] =
        //         (parseFloat(coupon.amount) * this.cartData.subTotal) / 100;
        //       cartDiscount += coupon.discount;
        //     }
        //   });
        // }
        // this.cartData.totalDiscount = cartDiscount;

        //
        // Calculate totals
        //
        let cartTotalQty = 0;
        let cartSubTotalPrice = 0;
        this.cartData.totalDiscount = 0;

        this.cartData.items.forEach((product) => {
          let extrasPrice = 0;
          product.productExtras.forEach((extra) => {
            const extraQty = parseInt(extra.extraQty);
            if (extraQty > 0)
              extrasPrice += extraQty * parseFloat(extra.extraPrice);
          });

          product.productWithExtrasPrice =
            parseFloat(product.productPrice) + extrasPrice;

          product.itemSubtotal =
            product.productWithExtrasPrice * product.productQty;

          product.itemTotal =
            product.isCouponEligible && percentageDiscount
              ? product.itemSubtotal * percentageDiscount
              : product.itemSubtotal;

          cartTotalQty += parseInt(product.productQty);

          cartSubTotalPrice += product.itemSubtotal;

          this.cartData.totalDiscount +=
            product.itemSubtotal - product.itemTotal;
        });

        this.cartData.totalQty = cartTotalQty;
        this.cartData.subTotal = cartSubTotalPrice;

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
      }

      // Save cart in cookie for 1 week
      if (this.isLoaded)
        cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
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
          subtotal: String(item.itemSubtotal),
          total: String(item.itemTotal),
        });

        if (item.lineId) {
          orderParams.line_items[itemIndex].id = item.lineId;
        }

        if (item.productExtras.length) {
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
          orderParams.coupon_lines.push({
            code: couponData.code,
          })
        );
      }

      // Add shipping costs
      if (this.cartData.totalShipping && this.cartData.totalShipping > 0) {
        orderParams.shipping_lines = [
          {
            method_id: "flat_rate",
            method_title: "Flat Rate",
            total: this.cartData.totalShipping.toString(),
          },
        ];
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

      // Thses fields have no .value property
      const shippingGeolocationFields = [
        "shipping_distance",
        "shipping_latitude",
        "shipping_longitude",
      ];
      for (const [fieldName, fieldData] of Object.entries(
        this.shippingFieldsMapping
      )) {
        orderShipping[fieldName] = {
          name: fieldData.name,
          value:
            this.cartData.addresses.shipping[fieldName].length ||
            shippingGeolocationFields.indexOf(fieldName) != -1
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
      if (this.cartData.orderComments.length) {
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
      let couponError = false;
      const couponData = await getCoupon(coupon).then((data) => data.data);
      const theCoupon = couponData[0];
      if (couponData.length) {
        // Coupon is restricted per account
        if (theCoupon.email_restrictions.length) {
          // Not logged in
          if (!this.userData.loggedIn) {
            couponError = "Trebuie sa fii logat pentru a folosi acest cod!";
          }

          // Logged in but account email is not in restrictions list
          if (
            this.userData.loggedIn &&
            !theCoupon.email_restrictions.includes(this.userData.email)
          ) {
            couponError = "Acest cod de reducere nu este asociat acestui cont!";
          }
        }
      } else {
        couponError = "Cupon invalid!";
      }

      if (!couponError) {
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
        this.cartData.coupon.errorMsg = couponError;
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
      const ignoreKeys = [
        "shipping_state",
        "shipping_country",
        "shipping_distance",
        "shipping_latitude",
        "shipping_longitude",
      ];

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
      let userShippingAddresses = this.userData.customerAddresses.shipping;

      let userBillingAddresses = this.userData.customerAddresses.billing;

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
          if (fieldData.required && !fieldData["value"].length)
            return {
              error: `${fieldData.name} este obligatoriu!`,
            };

          // Add to address object
          userAddress[fieldName] = fieldData["value"];
        }

        if (addressType === "shipping") {
          // Check if exists
          if (userShippingAddresses.length) {
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
          const newAddressResults = await this.addressDistance(
            `${this.shippingFieldsMapping.shipping_address_1.value}, ${this.shippingFieldsMapping.shipping_city.value}, Romania`
          ).then((data) => data);

          // If is not number then it's an error
          if (typeof newAddressResults !== "object")
            return {
              error: newAddressResults,
            };

          /**
           * It's eligible, now continue
           */
          // Add distance to address data
          userAddress["shipping_distance"] = newAddressResults.distance;
          userAddress["shipping_latitude"] = newAddressResults.lat;
          userAddress["shipping_longitude"] = newAddressResults.lng;

          // Add address to userShippingAddresses
          if (action === "add") userShippingAddresses.unshift(userAddress);

          if (action === "edit")
            userShippingAddresses[addressIndex] = userAddress;
        }

        if (addressType === "billing") {
          // Check if exists
          if (userBillingAddresses.length) {
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

      // Update store state
      if (addressType === "shipping") {
        this.$patch((state) => {
          state.userData.customerAddresses.shipping = userShippingAddresses;
          if (userShippingAddresses.length) {
            state.cartData.addresses.shipping = userShippingAddresses[0];
          } else {
            this.initCartAddresses("shipping");
          }
        });
      }

      if (addressType === "billing") {
        this.userData.customerAddresses.billing = userBillingAddresses;
        if (userBillingAddresses.length) {
          this.cartData.addresses.billing = userBillingAddresses[0];
        } else {
          this.initCartAddresses("billing");
        }
      }

      // Update cart cookie
      cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");

      this.storeLiveUpdate = false;

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

      updateUser(userUpdate);

      return true;

      // const updateWoo = await updateUser(userUpdate).then((data) => data.data);

      // if (updateWoo.id) {
      //   // Update store state
      //   if (addressType === "shipping") {
      //     this.$patch((state) => {
      //       state.userData.customerAddresses.shipping = userShippingAddresses;
      //       if (userShippingAddresses.length) {
      //         state.cartData.addresses.shipping = userShippingAddresses[0];
      //       } else {
      //         this.initCartAddresses("shipping");
      //       }
      //     });
      //   }

      //   if (addressType === "billing") {
      //     this.userData.customerAddresses.billing = userBillingAddresses;
      //     if (userBillingAddresses.length) {
      //       this.cartData.addresses.billing = userBillingAddresses[0];
      //     } else {
      //       this.initCartAddresses("billing");
      //     }
      //   }

      //   // Update cart cookie
      //   cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
      // } else {
      //   return {
      //     error:
      //       "A aparut o problema la crearea adresei. Te rugam revino mai tarziu!",
      //   };
      // }

      // return {
      //   success: updateWoo,
      // };
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
      let productsToRemove = [];
      await productsData(cartProductsIds).then((data) => {
        const productsData = data.data;
        // Loop through products to check if they are in stock
        this.cartData.items.forEach((product, productIndex) => {
          const currentProductData = productsData.filter(
            (productData) => productData.id === product.id
          )[0];
          if (currentProductData.stock_status !== "instock") {
            // Out of stock
            this.cartData.items[
              productIndex
            ].errorMsg = `Ne pare rau, dar acest produs nu mai este in stoc!`;

            productsToRemove.push(productIndex);
            productsAvailable = false;
          }

          if (
            currentProductData.stock_status === "instock" &&
            typeof currentProductData.stock_quantity === "number"
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

        this.storeLiveUpdate = false;
      });

      if (!productsAvailable) {
        if (productsToRemove.length) {
          setTimeout(() => {
            productsToRemove.reverse().forEach((index) => {
              // Remove from cart
              this.cartData.items.splice(index, 1);
            });
          }, 5000);
        }

        return "productError";
      }

      //
      // If user has no shipping/billing addresses, add the ones from checkout
      //

      // Shipping
      let shippingDefault = false;
      if (
        this.userData.loggedIn &&
        !this.userData.customerAddresses.shipping.length
      ) {
        shippingDefault = this.cartData.addresses.shipping;
      }

      // Billing
      let billingDefault = false;
      if (this.showBilling && this.userData.loggedIn) {
        billingDefault = this.cartData.addresses.billing;
      }

      if (shippingDefault || billingDefault) {
        // Woo object
        const userUpdate = {
          id: this.userData.ID,
          meta_data: [],
        };

        if (shippingDefault) {
          userUpdate["meta_data"].push({
            key: "user_shipping_addresses",
            value: [shippingDefault],
          });

          // Also save it in state
          this.userData.customerAddresses.shipping.push(shippingDefault);
        }

        if (billingDefault) {
          userUpdate["meta_data"].push({
            key: "user_billing_addresses",
            value: [billingDefault],
          });

          // Also save it in state
          this.userData.customerAddresses.billing.push(billingDefault);
        }

        // Send addresses to woo
        await updateUser(userUpdate);
      }

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

    articleDate(article) {
      const monthNames = [
        "Ianuarie",
        "Februarie",
        "Martie",
        "Aprilie",
        "Mai",
        "Iunie",
        "Iulie",
        "August",
        "Septembrie",
        "Octombrie",
        "Noiembrie",
        "Decembrie",
      ];

      const date = new Date(article.date);
      return `${date.getDate()} ${
        monthNames[date.getMonth()]
      } ${date.getFullYear()}`;
    },

    articleURL(article) {
      return `/blog/${article.slug}`;
    },

    scrollToElement(element) {
      var headerOffset =
        document.querySelector("header.menu-header").clientHeight;
      var elementPosition = element.value.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
  },
});
