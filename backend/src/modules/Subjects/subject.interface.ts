import { SubjectSlug } from "./subject.constrain";

export interface ISubject {
  title: string;
  slug: SubjectSlug;
  url: string;
}
