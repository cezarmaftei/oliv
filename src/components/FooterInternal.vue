<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import VRuntimeTemplate from "vue3-runtime-template";
import LogoOliv from "@icons/LogoOliv.vue";
import LogoFacebook from "@icons/LogoFacebook.vue";
import LogoInstagram from "@icons/LogoInstagram.vue";
import SplashGreen from "@icons/SplashGreen.vue";

const store = useOlivStore();
</script>
<template>
  <footer v-if="store.websiteOptions.footer" class="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="footer-top">
            <SplashGreen />
            <router-link to="/">
              <LogoOliv />
            </router-link>

            <v-runtime-template
              :template="store.websiteOptions.footer.footer_links"
            ></v-runtime-template>
          </div>
          <div v-if="store.currentPage" class="row footer-bot">
            <div class="col-12 col-sm-6">
              <v-runtime-template
                :template="store.websiteOptions.footer.footer_copyright"
              ></v-runtime-template>
            </div>
            <div class="col-12 col-sm-6">
              <ul>
                <li>
                  <a
                    :href="store.currentPage.yoast_social.facebook_site"
                    target="_blank"
                    rel="nofollow noopener"
                    ><LogoFacebook
                  /></a>
                </li>
                <li>
                  <a
                    :href="store.currentPage.yoast_social.other_social_urls[0]"
                    target="_blank"
                    rel="nofollow noopener"
                    ><LogoInstagram
                  /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
svg,
img {
  display: block;
  width: 50px;
}
</style>
