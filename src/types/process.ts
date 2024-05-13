export type PipelineRequestParams = {
  page: number;
  size: number;
  loanId: string;
  loanType: string[];
  stage: string[];
  beginTime: string;
  endTime: string;
};
