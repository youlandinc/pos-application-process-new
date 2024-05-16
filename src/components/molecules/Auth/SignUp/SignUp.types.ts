export interface SignUpProps {
  isNestForm?: boolean;
  successCb?: () => void | Promise<void>;
  isRedirect?: boolean;
}
