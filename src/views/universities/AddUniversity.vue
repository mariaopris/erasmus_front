<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiSchoolOutline" title="Add University"/>

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

        <template #footer>
          <BaseButtons>
            <BaseButton to="universities" type="button" color="info" outline label="Back"/>
            <BaseButton @click="university.add()" color="info" label="Submit" />
          </BaseButtons>
        </template>
      </CardBox>
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
import BaseDivider from '@/components/BaseDivider.vue';
import {mdiSchoolOutline, mdiAccount, mdiMail, mdiAccountSchool, mdiHomeCity} from '@mdi/js';
import Multiselect from 'vue-multiselect';
import {Universty} from "../../types/universities/Universty";
import {IscedCode} from "../../types/universities/IscedCode";
import axios from "axios";
import Swal from "sweetalert2";
import {onMounted} from "vue";

const university = ref<Universty>(new Universty());
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
const isced_codes = ref<IscedCode[]>([]);
const getIscedCodes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/isced-codes");
    response.data.codes.forEach((isced_code: any) => {
      isced_codes.value.push(new IscedCode(isced_code));
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

onMounted(() => {
  getIscedCodes();
})

</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

