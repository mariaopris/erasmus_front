<template>
  <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiSchoolOutline" title="Edit University"/>

        <template v-if="is_loading">
          <p>Loading ...</p>
        </template>
        <template v-else>
          <CardBox>
            <FormField label="University Name">
              <FormControl v-model="university.name" :icon="mdiAccountSchool"/>
            </FormField>

            <FormField label="University Email">
              <FormControl v-model="university.email" type="email" :icon="mdiMail"/>
            </FormField>

            <div class="grid grid-cols-2 space-x-3">
              <FormField label="Country">
                <FormControl v-model="university.country" :icon="mdiHomeCity" />
              </FormField>
              <FormField label="Erasmus Code">
                <FormControl v-model="university.code"/>
              </FormField>
            </div>

            <div class="grid grid-cols-2 space-x-3">
              <FormField label="Coordinator">
                <FormControl v-model="university.coordinator"/>
              </FormField>
              <FormField label="Mobility Period (months)">
                <FormControl v-model="university.mobility_period" type="number"/>
              </FormField>
            </div>

            <div class="grid grid-cols-2 space-x-3">
              <FormField label="ISCED Codes">
                <Multiselect v-model="university.isced_codes" :options="isced_codes" :multiple="true" label="name" track-by="name"></Multiselect>
              </FormField>
              <FormField label="Number of Required ECTS Credits">
                <FormControl v-model="university.no_required_credits" type="number"/>
              </FormField>
            </div>

            <FormField label="Study Plans">
              <div class="space-y-3">
                <div class="flex space-x-14">
                    <div class="flex space-x-3 items-center">
                      <input v-model="university.years" value="BA1" type="checkbox"/>
                      <span class="check">Bachelor Year 1</span>
                    </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="university.years" value="BA2" type="checkbox"/>
                    <span class="check">Bachelor Year 2</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="university.years" value="BA3" type="checkbox"/>
                    <span class="check">Bachelor Year 3</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="university.years" value="BA4" type="checkbox"/>
                    <span class="check">Bachelor Year 4</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="university.years" value="MA1" type="checkbox"/>
                    <span class="check">Masters Year 1</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input v-model="university.years" value="MA2" type="checkbox"/>
                    <span class="check">Masters Year 2</span>
                  </div>
                </div>
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center mr-1.5">
                    <input v-model="university.years" value="PhD" type="checkbox"/>
                    <span class="check">PhD</span>
                  </div>
                </div>
              </div>
            </FormField>

            <FormField label="Study Languages">
              <Multiselect v-model="university.languages" :options="languages" :multiple="true" label="name" track-by="name"></Multiselect>
            </FormField>

            <BaseDivider />

            <FormField label="Description">
              <FormControl v-model="university.description" type="textarea" placeholder="University Description" />
            </FormField>

            <BaseDivider />
            <p class="font-semibold text-lg mb-5">Departments</p>

            <template v-for="(department, department_index) in departments">
              <div class="flex space-x-3 p-2">
                <p>{{department.name}}</p>
                <button @click="deleteDepartment(department.id, department_index)" class="underline text-red-500">Delete</button>
              </div>
            </template>

            <div class="flex space-x-3">
              <FormControl type="text" v-model="new_department.name" placeholder="Department Name" class="w-1/2"/>
              <BaseButton @click="addDepartment()" type="button" color="info" outline label="+Add"/>
            </div>

            <template #footer>
              <BaseButtons>
                <BaseButton to="/universities" type="button" color="info" outline label="Back"/>
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
import {onMounted, ref} from "vue";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import {mdiSchoolOutline, mdiMail, mdiAccountSchool, mdiHomeCity} from '@mdi/js';
import Multiselect from 'vue-multiselect';
import {Universty} from "../../types/universities/Universty";
import axios from "axios";
import Swal from "sweetalert2";
import {IscedCode} from "../../types/universities/IscedCode";
import {useRoute} from "vue-router";
import {Department} from "../../types/universities/Department";

const route = useRoute();
const university = ref<Universty>(new Universty());
const isced_codes = ref<IscedCode[]>([]);
const is_loading = ref(true);
const languages = [
  {id: 'EN', name: 'English'},
  {id: 'FR', name: 'French'},
  {id: 'IT', name: 'Italian'},
  {id: 'ES', name: 'Spanish'},
  {id: 'DE', name: 'German'},
  {id: 'GR', name: 'Greek'},
  {id: 'SK', name: 'Slovak'},
  {id: 'TR', name: 'Turkish'},
  {id: 'PL', name: 'Polish'},
];
const departments = ref<Department[]>([]);
const new_department = ref(new Department());

const save = () => {
  departments.value.forEach((department: Department) => {
    try {
      axios.post(`http://127.0.0.1:8000/api/departments`, {
        form : {
          university_id: university.value.id,
          name: department.name
        }
      })
        .then(async (response) => {
        });
    } catch (e) {
      console.log(e);
      if (e.response?.data?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Ooops..',
          text: e.response.data.error,
        })
      }
    }
  })
  university.value.update();
}

const addDepartment = () => {
  departments.value.push(new_department.value);
  new_department.value = new Department();
}

const deleteDepartment = (id: number, index: number) => {
  if(id !== 0) {
    Swal.fire({
      title: 'Are you sure that you want to delete this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/departments/${id}`)
          .then((response) => {
            Swal.fire({
              title: 'Success',
              icon: 'success',
              html: 'Department deleted successfully!',
              showCancelButton: false,
            })
            departments.value.splice(index,1);
          })
          .catch((error) => {
            console.log('eroare: ', error);
          })
      }
    })
  }
  else {
    departments.value.splice(index, 1);
  }

}

const getUniversity = async () => {
  university.value.id = Number(route.params.id);
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/universities/${university.value.id}`);
    response.data.university.isced_codes = JSON.parse(response.data.university.isced_codes);
    let codes = <IscedCode[]>[];
    response.data.university.isced_codes.forEach((isced_code: string) => {
      let i = isced_codes.value.map(item => item.code).indexOf(isced_code);
      if(i >= 0)
      {
        codes.push(isced_codes.value[i]);
      }
    })
    university.value = new Universty(response.data.university);
    university.value.isced_codes = codes;
    response.data.university.departments.forEach((department: Department) => {
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
  is_loading.value = false;
}

const getIscedCodes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/isced-codes");
    response.data.codes.forEach((isced_code: any) => {
      isced_codes.value.push(new IscedCode(isced_code));
    })
    await getUniversity();
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

onMounted(() => {
  getIscedCodes();
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

