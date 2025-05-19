<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiFileDocumentAlert" title="Manage Notifications"/>
        <RouterLink to="/add-notification">
          <BaseButton type="button" color="info" label="+Add Notification"/>
        </RouterLink>
      </div>

      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div>
          <CardBox has-table>
            <table>
              <thead>
              <tr>
                <th>Created At</th>
                <th>Message</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(notification, notification_index) in notifications">
                <td data-label="Created At">
                  {{ notification.created_at }}
                </td>
                <td data-label="message">
                  <p>{{notification.message}}</p>
                </td>

                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="deleteNotification(notification.id, notification_index)"
                    />
                  </BaseButtons>
                </td>
              </tr>
              </tbody>
            </table>
          </CardBox>
        </div>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiFileDocumentAlert, mdiTableSearch, mdiTrashCan} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import CardBox from '@/components/CardBox.vue'
import axios from "axios";
import Swal from "sweetalert2";
import FormControl from '@/components/FormControl.vue'
import {Documentt} from "../../types/documents/Documentt";
import {Notificationn} from "../../types/Notificationn";

const is_loading = ref(true);
const notifications = ref<Notificationn[]>([]);

const deleteNotification = (id: number, index: number) => {
  Swal.fire({
    title: 'Are you sure that you want to delete this notification?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://127.0.0.1:8000/api/notifications/${id}`)
        .then((response) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            html: 'Notification deleted successfully!',
            showCancelButton: false,
          })
          notifications.value.splice(index,1);
        })
        .catch((error) => {
          console.log('eroare: ', error);
        })
    }
  })
}

const getData = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/notifications`);
    console.log('response.data.notifications', response.data.notifications)
    response.data.notifications.forEach((notification: any) => {
      notifications.value.push(new Notificationn(notification));
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
  getData();
})
</script>
