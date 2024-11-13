<template>
  <LayoutAuthenticated>
    <SectionMain>
      <template v-if="is_loading">
        <p>Loading ...</p>
      </template>
      <template v-else>
        <div class="justify-between mb-2 flex">
          <div class="flex space-x-6 items-center">
            <RouterLink to="/tickets">
              <PillTag label="Back" :icon="mdiBackburger" />
            </RouterLink>
            <p class="leading-tight text-2xl">{{ticket.title}}</p>
          </div>
          <div class="flex space-x-3 items-center">
            <p class="text-sm text-gray-500">Change Status:</p>
            <div @click="changeTicketStatus('Open')" :class="ticket.status === 'Open' ? 'bg-green-500' : 'bg-green-200'" class="cursor-pointer rounded-xl text-white px-2 py-1.5">Open</div>
            <div @click="changeTicketStatus('In Progress')" :class="ticket.status === 'In Progress' ? 'bg-yellow-500' : 'bg-yellow-200'" class="cursor-pointer rounded-xl text-white px-2 py-1.5">In Progress</div>
            <div @click="changeTicketStatus('Closed')" :class="ticket.status === 'Closed' ? 'bg-red-500' : 'bg-red-200'" class="cursor-pointer rounded-xl text-white px-2 py-1.5">Closed</div>
          </div>
        </div>
        <p class="mb-10 ml-28">Department: <span class="font-semibold">{{ticket.department}}</span></p>

        <div class="h-[370px] overflow-auto">
          <template v-for="(message, message_index) in messages">
            <template v-if="message.user_type === 0">
              <div class="flex space-x-3">
                <div class="rounded-full bg-green-700 h-fit w-fit p-2 justify-center text-center font-bold text-white uppercase">
                  {{ticket.user.name[0]}}{{ticket.user.name[1]}}
                </div>
                <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-green-100 border-1 border-green-500 w-fit">
                  <span class="text-left md:text-left md:py-2 text-xs font-semibold"><slot/>{{ticket.user.name}}</span>
                  <BaseLevel>
                    <div class="flex flex-col md:flex-row items-center">
                      <span class="text-left md:text-left md:py-2"><slot/>{{message.message}}</span>
                    </div>
                  </BaseLevel>
                </div>
              </div>
              <p class="text-xs text-gray-500 flex ml-12 mt-5">{{message.created_at}}</p>
            </template>
            <template v-if="message.user_type === 1">
              <div class="mr-20">
                <div class="flex space-x-3 items-center justify-end">
                  <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-blue-100 border-1 border-blue-500 w-fit">
                    <span class="text-right md:text-right md:py-2 text-xs font-bold"><slot/>Erasmus One Support</span>
                    <BaseLevel>
                      <div class="flex flex-col md:flex-row items-center">
                        <span class="text-right md:text-right md:py-2"><slot/>{{message.message}}</span>
                      </div>
                    </BaseLevel>
                  </div>
                  <div class="rounded-full bg-blue-700 h-fit w-fit p-2 justify-center text-center font-bold text-white uppercase">EO</div>
                </div>
                <p class="text-xs text-gray-500 justify-end flex mr-12 mb-5">{{message.created_at}}</p>
              </div>
            </template>
          </template>
        </div>

        <div class="bottom-0 fixed flex items-center space-x-6">
          <FormField class="w-[900px]">
            <FormControl v-model="message.message" type="textarea" placeholder="Write a message ..." />
          </FormField>
          <BaseButton @click="addMessage()" type="button" color="info" label="Send" class="w-fit h-fit"/>
        </div>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiAccountSchool, mdiBackburger} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import PillTag from '@/components/PillTag.vue'
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {Message} from "../../types/tickets/Message";
import {Ticket} from "../../types/tickets/Ticket";
import axios from "axios";
import Swal from "sweetalert2";

const is_loading = ref(true);
const route = useRoute();
const ticket = ref(new Ticket());
const messages = ref<Message[]>([]);
const message = ref(new Message());

const changeTicketStatus = async (status: string) => {
  await axios.patch(`http://127.0.0.1:8000/api/tickets/${ticket.value.id}`, {
    'status': status
  })
    .then(async (response) => {
      if (!response.data.status) {
        await Swal.fire({
          title: 'Error ...',
          text: response.data.message,
          icon: 'error',
        })
      } else {
        ticket.value.status = status;
      }
    })
}

const addMessage = async () => {
  await axios.post("http://127.0.0.1:8000/api/messages", {
    form: {
      'ticket_id': ticket.value.id,
      'user_type': 1,
      'message': message.value.message
    },
  })
    .then(async (response) => {
      if (!response.data.status) {
        await Swal.fire({
          title: 'Error ...',
          text: response.data.message,
          icon: 'error',
        })
      } else {
        message.value = new Message();
        await getTicket();
      }
    })
}
const readMessage = async (message_id: number) => {
  await axios.patch(`http://127.0.0.1:8000/api/messages/${message_id}`)
}

const getTicket = async () => {
  await axios.get("http://127.0.0.1:8000/api/tickets/" + route.params.id)
    .then(async (response) => {
      ticket.value = new Ticket(response.data.ticket);
      response.data.ticket.messages.forEach((message: Message) => {
        let i = messages.value.findIndex(item => item.id === message.id);
        if(i < 0)
        {
          if(message.read === 0)
          {
            readMessage(message.id);
          }
          messages.value.push(new Message(message));
        }
      })
    })
  is_loading.value = false;
  setTimeout(() => {
    getTicket();
  }, 5000);
}

onMounted(() => {
  getTicket();
})
</script>
