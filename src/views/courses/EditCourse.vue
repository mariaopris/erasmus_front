<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBook" title="Edit Course"/>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <FormField label="University" :required="true">
            <Multiselect @select="course.department = new Department(); course.degree = new Degree()" v-model="course.university" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
          </FormField>

          <FormField label="University Department" :required="true">
            <template v-if="course.university !== null">
              <Multiselect @select="course.degree = new Degree()" v-model="course.department" :options="filteredDepartments()" :multiple="false" label="name" track-by="name"></Multiselect>
            </template>
            <template v-else>
              <Multiselect :options="[]" :disabled="true" :multiple="false"></Multiselect>
            </template>
          </FormField>
          <div v-if="course.university !== null">
            <p class="text-xs mb-3">If you can't find a department <RouterLink :to="'/edit-university/'+course.university.id" class="underline text-blue-500"> +Add New Department</RouterLink></p>
          </div>

          <FormField label="University Degree" :required="true">
            <template v-if="course.department !== null">
              <Multiselect v-model="course.degree" :options="filteredDegrees()" :multiple="false" label="name" track-by="name"></Multiselect>
            </template>
            <template v-else>
              <Multiselect :options="[]" :disabled="true" :multiple="false"></Multiselect>
            </template>
          </FormField>
          <div>
            <p class="text-xs mb-3">If you can't find a degree <RouterLink to="/add-degree" class="underline text-blue-500"> +Add New Degree</RouterLink></p>
          </div>
          <FormField label="Course Name" :required="true">
            <FormControl v-model="course.name"/>
          </FormField>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Course Language" :required="true">
              <Multiselect v-model="course.language" :options="languages" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Semester" :required="true">
              <Multiselect v-model="course.semester" :options="semesters" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
          </div>

          <FormField label="Level" :required="true">
            <div class="space-y-3">
              <div class="flex space-x-14">
                <div class="flex space-x-3 items-center">
                  <input v-model="course.level" value="Ba" type="radio"/>
                  <span class="check">Bachelor</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="course.level" value="Ma" type="radio"/>
                  <span class="check">Master</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="course.level" value="PhD" type="radio"/>
                  <span class="check">PhD</span>
                </div>
              </div>
            </div>
          </FormField>

          <template v-if="course.level !== '' && course.level !== 'PhD'">
            <FormField label="Study Year" :required="true">
              <template v-if="course.level === 'Ba'">
                <div class="space-y-3">
                  <div class="flex space-x-14">
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="1" type="radio"/>
                      <span class="check">Year 1</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="2" type="radio"/>
                      <span class="check">Year 2</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="3" type="radio"/>
                      <span class="check">Year 3</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="4" type="radio"/>
                      <span class="check">Year 4</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="course.level === 'Ma'">
                <div class="space-y-3">
                  <div class="flex space-x-14">
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="1" type="radio"/>
                      <span class="check">Year 1</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input v-model="course.year" value="2" type="radio"/>
                      <span class="check">Year 2</span>
                    </div>
                  </div>
                </div>
              </template>
            </FormField>
          </template>

          <FormField label="Number of Credits" :required="true">
            <FormControl v-model="course.no_credits" class="w-1/2"/>
          </FormField>

          <FormField label="Course Description" :required="true">
            <FormControl v-model="course.description" type="textarea"/>
          </FormField>

          <FormField label="Link">
            <FormControl v-model="course.link"/>
          </FormField>
          <a v-if="course.link !== ''" :href="course.link" class="text-xs text-blue-500 underline">Visit Course Link</a>

          <template #footer>
            <BaseButtons>
              <BaseButton to="/courses" type="button" color="info" outline label="Back"/>
              <BaseButton @click="course.save()" color="info" label="Save" />
            </BaseButtons>
          </template>
        </CardBox>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import CardBox from '@/components/CardBox.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import {ref} from "vue";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import {mdiBook} from '@mdi/js';
import Multiselect from 'vue-multiselect';
import {Universty} from "../../types/universities/Universty";
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted} from "vue";
import {Department} from "../../types/universities/Department";
import {Degree} from "../../types/universities/Degree";
import {Course} from "../../types/universities/Course";
import {useRoute} from "vue-router";
import {Language} from "../../types/Language";

const university = ref<Universty>(new Universty());
const universities = ref<Universty[]>([]);
const departments = ref<Department[]>([]);
const department = ref(new Department());
const course = ref(new Course());
const route = useRoute();

const languages = ref<Language[]>([]);

const semesters = [
  {id: 'first', name: 'First Semester'},
  {id: 'second', name: 'Second Semester'}
];

const is_loading = ref(true);

function filteredDepartments() {
  let deps = <Department[]>[];

  if(course.value.university !== null) {
    departments.value.forEach((department: Department) => {
      if(department.university_id === course.value.university.id) {
        deps.push(department);
      }
    })
  }

  return deps;
}

function filteredDegrees() {
  let degrees = <Degree[]>[];
  let i = departments.value.findIndex(item => item.id === course.value.department.id);

  if(i >= 0) {
    departments.value[i].degrees.forEach((deg: Degree) => {
      if(deg.department_id === course.value.department.id) {
        degrees.push(deg);
      }
    })
  }

  return degrees;
}

const getCourse = async () => {
  course.value.id = Number(route.params.id);

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/courses/"+course.value.id);
    course.value = new Course(response.data.course);
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

const getDepartments = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/departments");
    response.data.departments.forEach((department: Department) => {
      departments.value.push(new Department(department));
    })
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

const getUniversities = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/universities");
    response.data.universities.forEach((university: any) => {
      university.isced_codes = university.isced_codes.split(',');
      universities.value.push(new Universty(university));
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

const getLanguages = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/languages");
    response.data.languages.forEach((language: any) => {
      languages.value.push(new Language(language));
    })
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

onMounted(async () => {
  await getCourse();
  await getLanguages();
  await getDepartments();
  await getUniversities();
})

</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

