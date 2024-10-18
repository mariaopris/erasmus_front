<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex space-x-3 justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiFileImportOutline" title="Import Universities"/>
        <BaseButton to="universities" type="button" color="info" outline label="Back"/>
      </div>

      <CardBox form @submit="uploadFile()">
        <NotificationBar color="warning" :icon="mdiAlert" :outline="notificationsOutline">
          <b>Warning: </b>Importing a file will overwrite the existing university data
          <template #right>
          </template>
        </NotificationBar>

        <CardBoxComponentTitle title="Upload Excel File"></CardBoxComponentTitle>

        <input type="file" @change="onFileChange" ref="fileInput" accept=".xlsx, .csv" />
        <BaseButton small @click="uploadFile()" color="info" label="Upload" />

        <p class="text-md font-semibold text-red-500 mt-5" v-if="errorMessage">{{ errorMessage }}</p>
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
import {computed, ref} from "vue";
import CardBoxComponentTitle from '@/components/CardBoxComponentTitle.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import {mdiFileImportOutline, mdiAlert} from '@mdi/js';
import axios from "axios";
import Swal from "sweetalert2";

const notificationSettingsModel = ref([])

const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const selectedFile = ref(null);
const errorMessage = ref("");
const fileInput = ref(null);

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    errorMessage.value = "Please select a file.";
    return;
  }

  let formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/import-universities", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    errorMessage.value = "";
    fileInput.value.value = "";
    await Swal.fire({
      title: 'Done!',
      text: 'File uploaded successfully!',
      icon: 'success',
    })
  } catch (error) {
    errorMessage.value = error.response.data.message || "File upload failed.";
  }
};
</script>


