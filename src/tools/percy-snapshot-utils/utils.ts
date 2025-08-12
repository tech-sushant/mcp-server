const content: { type: "text"; text: string }[] = [];

export async function updateFileAndStep(
  file: string,
  idx: number,
  total: number,
  instruction: string,
) {
  content.length = 0;

  content.push({
    type: "text",
    text: `Complete all steps in order. If a tool call is requested, update the file first, then call the tool. Follow instructions exactly— do not skip any steps to ensure all files are updated.`,
  });

  content.push({
    type: "text",
    text: `Step 1 : You need to add percy snapshot commands in some key test cases in the file ${file} use the following instructions: \n${instruction}`,
  });

  const nextIndex = idx + 1;
  if (nextIndex < total) {
    content.push({
      type: "text",
      text: `Step 2 : Call the tool updateTestFileWithInstructions with index as ${nextIndex} out of ${total}`,
    });
  }
  return content;
}
