import { createSlice } from "@reduxjs/toolkit";
import { fetchDirectMessages } from "../../services/discordService";
import DM from "../../classes/DM";
import {
  resetAdvancedFilters,
  resetFilters,
  resetMessageData,
} from "../message/messageSlice";

export const dmSlice = createSlice({
  name: "dm",
  initialState: {
    dms: [],
    selectedDm: new DM(),
    isLoading: null,
    preFilterUserId: null,
    preFilterUserIds: [],
  },
  reducers: {
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setDms: (state, { payload }) => {
      state.dms = payload.map((dm) =>
        Object.assign(dm, { name: _getDmName(dm) })
      );
    },
    setDm: (state, { payload }) => {
      const { id, preFilterUser } = payload;
      const selectedDm = state.dms.find((dm) => dm.id === id);
      if (selectedDm) {
        state.selectedDm = selectedDm;
        state.preFilterUserIds = [
          ...selectedDm.recipients.map((x) => ({
            name: x.username,
            id: x.id,
          })),
          preFilterUser,
        ];
        state.preFilterUserId = null;
      }
    },
    resetDm: (state, { payload }) => {
      state.selectedDm = new DM();
      state.preFilterUserId = null;
      state.preFilterUserIds = [];
    },
    setPreFilterUserId: (state, { payload }) => {
      state.preFilterUserId = payload;
    },
  },
});

export const { setIsLoading, setDms, setDm, resetDm, setPreFilterUserId } =
  dmSlice.actions;

export const getDms = () => async (dispatch, getState) => {
  const { token } = getState().user;
  dispatch(setIsLoading(true));
  const data = (await fetchDirectMessages(token)) || [];
  if (data.length) {
    dispatch(setDms(data.map((dm) => new DM(dm))));
  }
  dispatch(setIsLoading(false));
};

export const changeDm = (dmId) => (dispatch, getState) => {
  const { username, id } = getState().user;
  if (!dmId) {
    dispatch(resetAdvancedFilters());
    dispatch(setPreFilterUserId(null));
  }
  dispatch(resetMessageData());
  dispatch(resetFilters());
  dispatch(setDm({ preFilterUser: { name: username, id }, id: dmId }));
};

const _getDmName = (dm) => {
  const { recipients, name, id } = dm;
  return recipients.length === 1
    ? recipients[0].username
    : `${name ? "" : "Unnamed "}Group Chat - ${name || id}`;
};

export const selectDm = (state) => state.dm;

export default dmSlice.reducer;
