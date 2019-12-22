<p align="center">
<a href="https://travis-ci.org/antoine92190/vue-advanced-chat"><img src="https://img.shields.io/travis/antoine92190/vue-advanced-chat/master.svg"></a>
<!-- <a href="https://codecov.io/github/antoine92190/vue-advanced-chat?branch=master"><img src="https://img.shields.io/codecov/c/github/antoine92190/vue-advanced-chat/master.svg"></a> -->
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/dm/vue-advanced-chat.svg"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/bundlephobia/minzip/vue-advanced-chat"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/v/vue-advanced-chat.svg"></a>
<a href="https://www.npmjs.com/package/vue-advanced-chat"><img src="https://img.shields.io/npm/l/vue-advanced-chat.svg"></a>
</p>

# vue-advanced-chat

![Demo Image](demo/src/assets/demo.png)

## Features

- Realtime chat messaging
- Customizeable
- Backend agnostic
- Images, files & emojis
- Edit messages
- Reply to other messages
- Flexible options
- UI elements for seen, new and deleted messages
- Custom theming - light and dark modes
- Firestore example

## [Demo](https://antoine92190.github.io/vue-advanced-chat)

Enjoy :smile:

## Table of Contents

- [Installation](#installation)
- [Usage](#example)
- [Props API](#props-api)
- [Props data structure](#props-data-structure)
- [Events API](#events-api)
- [Using with Firestore](#using-with-firestore)

## Installation

```bash
# Using npm
npm install --save vue-advanced-chat

# Using yarn
yarn add --save vue-advanced-chat
```

## Usage

You can import it as a custom component:

```javascript
<template>
  <chat-window :rooms="rooms" :messages="messages" />
</template>

<script>
  import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'

  export default {
    components: {
      ChatWindow
    },
    data() {
      return {
        rooms: [],
        messages: []
      }
    }
  }
</script>
```

## Props API

| Prop               | Type    | Required | Default |
| ------------------ | ------- | -------- | ------- |
| height             | String  | -        | 600px   |
| rooms              | Array   | -        | [ ]     |
| loadingRooms (1)   | Boolean | -        | false   |
| messages           | Array   | -        | [ ]     |
| messagesLoaded (2) | Boolean | -        | false   |
| menuActions (3)    | Array   | -        | [ ]     |
| messageActions (4) | Array   | -        | (4)     |
| showFiles          | Boolean | -        | true    |
| showEmojis         | Boolean | -        | true    |
| textMessages (5)   | Object  | -        | null    |
| theme (6)          | Sring   | -        | light   |
| colors (7)         | Object  | -        | (6)     |

(1) `loadingRooms` can be used to show/hide a spinner icon while rooms are loading

(2) `messagesLoaded` must be manually set to `true` when all messages of a conversation have been loaded. Meaning the user cannot scroll on top anymore

(3) `menuActions` can be used to display your own buttons when clicking the vertical dots icon inside a room.<br>
You can then use the [menuActionHandler](#events-api) event to call your own action after clicking a button. Ex:

```javascript
menuActions="[
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

(4) `messageActions` can be used to display your own buttons when clicking the dropdown icon inside a message.<br>
You can then use the [messageActionHandler](#events-api) event to call your own action after clicking a button. Ex:

```javascript
messageActions="[
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

You can use built-in `messageActions` names to trigger specific UI modifications when clicked.<br>
Currently, `replyMessage`, `editMessage` and `deleteMessage` action names are available.<br>
If `messageActions` is not set, it will use the default values below.<br>
If you don't want to display this `messageActions`menu, you can pass it an empty array.

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
  }
]"
```

(5) `textMessages` can be used to replace default texts. Ex:

```javascript
textMessages="{
  NEW_MESSAGES: 'Nouveaux messages',
  MESSAGE_DELETED: 'Ce message a été supprimé',
  MESSAGES_EMPTY: 'Aucun message',
  CONVERSATION_STARTED: 'La conversation a commencée le :',
  TYPE_MESSAGE: 'Taper votre message',
  SEARCH: 'Rechercher'
}"
```

(6) `theme` can be used to change the chat theme. Currently, only `light` and `dark` are available.

(7) `colors` can be use to create your own theme. Ex:

```javascript
colors="{
  general: {
    color: '#0a0a0a',
    backgroundInput: '#fff',
    colorPlaceholder: '#9ca6af',
    colorCaret: '#1976d2',
    colorSpinner: '#333',
    borderStyle: '1px solid #e1e4e8',
    backgroundScrollIcon: '#fff'
  },

  header: {
    background: '#fff'
  },

  footer: {
    background: 'none',
    borderStyleInput: '1px solid #e1e4e8',
    borderInputSelected: '#1976d2',
    backgroundReply: 'rgba(0, 0, 0, 0.08)'
  },

  content: {
    background: '#f8f9fa'
  },

  sidemenu: {
    background: '#fff',
    backgroundHover: '#f6f6f6',
    backgroundActive: '#e5effa',
    colorActive: '#1976d2',
    borderColorSearch: '#e1e5e8'
  },

  dropdown: {
    background: '#fff',
    backgroundHover: '#f6f6f6'
  },

  message: {
    background: '#fff',
    backgroundMe: '#ccf2cf',
    color: '#0a0a0a',
    backgroundDeleted: '#dadfe2',
    colorDeleted: '#757e85',
    colorUsername: '#9ca6af',
    colorTimestamp: '#828c94',
    backgroundDate: '#e5effa',
    colorDate: '#505a62',
    backgroundReply: 'rgba(0, 0, 0, 0.08)',
    colorReplyUsername: '#0a0a0a',
    colorReply: '#6e6e6e',
    backgroundImage: '#ddd',
    colorNewMessages: '#1976d2'
  },

  room: {
    colorUsername: '#0a0a0a',
    colorMessage: '#67717a',
    colorTimestamp: '#a2aeb8',
    colorNewDot: '#1976d2'
  },

  emoji: {
    background: '#fff'
  },

  icons: {
    search: '#9ca6af',
    add: '#1976d2',
    menu: '#0a0a0a',
    close: '#9ca6af',
    closeImage: '#fff',
    file: '#1976d2',
    paperclip: '#1976d2',
    closeOutline: '#000',
    send: '#1976d2',
    sendDisabled: '#9ca6af',
    emoji: '#1976d2',
    document: '#1976d2',
    pencil: '#9e9e9e',
    checkmark: '#0696c7',
    eye: '#fff',
    dropdown: '#fff',
    dropdownScroll: '#0a0a0a'
  }
}"
```

## Props data structure

Your props must follow a specific structure to display rooms and messages correctly:

### Rooms prop

```javascript
rooms="[
  {
    roomId: 1,
    roomName: 'Room 1',
    lastMessage: {
      content: 'Last message received',
      sender_id: 1234,
      username: 'John Doe',
      timestamp: '10:20',
      seen: false,
      new: true
    },
    users: [
      {
        _id: 1234,
        username: 'John Doe'
      },
      {
        _id: 4321,
        username: 'John Snow'
      }
    ]
  }
]"
```

### Messages prop

Message objects are rendered differently depending on their type. Currently, only text, emoji and file types are supported.<br>
Each message object has a `sender_id` field which can have the value 'me' or the id of the corresponding agent.

```javascript
messages="[
  {
    content: 'message 1',
    sender_id: 1234,
    username: 'John Doe',
    date: '13 November',
    timestamp: '10:20',
    seen: true,
    file: {
      name: 'My File',
      size: 67351,
      type: 'png',
      url: 'https://firebasestorage.googleapis.com/...'
    }
  }
]"
```

## Events API

| Event                    | Params                                                          | Fires when                                            |
| ------------------------ | --------------------------------------------------------------- | ----------------------------------------------------- |
| fetchMessages (1)        | `{ room, options }`                                             | A user has scrolled on top to load more messages      |
| sendMessage              | `{ roomId, content, file (4), replyMessage (5) }`               | A user has sent a message                             |
| editMessage              | `{ roomId, messageId, newContent, file (4), replyMessage (5) }` | A user has edited a message                           |
| deleteMessage            | `{ roomId, messageId }`                                         | A user has deleted a message                          |
| openFile                 | `{ message }`                                                   | A user has clicked to view or download a file         |
| addRoom                  | -                                                               | A user clicks on the plus icon next to searchbar      |
| menuActionHandler (2)    | `{ roomId, action }`                                            | A user clicks on the vertical dots icon inside a room |
| messageActionHandler (3) | `{ roomId, action }`                                            | A user clicks on the dropdown icon inside a message   |

(1) `fetchMessages` should be a method implementing a pagination system. Its purpose is to load older messages of a conversation when the user scroll on top

(2) `menuActionHandler` is the result of the `menuActions` prop.<br>
When clicking a button from your `menuActions` array, `menuActionHandler` will give you the name of the button that was click.
Then you can do whatever you want with it. Ex:

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

(3) `messageActionHandler` is the result of the `messageActions` prop.<br>
When clicking a button from your `messageActions` array, `messageActionHandler` will give you the name of the button that was click.
Then you can do whatever you want with it. Ex:

```javascript
messageActionHandler({ roomId, action }) {
  switch (action.name) {
    case 'addMessageToFavorite':
      // call a method to add a message to the favorite list
    case 'shareMessage':
      // call a method to share the message with another user
  }
}
```

(4) All file params contain: `{ blob, localURL, name, size, type }`

(5) `replyMessage` object is available when the user replied to another message by clicking the corresponding icon, and contains the message information that was clicked

## Using with Firestore

### Source code

You can find the source code to implement a full featured chat app using Firebase/Firestore inside the `demo` folder.
<br>
To test it using your own Firebase project:

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
    _id: 1,
    username: 'User 1'
  },
  USER_ID_2: {
    _id: 2,
    username: 'User 2'
  },
  USER_ID_3: {
    _id: 3,
    username: 'User 2'
  }
}
```

#### Rooms collection

```javascript
chatRooms: {
  ROOM_ID_1: {
    users: [1, 3]
  },
  ROOM_ID_2: {
    users: [1, 2, 3]
  }
}
```

#### Messages collection inside a room document

```javascript
messages: {
  MESSAGE_ID_1: {
    content: 'My first message',
    sender_id: 2,
    timestamp: 'December 11, 2019 at 4:00:00 PM',
    seen: true
  }
}
```

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
