import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store/store";
import { RecentlyViewed } from "../Types/RecentlyViewed";
import { User } from "../Types/User";
import { UserAccount } from "../Types/UserAccount";
import { userItem } from "../Types/UserItem";

const initialState: User = {
  _id: "",
  Name: "",
  Email: "",
  Password: "",
  Cart: [],
  RecentlyViewed: [],
  Type: UserAccount.Customer,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, user: PayloadAction<User>) => {
      state._id = user.payload._id;
      state.Name = user.payload.Name;
      state.Email = user.payload.Email;
      state.Password = user.payload.Password;
      state.Cart = user.payload.Cart;
      state.RecentlyViewed = user.payload.RecentlyViewed;
      state.Type = user.payload.Type;
    },
    addToCart: (state, item: PayloadAction<userItem>) => {
      let index: number = state.Cart.findIndex((e) => {
        return e.id === item.payload.id;
      });
      if (index > -1) {
        let newItem: userItem = {
          id: item.payload.id,
          count: item.payload.count,
        };
        state.Cart[index] = newItem;
      } else {
        state.Cart.push(item.payload);
      }
    },
    removeFromCart: (state, item: PayloadAction<userItem>) => {
      let index: number = state.Cart.findIndex((e) => {
        return e.id === item.payload.id;
      });

      if (item.payload.count === 0) {
        state.Cart.splice(index, 1);
      } else {
        let newItem: userItem = {
          id: item.payload.id,
          count: item.payload.count,
        };
        state.Cart[index] = newItem;
      }
    },
    addToRecentlyViewed: (state, item: PayloadAction<RecentlyViewed>) => {
      let index: number = state.RecentlyViewed.findIndex((e) => {
        return e.id === item.payload.id;
      });
      if (index > -1) {
        return;
      }
      let tempArray: RecentlyViewed[] = [item.payload, ...state.RecentlyViewed];
      if (state.RecentlyViewed.length >= 5) {
        tempArray.splice(5);
      }
      state.RecentlyViewed = tempArray;
    },
    clearCart: (state) => {
      state.Cart = [];
    },
  },
});

export const {
  setUser,
  addToCart,
  removeFromCart,
  addToRecentlyViewed,
  clearCart,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
