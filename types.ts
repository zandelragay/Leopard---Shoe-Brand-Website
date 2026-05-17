/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  description: string;
  colorway: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  COLLECTION = 'collection',
  EXPERIENCE = 'experience',
  SHOP = 'shop',
}
