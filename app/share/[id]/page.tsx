import { SharePageComponent } from "./_sharepagecomponent";



export default function Page({ params: {id} }: { params: { id: string } }) {

  return (
    <SharePageComponent id={id} />
  );
}
