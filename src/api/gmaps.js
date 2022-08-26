// Checks user address
// 1. geocoder - If address exists
// 2. distance matrix - check if the distance from store to delivery is smaller than "Woo food" settings
// returns string if error
// returns float - distance in km - if success
import { Loader } from "@googlemaps/js-api-loader";

export const gmapsCheckUserAddress = async (shippingData, deliveryAddress) => {
  return await new Loader({
    apiKey: shippingData.shipping_options.exwoofood_gg_api,
  })
    .load()
    .then((google) => {
      const geocoder = new google.maps.Geocoder();
      const distanceMatrix = new google.maps.DistanceMatrixService();

      return geocoder
        .geocode({
          address: deliveryAddress,
        })
        .then((response) => {
          if (response.results[0]) {
            if (response.results[0].partial_match) {
              // If is partial match, ask for a more accurate address
              return "Nu reusim sa gasim locatia. Te rugam sa introduci adresa exacta!";
            } else {
              // Get distance matrix
              return distanceMatrix
                .getDistanceMatrix({
                  origins: [shippingData.store_address],
                  destinations: [deliveryAddress],
                  travelMode: "DRIVING",
                })
                .then((response) => {
                  let checkResult =
                    response.rows[0].elements[0].distance.value / 1000;

                  if (
                    checkResult >
                    shippingData.shipping_options.exwoofood_restrict_km
                  )
                    checkResult =
                      "Ne pare rau, dar adresa este la o distanta prea mare de punctul nostru de livrare.";

                  return checkResult;
                });
            }
          }
        })
        .catch(() => {
          return "Nu reusim sa gasim locatia. Te rugam sa introduci adresa exacta!";
        });
    });
};
