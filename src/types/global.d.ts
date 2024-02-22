type ProductCategory =
  | 'mortgage'
  | 'bridge'
  | 'fix_and_flip'
  | 'ground_up_construction'
  | undefined;
// | 'mortgageAlter'
// | 'rental'
// | 'jumbo';

type ApplicationType = 'purchase' | 'refinance' | undefined;

interface Option {
  key: string;
  value: string | number;
  label: string;
  subComponent?: React.ReactNode;
}

type AsyncState =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: any;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: any;
    };

interface FormNodeBaseProps {
  nextStep: () => void;
  prevStep: () => void;
  updateState: AsyncState;
  changeTaskState: AsyncState;
  completeTaskState: AsyncState;
}

interface SubFormNodeProps {
  updateState: AsyncState;
  changeTaskState: AsyncState;
  completeTaskState: AsyncState;
}

type TableState = 'edit' | 'add' | 'view';

type ProcDefKey = 'mortgage';

type VariableType = 'json' | 'string' | 'integer';

interface BaseExtra {
  id: string;
  url: string;
  name: string;
  startTime: string;
}

// This is a bit of a big change to specify a type, I don't have time for this, but I'll see what happens
interface Variable<T> {
  name: string;
  type: VariableType;
  value: T;
}

interface ProcessExtra extends BaseExtra {
  businessKey: string | null;
  processDefinitionId: string;
  processDefinitionUrl: string;
  variables: Variable[];
  completed: boolean;
}

// Task

interface TaskSummary {
  key: ServerTaskKey;
  name: string;
  formKey: string | null;
  proDefKey: ProcDefKey;
}

interface TaskExtra extends BaseExtra {
  owner: string | null;
  assigned: string | null;
  variables: Variable[];
}

interface TaskInputable {
  variables: Variable[];
}

interface TaskData {
  bpmn: TaskSummary;
  extra: TaskExtra;
  inputable: TaskInputable;
}

interface BaseResponse {
  errorMsg: string;
  statusCode: number;
  statusOk: boolean;
}

type TimeUnit =
  | 'na'
  | 'days'
  | 'weeks'
  | 'fortnights'
  | 'half_months'
  | 'months'
  | 'quarters'
  | 'years';

type Maybe<T> = T | void;

interface UserSession {
  accessToken: {
    jwtToken: string;
  };
  idToken: {
    jwtToken: string;
  };
  refreshToken: {
    token: string;
  };
}

interface ClientUserProfile {
  username?: string | undefined;
  email?: string | undefined;
  userType?: import('@/types/enum.ts').UserType | undefined;
  loginType?: import('@/types/enum').LoginType | undefined;
}

type google = import('@types/google.maps');

interface Window {
  google: typeof google;
}
