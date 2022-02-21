export const consumer = async (event) => {
  console.log("queue is trigger!!")
  console.log(event)
  // for (const record of event.Records) {
  //   const messageAttributes = record.messageAttributes;
  //   console.log(
  //     "Message Attribute: ",
  //     messageAttributes.AttributeName.stringValue
  //   );
  //   console.log("Message Body: ", record.body);
  // }
};