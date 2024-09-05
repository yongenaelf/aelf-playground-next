export function FormatErrors({ inputString }: { inputString: string }) {
  // Detect and remove the dynamic path
  const cleanedString = inputString.replace(
    /\/tmp\/playground\/[a-f0-9\-]+\//g,
    ""
  );

  // Regular expression to match lines containing errors and warnings
  const errorMessages = cleanedString.match(
    /(\w+\/[^\n]*): (error|warning) [^\n]*/g
  );

  // Print each error or warning message on a new line
  if (errorMessages) {
    return (
      <table>
        <thead>
          <tr>
            <th className="p-2">Path</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        {errorMessages.map((m) => (
          <ErrorMessage key={m} message={m} />
        ))}
      </table>
    );
  } else {
    return null;
  }
}

function ErrorMessage({ message }: { message: string }) {
  const [path, type, ...description] = message.split(":").map((i) => i.trim());

  return (
    <tr className="border border-black">
      <td className="p-2">{path}</td>
      <td className="p-2">{type}</td>
      <td className="p-2">{description.join(" ")}</td>
    </tr>
  );
}
