<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiSchool" title="Universities"/>
        <div class="space-x-3 items-center flex">
          <RouterLink to="import-university">
            <BaseButton :icon="mdiFileImportOutline" type="button" outline color="info" label="Import Universities"/>
          </RouterLink>
          <RouterLink to="add-university">
            <BaseButton type="button" color="info" label="Add University"/>
          </RouterLink>
        </div>
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
                <th>Name</th>
                <th>Country</th>
                <th>Erasmus Code</th>
                <th>Years</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(university, university_index) in itemsPaginated" :key="university.id">
                <td data-label="Name">
                  {{ university.name }}
                </td>
                <td data-label="Country">
                  {{ university.country }}
                </td>
                <td data-label="Erasmus Code">
                  {{ university.code }}
                </td>
                <td data-label="Created" class="lg:w-1 whitespace-nowrap">
                  <small class="text-gray-500 dark:text-slate-400">
                    <template v-for="(year, year_index) in university.years">
                      {{year}} <span v-if="year_index <= university.years.length - 2">,</span>
                    </template>
                  </small>
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small :to="'edit-university/'+university.id" />
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteUniversity(university.id, university_index)"
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
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiSchool, mdiTrashCan, mdiEye, mdiFileImportOutline,mdiTableSearch} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from 'sweetalert2'
import {Universty} from "../../types/Universty";
import FormControl from '@/components/FormControl.vue'

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_universities.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const is_loading = ref(true);
const universities = ref<Universty[]>([]);
const filtered_universities = ref<Universty[]>([]);
const searchValue = ref('');

const numPages = computed(() => Math.ceil(filtered_universities.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const search = () => {
  setTimeout(() => {
    filtered_universities.value = universities.value.filter((university) => {
      return (
        university.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        university.country.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
  }, 1000);
}

const deleteUniversity = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this university?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/universities/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'University deleted successfully!',
            showCancelButton: false,
          })
          universities.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getUniversities = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/universities");
    response.data.universities.forEach((university: any) => {
      university.isced_codes = university.isced_codes.split(',');
      universities.value.push(new Universty(university));
    })
    filtered_universities.value = JSON.parse(JSON.stringify(universities.value));
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
  getUniversities();
})
</script>
