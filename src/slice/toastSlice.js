import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    messages: [],
  },
  reducers: {
    pushMessage(state, action) {
      const { text, status } = action.payload;
      const id = Date.now();
      state.messages.push({
        id,
        text,
        status,
      })
    },
    removeMeaasge(state, action) {
      const messageId = action.payload;
      const index = state.messages.findIndex(message => message.id === messageId);
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    }
  }
});

export const { pushMessage, removeMeaasge } = toastSlice.actions;
export default toastSlice.reducer;