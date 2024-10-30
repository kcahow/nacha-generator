import {
  Nacha,
  Batch,
  Entry,
  ServiceClass,
  BatchCode,
  TransactionCode,
  EntryAddenda,
} from "nacha-cheese";
import fs from "fs";

export const generateNachaFile = (recordCount:number) => {
    // Create a new Nacha file
    const nacha = new Nacha({
        originIdentifier: "123456789",
        destinationRoutingNumber: "987654321",
        originName: "Sigmans Seafood Bank",
        destinationName: "My Bank",
        fileCreationDate: new Date(),
        fileIdModifier: "A",
        referenceCode: "12",
    });
    
    // Create a new Batch
    const batchOne = new Batch({
        transactionTypes: ServiceClass.Credit,
        originCompanyName: "Sigmans The Seamonster",
        originDiscretionaryData: "123456789",
        originIdentification: "123456789",
        code: BatchCode.CCD,
        description: "Payroll",
        descriptiveDate: new Date(),
        effectiveEntryDate: new Date(),
        originDfi: "99988888",
    });
    
    // Create a new Entry
    for (let i = 0; i < recordCount; i++) {
      // generate a random number between 1000 and 9999 as a number
      const amt: number = Math.floor(Math.random() * 9000) + 1000;

      // Generate a random bank routing number as a string
      const routingNumber: string = (
        Math.floor(Math.random() * 900000000) + 100000000
      ).toString();

      // Generate a random account number between 51000 and 78000 as a string and left pad with zeros
      const accountNumber: string = (Math.floor(Math.random() * 27000) + 51000)
        .toString()
        .padStart(9, "0");

      // Generate a random transaction number between 500 and 78000 with a length of 8 and as a string and left pad with zeros
      const transactionId: string = (Math.floor(Math.random() * 78000) + 500)
        .toString()
        .padStart(9, "0");

      batchOne.addEntry(
        new Entry({
          // need every even record to be a debit and every odd record to be a credit
          transactionCode: i % 2 === 0 ? TransactionCode.CheckingCredit : TransactionCode.CheckingDebit,
          destinationRoutingNumber: routingNumber,
          destinationAccountNumber: accountNumber,
          amount: amt, // Amount in cents ($10.76)
          transactionId: transactionId,
          destinationName: `Jane Doe_${i}`,
        })
      );
    }

    
    // Create a new Entry with Addenda]
    const entryTwo = new Entry({
        transactionCode: TransactionCode.CheckingCredit,
        destinationRoutingNumber: "987654321",
        destinationAccountNumber: "123456000",
        amount: 5050, // Amount in cents ($50.50)
        transactionId: "000001297",
        destinationName: "Jane Doe",
    });
    
    entryTwo.setAddenda(
        new EntryAddenda({
        info: "Special Payroll",
        })
    );
    
    // add the entry to the batch
    batchOne.addEntry(entryTwo);
    nacha.addBatch(batchOne);
    
    // Generate the file
    const nachaFile = nacha.toOutput();
    
    fs.writeFileSync("nacha.ach", nachaFile);
};


