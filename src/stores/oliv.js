import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

import {
  websiteOptions,
  pageData,
  productsData,
  productsCatData,
  userAccountActions,
  customerData,
  customerOrders,
  getCoupon,
  createOrder,
  updateOrder,
  shippingData,
  updateUser,
  createUser,
  getPaymentGateways,
} from "@/api";

import { gmapsCheckUserAddress } from "@/api/gmaps.js";

const { cookies } = useCookies();

export const useOlivStore = defineStore({
  id: "oliv",
  state: () => ({
    websiteOptions: [],
    pageData: [],
    storeData: {},
    storeLiveUpdate: false,
    showCartDrawer: false,
    showAddressesModal: false,
    cartData: {
      orderId: false,
      shippingId: false,
      coupon: {
        codes: false,
        error: false,
      },
      items: [],
      totalQty: 0,
      subTotal: 0,
      totalDiscount: 0,
      totalShipping: 0,
      totalPrice: 0,
    },
    shippingData: false,
    addressForm: {
      show: false,
      title: false,
      action: false,
      addressIndex: false,
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
          value: "",
        },
      },
    },
    userData: {
      credentials: {
        user: "",
        pass: "",
        vpass: "",
      },
      customerData: false,
      customerOrdersData: false,
      addressCreateData: {
        error: false,
        address: false,
      },
    },
  }),
  getters: {
    getPageBySlug: (state) => {
      return (slug) => state.pageData.filter((page) => page.slug === slug)[0];
    },
    getAllProductsByCategory: (state) => {
      // Orders products by category
      let products = [];
      if (state.storeData.products) {
        for (const catNumber in state.storeData.categories) {
          state.storeData.products.filter((product) => {
            product.categories.every((cat) => {
              if (cat.id === state.storeData.categories[catNumber].term_id) {
                products.push(product);
              }
            });
          });
        }
      }
      return products;
    },
    getProductFromCartIfExists: (state) => {
      // @product object
      // @extras object "extra ID": "extra input ref"
      return (product, extras) => {
        return state.cartData.items.find((item) => {
          if (item.id === product.id) {
            for (const extra in extras) {
              const itemMatches = item.productExtras.filter(
                (itemExtra) =>
                  itemExtra._id === extra &&
                  itemExtra.extraQty === extras[extra].value
              );

              if (itemMatches.length < 1) return false;
            }
            return item;
          }
          return false;
        });
      };
    },
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
    getCustomerData: (state) => {
      customerData(state.userData.success.ID).then(
        (data) => (state.userData["customerData"] = data.data)
      );

      customerOrders(state.userData.success.ID).then(
        (data) => (state.userData["customerOrdersData"] = data.data)
      );
    },
    // Get user addresses
    // @addressFor - string - shipping or billing
    getUserAddresses: (state) => {
      return (addressFor) => {
        const userAddresses = state.userData.customerData.meta_data.filter(
          (meta) => meta.key === "user_addresses"
        );

        if (userAddresses[0]) {
          if (addressFor) {
            return userAddresses[0].value.filter(
              (address) => address[addressFor]
            )[0];
          }

          return userAddresses[0].value;
        } else return false;
      };
    },
    getAddressIndex() {
      return (address) => {
        let index = false;
        this.getUserAddresses().forEach((userAddress, userAddressIndex) => {
          const addressExists = this.compareAddressObjects(
            userAddress,
            address
          );
          if (addressExists) index = userAddressIndex;
        });

        return index;
      };
    },
    getDistanceFees: (state) => {
      return (distance) => {
        const fees = state.shippingData.shipping_options.exwfood_adv_feekm;
        const results = fees.filter((fee) => parseFloat(fee.km) <= distance);
        return results[results.length - 1];
      };
    },
    getSameWithShipping(state) {
      return this.compareAddressObjects(
        state.userData.customerData.shipping,
        state.userData.customerData.billing
      );
    },
    getUserExtraAddresses() {
      const userAddresses = this.getUserAddresses();
      let extraAddresses = false;
      if (
        userAddresses.length &&
        userAddresses.filter((address) => !address.shipping && !address.billing)
          .length > 0
      )
        extraAddresses = true;

      return extraAddresses;
    },
  },
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

      shippingData().then((data) => {
        this.shippingData = data.data;
      });

      this.userActions("verify");

      this.checkCart();
    },

    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
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

      // Start creation process
      this.storeLiveUpdate = true;

      const userData = {
        email: this.userData.credentials.user,
        username: this.userData.credentials.user,
        pass: this.userData.credentials.pass,
      };

      await createUser(userData).then((result) => {
        console.log(result);
        this.storeLiveUpdate = false;
      });
    },
    // User actions( see user_actions() in custom-api-endpoints.php ):
    // - uses userAccountActions (action, user, email, pass, cookie, key) from @/api/index.js
    //
    // 1. action = verify | Verify if is logged in. Runs on load with initWebsite()
    // 2. action = login | Log in user. Returns user logged_in cookie and user data
    // 3. REMOVED action = register | Create new account. Returns user logged_in cookie and user data
    // 4. action = reset | Reset password
    // 5. action = recovery | The actual password reset
    async userActions(action, user, email, pass, key) {
      this.storeLiveUpdate = true;
      const loggedInCookie = cookies.get("oliv_logged_in");

      switch (action) {
        case "verify":
          // Get logged-in cookie
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
                this.userData.success = data.data.success.userData.data;
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
                this.userData.success = data.data.success.userData.data;
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
          this.userData.success = false;
          cookies.remove("oliv_logged_in");
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
                this.userData.success = data.data.success.userData.data;
              }

              if (data.data.error) {
                this.userData.error = data.data.error;
              }

              this.storeLiveUpdate = false;
            }
          );
          break;

        // case "register":
        //   userAccountActions(action, null, email, pass, null, null).then(
        //     (data) => {
        //       if (data.data.success) {
        //         cookies.set(
        //           "oliv_logged_in",
        //           data.data.success.cookie,
        //           data.data.success.expires
        //         );
        //         this.userData.success = data.data.success.userData.data;
        //       }

        //       if (data.data.error) {
        //         this.userData.error = data.data.error;
        //       }
        //     }
        //   );
        //   break;

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
                this.userData.success = data.data.success.userData.data;
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
    // Update cart after quantities change
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
        this.cartData.totalShipping = parseFloat(
          totalShipping.replace(",", ".")
        );
      } else {
        this.cartData.totalShipping = 0;
      }

      const totalPrice =
        cartSubTotalPrice -
        this.cartData.totalDiscount +
        this.cartData.totalShipping;
      this.cartData.totalPrice = parseFloat(totalPrice).toFixed(2);

      // Save cart in cookie for 1 week
      cookies.set("oliv_cart", JSON.stringify(this.cartData), "7D");
    },
    addToCart(product, extras, quantity, isFirstTime) {
      // Fisrt this.mergeCartProducts() to set all isFirstTime to false and merge the products
      this.mergeCartProducts();

      const sameProductCartItem = this.getProductFromCartIfExists(
        product,
        extras
      );

      if (sameProductCartItem) {
        sameProductCartItem.productQty += quantity;
      } else {
        // Cart product object:
        //
        // id -> product ID === Is added here
        // productQty -> quantity === Is added here
        // productPrice -> product price === Is added here
        // productExtras -> array with extra options: === Is added here
        //    _id -> extra ID === Is added here
        //    extraName -> extra name === Is added here
        //    extraQty -> extra quantity === Is added here
        //    extraPrice -> extra price === Is added here
        // productWithExtrasPrice -> product price including extras
        // itemTotal -> productQty * productWithExtrasPrice - item total price
        // isFirstTime -> bool - Used to add extras on "quick add" === Is added here
        let cartProductExtras = [];
        let currentProductExtras = this.getProductExtras(product);

        if (currentProductExtras) {
          for (const extra in extras) {
            for (const currentExtra in currentProductExtras) {
              if (currentProductExtras[currentExtra]._id === extra) {
                cartProductExtras.push({
                  _id: currentProductExtras[currentExtra]._id,
                  extraName: currentProductExtras[currentExtra]._name,
                  extraQty: extras[extra].value,
                  extraPrice: currentProductExtras[currentExtra]._price,
                });
              }
            }
          }
        }

        this.cartData.items.push({
          id: product.id,
          productQty: quantity,
          productPrice: product.price,
          productExtras: cartProductExtras,
          productWithExtrasPrice: 0, // Will be updated with this.updateCartTotals()
          itemTotal: 0, // Will be updated with this.updateCartTotals()
          isFirstTime: isFirstTime,
        });
      }

      // Update totals
      this.updateCartTotals();
    },
    removeFromCart(index) {
      if (this.cartData.orderId) {
        // Set to 0 to update the woo cart
        this.cartData.items[index].productQty = 0;

        this.updateCartTotals();

        // Update woo cart
        this.handleOrder(
          "put",
          this.createOrderParams(),
          this.cartData.orderId
        );
      }

      // Remove
      this.cartData.items.splice(index, 1);

      // Update totals
      this.updateCartTotals();
    },
    mergeCartProducts() {
      // Check if there is already a first time item and add it to the rest
      const itemFirstTime = this.cartData.items.find(
        (item) => item.isFirstTime
      );

      // Add it to the rest
      if (itemFirstTime) {
        // Merge it with another identical product
        this.cartData.items.find((item) => {
          if (
            item.id === itemFirstTime.id &&
            item.productExtras === itemFirstTime.productExtras &&
            !item.isFirstTime
          ) {
            item.productQty += itemFirstTime.productQty;
          }
        });

        itemFirstTime.isFirstTime = false;
      } else {
        this.cartData.items.forEach((compareItem, compareItemIndex) => {
          this.cartData.items.filter((compareToItem, compareToItemIndex) => {
            if (
              compareItemIndex !== compareToItemIndex &&
              compareItem.id === compareToItem.id &&
              JSON.stringify(compareItem.productExtras) ===
                JSON.stringify(compareToItem.productExtras)
            ) {
              compareItem.productQty += compareToItem.productQty;
              this.removeFromCart(compareToItemIndex);
            }
          });
        });
      }

      // Update totals
      this.updateCartTotals();
    },
    updateCartItems(action, item, index, qty) {
      if (action === "update") {
        if (qty > 0) {
          item.productQty = qty;
        } else {
          this.removeFromCart(index);
        }
      }

      if (action === "add") {
        item.productQty += qty;
      }

      if (action === "sub" && item.productQty - qty > -1) {
        item.productQty -= qty;
        if (item.productQty == 0) {
          this.removeFromCart(index);
        }
      }

      // Update totals
      this.updateCartTotals();
    },
    checkCart() {
      const userCart = cookies.get("oliv_cart");
      if (userCart) this.cartData = userCart;
    },
    handleExtra(action, eventTarget, product, extra, onlyFirstTime) {
      // Update extra on first time add to cart

      // Limit to maximum 10 extras
      if (action === "add" && eventTarget.value < 10) eventTarget.value++;
      if (action === "sub" && eventTarget.value > 0) eventTarget.value--;

      // Limit to maximum 10 extras
      if (action === "update" && eventTarget.value > 10) eventTarget.value = 10;
      if (action === "update" && eventTarget.value < 0) eventTarget.value = 0;

      if (onlyFirstTime) {
        const itemFirstTime = this.cartData.items.find((item) => {
          if (item.isFirstTime && item.id === product.id) return item;
        });

        if (itemFirstTime) {
          itemFirstTime.productExtras.find((productExtra) => {
            if (productExtra._id == extra._id)
              productExtra.extraQty = eventTarget.value;
          });
        }
      } else {
        product.productExtras.find((productExtra) => {
          if (productExtra._id == extra._id)
            productExtra.extraQty = eventTarget.value;
        });

        // Update only if the woo order is not created because once it is, every action triggers a live update
        if (!this.cartData.orderId) this.mergeCartProducts();
      }

      // Update totals
      this.updateCartTotals();
    },
    showCartDrawerAction() {
      // Update only if the woo order is not created because once it is, every action triggers a live update
      if (!this.cartData.orderId) this.mergeCartProducts();

      this.showCartDrawer = !this.showCartDrawer;
    },
    createOrderParams(coupon) {
      let orderParams = {};

      if (this.userData) {
        orderParams.customer_id = this.userData.success.ID;
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

      orderParams.coupon_lines = [];

      if (coupon) {
        orderParams.coupon_lines.push({
          code: coupon,
        });
      }

      if (this.cartData.coupon.codes) {
        this.cartData.coupon.codes.forEach((couponData) =>
          orderParams.coupon_lines.push({ code: couponData.code })
        );
      }

      return orderParams;
    },
    createOrderAddressesParams() {
      this.storeLiveUpdate = true;
      const orderAddressesParams = {};

      if (
        this.userData.customerData.billing ||
        this.userData.customerData.shipping
      ) {
        orderAddressesParams["customer_id"] = this.userData.success.ID;
      }

      if (this.userData.customerData.billing) {
        orderAddressesParams.billing = this.userData.customerData.billing;
      }

      // Add addresses
      if (this.userData.customerData.shipping) {
        //
        // Get shipping price
        //

        // Get user shipping address from meta data
        const userAddresses = this.getUserAddresses();
        const userShippingAddress = userAddresses.filter(
          (address) => address.shipping === true
        )[0];
        const distanceFees = this.getDistanceFees(userShippingAddress.distance);

        orderAddressesParams.shipping_lines = [
          {
            method_id: "flat_rate",
            method_title: "Flat Rate",
            total: "0",
          },
        ];

        if (this.cartData.shippingId) {
          orderAddressesParams.shipping_lines[0].id = this.cartData.shippingId;
        }

        const cartSubTotal = this.cartData.subTotal;

        if (
          cartSubTotal < distanceFees.free &&
          cartSubTotal >= distanceFees.min_amount
        ) {
          orderAddressesParams.shipping_total = distanceFees.fee;
          orderAddressesParams.shipping_lines[0].total = distanceFees.fee;
        }

        orderAddressesParams.shipping = this.userData.customerData.shipping;
      }

      return orderAddressesParams;
    },
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
          // Coupoon exists, add it to cartData
          this.cartData.coupon.codes.push({
            code: coupon,
            discount_type: couponData[0].discount_type,
            amount: couponData[0].amount,
          });

          this.updateCartTotals();
        } else {
          this.cartData.coupon.error = "Cupon invalid!";
        }
        this.storeLiveUpdate = false;
      });
    },
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

        this.updateCartTotals();
      }
    },
    compareAddressObjects(obj1, obj2) {
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
    handleUserAddress() {
      // Show loading screen
      this.storeLiveUpdate = true;

      let formErrorMessage = "";

      const newUserAddress = this.addressForm.formData;

      // Check all required fields
      for (const [fieldName, fieldValue] of Object.entries(newUserAddress)) {
        if (
          this.addressForm.addressFieldsMapping[fieldName].required &&
          !fieldValue.length
        )
          formErrorMessage += `Campul "${this.addressForm.addressFieldsMapping[fieldName].name}" este obligatoriu!<br />`;
      }

      // Return if form errors
      if (formErrorMessage.length) {
        this.userData.addressCreateData.error = formErrorMessage;
        return;
      }

      // Verify if we deliver to that address

      //
      // No errors, continue
      //

      // Get action - create, update, delete
      const action = this.addressForm.action;

      // User addresses array. Gets sent with the user data.
      let userAddresses = this.getUserAddresses();

      // Get shipping and billing addresses
      let userShippingAddress = false;
      let userBillingAddress = false;
      if (userAddresses) {
        // Get user shipping address
        userShippingAddress = userAddresses.filter(
          (address) => address.shipping === true
        );

        // Get user billing address
        userBillingAddress = userAddresses.filter(
          (address) => address.billing === true
        );
      } else {
        userAddresses = [];
      }

      // Create API call object
      const userUpdate = {
        id: this.userData.customerData.id,
      };

      switch (action) {
        case "create":
          // At this point we can't have duplicate addresses when creating a new one
          // see submitUserAddress() in FormUserAddress.vue

          if (userShippingAddress.length) {
            // User has a shipping address
            if (newUserAddress.shipping) {
              // Set it to false if newUserAddress.shipping = true
              userShippingAddress[0].shipping = false;
              userUpdate.shipping = newUserAddress;
            }
          } else {
            // Set it as shipping if none is present
            newUserAddress.shipping = true;
            userUpdate.shipping = newUserAddress;
          }

          if (userBillingAddress.length) {
            // User has a billing address
            if (newUserAddress.billing) {
              // Set it to false if newUserAddress.billing = true
              userBillingAddress[0].billing = false;
              userUpdate.billing = newUserAddress;
            }
          } else {
            // Set it as billing if none is present
            newUserAddress.billing = true;
            userUpdate.billing = newUserAddress;
          }

          // If this is the first address set it automatically as shipping and billing
          if (!userAddresses.length) {
            userUpdate.first_name = newUserAddress.first_name;
            userUpdate.last_name = newUserAddress.last_name;
            newUserAddress.shipping = true;
            newUserAddress.billing = true;
            userUpdate.shipping = newUserAddress;
            userUpdate.billing = newUserAddress;
          }

          // Set defaulty values for shipping/billing
          if (!newUserAddress.shipping) newUserAddress.shipping = false;

          if (!newUserAddress.billing) newUserAddress.billing = false;

          userAddresses.push(newUserAddress);
          break;

        case "update":
          userAddresses[this.addressForm.addressIndex] = newUserAddress;
          break;

        case "delete":
          userAddresses.splice(this.addressForm.addressIndex, 1);

          // If only 1 remains, set as billing and shipping
          if (userAddresses.length === 1) {
            userAddresses[0].shipping = true;
            userAddresses[0].billing = true;
          }
          break;
      }

      if (userAddresses.length) {
        // reset userUpdate shipping and billing
        userUpdate.shipping = {};
        userUpdate.billing = {};
        for (const [fieldName, mappingValues] of Object.entries(
          this.addressForm.addressFieldsMapping
        )) {
          if (["shipping", "billing"].indexOf(fieldName) === -1) {
            userUpdate.shipping[fieldName] = mappingValues.value;
            userUpdate.billing[fieldName] = mappingValues.value;
          }
        }

        // Check user addresses for shipping and billing and update
        userAddresses.forEach((address) => {
          if (address.shipping) {
            userUpdate.shipping = address;
          }

          if (address.billing) {
            userUpdate.billing = address;
          }
        });
      }

      userUpdate.meta_data = [
        {
          key: "user_addresses",
          value: userAddresses,
        },
      ];

      updateUser(userUpdate).then((data) => {
        this.userData.customerData = data.data;
        this.addressForm.show = false;
        this.addressForm.formData = false;
        this.addressForm.addressIndex = false;
        this.storeLiveUpdate = false;
      });
    },
    showUserAddressForm(title, action, addressIndex) {
      // Reset error message
      this.userData.addressCreateData.error = false;

      // Get user addresses
      const userAddresses = this.getUserAddresses();

      // Check if he reached the max number of addresses
      if (userAddresses && userAddresses.length >= 10 && action === "create") {
        alert(
          "Ai atins numarul maxim de adrese! Editeaza sau sterge una dintre cele existente."
        );
        return;
      }

      // Set store addressForm data
      this.addressForm.show = true;
      this.addressForm.title = title;
      this.addressForm.action = action;

      // Get address to update
      const addressToUpdate = userAddresses[addressIndex];

      switch (action) {
        case "create":
          this.addressForm.formData = {};
          for (const [fieldName, fieldData] of Object.entries(
            this.addressForm.addressFieldsMapping
          )) {
            // Ignore shipping and billing values beacuse those are set when calling showUserAddressForm() in UserAddresses.vue
            if (["shipping", "billing"].indexOf(fieldName) === -1) {
              this.addressForm.formData[fieldName] = fieldData.value;
            }
          }
          break;

        case "update":
          this.addressForm.formData = Object.assign({}, addressToUpdate);
          this.addressForm.addressIndex = addressIndex;
          break;
      }
    },
    deleteUserAddress(addressIndex) {
      this.addressForm.action = "delete";
      this.addressForm.addressIndex = addressIndex;
      this.handleUserAddress();
    },
    updateUserAddressFor(addressIndex, addressFor) {
      this.addressForm.action = "update";
      this.addressForm.addressIndex = addressIndex;
      this.userData.customerData.meta_data.forEach((meta) => {
        if (meta.key === "user_addresses") {
          meta.value.forEach((address) => {
            if (address[addressFor]) address[addressFor] = false;
          });

          this.addressForm.formData = meta.value[addressIndex];
          this.addressForm.formData[addressFor] = true;
        }
      });

      this.handleUserAddress();
      this.showAddressesModal = false;
    },
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
    updateUserGeneral(updateData) {
      this.storeLiveUpdate = true;
      updateData.id = this.userData.customerData.id;
      updateUser(updateData).then((data) => {
        this.userData.customerData = data.data;
        this.storeLiveUpdate = false;
      });
    },
    async addressShippingPrice() {
      const shippingAddress = this.getUserAddresses("shipping");
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

            console.log(this.getAddressIndex(shippingAddress));
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
    async paymentGateways() {
      await getPaymentGateways().then((data) => {
        const paymentGateways = data.data.filter((gateway) => gateway.enabled);
        console.log(paymentGateways);
      });
    },
  },
});
