<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="justify-between mb-10 flex">
        <div class="flex space-x-6 items-center">
          <RouterLink to="tickets">
            <PillTag label="Back" :icon="mdiBackburger" />
          </RouterLink>
          <p class="leading-tight text-2xl">Opris Maria-Alexandra</p>
        </div>
        <div class="flex space-x-3 items-center">
          <p class="text-sm text-gray-500">Status:</p>
          <div class="bg-green-400 rounded-xl text-white px-2 py-1.5">Open</div>
        </div>
      </div>

      <div class="flex space-x-3">
        <div class="rounded-full bg-green-700 h-fit w-fit p-2 justify-center text-center font-bold text-white">OM</div>

        <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-green-100 border-1 border-green-500 w-fit">
          <BaseLevel>
            <div class="flex flex-col md:flex-row items-center">
              <BaseIcon
                w="w-10 md:w-5"
                h="h-10 md:h-5"
                size="24"
                class="md:mr-2"
              />
              <span class="text-left md:text-left md:py-2"><slot />Buna am o problema!</span>
            </div>
          </BaseLevel>
        </div>
      </div>
      <p class="text-xs text-gray-500 flex ml-12 mt-5">12.03.2023 1:30</p>

      <div class="flex space-x-3 items-center justify-end">
        <div class="px-3 md:py-2 mb-6 last:mb-0 border rounded-lg transition-colors duration-150 bg-blue-100 border-1 border-blue-500 w-fit">
          <BaseLevel>
            <div class="flex flex-col md:flex-row items-center">
              <BaseIcon
                w="w-10 md:w-5"
                h="h-10 md:h-5"
                size="24"
                class="md:mr-2"
              />
              <span class="text-right md:text-left md:py-2"><slot />Buna! Cu ce te pot ajuta?</span>
            </div>
          </BaseLevel>
        </div>

        <div class="rounded-full bg-blue-700 h-fit w-fit p-2 justify-center text-center font-bold text-white">AA</div>
      </div>

      <p class="text-xs text-gray-500 justify-end flex mr-12 mb-5">12.03.2023 1:30</p>

      <div class="bottom-0 fixed flex items-center space-x-6">
        <FormField class="w-[900px]">
          <FormControl type="textarea" placeholder="Write a message ..." />
        </FormField>
        <BaseButton type="button" color="info" label="Send" class="w-fit h-fit"/>
      </div>

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

</script>
