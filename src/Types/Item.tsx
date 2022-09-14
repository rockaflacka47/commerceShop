import React from 'react';
import { Review } from './Review';


export interface Item{
    Name: String,
    Description: String,
    Price: Number,
    Img_url: string,
    Sold: Number,
    _id: String,
    Alternate_pictures: String [],
    Reviews: Review[]
}