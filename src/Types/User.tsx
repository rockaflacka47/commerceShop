import React from 'react';
import { Item } from './Item';
import { userItem } from './UserItem';

export interface User{
    _id: String,
    Name: String,
    Email: String,
    Password: String,
    Cart: userItem[],
    RecentlyViewed: String[]
}