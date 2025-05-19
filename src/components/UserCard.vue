<template>
  <CardBox>
    <BaseLevel type="justify-between">
      <div class="flex items-center justify-center space-x-3">
        <div class="space-y-3 text-center md:text-left lg:mx-12">
          <h1 class="text-2xl">Hello, <b>{{ auth_user.name }} {{ auth_user.family_name }} =]</b></h1>
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import BaseLevel from '@/components/BaseLevel.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import {AuthUser} from "@/types/AuthUser";
import {useAuthStore} from "../stores/auth";

const auth_user = ref(new AuthUser());
const auth = useAuthStore();

onMounted(() => {
  if (auth.user !== null) {
    auth_user.value = new AuthUser(JSON.parse(auth.user));
  }
})
</script>
