<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiCalendarQuestion" title="Student Feedback"/>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <CardBox has-table>
            <table>
              <thead>
              <tr>
                <th>Submitted At</th>
                <th>Score</th>
                <th>Message</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(feedback, feedbacks) in itemsPaginated">
                <td data-label="Submitted At">
                  {{feedback.created_at}}
                </td>
                <td data-label="Score">
                  {{feedback.score}}
                </td>
                <td data-label="Message">
                  {{feedback.comment}}
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
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiCalendarQuestion} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {Feedback} from "../types/Feedback";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  feedbacks.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const numPages = computed(() => Math.ceil(feedbacks.value.length / perPage.value))
const currentPageHuman = computed(() => currentPage.value + 1)
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const is_loading = ref(true);
const feedbacks = ref<Feedback[]>([]);

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/feedbacks`);
    response.data.feedbacks.forEach((feedback: any) => {
      feedbacks.value.push(new Feedback(feedback));
    })
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
  is_loading.value = false;
}

onMounted(() => {
  getData();
})
</script>
