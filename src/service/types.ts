/* eslint-disable */
// @ts-ignore

export type InfoUsingGetResponse = {
  code: number;
  msg: string;
  data: UserItem;
};

export type InfoUsingGetResponses = {
  200: InfoUsingGetResponse;
};

export type ListAllUsingGetResponse = {
  code: number;
  msg: string;
  data: UserItem[];
};

export type ListAllUsingGetResponses = {
  200: ListAllUsingGetResponse;
};

export type UserItem = {
  userId: number;
  uniqueId: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  gender: number;
  bio: string;
  location: string;
  backgroundUrl: string;
  phone: string;
};
