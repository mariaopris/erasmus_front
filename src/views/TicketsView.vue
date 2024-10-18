<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiTicket" title="Tickets"/>
        <RouterLink to="view-ticket">
          <BaseButton type="button" color="info" label="view"/>
        </RouterLink>
      </div>

      <div>
        <CardBox has-table>
          <table>
            <thead>
            <tr>
              <th>Full Name</th>
              <th>Description</th>
              <th>Status</th>
              <th />
            </tr>
            </thead>
            <tbody>
            <tr v-for="client in itemsPaginated" :key="client.id">
              <td data-label="Full Name">
                {{ client.name }}
              </td>
              <td data-label="Desctipton">
                {{ client.company }}
              </td>
              <td data-label="Status">
                {{ client.city }}
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
                </BaseButtons>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
            <BaseLevel>
              <BaseButtons>
                <BaseButton
                  v-for="page in pagesList"
                  :key="page"
                  :active="page === currentPage"
                  :label="page + 1"
                  :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                  small
                  @click="currentPage = page"
                />
              </BaseButtons>
              <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
            </BaseLevel>
          </div>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiTicket, mdiEye} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'

const items = ref([]);
const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const isModalActive = ref(false);
</script>
