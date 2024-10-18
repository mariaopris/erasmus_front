<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiAccountSchool" title="Students"/>
      </div>

      <div>
        <CardBox has-table>
          <table>
            <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>University</th>
              <th>Status</th>
              <th />
            </tr>
            </thead>
            <tbody>
            <tr v-for="client in itemsPaginated" :key="client.id">
              <td data-label="Email">
                {{ client.name }}
              </td>
              <td data-label="Full Name">
                {{ client.company }}
              </td>
              <td data-label="University">
                {{ client.city }}
              </td>
              <td data-label="Status" class="lg:w-1 whitespace-nowrap">
                <small class="text-gray-500 dark:text-slate-400" :title="client.created">{{
                    client.created
                  }}</small>
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
                  <BaseButton
                    color="danger"
                    :icon="mdiTrashCan"
                    small
                    @click="isModalDangerActive = true"
                  />
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
import {mdiAccountSchool, mdiTrashCan, mdiEye} from '@mdi/js'
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
const isModalDangerActive = ref(false);
</script>
