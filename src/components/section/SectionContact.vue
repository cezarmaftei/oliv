<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Loader } from "@googlemaps/js-api-loader";
import FormContact from "../form/FormContact.vue";
const store = useOlivStore();
const route = useRoute();

const contactSectionData = computed(() => {
  return store
    .getPageBySlug(route)
    .acf.page_sections.filter(
      (section) => section.acf_fc_layout === "SectionContact"
    )[0];
});

const gmap = ref(false);

onMounted(() => {
  new Loader({
    apiKey: store.shippingLimitsAndFees.shipping_options.exwoofood_gg_api,
  })
    .load()
    .then((google) => {
      const olivCoords = { lat: 47.160924, lng: 27.579239 };
      const map = new google.maps.Map(gmap.value, {
        center: olivCoords,
        zoom: 16,
        disableDefaultUI: true,
        styles: [
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#ebe3cd",
              },
            ],
          },
          {
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#f9f7ed",
              },
            ],
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#523735",
              },
            ],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#f5f1e6",
              },
            ],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#c9b2a6",
              },
            ],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#dcd2be",
              },
            ],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#ae9e90",
              },
            ],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [
              {
                color: "#dfd2ae",
              },
            ],
          },
          {
            featureType: "poi",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
              {
                color: "#dfd2ae",
              },
            ],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#93817c",
              },
            ],
          },
          {
            featureType: "poi.attraction",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#cdc89f",
              },
            ],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#447530",
              },
            ],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                color: "#f5f1e6",
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              {
                color: "#fdfcf8",
              },
            ],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#cebfa9",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
              {
                color: "#f8c967",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ecd5b9",
              },
            ],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#d7c7b0",
              },
            ],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [
              {
                color: "#e98d58",
              },
            ],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#d7c7b0",
              },
            ],
          },
          {
            featureType: "road.local",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ffffff",
              },
            ],
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#806b63",
              },
            ],
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [
              {
                color: "#dfd2ae",
              },
            ],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#8f7d77",
              },
            ],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [
              {
                color: "#ebe3cd",
              },
            ],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [
              {
                color: "#dfd2ae",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#cdc89f",
              },
            ],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#92998d",
              },
            ],
          },
        ],
      });

      const marker = new google.maps.Marker({
        position: olivCoords,
        map: map,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<h4>Oliv Bistro</h4><p class="mb-0">${store.websiteOptions.global_settings.address}<br /><strong>${store.websiteOptions.global_settings.store_opening_hours[0].interval_zile} ${store.websiteOptions.global_settings.store_opening_hours[0].ora_deschidere} - ${store.websiteOptions.global_settings.store_opening_hours[0].ora_inchidere}</strong><br /><br /><a rel="nofollow noopener" target="_blank" href="https://www.google.com/maps?saddr=My+Location&daddr=${store.websiteOptions.global_settings.address}, Iasi, Romania"><strong>Directii</strong></a></p>`,
      });

      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
    });
});
</script>

<template>
  <div class="contact-wrapper text-center p-8">
    <div class="form-wrapper">
      <div
        class="form-top-content"
        v-html="contactSectionData.form_top_content"
      ></div>
      <FormContact
        :contentBottom="contactSectionData.form_bottom_content"
        :buttonText="contactSectionData.form_submit_text"
      />
    </div>
  </div>
  <div class="map-wrapper pt-7 px-4 pb-4">
    <h2 class="mb-3" v-html="contactSectionData.map_heading"></h2>

    <div class="gmap" ref="gmap"></div>
  </div>
</template>

<style scoped lang="scss">
.contact-wrapper {
  border: 2px solid $border-color;

  .form-wrapper {
    width: 100%;
    max-width: 570px;
    margin-left: auto;
    margin-right: auto;
  }

  :deep {
    h5 {
      color: $gray-500;
      @include margin-bottom(2rem);
    }

    h2 {
      @include margin-bottom(2rem);
    }

    a {
      color: $olive;

      &:hover {
        color: $body-color;
      }
    }
  }
}

.map-wrapper {
  border: 2px solid $border-color;
  margin-top: -2px;
  margin-bottom: -2px;
}

.gmap {
  width: 100%;
  height: 400px;

  :deep {
    .gm-style-iw-c {
      border: 2px solid $border-color;
      border-radius: 0;
    }

    .gm-style .gm-style-iw-tc::after {
      background: $body-color;
    }

    a {
      color: $olive;
    }
  }
}
</style>
