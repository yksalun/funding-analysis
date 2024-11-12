import UploadCom from './components/uploadCom';

interface PageParams {
  params: {
    id: string;
  };
}

export default function Page({ params: { id } }: PageParams) {
  return (
    <div className="container mx-auto ">
      <UploadCom></UploadCom>
    </div>
  );
}
