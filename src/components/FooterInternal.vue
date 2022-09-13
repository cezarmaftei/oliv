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
          <div class="footer-top d-flex justify-content-center">
            <div class="footer-brand-wrapper">
              <router-link
                class="footer-brand d-flex align-items-end me-auto"
                to="/"
              >
                <SplashGreen />
                <LogoOliv />
              </router-link>
            </div>

            <nav
              class="footer-nav d-flex align-items-center justify-content-center"
            >
              <v-runtime-template
                :template="store.websiteOptions.footer.footer_links"
              ></v-runtime-template>
            </nav>

            <div class="footer-brand-wrapper invisible d-none d-sm-block">
              <router-link
                class="footer-brand d-flex align-items-end ms-auto"
                to="/"
              >
                <SplashGreen />
                <LogoOliv />
              </router-link>
            </div>
          </div>
          <div v-if="store.currentPage" class="footer-bot">
            <div class="row align-items-center">
              <div class="col-8">
                <v-runtime-template
                  :template="store.websiteOptions.footer.footer_copyright"
                ></v-runtime-template>
              </div>
              <div class="col-4">
                <ul>
                  <li>
                    <a
                      :href="store.websiteOptions.social.facebook_site"
                      target="_blank"
                      rel="nofollow noopener"
                      ><LogoFacebook
                    /></a>
                  </li>
                  <li>
                    <a
                      :href="store.websiteOptions.social.other_social_urls[0]"
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
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  margin-top: auto;
  @include padding-top(5rem);
}

.footer-top {
  border: 2px solid $border-color;
  overflow: hidden;
  @include padding-bottom(2.2rem);
}

.footer-brand {
  width: 8rem;
  margin-top: -0.5rem;
  margin-left: -1rem;

  :deep {
    svg {
      flex: 1 0 60%;

      &:last-child {
        margin-left: -20%;
        margin-bottom: 1rem;
      }
    }
  }
}

.invisible .footer-brand {
  margin-right: -1rem;
}

.footer-nav {
  font-family: $font-family-lanekcut;
  line-height: 0.6;
  @include padding(2.2rem 1.5rem 0);
  flex-grow: 1;
  text-align: center;

  :deep {
    @include font-size(3.2rem);

    a {
      display: inline-block;
      color: $body-color;
      margin: 0.5rem;
    }

    p {
      margin: 0;
    }
  }
}

.footer-bot {
  border: 2px solid $border-color;
  margin-top: -2px;
  @include padding(1.5rem 3rem);

  :deep {
    font-size: 1.2rem;

    p {
      margin: 0;
    }

    ul {
      list-style: none;
      display: flex;
      justify-content: flex-end;
      padding: 0;
      margin: 0;

      li {
        margin-left: 2rem;
      }

      svg {
        display: block;
        height: 1.8rem;
        width: auto;
      }
    }
  }
}

@include media-breakpoint-up(md) {
  .footer-brand {
    width: 12rem;
    margin-top: -1.5rem;
    margin-left: -2rem;
  }

  .invisible .footer-brand {
    margin-right: -2rem;
  }

  .footer-bot {
    :deep {
      font-size: 1.4rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .footer-brand {
    width: 16rem;
    margin-top: -2rem;
    margin-left: -2.5rem;
  }

  .invisible .footer-brand {
    margin-right: -2.5rem;
  }
}

// @include media-breakpoint-up(xl) {
//   .footer-brand {
//     width: 18rem;
//     margin-top: -1rem;
//     margin-left: -1.5rem;
//   }

//   .invisible .footer-brand {
//     margin-right: -1.5rem;
//   }
// }

// @include media-breakpoint-up(xxl) {
//   .footer-brand {
//     width: 20rem;
//   }
// }
</style>
