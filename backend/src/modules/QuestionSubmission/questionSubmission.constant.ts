export enum SubmissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type TSubmissionStatus = `${SubmissionStatus}`;

export const CONTRIBUTOR_REWARD = 10;