<p align="center">
<a href="https://github.com/antoine92190/vue-advanced-chat/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/antoine92190/vue-advanced-chat/build.yml?branch=master"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/dm/vue-advanced-chat.svg"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/bundlephobia/minzip/vue-advanced-chat"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/v/vue-advanced-chat.svg"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/l/vue-advanced-chat.svg"></a>
</p>

# vue-advanced-chat

![Demo Image](demo/src/assets/web_mobile.png)

## Features

- Compatible with all Javascript frameworks (Vue, Angular, React, etc.) or no framework at all
- Customizeable realtime chat messaging
- Backend agnostic
- Images, videos, files, voice messages & emojis
- Edit messages & reply to other messages
- Tag users & emojis shortcut suggestions
- UI elements for seen, new, deleted, typing and system messages
- Text formatting - bold, italic, strikethrough, underline, code, multiline
- Online / Offline users status
- Flexible options and slots
- Light and dark theme modes
- Firestore example
- Typescript, PWA, Web Component support

## [Demo](https://antoine92190.github.io/vue-advanced-chat)

Enjoy :smile:

## [Real World Example](https://vue-advanced-chat-app.netlify.app/)

A Progressive Web Application showcasing all the features of `vue-advanced-chat` component.<br>
Built with Firestore, Vuetify, and Push Notifications.

If you wish to get premium access to the real world example source code, please contact me by email.

You will get a fully working chat application for web and mobile:

- UI and backend integration
- Email, Facebook and Google authentication
- Real-time messaging, browser push notifications, images optimization (Firebase Cloud Functions to compress avatars)
- UI/UX components for alerts (errors, information), dialogs, etc.
- Add existing users to a room using their email
- Send email invitations to non-existing users
- Edition of profile and rooms
- Addition and deletion of room users
- Optimised firestore implementation to reduce bandwidth and costs as much as possible
- State management using vuex
- Internationalisation (i18n)
- Google Analytics
- Support to help you get the chat up and running

<br>

## Table of Contents

- [Installation](#installation)
- [Usage](#example)
- [Props API](#props-api)
- [Props data structure](#props-data-structure)
- [Events API](#events-api)
- [Named Slots](#named-slots)
- [Using with Firestore](#using-with-firestore)

<br>

## Installation

```bash
# Using npm
npm install --save vue-advanced-chat

# Using yarn
yarn add vue-advanced-chat

# Using CDN
<script src="https://cdn.jsdelivr.net/npm/vue-advanced-chat@2.0.4/dist/vue-advanced-chat.umd.js"></script>
```

### Vue

Register `vue-advanced-chat` and `emoji-picker` as web components in your [config file](https://vuejs.org/guide/extras/web-components.html#example-vite-config):

```javascript
compilerOptions: {
  isCustomElement: tagName => {
    return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
  }
}
```

Demo: https://github.com/antoine92190/vue-advanced-chat-sandbox/tree/main

### React

Demo: https://github.com/antoine92190/vue-advanced-chat-sandbox/tree/react

### Angular / Ionic

Demo: https://github.com/antoine92190/vue-advanced-chat-sandbox/tree/angular

<br>

## Usage

#### You can import it as a custom component:

```javascript
<template>
  <vue-advanced-chat
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
  />
</template>

<script>
  import { register } from 'vue-advanced-chat'
  register()

  // Or if you used CDN import
  // window['vue-advanced-chat'].register()

  export default {
    data() {
      return {
        currentUserId: '1234',
        rooms: [],
        messages: [],
        roomActions: [
          { name: 'inviteUser', title: 'Invite User' },
          { name: 'removeUser', title: 'Remove User' },
          { name: 'deleteRoom', title: 'Delete Room' }
        ]
      }
    }
  }
</script>
```

### Important notes

`vue-advanced-chat` component is performance oriented, hence you have to follow specific rules to make it work properly.

- Use array assignement instead of `push` method

```javascript
// DO THIS
const rooms = []
for (let i = 0; i < res.length; i++) {
  rooms.push(res)
}
this.rooms = rooms

// DON'T DO THIS
for (let i = 0; i < res.length; i++) {
  this.rooms.push(res)
}
```

```javascript
// DO THIS
this.rooms[i].typingUsers = [...this.rooms[i].typingUsers, typingUserId]

// DON'T DO THIS
this.rooms[i].typingUsers.push(typingUserId)
```

- To add or replace an item inside an array, use spread operator

```javascript
// DO THIS
this.rooms[roomIndex] = room
this.rooms = [...this.rooms]

// DON'T DO THIS
this.rooms[roomIndex] = room

// AND DON'T DO THIS
this.rooms.push(room)
```

- Follow the UI loading pattern by updating `messagesLoaded` prop every time a new room is fetched

```javascript
fetchMessages({ room, options }) {
  this.messagesLoaded = false

  // use timeout to imitate async server fetched data
  setTimeout(() => {
    this.messages = []
    this.messagesLoaded = true
  })
}
```

<br>

## Props API

### Important notes

If you are using Vue 3, you can pass Array and Object props normally: [Passing DOM Properties in Vue 3](https://vuejs.org/guide/extras/web-components.html#passing-dom-properties)
<br>
Otherwise, you need to pass those props as strings. For example: `[messages]="JSON.stringify(messages)"`

| <div style="width:230px">Prop</div> | Type             | Required | Default                                                                                                           |
|-------------------------------------| ---------------- | -------- |-------------------------------------------------------------------------------------------------------------------|
| `height`                            | String           | -        | `600px`                                                                                                           |
| `current-user-id`(1)                | String           | `true`   | -                                                                                                                 |
| `rooms`                             | [String, Array]  | -        | `[]`                                                                                                              |
| `rooms-order`                       | `desc` / `asc`   | -        | `desc`                                                                                                            |
| `loading-rooms`(2)                  | Boolean          | -        | `false`                                                                                                           |
| `rooms-loaded`(3)                   | Boolean          | -        | `false`                                                                                                           |
| `room-id`(4)                        | String           | -        | `null`                                                                                                            |
| `load-first-room`(5)                | Boolean          | -        | `true`                                                                                                            |
| `rooms-list-opened`                 | Boolean          | -        | `true`                                                                                                            |
| `custom-search-room-enabled` (6)    | Boolean          | -        | `false`                                                                                                           |
| `messages`                          | [String, Array]  | -        | `[]`                                                                                                              |
| `room-message`(7)                   | String           | -        | `null`                                                                                                            |
| `username-options` (8)              | [String, Object] | -        | `{minUsers: 3, currentUser: false}`                                                                               |
| `messages-loaded`(9)                | Boolean          | -        | `false`                                                                                                           |
| `room-actions`(10)                  | [String, Array]  | -        | `[]`                                                                                                              |
| `menu-actions`(11)                  | [String, Array]  | -        | `[]`                                                                                                              |
| `message-actions`(12)               | [String, Array]  | -        | (11)                                                                                                              |
| `message-selection-actions`(13)     | [String, Array]  | -        | (13)                                                                                                              |
| `templates-text`(14)                | [String, Array]  | -        | `null`                                                                                                            |
| `auto-scroll`(15)                   | [String, Object] | -        | `{ send: { new: true, newAfterScrollUp: true }, receive: { new: true, newAfterScrollUp: false } }`                |
| `show-search`                       | Boolean          | -        | `true`                                                                                                            |
| `show-add-room`                     | Boolean          | -        | `true`                                                                                                            |
| `show-send-icon`                    | Boolean          | -        | `true`                                                                                                            |
| `show-files`                        | Boolean          | -        | `true`                                                                                                            |
| `show-audio`                        | Boolean          | -        | `true`                                                                                                            |
| `audio-bit-rate`                    | Number           | -        | `128`                                                                                                             |
| `audio-sample-rate`                 | Number           | -        | `44100`                                                                                                           |
| `show-emojis`                       | Boolean          | -        | `true`                                                                                                            |
| `show-reaction-emojis`              | Boolean          | -        | `true`                                                                                                            |
| `show-new-messages-divider`(16)     | Boolean          | -        | `true`                                                                                                            |
| `show-footer`(17)                   | Boolean          | -        | `true`                                                                                                            |
| `text-messages`(18)                 | [String, Object] | -        | `null`                                                                                                            |
| `text-formatting`(19)               | [String, Object] | -        | ` {disabled: false, italic: '_', bold: '*', strike: '~', underline: '°', multilineCode: '```', inlineCode: ' `'}` |
| `link-options`(20)                  | [String, Object] | -        | `{ disabled: false, target: '_blank', rel: null }`                                                                |
| `room-info-enabled` (21)            | Boolean          | -        | `false`                                                                                                           |
| `textarea-action-enabled`(22)       | Boolean          | -        | `false`                                                                                                           |
| `textarea-auto-focus`               | Boolean          | -        | `true`                                                                                                            |
| `user-tags-enabled`                 | Boolean          | -        | `true`                                                                                                            |
| `emojis-suggestion-enabled`         | Boolean          | -        | `true`                                                                                                            |
| `media-preview-enabled`             | Boolean          | -        | `true`                                                                                                            |
| `responsive-breakpoint`(23)         | Number           | -        | `900`                                                                                                             |
| `single-room`(24)                   | Boolean          | -        | `false`                                                                                                           |
| `scroll-distance`(25)               | Number           | -        | `60`                                                                                                              |
| `theme`(26)                         | `light` / `dark` | -        | `light`                                                                                                           |
| `accepted-files`(27)                | String           | -        | `*`                                                                                                               |
| `capture-files`(28)                 | String           | -        | `undefined`                                                                                                       |
| `styles`(29)                        | [String, Object] | -        | (26)                                                                                                              |
| `emoji-data-source`                 | String           | -        | `https://cdn.jsdelivr.net/npm/emoji-picker-element-data@%5E1/en/emojibase/data.json`                              |

**(1)** `current-user-id` is required to display UI and trigger actions according to the user using the chat (ex: messages position on the right, etc.)

**(2)** `loading-rooms` can be used to show/hide a spinner icon while rooms are loading

**(3)** `rooms-loaded` must be set to `true` when all rooms have been loaded. Meaning the user cannot scroll to load more paginated rooms

**(4)** `room-id` can be used to load a specific room at any time

**(5)** `load-first-room` can be used to remove the default behaviour of opening the first room at initialization

**(6)** `custom-search-room-enabled` can be used to use the [search-room](#events-api) event to call your own method to filter out rooms

**(7)** `room-message` can be used to add a default textarea value

**(8)** `username-options` can be used to show/hide room messages username according to the minimum number of users `minUsers` inside a room, and if the message user is the current user `currentUser`

**(9)** `messages-loaded` must be set to `true` when all messages of a conversation have been loaded. Meaning the user cannot scroll on top to load more paginated messages

**(10)** `room-actions` can be used to display your own buttons when clicking the dropdown icon of each room inside the rooms list.<br>
You can then use the [room-action-handler](#events-api) event to call your own action after clicking a button. Ex:

```javascript
room-actions="[
  {
    name: 'archiveRoom',
    title: 'Archive Room'
  }
]"
```

**(11)** `menu-actions` can be used to display your own buttons when clicking the vertical dots icon inside a room.<br>
You can then use the [menu-action-handler](#events-api) event to call your own action after clicking a button. Ex:

```javascript
menu-actions="[
  {
    name: 'inviteUser',
    title: 'Invite User'
  },
  {
    name: 'removeUser',
    title: 'Remove User'
  },
  {
    name: 'deleteRoom',
    title: 'Delete Room'
  }
]"
```

**(12)** `message-actions` can be used to display your own buttons when clicking the dropdown icon inside a message.<br>
You can then use the [message-action-handler](#events-api) event to call your own action after clicking a button. Ex:

```javascript
message-actions="[
  {
    name: 'addMessageToFavorite',
    title: 'Add To Favorite'
  },
  {
    name: 'shareMessage',
    title: 'Share Message'
  }
]"
```

You can use built-in `message-actions` names to trigger specific UI modifications when clicked.<br>
Currently, `replyMessage`, `editMessage` and `deleteMessage` action names are available.<br>
If `messageActions` is not set, it will use the default values below.<br>
If you don't want to display this `messageActions` menu, you can pass it an empty array.

```javascript
messageActions="[
  {
    name: 'replyMessage',
    title: 'Reply'
  },
  {
    name: 'editMessage',
    title: 'Edit Message',
    onlyMe: true
  },
  {
    name: 'deleteMessage',
    title: 'Delete Message',
    onlyMe: true
  },
  {
    name: 'selectMessages',
    title: 'Select'
  }
]"
```

**(13)** `message-selection-actions` is related to the above `selectMessages` message action. You can use it to display custom action buttons in the room header when selecting a message. Ex:

```
messageActions="[
  {
    name: 'deleteMessages',
    title: 'Delete'
  },
  {
    name: 'forwardMessages',
    title: 'Forward'
  }
]"
```

**(14)** `templates-text` can be used to add autocomplete templates text when typing `/` in the room textarea. Ex:

```javascript
templatesText="[
  {
    tag: 'help',
    text: 'This is the help'
  },
  {
    tag: 'action',
    text: 'This is the action'
  }
]"
```

**(15)** `auto-scroll` can be used to change the auto scroll behaviour when sending/receiving a message. Ex:

```javascript
auto-scroll="{
  send: {
    new: true, // will scroll down after sending a message
    newAfterScrollUp: false // will not scroll down after sending a message when scrolled up
  },
  receive: {
    new: false, // will not scroll down when receiving a message
    newAfterScrollUp: true // will scroll down when receiving a message when scrolled up
  }
}"
```

**(16)** `show-new-messages-divider` can be used to show/hide the blue line divider between seen and unseen messages.

**(17)** `show-footer` can be used to hide the room footer. For example to prevent users to send any message or media.

**(18)** `text-messages` can be used to replace default i18n texts. Ex:

```javascript
text-messages="{
  ROOMS_EMPTY: 'Aucune conversation',
  ROOM_EMPTY: 'Aucune conversation sélectionnée',
  NEW_MESSAGES: 'Nouveaux messages',
  MESSAGE_DELETED: 'Ce message a été supprimé',
  MESSAGES_EMPTY: 'Aucun message',
  CONVERSATION_STARTED: 'La conversation a commencée le :',
  TYPE_MESSAGE: 'Tapez votre message',
  SEARCH: 'Rechercher',
  IS_ONLINE: 'est en ligne',
  LAST_SEEN: 'dernière connexion ',
  IS_TYPING: 'est en train de taper...',
  CANCEL_SELECT_MESSAGE: 'Annuler Sélection'
}"
```

**(19)** `text-formatting` can be used to add text formatting. Bold, italic, strikethrough, underline, inline code and multiline code formatting are currently available and can be used in conjonction.

- You can disable text formatting by passing the prop `:text-formatting="{disabled: true}"`.
- You can change markdown characters, for example: `:text-formatting="{italic: '^'}"`
- You can disable a specific markdown character, for example: `:text-formatting="{bold: null}"`

| Style             | Syntax          | Example                                | Output                                 |
| ----------------- | --------------- | -------------------------------------- | -------------------------------------- |
| Bold              | `* *`           | `*This is bold text*`                  | **This is bold text**                  |
| Italic            | `_ _`           | `_This text is italicized_`            | _This text is italicized_              |
| Strikethrough     | `~ ~`           | `~This was mistaken text~`             | ~~This was mistaken text~~             |
| Underline         | `° °`           | `°This text is underlined°`            | <ins>This text is underlined</ins>     |
| Nested formatting | `* *` and `_ _` | `*This text is _extremely_ important*` | **This text is _extremely_ important** |

**Inline Code**

Example: \`This is inline code\`

Output: `This is inline code`

**Multiline Code**

Example: \```This is multiline code\```

Output:

```bash
This is
multiline code
```

**(20)** `link-options` can be used to disable url links in messages, or change urls target. Ex:

```javascript
:link-options="{ disabled: true, target: '_self', rel: null }"
```

**(21)** `room-info-enabled` can be used to trigger an event after clicking the room header component.<br>
You can then use the [room-info](#events-api) event to call your own action after clicking the header.

**(22)** `textarea-action-enabled` can be used to add an extra icon on the right of the textarea<br>
You can then use the [textarea-action-handler](#events-api) event to call your own action after clicking the icon.

**(23)** `responsive-breakpoint` can be used to collapse the rooms list on the left when then viewport size goes below the specified width.

**(24)** `single-room` can be used if you never want to show the rooms list on the left. You still need to pass the `rooms` prop as an array with a single element.

**(25)** `scroll-distance` can be used to change the number of pixels before `fetchMessages` event is triggered when scrolling up to load more messages, or `fetchMoreRooms` event is triggered when scrolling down to load more rooms.

**(26)** `theme` can be used to change the chat theme. Currently, only `light` and `dark` are available.

**(27)** `accepted-files` can be used to set specifics file types allowed in chat. By default, all file types are allowed: `"*"`.

Example: set `accepted-files="image/png, image/jpeg, application/pdf"` to allow `JPG` `PNG` and `PDF` files only

**(28)** `capture-files` can be used to enable direct capturing of photos and videos on mobile browsers, as opposed to just uploading existing photos and videos which are already on the device. See [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture) for more information and recognized values. By default, the attribute is omitted and mobile browsers will only offer the gallery to choose photos and videos. Note: this only affects file attachments. Audio messages are always recorded using the device's microphone.

**(29)** `styles` can be used to customize your own theme. You can find the full list [here](src/themes/index.js)

```javascript
styles="{
  general: {
    color: '#0a0a0a',
    colorSpinner: '#333',
    borderStyle: '1px solid #e1e4e8'
  },

  footer: {
    background: '#f8f9fa',
    backgroundReply: 'rgba(0, 0, 0, 0.08)'
  },

  icons: {
    search: '#9ca6af'
  }
}"
```

## Props data structure

Your props must follow a specific structure to display rooms and messages correctly:

### Rooms prop

```javascript
rooms="[
  {
    roomId: '1',
    roomName: 'Room 1',
    avatar: 'assets/imgs/people.png',
    unreadCount: 4,
    index: 3,
    lastMessage: {
      _id: 'xyz',
      content: 'Last message received',
      senderId: '1234',
      username: 'John Doe',
      timestamp: '10:20',
      saved: true,
      distributed: false,
      seen: false,
      new: true
    },
    users: [
      {
        _id: '1234',
        username: 'John Doe',
        avatar: 'assets/imgs/doe.png',
        status: {
          state: 'online',
          lastChanged: 'today, 14:30'
        }
      },
      {
        _id: '4321',
        username: 'John Snow',
        avatar: 'assets/imgs/snow.png',
        status: {
          state: 'offline',
          lastChanged: '14 July, 20:00'
        }
      }
    ],
    typingUsers: [ 4321 ]
  }
]"
```

- If you add the `index` property, your rooms will be ordered using this value.
  `index` can be any sortable value, like a `string`, `datetime`, `timestamp`, etc.

- For each room user, you can add the `status` property, which can hold the `state` and `lastChanged` properties:

  - `state` can be `'online'` or `'offline'`
  - `lastChanged` is the date when `state` was last modified.

- `typingUsers` is an array of all the users who are currently writing a message

### Messages prop

Message objects are rendered differently depending on their type. Text, emoji, image, video and file types are supported.<br><br>
Each message object has a `senderId` field which holds the id of the corresponding agent. If `senderId` matches the `currentUserId` prop, specific UI and actions will be implemented.<br><br>
Notes:

- `username` will be displayed on each message of corresponding agents if at least 3 users are in the room
- `system` is used to show messages with a specific centered display
- `indexId` can be used if you need to change a message ID that is already displayed in a room, this preventing an animation glitch. For example, when you don't know in advance the message ID your backend will create.

Message states:

- `saved: true` one checkmark
- `distributed: true` two checkmarks
- `seen: true` two blue checkmarks
- `deleted: true` grey background with deleted message text
- `failure: true` red clickable failure icon

```javascript
messages="[
  {
    _id: '7890',
    indexId: 12092,
    content: 'Message 1',
    senderId: '1234',
    username: 'John Doe',
    avatar: 'assets/imgs/doe.png',
    date: '13 November',
    timestamp: '10:20',
    system: false,
    saved: true,
    distributed: true,
    seen: true,
    deleted: false,
    failure: true,
    disableActions: false,
    disableReactions: false,
    files: [
      {
        name: 'My File',
        size: 67351,
        type: 'png',
        audio: true,
        duration: 14.4,
        url: 'https://firebasestorage.googleapis.com/...',
        preview: 'data:image/png;base64,iVBORw0KGgoAA...',
        progress: 88
      }
    ],
    reactions: {
      😁: [
        '1234', // USER_ID
        '4321'
      ],
      🥰: [
        '1234'
      ]
    },
    replyMessage: {
      content: 'Reply Message',
      senderId: '4321',
      files: [
        {
          name: 'My Replied File',
          size: 67351,
          type: 'png',
          audio: true,
          duration: 14.4,
          url: 'https://firebasestorage.googleapis.com/...',
          preview: 'data:image/png;base64,iVBORw0KGgoAA...'
        }
      ]
    },
  }
]"
```

<br>

## Events API

| <div style="width:230px">Event</div>  | Params                                                                     | Fires when a user                               |
| ------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| `fetch-messages`(1)                   | `{ room, options }`                                                        | Scrolled on top to load more messages           |
| `fetch-more-rooms`(2)                 | -                                                                          | Scrolled to load more rooms                     |
| `send-message`                        | `{ roomId, content, files(11), replyMessage(12), usersTag }`               | Sent a message                                  |
| `edit-message`                        | `{ roomId, messageId, newContent, files(11), replyMessage(12) ,usersTag }` | Edited a message                                |
| `delete-message`                      | `{ roomId, message }`                                                      | Deleted a message                               |
| `open-file`                           | `{ message, file }`                                                        | Clicked to view or download a file              |
| `open-user-tag`(3)                    | `{ user }`                                                                 | Clicked on a user tag inside a message          |
| `open-failed-message`                 | `{ roomId, message }`                                                      | Clicked on the failure icon next to a message   |
| `add-room`                            | -                                                                          | Clicked on the plus icon next to searchbar      |
| `search-room`(4)                      | `{ roomId, value }`                                                        | Typed a character in the room search input      |
| `room-action-handler`(5)              | `{ roomId, action }`                                                       | Clicked on the vertical dots icon inside a room |
| `menu-action-handler`(6)              | `{ roomId, action }`                                                       | Clicked on the vertical dots icon inside a room |
| `message-action-handler`(7)           | `{ roomId, action, message }`                                              | Clicked on the dropdown icon inside a message   |
| `message-selection-action-handler`(8) | `{ roomId, action, messages }`                                             | Clicked on the select button inside a message   |
| `send-message-reaction`               | `{ roomId, messageId, reaction, remove }`                                  | Clicked on the emoji icon inside a message      |
| `room-info` (9)                       | `room`                                                                     | Clicked the room header bar                     |
| `toggle-rooms-list`                   | `{ opened }`                                                               | Clicked on the toggle icon inside a room header |
| `textarea-action-handler`(10)         | `{ roomId, message }`                                                      | Clicked on custom icon inside the footer        |
| `typing-message`                      | `{ roomId, message }`                                                      | Started typing a message                        |

**(1)** `fetch-messages` is triggered every time a room is opened. If the room is opened for the first time, the `options` param will hold `reset: true`.<br>
**(1)** `fetch-messages` should be a method implementing a pagination system. Its purpose is to load older messages of a conversation when the user scroll on top.

**(2)** `fetch-more-rooms` is triggered when scrolling down the rooms list, and should be a method implementing a pagination system.

**(3)** `open-user-tag` is triggered when clicking a user tag inside a message. When creating a user tag by typing `@` in the footer textarea and sending the message, the tag will be identified with the below pattern:

```javascript
<usertag>TAGGED_USER_ID</usertag>
```

This will make the tag clickable inside a message. Ex: [message tag content](#messages-collection-inside-a-room-document)<br>
`send-message` and `edit-message` events will handle that pattern for you and pass it in the `content` param.

**(4)** `room-action-handler` is the result of the [`room-actions`](#props-api) prop.<br>
When clicking a button from your `room-actions` array, `room-action-handler` will give you the name of the button that was click.
Then you can do anything you want with it. Ex:

```javascript
menuActionHandler({ roomId, action }) {
  switch (action.name) {
    case 'archiveRoom':
      // call a method to archive the room
  }
}
```

**(5)** `menu-action-handler` is the result of the [`menu-actions`](#props-api) prop.<br>
When clicking a button from your `menu-actions` array, `menu-action-handler` will give you the name of the button that was click.
Then you can do anything you want with it. Ex:

```javascript
menuActionHandler({ roomId, action }) {
  switch (action.name) {
    case 'inviteUser':
      // call a method to invite a user to the room
    case 'removeUser':
      // call a method to remove a user from the room
    case 'deleteRoom':
      // call a method to delete the room
  }
}
```

**(6)** `search-room` can be enabled by using [`custom-search-room-enabled`](#props-api) prop. This will allow you to call your own method to filter out searched rooms.

**(7)** `message-action-handler` is the result of the [`message-actions`](#props-api) prop.<br>
When clicking a button from your `message-actions` array, `message-action-handler` will give you the name of the button that was click and the corresponding message data.
Then you can do anything you want with it. Ex:

```javascript
messageActionHandler({ roomId, action, message }) {
  switch (action.name) {
    case 'addMessageToFavorite':
      // call a method to add a message to the favorite list
    case 'shareMessage':
      // call a method to share the message with another user
  }
}
```

**(8)** `message-selection-action-handler` is the result of the [`message-selection-actions`](#props-api) prop.<br>
When clicking a button from your `message-selection-actions` array, `message-selection-action-handler` will give you the name of the button that was click and the corresponding selected messages data.
Then you can do anything you want with it. Ex:

```javascript
messageSelectionActionHandler({ roomId, action, message }) {
  switch (action.name) {
    case 'deleteMessages':
      // call a method to delete selected messaged
    case 'shareMessage':
      // call a method to share selected messaged with another user
  }
}
```

**(9)** `room-info` is the result of the [`room-info-enabled`](#props-api) prop.<br>

**(10)** `textarea-action-handler` is the result of the [`textarea-action-enabled`](#props-api) prop.<br>

**(11)** Array of files where each file contain: `{ blob, localUrl, name, size, type, extension }`

**(12)** `replyMessage` object is available when the user replied to another message by clicking the corresponding icon, and contains the message information that was clicked.

<br>

## Named Slots

Example:

```javascript
<vue-advanced-chat>
  <div slot="room-header">
    This is a new room header
  </div>

  <div v-for="message in messages" :slot="'message_' + message._id">
    <div v-if="message.system">
      System message: {{ message.content }}
    </div>
    <div v-else>
      Normal message: {{ message.content }}
    </div>
  </div>

  <div v-for="message in messages" :slot="'message-avatar_' + message._id">
    New Avatar
  </div>
</vue-advanced-chat>
```

| <div style="width:230px">Slot</div>         | Action                                                            |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `custom-action-icon`                        | Add a custom icon inside the footer                               |
| `rooms-header`                              | Add a template on top of rooms list (above the search bar)        |
| `room-list-item_{{ROOM_ID}}`                | Replace the template of the room list items                       |
| `room-list-avatar_{{ROOM_ID}}`              | Replace the avatar of room list items                             |
| `room-list-options_{{ROOM_ID}}`             | Replace the template of the list room options                     |
| `room-list-options-icon_{{ROOM_ID}}`        | Replace the room list options dropdown icon                       |
| `rooms-header`                              | Replace the content above the search bar                          |
| `rooms-list-search`                         | Replace the search bar                                            |
| `room-header`                               | Replace the template of the room header                           |
| `room-header-avatar`                        | Replace the template of the room header avatar                    |
| `room-header-info`                          | Replace the template of the room header text                      |
| `room-options`                              | Replace the template of the room options                          |
| `message_{{MESSAGE_ID}}`                    | Replace the template of the message (and system message) box      |
| `message-avatar_{{MESSAGE_ID}}`             | Replace the template of the message avatar                        |
| `message-failure_{{MESSAGE_ID}}`            | Replace the message failure icon                                  |
| `messages-empty`                            | Replace the empty message template                                |
| `rooms-empty`                               | Replace the empty rooms template                                  |
| `no-room-selected`                          | Replace the no room selected template                             |
| `menu-icon`                                 | Replace the room menu icon                                        |
| `toggle-icon`                               | Replace the toggle room list icon                                 |
| `spinner-icon-rooms`                        | Replace the loading spinner icon in the rooms list                |
| `spinner-icon-infinite-rooms`               | Replace the loading spinner icon to load more rooms               |
| `spinner-icon-messages`                     | Replace the loading spinner icon in a room                        |
| `spinner-icon-infinite-messages`            | Replace the loading spinner icon to load more messages            |
| `spinner-icon-room-file`                    | Replace the loading spinner icon to load heavy files              |
| `spinner-icon-message-file_{{MESSAGE_ID}}`  | Replace the loading spinner icon in a message containing an image |
| `scroll-icon`                               | Replace the scroll to newest message icon                         |
| `reply-close-icon`                          | Replace the reply close icon                                      |
| `image-close-icon`                          | Replace the image close icon                                      |
| `file-icon`                                 | Replace the file icon                                             |
| `files-close-icon`                          | Replace the file close icon                                       |
| `edit-close-icon`                           | Replace the edit close icon                                       |
| `preview-close-icon`                        | Replace the media preview close icon                              |
| `emoji-picker-icon`                         | Replace the emoji picker icon                                     |
| `emoji-picker-reaction-icon_{{MESSAGE_ID}}` | Replace the emoji picker reaction icon (in the message box)       |
| `paperclip-icon`                            | Replace the paperclip icon                                        |
| `send-icon`                                 | Replace the message send icon                                     |
| `eye-icon_{{MESSAGE_ID}}`                   | Replace the eye icon (image message)                              |
| `document-icon_{{MESSAGE_ID}}`              | Replace the document icon                                         |
| `pencil-icon_{{MESSAGE_ID}}`                | Replace the pencil icon                                           |
| `checkmark-icon_{{MESSAGE_ID}}`             | Replace the checkmark icon of a message                           |
| `checkmark-icon_{{ROOM_ID}}`                | Replace the checkmark icon of a message from the rooms list       |
| `deleted-icon_{{MESSAGE_ID}}`               | Replace the deleted icon of a message                             |
| `deleted-icon_{{ROOM_ID}}`                  | Replace the deleted icon of a message from the rooms list         |
| `microphone-icon_{{ROOM_ID}}`               | Replace the microphone icon                                       |
| `dropdown-icon_{{MESSAGE_ID}}`              | Replace the dropdown icon                                         |
| `search-icon`                               | Replace the search icon                                           |
| `add-icon`                                  | Replace the add room icon                                         |
| `audio-stop-icon`                           | Replace the audio recorder stop icon                              |
| `audio-check-icon`                          | Replace the audio recorder confirm icon                           |
| `audio-pause-icon_{{MESSAGE_ID}}`           | Replace the message audio pause icon                              |
| `audio-play-icon_{{MESSAGE_ID}}`            | Replace the message audio play icon                               |

<br>

## Using with Firestore

### Source code

You can find the source code to implement a full featured chat app using Firebase/Firestore inside the `demo` folder.
<br>
To test it using your own Firebase project:

- Setup Cloud Firestore (to store users and rooms) and Realtime Database (to store users online status)
- Clone this repository: `git clone https://github.com/antoine92190/vue-advanced-chat.git`
- Inside `demo/src/firestore/index.js` file, replace the line `const config = ...` by your own Firebase config
- Go inside `demo` folder and run `npm run serve`

### Data structure

If you decide to use the same code as in the `demo` folder to create your chat app, you need to have a specific Firestore data structure.<br>
To help you get started, I added in `demo/src/App.vue` a method `addData` to initialize some data on your Firestore database.

#### Users collection

```javascript
users: {
  USER_ID_1: {
    _id: '1',
    username: 'User 1'
  },
  USER_ID_2: {
    _id: '2',
    username: 'User 2'
  },
  USER_ID_3: {
    _id: '3',
    username: 'User 2'
  }
}
```

#### Rooms collection

```javascript
chatRooms: {
  ROOM_ID_1: {
    users: ['1', '3']
  },
  ROOM_ID_2: {
    users: ['1', '2', '3']
  }
}
```

#### Messages collection inside a room document

```javascript
messages: {
  MESSAGE_ID_1: {
    content: 'My first message to <usertag>John</usertag>',
    senderId: '2',
    timestamp: 'December 11, 2019 at 4:00:00 PM',
    seen: true
  }
}
```

#### Notes

- You need to create a composite index to order rooms by last message received.
  The easiest way to do it is to create a room, then click the error message url in the browser debugging console.

<br>

## [Contributing](https://github.com/antoine92190/vue-advanced-chat/blob/master/.github/CONTRIBUTING.md)

Your help is always appreciated :rocket:

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
