import FinancialFlow from '@/components/FinancialFlow';
import UploadCom from './components/uploadCom';
import { StepForm } from './components/SetpForm';

interface PageParams {
  params: {
    id: string;
  };
}

export default function Page({ params: { id } }: PageParams) {
  return (
    <div className="size-full">
      {/* <FinancialFlow /> */}
      <StepForm />
    </div>
    // <div className="container mx-auto">
    //   <UploadCom></UploadCom>
    //   <FinancialFlow />
    // </div>
  );
}
