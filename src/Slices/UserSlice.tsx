import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store/store";
import { Item } from "../Types/Item";
import { User } from "../Types/User";
import { userItem } from "../Types/UserItem";

const initialState: User = {
    _id: "",
    Name: "",
    Email: "",
    Password: "",
    Cart: [],
    RecentlyViewed: []
}
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
    },
    addToCart: (state, item: PayloadAction<userItem>) => {
        let index: number = state.Cart.findIndex(e => {
            return e.id === item.payload.id
         });
         if(index > -1){
             let newItem: userItem = {
                id: item.payload.id,
                count: item.payload.count
             }
             state.Cart[index] = newItem;
         } else{
            state.Cart.push(item.payload);
         }
    }
  },
});

export const { setUser, addToCart } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
