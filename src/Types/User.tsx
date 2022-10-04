import React from 'react';
import { Item } from './Item';
import { RecentlyViewed } from './RecentlyViewed';
import { UserAccount } from './UserAccount';
import { userItem } from './UserItem';

export interface User{
    _id: String,
    Name: string,
    Email: String,
    Password: String,
    Cart: userItem[],
    RecentlyViewed: RecentlyViewed[],
    Type: UserAccount
}