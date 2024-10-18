<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <template v-if="status === 'view'">
          <SectionTitleLineWithButton :icon="mdiFileDocument" title="View Application"/>
          <BaseButton type="button" color="info" label="Edit" :icon="mdiPencil"/>
        </template>
       <template v-else-if="status === 'edit'">
         <SectionTitleLineWithButton :icon="mdiBookEdit" title="Edit Application"/>
         <div class="space-x-3">
           <BaseButton @click="cancelEdit()" type="button" color="warning" outline label="Cancel"/>
           <BaseButton type="button" color="success" label="Save"/>
         </div>
       </template>
      </div>
      <FormField label="Status" class="w-[150px]">
        <FormControl :options="statusOptions" />
      </FormField>

      <FormField label="Denial Reason">
        <FormControl v-model="university.description" type="textarea"/>
      </FormField>

      <CardBox form @submit.prevent="university.add()">
        <FormField label="Academic Year" class="w-[350px]">
          <FormControl :options="academicYearOptions"/>
        </FormField>

        <div class="grid grid-cols-2 space-x-3">
          <FormField label="First Name">
            <FormControl/>
          </FormField>

          <FormField label="Last Name">
            <FormControl/>
          </FormField>
        </div>

        <div class="grid grid-cols-2 space-x-3">
          <FormField label="Email">
            <FormControl type="email"/>
          </FormField>
          <FormField label="Date of birth">
            <FormControl type="date"/>
          </FormField>
        </div>

        <FormField label="Phone (including country prefix)">
          <FormControl class="w-1/2"/>
        </FormField>

        <FormField label="Identity Number">
          <FormControl class="w-1/2" type="number"/>
        </FormField>

        <FormField label="Faculty">
          <Multiselect :options="facultyOptions" :multiple="false" label="name" track-by="name"></Multiselect>
        </FormField>

        <FormField label="Mobility Program">
          <div class="space-y-3">
            <div class="flex space-x-14">
              <div class="flex space-x-3 items-center">
                <input value="short" type="checkbox"/>
                <span class="check">Short-term ERASMUS+</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input value="ba2" type="checkbox"/>
                <span class="long">Long-term ERASMUS+</span>
              </div>
              <div class="flex space-x-3 items-center">
                <input value="ba3" type="checkbox"/>
                <span class="placement">ERASMUS+ placement</span>
              </div>
            </div>
          </div>
        </FormField>



        <BaseDivider />

        <FormField label="Description">
          <FormControl v-model="university.description" type="textarea" placeholder="University Description" />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton to="universities" type="button" color="info" outline label="Back"/>
            <BaseButton type="submit" color="info" label="Submit" />
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
import {mdiFileDocument, mdiMail, mdiAccountSchool, mdiHomeCity, mdiBookEdit, mdiPencil} from '@mdi/js';
import {Universty} from "../types/Universty";
import Multiselect from 'vue-multiselect';

const university = ref<Universty>(new Universty());
const statusOptions = [
  { id: 0, label: 'In progress'},
  { id: 1, label: 'Accepted' },
  { id: 2, label: 'Denied' }
];
const facultyOptions = [
  { id: 0, name: 'Aerospace Engineering'},
  { id: 1, name: 'Applied Sciences' },
  { id: 2, name: 'Automatic Control and Computers' },
  { id: 3, name: 'Biotechnical Systems Engineering ' },
  { id: 4, name: 'Chemical Engineering and Biotechnologies' },
  { id: 5, name: 'Electrical Engineering' },
  { id: 6, name: 'Electronics, Telecommunications and Information Technology' },
  { id: 7, name: 'Energy Engineering' },
  { id: 8, name: 'Engineering in Foreign Languages' },
  { id: 9, name: 'Entrepreneurship, Business Engineering and Management' },
  { id: 10, name: 'Faculty of Economic Sciences and Law' },
  { id: 11, name: 'Faculty of Educational Sciences, Social Sciences and Psychology' },
  { id: 12, name: 'Faculty of Electronics, Communications and Computers' },
  { id: 13, name: 'Faculty of Mechanics and Technology' },
  { id: 14, name: 'Faculty of Sciences, Physical Education and Informatics' },
  { id: 15, name: 'Faculty of Theology, Letters, History and Arts' },
  { id: 16, name: 'Industrial Engineering and Robotics' },
  { id: 17, name: 'IOSUD/CSUD - PhD Studies' },
  { id: 18, name: 'Materials Science and Engineering' },
  { id: 19, name: 'Mechanical Engineering and Mechatronics' }
];
const academicYearOptions = ['2024/2025','2025/2026'];

const status = ref('view');

const cancelEdit = () => {
  // warning "Are you sure?" -- "All the changes will be lost"
}
</script>

<style src="node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
