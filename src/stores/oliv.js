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
    showCartDrawer: false,
    showAddressesModal: false,
    currentPage: false,
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
      customerOrdersData: false,
    },
    cartData: {
      items: [],
      coupon: {
        codes: false,
        error: false,
      },
      addresses: {
        billing: false,
        shipping: false,
        pool: false,
      },
      paymentMethod: false,
      orderExtras: {
        cutlery: {
          title: "Da, doresc tacamuri",
          active: false,
        },
        makepaw: {
          title: "Make PAW not war!",
          active: false,
        },
      },
      totalQty: 0,
      subTotal: 0,
      totalDiscount: 0,
      totalShipping: 0,
      totalPrice: 0,
    },
    shippingData: false,
    paymentData: {
      methods: {
        cashod: "Cash la livrare",
        cardod: "Card la livrare",
      },
    },
    addressForm: {
      show: false,
      title: false,
      buttonText: false,
      action: false,
      addressIndex: false,
      addressFor: false,
      addressCeateError: false,
      formData: false,
      addressFieldsMapping: {
        first_name: {
          name: "Nume",
          type: "text",
          required: true,
          value: "",
        },
        last_name: {
          name: "Prenume",
          type: "text",
          required: true,
          value: "",
        },
        company: {
          name: "Companie",
          type: "text",
          required: false,
          value: "",
        },
        address_1: {
          name: "Adresa",
          type: "text",
          required: true,
          value: "",
        },
        address_2: {
          name: "Alte indicatii pentru a te gasi mai usor",
          type: "textarea",
          required: false,
          value: "",
        },
        city: {
          name: "Oras/Localitate",
          required: true,
          type: "text",
          value: "",
        },
        phone: {
          name: "Telefon",
          type: "tel",
          required: true,
          value: "",
        },
        shipping: {
          name: "Seteaza ca adresa de livrare",
          type: "checkbox",
          required: false,
          value: false,
        },
        billing: {
          name: "Seteaza ca adresa de facturare",
          type: "checkbox",
          required: false,
          value: false,
        },
        // Not needed
        postcode: {
          name: "Cod Postal",
          type: "hidden",
          required: false,
          value: "",
        },
        // Not needed - defaults to Romania
        country: {
          name: "Tara",
          type: "hidden",
          required: false,
          value: "Romania",
        },
        // Not needed - defaults to Iasi
        state: {
          name: "Judet",
          type: "hidden",
          required: false,
          value: "Iasi",
        },
        distance: {
          name: "Distanta de la sediu pana la adresa",
          type: "hidden",
          required: false,
          value: false,
        },
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
     * Check if a product already exists in cart and returns it
     * Used in addToCart() to avoid duplicates in cart
     * @param {Object} state the store's state
     * @param {Object} product the Woo product object
     * @param {Object} extras "extra ID": { element: "extra input ref", price: extra price }
     * @returns {Object/Bool} the cart item/false if it doesn't exist
     */
    getProductFromCartIfExists: (state) => {
      return (product, extras) => {
        return state.cartData.items.find((item) => {
          if (item.id === product.id) {
            if (extras) {
              // Use for loop because we want to stop execution
              for (const [extraId, extraInput] of Object.entries(extras)) {
                const itemMatches = item.productExtras.filter(
                  (itemExtra) =>
                    itemExtra._id === extraId &&
                    itemExtra.extraQty === extraInput.value
                );

                if (itemMatches.length < 1) return false;
              }
            }
            return item;
          }
          return false;
        });
      };
    },

    /**
     * Return product object by id
     * @param {Object} state the store's state
     * @param {Int} id product id
     * @returns Woo product object
     */
    getProductById: (state) => {
      return (id) => {
        if (state.storeData.products) {
          const product = state.storeData.products.filter(
            (prod) => prod.id === id
          );

          return product[0];
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

    /**
     * If user is logged in get his general info, addresses and order history
     * @param {Object} state the store's state
     * @returns nothing. It just updates the store's state.
     */
    getCustomerData: (state) => {
      customerData(state.userData.ID).then((data) => {
        // Keep only the data that we need
        state.userData["avatarUrl"] = data.data.avatar_url;
        state.userData["firstName"] = data.data.first_name;
        state.userData["lastName"] = data.data.last_name;
        state.userData["email"] = data.data.email;

        // Get addresses
        data.data.meta_data.forEach((meta) => {
          if (meta.key === "user_addresses") {
            if (meta.value.length) {
              // All addresses
              state.cartData.addresses.pool = meta.value;

              // Set shipping and billing
              meta.value.forEach((address) => {
                if (address.shipping)
                  state.cartData.addresses.shipping = address;
                if (address.billing) state.cartData.addresses.billing = address;
              });
            }
          }
        });
      });

      customerOrders(state.userData.ID).then(
        (data) => (state.userData["customerOrdersData"] = data.data)
      );
    },

    /**
     * @param {Object} address the address object. See addressFieldsMapping.
     * @returns {Int} the index number of the address
     */
    getAddressIndex() {
      return (address) => {
        let index = false;
        this.cartData.addresses.pool.forEach(
          (userAddress, userAddressIndex) => {
            const addressExists = this.compareAddressObjects(
              userAddress,
              address
            );
            if (addressExists) index = userAddressIndex;
          }
        );

        return index;
      };
    },

    /**
     * Returns data about the cost of shipping
     * @param {Object} state the store's state
     * @param {Float} distance the distance from store to client
     * @returns {Array/Bool} fees data/false if address is too far
     */
    getDistanceFees: (state) => {
      return (distance) => {
        const fees = state.shippingData.shipping_options.exwfood_adv_feekm;
        const results = fees.filter((fee) => parseFloat(fee.km) <= distance);
        return results.length ? results[results.length - 1] : false;
      };
    },

    /**
     * Check if shipping and billing are the same
     * @param {Object} state the store's state
     * @returns {Bool}
     */
    getSameWithShipping(state) {
      if (
        !state.cartData.addresses.shipping ||
        !state.cartData.addresses.billing
      )
        return false;

      return this.compareAddressObjects(
        state.cartData.addresses.shipping,
        state.cartData.addresses.billing
      );
    },

    /**
     * Get user addresses that are not billing and shipping
     * @param {Object} state the store's state
     * @returns {Array/Bool} addresses/false if there are none
     */
    getUserExtraAddresses(state) {
      let extraAddresses = false;
      if (state.cartData.addresses.pool.length)
        extraAddresses = state.cartData.addresses.pool.filter(
          (address) => !address.shipping && !address.billing
        );

      return extraAddresses.length ? extraAddresses : false;
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
        this.shippingData = data.data;
      });

      // Check if user is logged in
      this.userActions("verify");

      // Check user cart cookie
      this.checkCart();

      this.$patch({ isLoaded: true });
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
            userAccountActions(
              "verify",
              null,
              null,
              null,
              loggedInCookie,
              null
            ).then((data) => {
              if (data.data.success) {
                this.userData.loggedIn = true;
                this.userData["ID"] = data.data.success.userData.ID;
                this.getCustomerData;
              }
            });
          }

          this.storeLiveUpdate = false;
          break;

        case "login":
          await userAccountActions(action, user, null, pass, null, null).then(
            (data) => {
              if (data.data.success) {
                cookies.set(
                  "oliv_logged_in",
                  data.data.success.cookie,
                  data.data.success.expires
                );
                this.userData.loggedIn = true;
                this.userData["ID"] = data.data.success.userData.ID;
                this.getCustomerData;
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
          this.cartData.addresses = {
            shipping: false,
            billing: false,
            pool: false,
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
     * Converts number like 5,99 to float
     * I'm using this because parseFloat causes multiple decimals when adding results
     * @param {String} number a number in string format with comma separator. Eg: 5,99
     * @returns {Float}
     */
    toFloat(number) {
      const numberSplit = number.split(",");
      return parseInt(numberSplit[0]) + parseInt(numberSplit[0]) / 100;
    },

    /**
     * Update cart after quantities change
     */
    async updateCartTotals() {
      // Cart product object:
      //
      // id -> product ID
      // productQty -> quantity
      // productPrice -> product price
      // productExtras -> array with extra options:
      //    _id -> extra ID
      //    extraName -> extra name
      //    extraQty -> extra quantity
      //    extraPrice -> extra price
      // productWithExtrasPrice -> product price including extras === Is updated here
      // itemTotal -> productQty * productWithExtrasPrice - item total price === Is updated here
      // isFirstTime -> bool - Used to add extras on "quick add"
      let cartTotalQty = 0;
      let cartSubTotalPrice = 0;
      this.cartData.items.forEach((product) => {
        let extrasPrice = 0;
        product.productExtras.forEach((extra) => {
          if (extra.extraQty > 0)
            extrasPrice += extra.extraQty * extra.extraPrice;
        });

        product.productWithExtrasPrice =
          parseFloat(product.productPrice) + extrasPrice;
        product.itemTotal = product.productWithExtrasPrice * product.productQty;

        cartTotalQty += parseInt(product.productQty);
        cartSubTotalPrice += product.itemTotal;
      });

      this.cartData.totalQty = cartTotalQty;
      this.cartData.subTotal = cartSubTotalPrice;

      // Set coupon discount
      let cartDiscount = 0;
      if (this.cartData.coupon.codes.length) {
        this.cartData.coupon.codes.forEach((coupon) => {
          if (coupon.discount_type === "percent") {
            coupon["discount"] =
              (parseInt(coupon.amount) * this.cartData.subTotal) / 100;
            cartDiscount += coupon.discount;
          }
        });
      }
      this.cartData.totalDiscount = cartDiscount;

      // Set shipping cost
      const totalShipping = await this.addressShippingPrice().then(
        (price) => price
      );

      if (totalShipping) {
        this.cartData.totalShipping = this.toFloat(totalShipping);
      } else {
        this.cartData.totalShipping = 0;
      }

      const totalPrice =
        cartSubTotalPrice -
        this.cartData.totalDiscount +
        this.cartData.totalShipping;
      this.cartData.totalPrice = totalPrice;

      // Save cart in cookie for 1 week
      cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
    },

    /**
     * Check for identical products in cart and merge them
     */
    mergeCartProducts() {
      this.cartData.items.forEach((compareItem, compareItemIndex) => {
        this.cartData.items.filter((compareToItem, compareToItemIndex) => {
          if (
            compareItemIndex !== compareToItemIndex &&
            compareItem.id === compareToItem.id &&
            JSON.stringify(compareItem.productExtras) ===
              JSON.stringify(compareToItem.productExtras)
          ) {
            this.$patch((state) => {
              // Update qty
              state.cartData.items[compareItemIndex].productQty +=
                compareToItem.productQty;

              // Remove product
              state.cartData.items.splice(compareToItemIndex, 1);
            });
          }
        });
      });

      // Update totals
      this.updateCartTotals();
    },

    /**
     * Check the cart cookie and save it in the shop's state
     */
    checkCart() {
      const userCart = cookies.get("oliv_cart");
      if (userCart) this.cartData = userCart;
    },

    /**
     * Show the cart sidebar drawer
     */
    showCartDrawerAction() {
      this.mergeCartProducts();
      this.showCartDrawer = !this.showCartDrawer;
    },

    /**
     * Create order parameters to be sent to Woo via API and create a new order
     * @returns {Object} orderParams
     */
    createOrderParams() {
      let orderParams = {};

      if (this.userData) {
        orderParams.customer_id = this.userData.loggedIn
          ? this.userData.loggedIn.ID
          : 0;
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
              display_value: productExtra.extraQty,
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
      orderParams.payment_method = this.cartData.paymentMethod;
      orderParams.payment_method_title =
        this.paymentData.methods[this.cartData.paymentMethod];

      // Add coupon(s)
      orderParams.coupon_lines = [];
      if (this.cartData.coupon.codes) {
        this.cartData.coupon.codes.forEach((couponData) =>
          orderParams.coupon_lines.push({ code: couponData.code })
        );
      }

      // Delivery address
      orderParams.shipping = this.cartData.addresses.shipping;

      // Billing address
      orderParams.billing = this.cartData.addresses.billing;

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

      return orderParams;
    },

    /**
     * Add coupon to order and update cart totals
     * @param {String} coupon the coupon code
     */
    async addOrderCoupon(coupon) {
      // Check if the coupon input field is not empty
      if (!coupon) {
        this.cartData.coupon.error = "Te rugam introdu codul cuponului!";
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
      //     this.cartData.coupon.error = "Cuponul este deja aplicat!";
      //     return false;
      //   }
      // }

      // Check if the coupon exists in woo
      this.storeLiveUpdate = true;
      await getCoupon(coupon).then((data) => {
        const couponData = data.data;
        if (couponData.length) {
          // Init coupon.codes
          if (!this.cartData.coupon.codes) this.cartData.coupon.codes = [];
          // Coupoon exists, add it to cartData
          this.$patch((state) => {
            state.cartData.coupon.codes.push({
              code: coupon,
              discount_type: couponData[0].discount_type,
              amount: couponData[0].amount,
            });
          });
        } else {
          this.cartData.coupon.error = "Cupon invalid!";
        }
        this.storeLiveUpdate = false;
      });
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
        this.$patch((state) => {
          state.cartData.coupon.codes.splice(
            state.cartData.coupon.codes[couponIndexToRemove],
            1
          );
        });
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
    async handleUserAddress() {
      // Show loading screen
      this.storeLiveUpdate = true;

      // User addresses array. Gets sent with the user data to Woo
      let userAddresses = this.cartData.addresses.pool.length
        ? Object.values(Object.assign({}, this.cartData.addresses.pool))
        : [];

      // Address data
      let newUserAddress = this.addressForm.formData;

      // Get action - create, update, delete
      const action = this.addressForm.action;

      if (action !== "delete") {
        const addressFound = await gmapsCheckUserAddress(
          this.shippingData,
          `${newUserAddress.address_1}, ${newUserAddress.city}`,
          "geocode"
        ).then((result) => result);

        // If is string it means the address was not found
        if (typeof addressFound === "string") {
          this.addressForm.addressCeateError = addressFound;
          this.storeLiveUpdate = false;
          return;
        }

        const distanceToAddress = await gmapsCheckUserAddress(
          this.shippingData,
          `${newUserAddress.address_1}, ${newUserAddress.city}`,
          "getDistance"
        ).then((result) => result);

        // If is string it means the address is too far
        if (typeof distanceToAddress === "string" && newUserAddress.shipping) {
          this.addressForm.addressCeateError = distanceToAddress;
          this.storeLiveUpdate = false;
          return;
        }

        // If is number it means it's eligible for
        if (typeof distanceToAddress === "number")
          newUserAddress.distance = distanceToAddress;

        const shippingIndex = userAddresses.findIndex(
          (address) => address.shipping
        );

        const billingIndex = userAddresses.findIndex(
          (address) => address.billing
        );

        // Set as shipping
        if (shippingIndex !== -1) {
          // User has a shipping address
          if (newUserAddress.shipping && newUserAddress.distance) {
            // Set it to false if newUserAddress.shipping = true
            userAddresses[shippingIndex].shipping = false;
          }
        } else if (newUserAddress.distance) {
          // Set it as shipping if none is present
          newUserAddress.shipping = true;
        }

        // Set as billing
        if (billingIndex !== -1) {
          // User has a billing address
          if (newUserAddress.billing) {
            // Set it to false if newUserAddress.billing = true
            userAddresses[billingIndex].billing = false;
          }
        } else {
          // Set it as billing if none is present
          newUserAddress.billing = true;
        }
      }

      switch (action) {
        case "create":
          // Set default values for shipping/billing
          if (typeof newUserAddress.shipping === "undefined")
            newUserAddress.shipping = false;

          if (typeof newUserAddress.billing === "undefined")
            newUserAddress.billing = false;

          userAddresses.push(newUserAddress);
          break;

        case "update":
          userAddresses[this.addressForm.addressIndex] = newUserAddress;
          break;

        case "delete":
          userAddresses.splice(this.addressForm.addressIndex, 1);

          // If only 1 remains, set as billing and shipping
          if (userAddresses.length === 1) {
            // Set as shipping
            if (typeof userAddresses[0].distance === "number") {
              userAddresses[0].shipping = true;
              this.cartData.addresses.shipping = userAddresses[0];
            }
            // Set as billing
            userAddresses[0].billing = true;
            this.cartData.addresses.billing = userAddresses[0];
          }
          break;
      }

      // Update in woo
      if (this.userData.loggedIn) {
        const userUpdate = {
          id: this.userData.ID,
          meta_data: [
            {
              key: "user_addresses",
              value: userAddresses,
            },
          ],
        };

        if (userAddresses.length === 1) {
          userUpdate["first_name"] = userAddresses[0].first_name;
          userUpdate["last_name"] = userAddresses[0].last_name;
        }
        await updateUser(userUpdate);
      } else {
        // Remove addresses that have shipping and billing as false
        // Do this to only allow 2 addresses to guest checkouts
        userAddresses = userAddresses.filter(
          (address) => address.shipping || address.billing
        );
      }

      // Update new shipping
      const newShippingIndex = userAddresses.findIndex(
        (address) => address.shipping
      );

      // Update new billing
      const newBillingIndex = userAddresses.findIndex(
        (address) => address.billing
      );

      this.$patch((state) => {
        state.cartData.addresses.pool = userAddresses;

        state.cartData.addresses.shipping =
          newShippingIndex !== -1 ? userAddresses[newShippingIndex] : false;

        state.cartData.addresses.billing =
          newBillingIndex !== -1 ? userAddresses[newBillingIndex] : false;
      });

      // Update cart cookie
      cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");

      // Reset stuff
      this.addressForm.show = false;
      this.resetAddressForm();
      this.addressForm.addressIndex = false;
      this.storeLiveUpdate = false;

      return;
    },
    /**
     * Show user address create/update form
     *
     * @param {String} title The heading of the form
     * @param {String} buttonText Submit button text
     * @param {String} action The action for the current form data: create or update address
     * @param {Int} addressIndex The index of the address that needs to be updated
     * @returns updates the store state and shows the ModalUserAddress component
     */
    showUserAddressForm(title, buttonText, action, addressIndex) {
      // Reset error message
      this.addressForm.addressCeateError = false;

      // Check if he reached the max number of addresses
      if (
        this.cartData.addresses.pool &&
        this.cartData.addresses.pool.length >= 10 &&
        action === "create"
      ) {
        alert(
          "Ai atins numarul maxim de adrese! Editeaza sau sterge una dintre cele existente."
        );
        return;
      }

      // Set store addressForm data
      this.addressForm.show = true;
      this.addressForm.title = title;
      this.addressForm.buttonText = buttonText;
      this.addressForm.action = action;

      if (action === "update") {
        this.addressForm.formData = Object.assign(
          {},
          this.cartData.addresses.pool[addressIndex]
        );
        this.addressForm.addressIndex = addressIndex;
      }

      if (this.addressForm.formData === false) {
        this.addressForm.formData = {};
        for (const [fieldName, fieldData] of Object.entries(
          this.addressForm.addressFieldsMapping
        )) {
          // Ignore shipping and billing values
          if (["shipping", "billing"].indexOf(fieldName) === -1) {
            this.addressForm.formData[fieldName] = fieldData.value;
          }
        }
      }
    },

    /**
     * Deletes user's address
     * @param {Int} addressIndex
     */
    deleteUserAddress(addressIndex) {
      this.addressForm.action = "delete";
      this.addressForm.addressIndex = addressIndex;
      this.handleUserAddress();
    },

    /**
     * Sets user address for shipping or billing
     * @param {Int} addressIndex
     * @param {String} addressFor "shipping" or "billing"
     */
    updateUserAddressFor(addressIndex, addressFor) {
      this.addressForm.action = "update";
      this.addressForm.addressIndex = addressIndex;
      this.addressForm.formData = Object.assign(
        {},
        this.cartData.addresses.pool[addressIndex]
      );
      this.addressForm.formData[addressFor] = true;

      this.handleUserAddress();
      this.showAddressesModal = false;
    },

    /**
     * Check if user address exists using gmaps API
     * and also checks if is in range of delivery
     * see gmapsCheckUserAddress in /src/api/gmaps.js
     * @param {String} clientAddress
     * @returns {Float/Bool} delivery distance/false
     */
    checkUserAddress(clientAddress) {
      this.storeLiveUpdate = true;
      return gmapsCheckUserAddress(this.shippingData, clientAddress).then(
        (response) => {
          // If response is float then address exists and is in range
          this.storeLiveUpdate = false;
          return response;
        }
      );
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
     * Get the shipping price for the shipping address
     * It's used in cart and it's considering the final cart price(eg. with discounts applied)
     * @returns {Float} the price
     */
    async addressShippingPrice() {
      const shippingAddress = this.cartData.addresses.shipping;
      if (shippingAddress) {
        // Update address to get the distance
        if (!shippingAddress.distance) {
          await this.checkUserAddress(
            `${shippingAddress.address_1}, ${shippingAddress.city}`
          ).then((distance) => {
            // Update address in Woo
            shippingAddress.distance = distance;
            this.addressForm.formData = shippingAddress;
            this.addressForm.addressIndex =
              this.getAddressIndex(shippingAddress);

            this.addressForm.action = "update";
            this.handleUserAddress();
          });
        }

        const distanceFees = this.getDistanceFees(shippingAddress.distance);

        const cartSubTotal =
          this.cartData.subTotal - this.cartData.totalDiscount;

        if (cartSubTotal < distanceFees.free) {
          return distanceFees.fee;
        }
      }
      return 0;
    },

    /**
     * Reset the address form v-model data(addressForm.formData)
     */
    resetAddressForm() {
      this.addressForm.formData = {};
      for (const [fieldName, fieldData] of Object.entries(
        this.addressForm.addressFieldsMapping
      )) {
        // Ignore shipping and billing values because those are set when calling showUserAddressForm()
        if (["shipping", "billing"].indexOf(fieldName) === -1) {
          this.addressForm.formData[fieldName] = fieldData.value;
        }
      }
    },

    /**
     * Sends order to Woo
     * @returns {Int/Bool} order id or false onerror
     */
    async submitOrder() {
      this.storeLiveUpdate = true;

      const cartProductsIds = this.cartData.items.map((product) => product.id);
      const productsAvailable = await productsData(cartProductsIds).then(
        (data) => {
          this.storeLiveUpdate = false;
          // Loop through products to check if they are in stock
          data.data.forEach((product, productIndex) => {
            if (product.stock_status !== "instock") {
              // Out of stock
              this.cartData.items[
                productIndex
              ].errorMsg = `Ne pare rau, dar acest produs nu mai este in stoc!`;

              setTimeout(() => {
                this.updateCartItems(
                  "update",
                  this.cartData.items[productIndex],
                  productIndex,
                  parseInt(product.stock_quantity)
                );
              }, 5000);

              return false;
            }

            if (
              product.stock_status === "instock" &&
              typeof product.stock_quantity === "number"
            ) {
              // Limited stock
              const cartProductQty =
                this.cartData.items[productIndex].productQty;
              if (parseInt(product.stock_quantity) < cartProductQty) {
                this.cartData.items[
                  productIndex
                ].errorMsg = `Ne pare rau, dar mai avem doar ${product.stock_quantity} produse in stoc! Am schimbat noi cantitatea pentru tine.`;

                this.updateCartItems(
                  "update",
                  this.cartData.items[productIndex],
                  productIndex,
                  parseInt(product.stock_quantity)
                );

                return false;
              }
            }
          });

          return true;
        }
      );

      if (!productsAvailable) return "productError";

      return await createOrder(this.createOrderParams()).then((data) => {
        this.storeLiveUpdate = false;

        if (data.data.id) {
          //
          // The order has been created
          //

          // Reset cart data, but keep addresses(for guests)
          this.cartData = {
            items: [],
            coupon: {
              codes: false,
              error: false,
            },
            addresses: {
              billing: this.cartData.addresses.billing,
              shipping: this.cartData.addresses.shipping,
              pool: this.cartData.addresses.pool,
            },
            paymentMethod: false,
            orderExtras: {
              cutlery: {
                title: "Da, doresc tacamuri",
                active: false,
              },
              makepaw: {
                title: "Make PAW not war!",
                active: false,
              },
            },
            totalQty: 0,
            subTotal: 0,
            totalDiscount: 0,
            totalShipping: 0,
            totalPrice: 0,
          };

          cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
          console.log(data.data);
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
  },
});
