<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiChairSchool" title="Degrees"/>
        <RouterLink to="/add-degree">
          <BaseButton type="button" color="info" label="+Add Degree"/>
        </RouterLink>
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
                <th>University Name</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(degree, degree_index) in itemsPaginated" :key="degree.id">
                <td data-label="Name">
                  {{ degree.name }}
                </td>
                <td data-label="University Name">
                  {{ degree.university.name }}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteDegree(degree.id, degree_index)"
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
import {mdiTrashCan, mdiChairSchool,mdiTableSearch} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from 'sweetalert2'
import FormControl from '@/components/FormControl.vue'
import {Degree} from "../../types/universities/Degree";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_degrees.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const is_loading = ref(true);
const degrees = ref<Degree[]>([]);
const filtered_degrees = ref<Degree[]>([]);
const searchValue = ref('');

const numPages = computed(() => Math.ceil(filtered_degrees.value.length / perPage.value))

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
    filtered_degrees.value = degrees.value.filter((degree) => {
      return (
        degree.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        degree.university.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
  }, 1000);
}

const deleteDegree = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this degree?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/degrees/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'Degree deleted successfully!',
            showCancelButton: false,
          })
          degrees.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getDegrees = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/degrees");
    console.log('response.data.degrees',response.data.degrees)
    response.data.degrees.forEach((degree: any) => {
      degrees.value.push(new Degree(degree));
    })
    filtered_degrees.value = JSON.parse(JSON.stringify(degrees.value));
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
  getDegrees();
})
</script>
