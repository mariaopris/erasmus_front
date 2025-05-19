<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiBook" title="Courses"/>
        <RouterLink to="/add-course">
          <BaseButton type="button" color="info" label="+Add Course"/>
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
                <th>University</th>
                <th>Department</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(course, course_index) in itemsPaginated" :key="course.id">
                <td data-label="Name">
                  {{ course.name }}
                </td>
                <td data-label="Country">
                  {{ course.university.name }}
                </td>
                <td data-label="Department">
                  {{ course.department.name }}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small :to="'edit-course/'+course.id" />
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteCourse(course.id, course_index)"
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
import {mdiBook, mdiTrashCan, mdiEye, mdiFileImportOutline,mdiTableSearch} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from 'sweetalert2'
import {Universty} from "../../types/universities/Universty";
import FormControl from '@/components/FormControl.vue'
import {Course} from "../../types/universities/Course";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_courses.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const is_loading = ref(true);
const courses = ref<Course[]>([]);
const filtered_courses = ref<Course[]>([]);
const searchValue = ref('');

const numPages = computed(() => Math.ceil(filtered_courses.value.length / perPage.value))

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
    filtered_courses.value = courses.value.filter((course) => {
      return (
        course.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        course.university.name.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
  }, 1000);
}

const deleteCourse = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this course?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/courses/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'Course deleted successfully!',
            showCancelButton: false,
          })
          courses.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getCourses = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/courses");
    response.data.courses.forEach((course: any) => {
      courses.value.push(new Course(course));
    })
    filtered_courses.value = JSON.parse(JSON.stringify(courses.value));
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
  getCourses();
})
</script>
