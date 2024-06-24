import { Request } from "express";

export interface GetAllContentCreators extends Request {
  query: {
    page: string;
  };
}

export interface AddContentCreator extends Request {
  body: {
    name: string;
    twitter: string;
    instagram: string;
    youtube: string;
    photo: string;
    about: string;
  };
}

export interface AddVideoLink extends Request {
  body: {
    link: string;
    about: string;
    creator: string;
    title: string;
  };
}
