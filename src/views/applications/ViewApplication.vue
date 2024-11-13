<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBookEdit" title="View Application"/>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox class="mb-5">
          <p class="text-2xl font-semibold mb-5">Feedback</p>
          <FormField label="Status" required>
            <FormControl v-model="application.status" :options="statusOptions"/>
          </FormField>
          <div class="flex w-full space-x-3">
            <FormField label="Selection score (0.0 - 100.0)" class="w-1/3">
              <FormControl v-model="application.selection_score" type="number"/>
            </FormField>
            <FormField label="Destination university" class="w-2/3">
              <Multiselect v-model="selected_university" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
          </div>
          <FormField label="Feedback comments">
            <FormControl v-model="application.feedback_comments" type="textarea"/>
          </FormField>
          <template #footer>
            <BaseButtons class="justify-center">
              <BaseButton to="/applications" type="button" color="info" outline label="Back"/>
              <BaseButton @click="submit()" color="info" label="Save changes" />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox>
          <p class="text-2xl font-semibold mb-5">General information</p>

          <FormField label="Academic Year" class="w-[350px]" required>
            <FormControl :disabled="true" v-model="application.academic_year" :options="academicYearOptions"/>
          </FormField>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="First Name" required>
              <FormControl :disabled="true" v-model="application.first_name"/>
            </FormField>

            <FormField label="Last Name" required>
              <FormControl :disabled="true" v-model="application.last_name"/>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Email" required>
              <FormControl :disabled="true" v-model="application.email" type="email"/>
            </FormField>
            <FormField label="Date of birth" required>
              <FormControl :disabled="true" v-model="application.date_of_birth" type="date"/>
            </FormField>
          </div>

          <FormField label="Phone (including country prefix)" required>
            <FormControl :disabled="true" v-model="application.phone" class="w-1/2"/>
          </FormField>

          <BaseDivider />

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Identity Number" required>
              <FormControl :disabled="true" v-model="application.id_number"/>
            </FormField>

            <FormField label="Faculty" required>
              <Multiselect :disabled="true" v-model="application.faculty" :options="facultyOptions" :multiple="false" label="name" track-by="id"></Multiselect>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Study cycle" required>
              <FormControl :disabled="true" v-model="application.study_cycle" :options="studyCycleOptions"/>
            </FormField>

            <FormField label="Current year of study" required>
              <FormControl :disabled="true" v-model="application.current_study_year" :options="studyYearOptions"/>
            </FormField>
          </div>

          <div class="grid grid-cols-2 space-x-3">
            <FormField label="Education field" required>
              <Multiselect :disabled="true" v-model="application.education_field" :options="isced_codes" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Grade point average (GPA)" required>
              <FormControl :disabled="true" v-model="application.gpa" type="number"/>
            </FormField>
          </div>

          <FormField label="Educational/professional awards (summary)">
            <FormControl :disabled="true" v-model="application.summary" type="textarea"/>
          </FormField>

          <FormField label="Mobility Program" required>
            <div class="space-y-3">
              <div class="flex space-x-14">
                <div class="flex space-x-3 items-center">
                  <input disabled v-model="application.mobility_program" value="short" type="radio" class="opacity-50 cursor-not-allowed"/>
                  <span>Short-term ERASMUS+</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input disabled v-model="application.mobility_program" value="long" type="radio" class="opacity-50 cursor-not-allowed"/>
                  <span>Long-term ERASMUS+</span>
                </div>
                <div class="flex space-x-3 items-center">
                  <input disabled v-model="application.mobility_program" value="placement" type="radio" class="opacity-50 cursor-not-allowed"/>
                  <span>ERASMUS+ placement</span>
                </div>
              </div>
            </div>
          </FormField>

          <template v-if="application.mobility_program === 'short'">
            <NotificationBar color="info" :icon="mdiAlert">
              The short term period should not be less then 5 days or bigger then 60 days
              <template #right>
              </template>
            </NotificationBar>
            <div class="grid grid-cols-2 space-x-3">
              <FormField label="Start Period" required>
                <FormControl :disabled="true" v-model="application.mobility_start_date" type="date"/>
              </FormField>
              <FormField label="End Period" required>
                <FormControl :disabled="true" v-model="application.mobility_end_date" type="date"/>
              </FormField>
            </div>
          </template>
          <template v-else-if="application.mobility_program === 'long' || application.mobility_program === 'placement'">
            <FormField label="Period of mobility" required>
              <div class="space-y-3">
                <div class="flex space-x-14">
                  <div class="flex space-x-3 items-center">
                    <input :disabled="true" v-model="application.period_of_mobility" value="first" type="radio" class="opacity-50 cursor-not-allowed"/>
                    <span>First semester</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input :disabled="true" v-model="application.period_of_mobility" value="second" type="radio" class="opacity-50 cursor-not-allowed"/>
                    <span>Second semester</span>
                  </div>
                  <div class="flex space-x-3 items-center">
                    <input :disabled="true" v-model="application.period_of_mobility" value="entire" type="radio" class="opacity-50 cursor-not-allowed"/>
                    <span>Entire year</span>
                  </div>
                </div>
              </div>
            </FormField>

            <template v-if="application.mobility_program === 'placement'">
              <FormField label="Destination Type" required>
                <div class="space-y-3">
                  <div class="flex space-x-14">
                    <div class="flex space-x-3 items-center">
                      <input disabled v-model="application.destination_type" value="university" type="radio" class="opacity-50 cursor-not-allowed"/>
                      <span>University</span>
                    </div>
                    <div class="flex space-x-3 items-center">
                      <input disabled v-model="application.destination_type" value="non_university" type="radio" class="opacity-50 cursor-not-allowed"/>
                      <span>Non-University</span>
                    </div>
                  </div>
                </div>
              </FormField>
            </template>
          </template>

          <template v-if="application.destination_type !== 'non_university'">
            <FormField label="Destination 1" required>
              <Multiselect :disabled="true" v-model="destination_1" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Destination 2" required>
              <Multiselect :disabled="true" v-model="destination_2" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
            <FormField label="Destination 3" required>
              <Multiselect :disabled="true" v-model="destination_3" :options="universities" :multiple="false" label="name" track-by="name"></Multiselect>
            </FormField>
          </template>
          <template v-else>
            <FormField label="Destination Type" required>
              <Multiselect :disabled="true" v-model="application.placement_country" :options="countries" :multiple="false"></Multiselect>
            </FormField>
          </template>

          <BaseDivider />

          <p class="text-2xl font-semibold mb-5">Documents</p>

          <FormField label="Language Certificate" required>
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/language_certificate.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>

          <FormField label="ID" required>
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/id.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>

          <FormField label="CV" required>
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/cv.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>

          <FormField label="Motivation Letter" required>
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/motivation_letter.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>

          <FormField label="Transcript of records" required>
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/transcript_of_records.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>

          <FormField label="Diplomas/Awards">
            <a :href="'http://127.0.0.1:8000/storage/applications/'+application.user_id+'/'+application.id+'/other_diplomas.pdf'" target="_blank" rel="noopener noreferrer">
              <BaseButton color="info" :icon="mdiFileDownload" small/>
            </a>
          </FormField>
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
import {mdiBookEdit, mdiFileDownload} from '@mdi/js';
import {Universty} from "../../types/universities/Universty";
import Multiselect from 'vue-multiselect';
import Swal from "sweetalert2";
import axios from "axios";
import {IscedCode} from "../../types/universities/IscedCode";
import {Application} from "../../types/applications/Application";
import NotificationBar from '@/components/NotificationBar.vue'
import {mdiAlert} from '@mdi/js';
import {useRoute, useRouter} from "vue-router";

const isced_codes = ref<IscedCode[]>([]);
const universities = ref<Universty[]>([]);
const is_loading = ref(true);
const application = ref(new Application());
const countries = ref([]);
const router = useRouter();
const route = useRoute();

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
const studyCycleOptions = [
  'Bachelor or equivalent first cycle (EQF level 6)',
  'Doctorate or equivalent third cycle (EQF level 8)',
  'Master or equivalent second cycle (EQF level 7)',
  'Short cycle (EQF level 5)',
];
const statusOptions = [
  'Waiting for approval',
  'Issues',
  'Accepted'
];
const studyYearOptions = [
  '1st Year',
  '2nd Year',
  '3th Year',
  '4th Year',
  '5th Year',
  '6th Year'
];
const destination_1 = ref(new Universty());
const destination_2 = ref(new Universty());
const destination_3 = ref(new Universty());
const selected_university = ref(new Universty());

const submit = async () => {
  application.value.university_id = selected_university.value.id;

  try {
    await axios.patch("http://127.0.0.1:8000/api/applications/" + application.value.id, {
      'university_id': application.value.university_id,
      'feedback_comments': application.value.feedback_comments,
      'selection_score': application.value.selection_score,
      'status': application.value.status,
    })
      .then(async (response) => {
        if (!response.data.status) {
          await Swal.fire({
            title: response.data.message,
            text: response.data.errors.status[0],
            icon: 'error',
          })
        }
        else {
          Swal.fire({
            title: 'Success!',
            text: 'Feedback added successfully!',
            icon: 'success',
          })
          await router.push('/applications')
        }
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
}

const getIscedCodes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/isced-codes");
    response.data.codes.forEach((isced_code: any) => {
      let parsed_code = new IscedCode(isced_code);
      parsed_code.name = parsed_code.code + ' - ' + parsed_code.name;
      isced_codes.value.push(parsed_code);
    })
    await getUniversities();
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
}

const getCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all?fields=name");
    response.data.forEach((country: any) => {
      countries.value.push(country.name.common);
    })
    countries.value.sort();
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
}

const getApplication = async () => {
  application.value.id = Number(route.params.id);
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/applications/${application.value.id}`);
    application.value = new Application(response.data.application);

    if(application.value.destination_1 !== '') {
      let index1  = universities.value.findIndex(item => item.id == application.value.destination_1);
      if(index1 >= 0) {
        destination_1.value = universities.value[index1];
      }
    }
    if(application.value.destination_2 !== '') {
      let index2  = universities.value.findIndex(item => item.id == application.value.destination_2);
      if(index2 >= 0) {
        destination_2.value = universities.value[index2];
      }
    }
    if(application.value.destination_3 !== '') {
      let index3  = universities.value.findIndex(item => item.id == application.value.destination_3);
      if(index3 >= 0) {
        destination_3.value = universities.value[index3];
      }
    }
    if(application.value.university_id !== 0) {
      let index4  = universities.value.findIndex(item => item.id == application.value.university_id);
      if(index4 >= 0) {
        selected_university.value = universities.value[index4];
      }
    }
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
  await getCountries();
  await getIscedCodes();
  await getApplication();
})
</script>

<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
