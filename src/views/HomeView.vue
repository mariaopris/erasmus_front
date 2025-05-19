<template>
  <LayoutAuthenticated>
    <template v-if="is_loading">
      <p>Loading ...</p>
    </template>
    <template v-else>
      <SectionMain>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            color="text-violet-500"
            :icon="mdiListStatus"
            :number="feedback_score"
            suffix="/5"
            label="Feedback Score"
          />
          <CardBoxWidget
            color="text-blue-500"
            :icon="mdiAccountMultiple"
            :number="no_students"
            label="Total Students"
          />
          <CardBoxWidget
            color="text-red-500"
            :icon="mdiChartTimelineVariant"
            :number="no_rec"
            label="Total Recommendations"
          />
        </div>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            color="text-emerald-500"
            :icon="mdiMessageAlert"
            :number="unread_mes"
            label="Unread Messages"
          />
          <CardBoxWidget
            color="text-pink-500"
            :icon="mdiFileDocumentAlert"
            :number="no_doc"
            label="Pending Documents"
          />
        </div>

        <div class="flex justify-between items-center">
          <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Students Progress" />
          <RouterLink to="/students" class="text-blue-500 underline text-sm">View all students</RouterLink>
        </div>
        <CardBox has-table>
          <table>
            <thead>
            <tr>
              <th>Full Name</th>
              <th>Current Step</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="client in user_steps" :key="client.id">
              <td data-label="Full Name">
                {{client.name}}
              </td>
              <td data-label="Current Step">
                <template v-if="client.tag === '1_1'">
                  <p>Choose University</p>
                </template>
                <template v-else-if="client.tag === '1_2'">
                  <p>Add Application</p>
                </template>
                <template v-else-if="client.tag === '1_3'">
                  <p>Complete OLA</p>
                </template>
                <template v-else-if="client.tag === '1_4'">
                  <p>Finish Application</p>
                </template>
                <template v-else-if="client.tag === '2_1'">
                  <p>Upload Certificate of Arrival</p>
                </template>
                <template v-else-if="client.tag === '2_2'">
                  <p>Change OLA</p>
                </template>
                <template v-else-if="client.tag === '3_1'">
                  <p>Upload Activity Report</p>
                </template>
                <template v-else-if="client.tag === '3_2'">
                  <p>Upload OLA after-mobility</p>
                </template>
                <template v-else>
                  <p>{{client.tag}}</p>
                </template>
              </td>
              <td data-label="Status">
                <template v-if="client.status === 'not_available'">
                  <p>Not Available</p>
                </template>
                <template v-else-if="client.status === 'incomplete'">
                  <p class="text-red-500">Incomplete</p>
                </template>
                <template v-else-if="client.status === 'done'">
                  <p class="text-green-500">Done</p>
                </template>
                <template v-else-if="client.status === 'in_progress'">
                  <p class="text-yellow-500">In Progress</p>
                </template>
                <template v-else>
                  <p>{{client.status}}</p>
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </CardBox>
      </SectionMain>
    </template>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  mdiAccountMultiple,
  mdiListStatus,
  mdiChartTimelineVariant,
  mdiMessageAlert,
  mdiFileDocumentAlert
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {Step} from "../types/home/Step";

const is_loading = ref(true);
const no_students = ref(0);
const feedback_score = ref(0);
const no_rec = ref(0);
const unread_mes = ref(0);
const no_doc = ref(0);
const user_steps = ref<Step[]>([]);

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/get-dashboard-data`);
    no_students.value = response.data.no_students;
    feedback_score.value = response.data.feedback_score;
    no_rec.value = response.data.no_rec;
    unread_mes.value = response.data.unread_mes;
    no_doc.value = response.data.no_doc;
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

const getSteps = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/steps`);
    Object.keys(response.data.steps).forEach((user_id: string) => {
      let final_step = new Step();
      response.data.steps[user_id].forEach((step: Step) => {
        if(step.status !== 'not_available' && (step.status !== 'done' && step.tag !== '3_2')) {
          final_step = new Step(step);
          final_step.name = step.user.name + ' ' + step.user.family_name;
        }
      })
      if(final_step.id !== 0) {
        user_steps.value.push(final_step);
      }
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

onMounted(async () => {
  await getSteps();
  await getData();
})
</script>
