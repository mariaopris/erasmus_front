<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiNotificationClearAll" title="Add Notification"/>
        <CardBox>
          <FormField label="Message">
            <FormControl v-model="notification.message" type="textarea"/>
          </FormField>

          <BaseDivider></BaseDivider>

          <template #footer>
            <BaseButtons>
              <BaseButton to="/notifications" type="button" color="info" outline label="Back"/>
              <BaseButton @click="save()" color="info" label="Submit" />
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
import {mdiNotificationClearAll} from '@mdi/js';
import BaseDivider from "../../components/BaseDivider.vue";
import {Notificationn} from "../../types/Notificationn";
import axios from "axios";
import Swal from "sweetalert2";
import {useRouter} from "vue-router";

const notification = ref(new Notificationn());
const router = useRouter();

const save = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/api/notifications", {
      form: {
        'message': notification.value.message
      },
    })
      .then(async (response) => {
        if (response.data.status) {
          await Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
          })

          await router.push('/notifications');
        } else {
          let message = response.data.message;
          let title = 'Error...';
          if (Object.keys(response.data.errors).length > 0) {
            message = response.data.errors[Object.keys(response.data.errors)[0]];
            title = response.data.message;
          }
          Swal.fire({
            title: title,
            text: message,
            icon: 'error',
          })
        }
      });
  } catch (e) {
    console.log('error', e);
    await Swal.fire({
      icon: 'error',
      title: 'Ooops..',
      text: e.response.data.error,
    })
  }
}
</script>

