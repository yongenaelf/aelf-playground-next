export function FormatBuildErrors({ inputString }: { inputString?: string }) {
  if (!inputString) return "";
  // Detect and remove the dynamic path
  const cleanedString = inputString.replace(
    /\/tmp\/[a-f0-9\-]+\//g,
    ""
  );

  return <>
    {cleanedString.split("\n").map((line, index) => <p key={index}>{line}</p>)}
  </>
}
