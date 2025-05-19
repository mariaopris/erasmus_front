<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChairSchool" title="Add Degree"/>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <FormField label="University">
            <Multiselect v-model="university" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
          </FormField>

          <FormField label="University Department">
            <template v-if="university.name !== ''">
              <Multiselect v-model="department" :options="university.departments" :multiple="false" label="name" track-by="name"></Multiselect>
            </template>
            <template v-else>
              <Multiselect :options="[]" :disabled="true" :multiple="false"></Multiselect>
            </template>
          </FormField>

          <p class="font-semibold text-xl mb-3 text-blue-500">Degrees</p>
          <p v-if="degrees.length === 0 && university.degrees.length === 0" class="text-xs">No degrees yet.</p>

          <template v-for="(degree, degree_index) in university.degrees">
            <div v-if="degree.department_id === department.id" class="flex space-x-3">
              <p>{{degree.name}} | {{degree.level}}</p>
              <button @click="deleteDegree(degree.id, degree_index)" class="underline text-red-500 cursor-pointer">Delete</button>
            </div>
          </template>

          <template v-for="(degree, degree_index) in degrees">
            <div class="flex space-x-3">
              <p>{{degree.name}} | {{degree.level}}</p>
              <button @click="deleteNewDegree(degree_index)" class="underline text-red-500 cursor-pointer">Remove</button>
            </div>
          </template>

          <BaseDivider></BaseDivider>

          <p class="font-semibold text-xl mb-3 text-blue-500">New Degree</p>

          <FormField label="Degree Name">
            <FormControl v-model="new_degree.name" class="w-1/2"/>
          </FormField>

          <FormField label="Level">
            <div class="space-y-3">
              <div class="flex space-x-14">
                <div class="flex space-x-3 items-center">
                  <input v-model="new_degree.level" value="Ba" type="radio"/>
                  <span class="check">Bachelor</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="new_degree.level" value="Ma" type="radio"/>
                  <span class="check">Master</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input v-model="new_degree.level" value="PhD" type="radio"/>
                  <span class="check">PhD</span>
                </div>
              </div>
            </div>
          </FormField>
          <BaseButton @click="addDegree()" color="info" outline label="+ Add"/>

          <BaseDivider></BaseDivider>

          <template #footer>
            <BaseButtons>
              <BaseButton to="/degrees" type="button" color="info" outline label="Back"/>
              <BaseButton @click="save()" color="info" label="Submit" />
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
import {mdiChairSchool} from '@mdi/js';
import Multiselect from 'vue-multiselect';
import {Universty} from "../../types/universities/Universty";
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted} from "vue";
import {Department} from "../../types/universities/Department";
import {Degree} from "../../types/universities/Degree";
import BaseDivider from "../../components/BaseDivider.vue";

const university = ref<Universty>(new Universty());
const universities = ref<Universty[]>([]);
const department = ref(new Department());
const degrees = ref<Degree[]>([]);
const new_degree = ref(new Degree());
const is_loading = ref(true);

const addDegree = () => {
  degrees.value.push(new_degree.value);
  new_degree.value = new Degree();
}

const deleteNewDegree = (index: number) => {
  degrees.value.splice(index, 1);
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
          university.value.degrees.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const save = () => {
  degrees.value.forEach((degree: Degree) => {
    degree.add(university.value, department.value);
  })
}

const getUniversities = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/universities");
    response.data.universities.forEach((university: any) => {
      university.isced_codes = university.isced_codes.split(',');
      if(university.name.includes('Bergamo'))
      {
        console.log('response.data.universities', university)
      }
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

onMounted(() => {
  getUniversities();
})

</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

