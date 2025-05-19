<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex space-x-3 justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiEye" title="Review Document"/>
        <BaseButton to="/documents" type="button" color="info" outline label="Back"/>
      </div>
      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <CardBox>
          <p><span class="font-bold mr-3">Status:</span>
            <span v-if="document.status === 'waiting_for_approval'" class="text-yellow-500">Waiting for Approval</span>
            <span v-else-if="document.status === 'approved'" class="text-green-500">Approved</span>
            <span v-else-if="document.status === 'denied'" class="text-red-500">Denied</span>
            <span v-else>{{document.status}}</span>
          </p>
          <p><span class="font-bold">Student:</span> {{document.user.name}} {{document.user.family_name}}</p>
          <p><span class="font-bold">Student email:</span> {{document.user.email}}</p>
          <p class="mt-5">
            <span class="font-bold">
              <template v-if="document.type === 'certificate-of-arrival'">Certificate of arrival</template>
              <template v-else-if="document.type === 'travel-authorization'">Travel Authorization</template>
              <template v-else-if="document.type === 'activity-report'">Activity Report</template>
              <template v-else-if="document.type === 'learning-agreement'">Learning Agreement</template>
              <template v-else-if="document.type === 'learning-agreement-during'">During the mobility - Learning Agreement</template>
              <template v-else-if="document.type === 'learning-agreement-after'">After the mobility - Learning Agreement</template>
              <template v-else>
                {{document.type}}
              </template>
            :</span>
              <a :href="'http://127.0.0.1:8000/storage/documents/'+document.user_id+'/'+document.type+'.pdf'" target="_blank" rel="noopener noreferrer">
                <BaseButton color="success" :icon="mdiFileDownload" small label="Download" class="ml-3"/>
              </a>
          </p>

          <p class="mt-2"><span class="font-bold mr-3">Previous review:</span>
            <template v-if="old_feedback === ''">
              no previous feedback
            </template>
            <template v-else>
              {{old_feedback}}
            </template>
          </p>

          <BaseDivider />

          <FormField label="Feedback" class="mt-10">
            <FormControl v-model="document.feedback" type="textarea"/>
          </FormField>

          <div class="space-x-3">
            <BaseButton @click="changeDocumentStatus('denied')" color="danger" label="Deny"/>
            <BaseButton @click="changeDocumentStatus('approved')" color="success" label="Approve"/>
          </div>
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
import {onMounted, ref} from "vue";
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import {mdiEye, mdiFileDownload} from '@mdi/js';
import Swal from "sweetalert2";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {Documentt} from "../../types/documents/Documentt";
import {Step} from "../../types/home/Step";

const is_loading = ref(true);
const route = useRoute();
const document = ref(new Documentt());
const old_feedback = ref('');
const router = useRouter();

const getDocument = async () => {
  document.value.id = Number(route.params.id);

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/get-document/" + document.value.id);
    document.value = new Documentt(response.data.document);
    old_feedback.value = document.value.feedback;
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

const changeStepStatus = async (tag, status: string) => {
  try {
    let step = new Step();
    step.tag = tag;
    step.status = status;
    await axios.put(`http://127.0.0.1:8000/api/steps/`+document.value.user_id, step)
      .then(async (response) => {
        await router.push('/documents')
      });
  } catch (e) {
    console.log(e);
    if (e.response?.data?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: "An unknown error has occurred",
      })
    }
  }
}

const changeDocumentStatus = async (status: string) => {
  document.value.status = status;
  try {
    await axios.patch("http://127.0.0.1:8000/api/documents/" + document.value.id, {
      'status': document.value.status,
      'feedback': document.value.feedback,
    })
      .then(async (response) => {
        if (!response.data.status) {
          await Swal.fire({
            title: response.data.message,
            text: response.data.errors.status[0],
            icon: 'error',
          })
        } else {
          if (document.value.status === 'approved') {
            if(document.value.type === 'certificate-of-arrival') {
              await changeStepStatus('2_1', 'done');
              await changeStepStatus('2_2', 'in_progress');
            }
            if(document.value.type === 'activity-report') {
              await changeStepStatus('3_1', 'done');
              await changeStepStatus('3_2', 'in_progress');
            }
            if(document.value.type === 'learning-agreement') {
              await changeStepStatus('1_3', 'done');
              await changeStepStatus('1_4', 'in_progress');
            }
            if(document.value.type === 'learning-agreement-during') {
              await changeStepStatus('2_2', 'done');
              await changeStepStatus('3_1', 'in_progress');
            }
            if(document.value.type === 'learning-agreement-after') {
              await changeStepStatus('3_2', 'done');
              await changeStepStatus('3_3', 'in_progress');
            }
            if(document.value.type === 'travel-authorization') {
              await changeStepStatus('1_4', 'done');
              await changeStepStatus('2_1', 'in_progress');
            }
          } else {
            if(document.value.type === 'certificate-of-arrival') {
              await changeStepStatus('2_1', 'incomplete');
            }
            if(document.value.type === 'activity-report') {
              await changeStepStatus('3_1', 'incomplete');
            }
            if(document.value.type === 'learning-agreement') {
              await changeStepStatus('1_3', 'incomplete');
            }
            if(document.value.type === 'travel-authorization') {
              await changeStepStatus('1_4', 'incomplete');
            }
            if(document.value.type === 'learning-agreement-during') {
              await changeStepStatus('2_2', 'incomplete');
            }
            if(document.value.type === 'learning-agreement-after') {
              await changeStepStatus('3_2', 'incomplete');
            }
          }
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

onMounted(() => {
  getDocument();
})
</script>
