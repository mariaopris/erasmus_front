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
              <th>Current Step</th>
              <th>Status</th>
              <th />
            </tr>
            </thead>
            <tbody>
            <tr v-for="(client, index) in itemsPaginated" :key="client.id">
              <td data-label="Email">
                {{ client.email }}
              </td>
              <td data-label="Full Name">
                {{ client.name }} {{ client.family_name }}
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
              <td class="before:hidden lg:w-1 whitespace-nowrap">
<!--                <BaseButtons type="justify-start lg:justify-end" no-wrap>-->
<!--                  <BaseButton-->
<!--                    color="danger"-->
<!--                    :icon="mdiTrashCan"-->
<!--                    small-->
<!--                    @click="deleteUser(client.user_id, index)"-->
<!--                    label="Delete"-->
<!--                  />-->
<!--                </BaseButtons>-->
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
import {mdiAccountSchool, mdiTrashCan, mdiMessage} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted} from "vue";
import {Step} from "../types/home/Step";
import {useRouter} from "vue-router";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  students.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const currentPageHuman = computed(() => currentPage.value + 1)
const numPages = computed(() => Math.ceil(students.value.length / perPage.value))
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const is_loading = ref(true);
const students = ref<Step[]>([]);
const router = useRouter();

const deleteUser = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/users/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'User deleted successfully!',
            showCancelButton: false,
          })
          students.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users`);
    Object.keys(response.data.students).forEach((user_id: string) => {
      let final_step = new Step();
      response.data.students[user_id].forEach((step: Step) => {
        if(step.status !== 'not_available' && (step.status !== 'done' && step.tag !== '3_2')) {
          final_step = new Step(step);
          final_step.name = step.user.name + ' ' + step.user.family_name;
          final_step.email = step.user.email;
        }
      })
      if(final_step.id !== 0) {
        students.value.push(final_step);
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
  await getData();
})
</script>
