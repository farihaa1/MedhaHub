export enum SubmissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum SubmissionType {
  NEW = "NEW",
  UPDATE = "UPDATE",
}

export type TSubmissionStatus = `${SubmissionStatus}`;
export type TSubmissionType = `${SubmissionType}`;

export const CONTRIBUTOR_REWARD = 10;
