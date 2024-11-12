interface PageParams {
  params: {
    id: string;
  };
}

export default function Page({ params: { id } }: PageParams) {
  return <div>case id: {id}</div>;
}
