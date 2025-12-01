<script setup lang="ts">
import { type Chat, findUserById, type UserReference } from '../models'
import onClickOutside from '../utils/on-click-outside'
import { computed } from 'vue'
import { typingUsersString } from '../models/chat.ts'
import { getLocalizationStrings, type Strings } from '../localization'
import { isAudioFile } from '../utils/media-types.ts'

import SvgIcon from '@/components/SvgIcon.vue'

export interface ChatsItemProps {
  user: UserReference
  chat: Chat
  strings?: Partial<Strings>
}

const vClickOutside = onClickOutside

const props = withDefaults(defineProps<ChatsItemProps>(), {
  strings: () => getLocalizationStrings('auto'),
})

const userStatus = computed(() => {
  const { chat, user } = props

  if (!chat.users || chat.users.length !== 2) return null

  const otherUser = findUserById(chat.users, user.id)

  return otherUser?.status?.state || null
})

const typingUsers = computed(() => typingUsersString(props.chat, props.strings))

const isMessageCheckmarkVisible = computed(() => {
  const { chat, user } = props

  return (
    !typingUsers.value &&
    chat.lastMessage &&
    !chat.lastMessage.deleted &&
    chat.lastMessage.sender.id === user.id &&
    (chat.lastMessage.saved || chat.lastMessage.delivered || chat.lastMessage.read)
  )
})

const isAudio = computed(() => {
  const { chat } = props

  return chat.lastMessage?.files ? isAudioFile(chat.lastMessage.files[0]) : false
})

const formattedDuration = computed(() => {
  const { chat } = props

  if (!chat.lastMessage?.files || !isAudio.value) return ''

  const duration = chat.lastMessage?.files?.[0]?.duration || 0

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})
</script>

<template>
  <div class="vac-room-container">
    <slot :name="'room-list-item_' + chat.id">
      <slot :name="'room-list-avatar_' + chat.id">
        <div
          v-if="chat.icon"
          class="vac-avatar"
          :style="{ 'background-image': `url('${chat.icon}')` }"
        />
      </slot>
      <div class="vac-name-container vac-text-ellipsis">
        <div class="vac-title-container">
          <div
            v-if="userStatus"
            class="vac-state-circle"
            :class="{ 'vac-state-online': userStatus === 'online' }"
          />
          <slot :name="'room-list-info_' + chat.id">
            <div class="vac-room-name vac-text-ellipsis">
              {{ chat.name }}
            </div>
          </slot>
          <div v-if="chat.lastMessage" class="vac-text-date">
            {{ chat.lastMessage.createdAt }}
          </div>
        </div>
        <div
          class="vac-text-last"
          :class="{
            'vac-message-new': chat.lastMessage && chat.lastMessage.new && !typingUsers,
          }"
        >
          <span v-if="isMessageCheckmarkVisible">
            <slot :name="'checkmark-icon_' + chat.id">
              <SvgIcon
                :name="chat.lastMessage?.delivered ? 'double-checkmark' : 'checkmark'"
                :param="chat.lastMessage?.read ? 'seen' : ''"
                class="vac-icon-check"
              />
            </slot>
          </span>
          <div
            v-if="chat.lastMessage && !chat.lastMessage.deleted && isAudio"
            class="vac-text-ellipsis"
          >
            <slot :name="'microphone-icon_' + chat.id">
              <svg-icon name="microphone" class="vac-icon-microphone" />
            </slot>
            {{ formattedDuration }}
          </div>
          <format-message
            v-else-if="chat.lastMessage"
            :message-id="chat.lastMessage.id"
            :room-id="chat.id"
            :room-list="true"
            :content="getLastMessage"
            :deleted="!!chat.lastMessage.deleted && !typingUsers"
            :users="room.users"
            :text-messages="textMessages"
            :linkify="false"
            :text-formatting="textFormatting"
            :link-options="linkOptions"
            :single-line="true"
          >
            <template v-for="(idx, name) in $slots" #[name]="data">
              <slot :name="name" v-bind="data" />
            </template>
          </format-message>
          <div v-if="!chat.lastMessage && typingUsers" class="vac-text-ellipsis">
            {{ typingUsers }}
          </div>
          <div class="vac-room-options-container">
            <div v-if="room.unreadCount" class="vac-badge-counter vac-room-badge">
              {{ room.unreadCount }}
            </div>
            <slot :name="'room-list-options_' + chat.id">
              <div
                v-if="roomActions.length"
                class="vac-svg-button vac-list-room-options"
                @click.stop="roomMenuOpened = chat.id"
              >
                <slot :name="'room-list-options-icon_' + chat.id">
                  <svg-icon name="dropdown" param="room" />
                </slot>
              </div>
              <transition v-if="roomActions.length" name="vac-slide-left">
                <div
                  v-if="roomMenuOpened === chat.id"
                  v-click-outside="closeRoomMenu"
                  class="vac-menu-options"
                >
                  <div class="vac-menu-list">
                    <div v-for="action in roomActions" :key="action.name">
                      <div class="vac-menu-item" @click.stop="roomActionHandler(action)">
                        {{ action.title }}
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss"></style>
