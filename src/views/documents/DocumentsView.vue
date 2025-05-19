<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiFileDocumentAlert" title="Student Documents"/>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <div class="justify-end flex py-2">
            <FormControl v-model="searchValue" @input="search()" type="text" :icon="mdiTableSearch" class="w-[400px]" placeholder="Search ... " borderless/>
          </div>
          <CardBox has-table>
            <table>
              <thead>
              <tr>
                <th>Student Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(document, application_index) in itemsPaginated">
                <td data-label="Student Name">
                  {{ document.user.name }} {{document.user.family_name}}
                </td>
                <td data-label="Type">
                  <p v-if="document.type === 'learning-agreement'">Learning Agreement</p>
                  <p v-else-if="document.type === 'learning-agreement-during'">During mobility - Learning Agreement</p>
                  <p v-else-if="document.type === 'learning-agreement-after'">After mobility - Learning Agreement</p>
                  <p v-else-if="document.type === 'certificate-of-arrival'">Certificate of Arrival</p>
                  <p v-else-if="document.type === 'activity-report'">Activity Report</p>
                  <p v-else-if="document.type === 'travel-authorization'">Travel Authorization</p>
                  <p v-else>{{document.type}}</p>
                </td>
                <td data-label="Status">
                  <p v-if="document.status === 'waiting_for_approval'" class="font-semibold text-yellow-500">Waiting for approval</p>
                  <p v-else-if="document.status === 'denied'" class="font-semibold text-red-500">Denied</p>
                  <p v-else-if="document.status === 'approved'" class="font-semibold text-green-500">Accepted</p>
                  <p v-else class="font-semibold">{{document.status}}</p>
                </td>
                <td data-label="Submitted At">
                  {{document.created_at}}
                </td>

                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="success" small :to="'/view-document/'+document.id" label="Review"/>
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
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiFileDocumentAlert, mdiTableSearch, mdiTrashCan} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import FormControl from '@/components/FormControl.vue'
import {Documentt} from "../../types/documents/Documentt";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_documents.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const numPages = computed(() => Math.ceil(filtered_documents.value.length / perPage.value))
const currentPageHuman = computed(() => currentPage.value + 1)
const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const is_loading = ref(true);
const documents = ref<Documentt[]>([]);
const filtered_documents = ref<Documentt[]>([]);
const searchValue = ref('');

const search = () => {
  setTimeout(() => {
    filtered_documents.value = documents.value.filter((document: Documentt) => {
      return (
        document.user.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        document.user.family_name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        document.created_at?.includes(searchValue.value.toLowerCase()) ||
        document.status.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        document.type.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
  }, 1000);
}

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/documents`);
    console.log('response.data.documents', response.data.documents)
    response.data.documents.forEach((document: any) => {
      console.log('document.type', document.type)
      if(document.type === 'certificate-of-arrival' || document.type === 'learning-agreement'
        || document.type === 'activity-report'|| document.type === 'travel-authorization'
        || document.type === 'learning-agreement-during'|| document.type === 'learning-agreement-after'
      ) {
        documents.value.push(new Documentt(document));
      }
    })
    filtered_documents.value = JSON.parse(JSON.stringify(documents.value));
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
