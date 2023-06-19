import { Loader } from "@googlemaps/js-api-loader";

/**
 * Check user address and get the driving distance to client's location
 *
 * @param {Object} shippingLimitsAndFees
 * @param {String} deliveryAddress
 * @param {String} operation geocode or getDistance
 * @returns {Bool/Float/String} TRUE if geocode is successfull/DISTANCE if address is in range/ERRORMSG if any error
 */
export const gmapsCheckUserAddress = async (
  shippingLimitsAndFees,
  deliveryAddress,
  operation
) => {
  return await new Loader({
    apiKey: shippingLimitsAndFees.shipping_options.exwoofood_gg_api,
  })
    .load()
    .then((google) => {
      const geocoder = new google.maps.Geocoder();
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
              if (operation === "geocode") {
                return true;
              } else {
                const distanceMatrix = new google.maps.DistanceMatrixService();

                let checkResult = {
                  lat: response.results[0].geometry.location.lat(),
                  lng: response.results[0].geometry.location.lng(),
                };
                // Get distance matrix
                return distanceMatrix
                  .getDistanceMatrix({
                    origins: [shippingLimitsAndFees.store_address],
                    destinations: [deliveryAddress],
                    travelMode: "DRIVING",
                  })
                  .then((response) => {
                    checkResult["distance"] =
                      response.rows[0].elements[0].distance.value / 1000;

                    if (
                      checkResult.distance >
                      shippingLimitsAndFees.shipping_options
                        .exwoofood_restrict_km
                    )
                      checkResult =
                        "Aceasta adresa este la o distanta prea mare de punctul nostru de livrare. O puteti folosi doar ca adresa de facturare.";

                    return checkResult;
                  });
              }
            }
          }
        })
        .catch(() => {
          return "Nu reusim sa gasim locatia. Te rugam sa introduci adresa exacta!";
        });
    });
};
