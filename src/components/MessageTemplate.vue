<script setup lang="ts">
import type { Message, ChatReference, User } from '../models'
import type { Styles } from '../themes'
import { getLocalizationStrings, type Strings } from '../localization'
import { computed } from 'vue'
import { formatText, type TextFormattingOptions } from '../utils/text-formatter'

export interface MessageTemplateProps {
  message?: Message
  chat?: ChatReference
  users?: Array<User>
  formattingOptions?: TextFormattingOptions
  styles?: Partial<Styles>
  strings?: Partial<Strings>
}

const props = withDefaults(defineProps<MessageTemplateProps>(), {
  formattingOptions: () => ({
    markdown: true,
    linkify: true,
    singleLine: false,
    linkOptions: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  styles: () => ({}),
  strings: () => getLocalizationStrings('auto'),
})

const singleLine = computed(() => {
  return props.formattingOptions?.singleLine || false
})

const textFormattingBindings = computed(() => {
  return {
    users: props.users,
  }
})

const formattedMessageParts = computed(() => {
  return [
    formatText(
      props.message?.content || '',
      props.formattingOptions || {},
      textFormattingBindings.value,
    ),
  ]
})
</script>

<template>
  <div class="vac-format-message-wrapper" :class="{ 'vac-text-ellipsis': singleLine }">
    <template v-for="(part, i) in formattedMessageParts" :key="i">
      <div v-if="part.markdown" class="markdown" v-html="part.value" />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
