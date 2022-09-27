<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import VRuntimeTemplate from "vue3-runtime-template";
import LogoFacebook from "@icons/LogoFacebook.vue";
import LogoInstagram from "@icons/LogoInstagram.vue";
import NavbarBrand from "@/components/partials/NavbarBrand.vue";

const store = useOlivStore();
</script>
<template>
  <footer v-if="store.websiteOptions.footer" class="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="footer-top d-flex justify-content-center">
            <div class="footer-brand-wrapper">
              <NavbarBrand class="footer-brand" />
            </div>

            <nav
              class="footer-nav d-flex align-items-center justify-content-center"
            >
              <v-runtime-template
                :template="store.websiteOptions.footer.footer_links"
              ></v-runtime-template>
            </nav>

            <div class="footer-brand-wrapper d-none d-sm-block">
              <NavbarBrand class="invisible footer-brand" />
            </div>
          </div>
          <div class="footer-bot">
            <div class="row align-items-center">
              <div class="col-12 col-sm-8 col-lg-6">
                <v-runtime-template
                  :template="store.websiteOptions.footer.footer_copyright"
                ></v-runtime-template>
              </div>
              <div class="col-12 col-sm-4 col-lg-6">
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

.footer-top,
.footer-bot {
  background: $body-bg;
}

.footer-top {
  border: 2px solid $border-color;
  border-right-color: transparent;
  border-left-color: transparent;
  overflow: hidden;
  @include padding-bottom(2.2rem);
  flex-direction: column;
  align-items: center;
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
  border-top: 2px solid $border-color;
  margin-top: -2px;
  @include padding(1.5rem 3rem);
  text-align: center;

  :deep {
    font-size: 1.2rem;

    p {
      margin: 0;
    }

    ul {
      list-style: none;
      display: flex;
      justify-content: center;
      padding: 0;
      margin: 1.5rem 0 0;

      li {
        margin: 0 1rem;
      }

      svg {
        display: block;
        height: 1.8rem;
        width: auto;
      }
    }
  }
}

@include media-breakpoint-up(sm) {
  .site-footer {
    padding-top: 0;
    margin-top: auto;
  }
  .footer-top {
    border: 2px solid $border-color;
    flex-direction: row;
    padding: 0 0 2rem;
  }

  .footer-bot {
    border: 2px solid $border-color;
    text-align: left;

    ul {
      margin: 0;
      justify-content: flex-end;

      li {
        margin: 0 0 0 2rem;
      }
    }
  }
}

@include media-breakpoint-up(md) {
  // .footer-brand {
  //   width: 12rem;
  //   margin-top: -1.5rem;
  //   margin-left: -2rem;
  // }

  // .invisible .footer-brand {
  //   margin-right: -2rem;
  // }

  .footer-bot {
    :deep {
      font-size: 1.4rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  // .footer-brand {
  //   width: 16rem;
  //   margin-top: -2rem;
  //   margin-left: -2.5rem;
  // }

  // .invisible .footer-brand {
  //   margin-right: -2.5rem;
  // }
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
