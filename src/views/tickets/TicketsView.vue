<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="flex justify-between items-center">
        <SectionTitleLineWithButton :icon="mdiTicket" title="Tickets"/>
      </div>
      <div class="justify-between flex py-2 items-center">
        <div class="space-x-3">
          <PillTag @click="filterStatus('Open')" class="cursor-pointer" :class="status === 'Open' ? 'border-blue-700 border-b-4': ''" color="success" label="Open"/>
          <PillTag @click="filterStatus('In Progress')" class="cursor-pointer" :class="status === 'In Progress' ? 'border-blue-700 border-b-4': ''" color="warning" label="In progress"/>
          <PillTag @click="filterStatus('Closed')" class="cursor-pointer" :class="status === 'Closed' ? 'border-blue-700 border-b-4': ''" color="danger" label="Closed"/>
        </div>
        <FormControl v-model="searchValue" @input="search()" type="text" :icon="mdiTableSearch" class="w-[400px]" placeholder="Search ... " borderless/>
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
                <th>Full Name</th>
                <th>Description</th>
                <th>Unread Messages</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th />
              </tr>
              </thead>
              <tbody>
              <tr v-for="(ticket, ticket_index) in itemsPaginated">
                <td data-label="Full Name">
                  {{ ticket.user.name }}
                </td>
                <td data-label="Desctipton">
                  {{ ticket.title}}
                </td>
                <td data-label="Unread Messages">
                  <PillTag class="font-semibold" color="info" :label="ticket.no_unread_messages"/>
                </td>
                <td data-label="Department">
                  <p>{{ticket.department}}</p>
                </td>
                <td data-label="Status">
                  <PillTag v-if="ticket.status === 'Open'" color="success" label="Open"/>
                  <PillTag v-if="ticket.status === 'In Progress'" color="warning" label="In progress"/>
                  <PillTag v-if="ticket.status === 'Closed'" color="danger" label="Closed"/>
                </td>
                <td data-label="Last Updated">
                  {{ ticket.updated_at}}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <RouterLink :to="'view-ticket/'+ticket.id">
                    <BaseButton color="info" :icon="mdiEye" small/>
                  </RouterLink>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
              <BaseLevel>
                <BaseButtons>
                  <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                  />
                </BaseButtons>
                <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
              </BaseLevel>
            </div>
          </CardBox>
        </div>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {mdiTicket, mdiEye, mdiTableSearch} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import {computed, onMounted, ref} from "vue";
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import FormControl from '@/components/FormControl.vue'
import PillTag from '@/components/PillTag.vue'
import axios from "axios";
import Swal from "sweetalert2";
import {Ticket} from "../../types/tickets/Ticket";

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  filtered_tickets.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
);
const numPages = computed(() => Math.ceil(filtered_tickets.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
const searchValue = ref('');
const status = ref('');
const is_loading = ref(true);
const tickets = ref<Ticket[]>([]);
const filtered_tickets = ref<Ticket[]>([]);

const filterStatus = (type: string) => {
  if(status.value == '' || status.value !== type){
    status.value = type;
    filtered_tickets.value = tickets.value.filter((ticket: Ticket) => {
      return (
        ticket.status.toLowerCase().includes(status.value.toLowerCase())
      );
    });
  }
  else {
    status.value = '';
    filtered_tickets.value = tickets.value;
  }
}

const search = () => {
  setTimeout(() => {
    filtered_tickets.value = tickets.value.filter((ticket: Ticket) => {
      return (
        ticket.user.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        ticket.created_at.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        ticket.updated_at.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
  }, 1000);
}

const getTickets = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/tickets");
    tickets.value = <Ticket[]>[];
    filtered_tickets.value = <Ticket[]>[];
    response.data.tickets.forEach((ticket: Ticket) => {
      tickets.value.push(new Ticket(ticket));
    })
    filtered_tickets.value = JSON.parse(JSON.stringify(tickets.value));
  } catch (error) {
    console.log('error', error)
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
    })
  }
  is_loading.value = false;
  setTimeout(() => {
    getTickets();
  }, 5000);
}

onMounted(() =>{
  getTickets();
})
</script>
