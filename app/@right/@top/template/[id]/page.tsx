export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl">You have chosen template {id}.</h1>
      <p>Choose a file on the left to edit.</p>
    </div>
  );
}
