## [Contributing](https://github.com/antoine92190/vue-advanced-chat/blob/master/.github/CONTRIBUTING.md)


## Named Slots

Example:

```javascript
<template #room-header="{ room, userStatus }">
  {{ room.roomName }} - {{ userStatus }}
</template>
```

| <div style="width:230px">Slot</div> | Action                                                      | Data                                | Overridden slots                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `room-texarea`                | Add a custom textarea |                                  |

## Slots original
### room-texarea
```
<textarea
  ref="roomTextarea"
  :placeholder="textMessages.TYPE_MESSAGE"
  class="vac-textarea"
  :class="{
    'vac-textarea-outline': editedMessage._id
  }"
  :style="{
    'min-height': `20px`,
    'padding-left': `12px`
  }"
  @input="onChangeInput"
  @keydown.esc="escapeTextarea"
  @keydown.enter.exact.prevent="selectItem"
  @paste="onPasteImage"
  @keydown.tab.exact.prevent=""
  @keydown.tab="selectItem"
  @keydown.up.exact.prevent=""
  @keydown.up="updateActiveUpOrDown(-1)"
  @keydown.down.exact.prevent=""
  @keydown.down="updateActiveUpOrDown(1)"
/>
```